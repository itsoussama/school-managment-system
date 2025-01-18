<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 5);
        $sortColumn = $request->input('sort_column', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $schoolID = $request->input('school_id');
        $subjects = Subject::with('grades')->where("school_id", $schoolID)->orderBy($sortColumn, $sortDirection);

        if ($perPage == -1) {
            return response()->json($subjects->get(), Response::HTTP_OK);
        }

        return response()->json($subjects->paginate($perPage));
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
            'name' => 'required|string|max:255',
            'coef' => 'required|numeric|min:0',
            'school_id' => 'required|exists:schools,id',
        ]);


        $subject = Subject::create($request->all());
        $subject->grades()->sync($request->input('grades'));

        return response()->json($subject, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Subject $subject
     * @return \Illuminate\Http\Response
     */
    public function show(Subject $subject)
    {
        return response()->json($subject->load(['grades']));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Subject $subject
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Subject $subject)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'coef' => 'required|numeric|min:0',
            'school_id' => 'required|exists:schools,id',
        ]);

        $subject->grades()->sync($request->input('grades'));
        $subject->update($request->all());

        return response()->json($subject->load(['grades']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Subject $subject
     * @return \Illuminate\Http\Response
     */
    public function destroy(Subject $subject)
    {
        $subject->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
