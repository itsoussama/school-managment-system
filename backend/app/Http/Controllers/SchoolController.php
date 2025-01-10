<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class SchoolController extends Controller
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
        $schools = School::orderBy($sortColumn, $sortDirection)->paginate($perPage);
        return response()->json($schools);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{
            $validation = $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'contact' => 'required|string|max:255',
                'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validation) {

                $path = '';
                if ($request->hasFile('image')) {
                    // $filename = Str::random(20) . '_' . $request->file('image')->getClientOriginalName();
                    // $request->file('image')->move(public_path('images/users'), $filename);
                    $path = $request->file('image')->store('images', 'public');
                }

                $school = School::create([
                    'name' => $request->name,
                    'address' => $request->address,
                    'contact' => $request->contact,
                    'image_path' => $path,
                ]);
                return response()->json($school, Response::HTTP_CREATED);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\School $school
     * @return \Illuminate\Http\Response
     */
    public function show(School $school)
    {
        return response()->json($school);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\School $school
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, School $school)
    {
        try {


            $validation = $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'contact' => 'required|string|max:255',
                'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validation) {
                $path = '';
                if ($request->hasFile('image')) {
                    if (Storage::disk('public')->exists($request->image)) {
                        Storage::disk('public')->delete($request->image);
                    }
                    $path = $request->file('image')->store('images', 'public');
                }

                $school->update([
                    'name' => $request->name,
                    'address' => $request->address,
                    'contact' => $request->contact,
                    'image_path' => $path,
                ]);


                return response()->json($school);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\School $school
     * @return \Illuminate\Http\Response
     */
    public function destroy(School $school)
    {
        $school->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
