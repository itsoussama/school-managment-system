<?php

namespace App\Http\Controllers;

use App\Models\Stage;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stages = Stage::with(['grades' => function ($query) {
            $query->withCount('groups as total_groups')->with(['groups' => function ($query) {
                $query->withCount(['students', 'teachers']);
            }]);
        }])
            ->where('school_id', auth()->user()->school_id)
            ->get();

        // Calculate total students and teachers per grade
        $stages->each(function ($stage) {
            $stage->grades->each(function ($grade) {
                $grade->total_students = $grade->groups->sum('students_count');
                $grade->total_teachers = $grade->groups->sum('teachers_count');
            });
        });
        return response()->json($stages, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = $request->validate([
            'name' => 'required|string',
            'school_id' => 'required|exists:schools,id'
        ]);

        if ($validation) {
            $stage = Stage::create($request->all());
            return response()->json($stage, Response::HTTP_CREATED);
        }

        return response()->json($validation, Response::HTTP_BAD_REQUEST);
    }

    /**
     * Display the specified resource.
     */
    public function show(Stage $stage)
    {
        return response()->json($stage, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stage $stage)
    {
        $validation = $request->validate([
            'name' => 'required|string',
            'school_id' => 'required|exists:schools,id'
        ]);

        if ($validation) {
            $stage->update($request->all());
            return response()->json($stage, Response::HTTP_OK);
        }

        return response()->json($validation, Response::HTTP_BAD_REQUEST);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stage $stage)
    {
        info($stage);
        $stage->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
