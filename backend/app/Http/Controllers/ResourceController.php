<?php

namespace App\Http\Controllers;

use App\Models\resource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resources.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 5);

        $sortColumn = $request->input('sort_column', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $resources = Resource::with(['school', 'categories'])->orderBy($sortColumn, $sortDirection);

        if ($perPage == -1) {
            return response()->json($resources->get(), Response::HTTP_OK);
        }

        return response()->json($resources->paginate($perPage), Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'label' => 'required|string|max:255',
                'qty' => 'required|integer',
                'school_id' => 'required|exists:schools,id',
                'category_id' => 'required|exists:categories,id',
            ]);

            $resource = Resource::create($request->all());
            $resource->load(['school', 'categories']);
            return response()->json($resource, Response::HTTP_CREATED);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        };
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Resource $resource
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Resource $resource)
    {
        $resource->load(['school', 'categories']);
        return response()->json($resource, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Resource $resource
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Resource $resource)
    {
        $request->validate([
            'label' => 'sometimes|string|max:255',
            'qty' => 'sometimes|integer',
            'school_id' => 'sometimes|exists:schools,id',
            'category_id' => 'sometimes|exists:categories,id',
        ]);

        $resource->update($request->all());
        $resource->load(['school', 'categories']);
        return response()->json($resource, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Resource $resource
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Resource $resource)
    {
        $resource->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
