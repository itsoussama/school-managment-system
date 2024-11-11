<?php

namespace App\Http\Controllers;

use App\Models\category;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {

        $perPage = $request->input('per_page', 5);

        $sortColumn = $request->input('sort_column', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $categories = Category::orderBy($sortColumn, $sortDirection);
        if ($perPage == -1) {
            return response()->json($categories->get(), 200);
        }
        return response()->json($categories->paginate($perPage), 200);
    }

    /**
     * Store a newly created category in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'label' => 'required|string|max:255',
        ]);

        $category = Category::create($request->all());

        return response()->json($category, 201);
    }

    /**
     * Display the specified category.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $category = Category::findOrFail($id);
            return response()->json($category, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Category not found'], 404);
        }
    }

    /**
     * Update the specified category in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'label' => 'required|string|max:255',
        ]);

        try {
            $category = Category::findOrFail($id);
            $category->update($request->all());
            return response()->json($category, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Category not found'], 404);
        }
    }

    /**
     * Remove the specified category from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $category = Category::findOrFail($id);
            $category->delete();
            return response()->json(['message' => 'Category deleted successfully'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Category not found'], 404);
        }
    }
}
