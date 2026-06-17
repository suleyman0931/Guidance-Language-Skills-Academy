<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    // ── Public ───────────────────────────────────────────────────────────────

    public function publicIndex(): JsonResponse
    {
        $posts = Post::where('is_published', true)
            ->orderByDesc('created_at')
            ->get();
        return response()->json(['data' => $posts]);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        $posts = Post::orderByDesc('created_at')->paginate(20);
        return response()->json($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $v = Validator::make($request->all(), [
            'title_en'     => 'required|string|max:200',
            'title_am'     => 'required|string|max:200',
            'body_en'      => 'required|string',
            'body_am'      => 'required|string',
            'type'         => 'required|in:announcement,news,tip',
            'is_published' => 'boolean',
        ]);
        if ($v->fails()) return response()->json(['message' => 'Validation failed', 'errors' => $v->errors()], 422);

        $post = Post::create([
            'title_en'     => $request->title_en,
            'title_am'     => $request->title_am,
            'body_en'      => $request->body_en,
            'body_am'      => $request->body_am,
            'type'         => $request->type,
            'is_published' => $request->boolean('is_published', true),
            'created_by'   => $request->user()->id,
        ]);

        return response()->json(['data' => $post], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);
        $v = Validator::make($request->all(), [
            'title_en'     => 'sometimes|string|max:200',
            'title_am'     => 'sometimes|string|max:200',
            'body_en'      => 'sometimes|string',
            'body_am'      => 'sometimes|string',
            'type'         => 'sometimes|in:announcement,news,tip',
            'is_published' => 'sometimes|boolean',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $post->update($request->only(['title_en','title_am','body_en','body_am','type','is_published']));
        return response()->json(['data' => $post]);
    }

    public function togglePublish(int $id): JsonResponse
    {
        $post = Post::findOrFail($id);
        $post->update(['is_published' => !$post->is_published]);
        return response()->json(['data' => $post]);
    }

    public function destroy(int $id): JsonResponse
    {
        Post::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
