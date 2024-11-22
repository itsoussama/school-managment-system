<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MaintenanceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 5);
        $sortColumn = $request->input('sort_column', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $data = MaintenanceRequest::with('users')->orderBy($sortColumn, $sortDirection)->paginate($perPage);

        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validation = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|in:' . implode(',', MaintenanceRequest::getStatuses()),
                'users' => 'required|array',
                'users.*' => 'exists:users,id',
                'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            if ($validation) {
                $path = '';
                if ($request->hasFile('image')) {
                    // $filename = Str::random(20) . '_' . $request->file('image')->getClientOriginalName();
                    // $request->file('image')->move(public_path('images/users'), $filename);
                    $path = $request->file('image')->store('images', 'public');
                }
                info('path : ' . $path);
                $maintenanceRequest = MaintenanceRequest::create([
                    'title' => $request->title,
                    'description' => $request->description,
                    'status' => $request->status,  // This will be validated as part of the request validation
                    'user_id' => $request->user_id,
                ]);
                $maintenanceRequest->imagePath = $path;
                $maintenanceRequest->users()->sync($request->users);
                $maintenanceRequest->save();

                // to call the image in frontend `http://localhost:8000/storage/${imagePath}`;

            } else {
                return $request;
            }


            return response()->json($maintenanceRequest, Response::HTTP_CREATED);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(MaintenanceRequest $maintenanceRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MaintenanceRequest $maintenanceRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MaintenanceRequest $maintenanceRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MaintenanceRequest $maintenanceRequest)
    {
        //
    }
}
