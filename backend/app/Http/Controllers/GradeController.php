<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GradeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $grades = Grade::all();
        return response()->json($grades);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string|max:255',
        ]);

        $grade = Grade::create($request->all());
        return response()->json($grade, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Grade $grade
     * @return \Illuminate\Http\Response
     */
    public function show(Grade $grade)
    {
        return response()->json($grade);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Grade $grade
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Grade $grade)
    {
        $request->validate([
            'label' => 'required|string|max:255',
        ]);

        $grade->update($request->all());
        return response()->json($grade);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Grade $grade
     * @return \Illuminate\Http\Response
     */
    public function destroy(Grade $grade)
    {
        $grade->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
