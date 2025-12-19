<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use App\Models\School;
use Illuminate\Http\Request;
use App\Http\Resources\ClassRoomResource;
use App\Http\Resources\ClassRoomCollection;

class ClassRoomController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 5);
        $sortColumn = $request->input('sort_column', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');

        $classRooms = ClassRoom::with('school')
            ->when(request('name'), function ($query, $name) {
                if (!empty($name)) {
                    $query->where('name', 'LIKE', '%' . $name . '%');
                }
            })
            ->orderBy($sortColumn, $sortDirection);

        if ($perPage == -1) {
            return response()->json($classRooms->get());
        }

        return response()->json($classRooms->paginate($perPage));
        // return response()->json(new ClassRoomCollection($classRooms->paginate($perPage)));
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'capacity' => 'required|integer',
                'school_id' => 'required|exists:schools,id',
            ]);

            $classRoom = ClassRoom::create($request->all());

            return response()->json(new ClassRoomResource($classRoom), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    // Display the specified resource
    public function show(ClassRoom $classRoom)
    {
        return response()->json(new ClassRoomResource($classRoom));
    }

    // Update the specified resource in storage
    public function update(Request $request, ClassRoom $classRoom)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'capacity' => 'required|integer',
                'school_id' => 'required|exists:schools,id',
            ]);

            $classRoom->update($request->all());

            return response()->json(new ClassRoomResource($classRoom));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    // Remove the specified resource from storage
    public function destroy(ClassRoom $classRoom)
    {
        try {
            $classRoom->delete();

            return response()->json(null, 204);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }
}
