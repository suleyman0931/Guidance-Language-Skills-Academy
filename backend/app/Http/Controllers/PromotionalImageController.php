<?php

namespace App\Http\Controllers;

use App\Models\PromotionalImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PromotionalImageController extends Controller
{
    // PUBLIC: Get all active promotional images
    public function index()
    {
        $images = PromotionalImage::active()
            ->ordered()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $images
        ]);
    }

    // ADMIN: Get all promotional images (including inactive)
    public function adminIndex()
    {
        $images = PromotionalImage::ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $images
        ]);
    }

    // ADMIN: Upload new promotional image
    public function store(Request $request)
    {
        try {
            // Log incoming request
            \Log::info('Promotional image upload attempt', [
                'has_file' => $request->hasFile('image'),
                'all_files' => $request->allFiles(),
            ]);

            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // Max 2MB
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'display_order' => 'nullable|integer',
            ]);

            if (!$request->hasFile('image')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No image file provided in request'
                ], 400);
            }

            $image = $request->file('image');
            
            // Log file details
            \Log::info('Image file details', [
                'original_name' => $image->getClientOriginalName(),
                'size' => $image->getSize(),
                'mime' => $image->getMimeType(),
            ]);

            // Check if storage directory exists, create if not
            $storagePublicPath = storage_path('app/public');
            $promoImagesPath = $storagePublicPath . '/promotional_images';
            
            if (!is_dir($storagePublicPath)) {
                \Log::warning('Storage public directory missing, creating it');
                mkdir($storagePublicPath, 0755, true);
            }
            
            if (!is_dir($promoImagesPath)) {
                \Log::info('Creating promotional_images directory');
                mkdir($promoImagesPath, 0755, true);
            }

            // Ensure directory is writable
            if (!is_writable($storagePublicPath)) {
                \Log::error('Storage directory not writable', ['path' => $storagePublicPath]);
                return response()->json([
                    'success' => false,
                    'message' => 'Storage directory is not writable: ' . $storagePublicPath
                ], 500);
            }

            // Generate unique filename
            $filename = 'promo_' . time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            
            // Store file
            $path = $image->storeAs('promotional_images', $filename, 'public');
            
            if (!$path) {
                \Log::error('Failed to store image file');
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to store image file'
                ], 500);
            }
            
            $imageUrl = '/storage/' . $path;

            \Log::info('Image stored successfully', [
                'path' => $path,
                'url' => $imageUrl,
            ]);

            // Create database record
            $promoImage = PromotionalImage::create([
                'title' => $request->title,
                'image_url' => $imageUrl,
                'description' => $request->description,
                'display_order' => $request->display_order ?? 0,
                'is_active' => true,
            ]);

            \Log::info('Promotional image record created', ['id' => $promoImage->id]);

            return response()->json([
                'success' => true,
                'message' => 'Promotional image uploaded successfully',
                'data' => $promoImage
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Promotional image upload failed', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image: ' . $e->getMessage(),
                'debug' => config('app.debug') ? [
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => explode("\n", $e->getTraceAsString())
                ] : null
            ], 500);
        }
    }

    // ADMIN: Update promotional image
    public function update(Request $request, $id)
    {
        $promoImage = PromotionalImage::findOrFail($id);

        $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $promoImage->update($request->only(['title', 'description', 'display_order', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Promotional image updated successfully',
            'data' => $promoImage
        ]);
    }

    // ADMIN: Toggle active status
    public function toggleActive($id)
    {
        $promoImage = PromotionalImage::findOrFail($id);
        $promoImage->is_active = !$promoImage->is_active;
        $promoImage->save();

        return response()->json([
            'success' => true,
            'message' => 'Status toggled successfully',
            'data' => $promoImage
        ]);
    }

    // ADMIN: Delete promotional image
    public function destroy($id)
    {
        $promoImage = PromotionalImage::findOrFail($id);

        // Delete the image file from storage
        if ($promoImage->image_url) {
            $path = str_replace('/storage/', '', $promoImage->image_url);
            Storage::disk('public')->delete($path);
        }

        $promoImage->delete();

        return response()->json([
            'success' => true,
            'message' => 'Promotional image deleted successfully'
        ]);
    }
}
