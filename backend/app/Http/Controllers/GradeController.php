<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use function PHPUnit\Framework\isNull;

class GradeController extends Controller
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
        $school_id = $request->input('school_id');
        $grades = Grade::with([
            'groups' => function ($query) {
                $query->with(['students', 'teachers'])->withCount(['students', 'teachers']);
            },
            'stage'
        ])
            ->where("school_id", $school_id)
            ->orderBy($sortColumn, $sortDirection);

        if ($perPage == -1) {
            return response()->json($grades->get(), Response::HTTP_OK);
        }
        return response()->json($grades->paginate($perPage), Response::HTTP_OK);
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
            'stage_id' => 'required|exists:stages,id',
            "school_id" => 'required|exists:schools,id'
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
        return response()->json($grade->load(['groups', 'stage']), Response::HTTP_OK);
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
            'stage_id' => 'required|exists:stages,id',
            'groups' => 'nullable|array',
            'groups.*' => 'exists:groups,id',
            // 'students' => 'nullable|array',
            // 'students.*' => 'exists:users,id',
            // 'teachers' => 'nullable|array',
            // 'teachers.*' => 'exists:users,id',
            "school_id" => 'required|exists:schools,id'

        ]);

        // info($request->input('students'), $request->input('teachers'));
        // $grade->users()->detach();
        // $grade->users()->attach(array_merge($request->input('students') ?? [], $request->input('teachers') ?? []));

        if (!empty($request->input('groups'))) {
            Group::where('grade_id', $grade->id)->whereNotIn('id', $request->input('groups'))->delete();
        }

        $grade->update($request->only(['label', 'stage_id', 'school_id']));


        return response()->json($grade, Response::HTTP_OK);
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
