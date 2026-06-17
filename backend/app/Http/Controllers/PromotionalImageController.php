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
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // Max 2MB
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);

        try {
            // Handle file upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = 'promo_' . time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                
                // Store in public/storage/promotional_images
                $path = $image->storeAs('promotional_images', $filename, 'public');
                $imageUrl = '/storage/' . $path;

                $promoImage = PromotionalImage::create([
                    'title' => $request->title,
                    'image_url' => $imageUrl,
                    'description' => $request->description,
                    'display_order' => $request->display_order ?? 0,
                    'is_active' => true,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Promotional image uploaded successfully',
                    'data' => $promoImage
                ], 201);
            }

            return response()->json([
                'success' => false,
                'message' => 'No image file provided'
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image: ' . $e->getMessage()
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
