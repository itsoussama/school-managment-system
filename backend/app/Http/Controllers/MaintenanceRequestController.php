<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

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
                'status' => 'nullable|in:' . implode(',', MaintenanceRequest::getStatuses()),
                'users' => 'required|array',
                'users.*' => 'exists:users,id',
                'school_id' => 'nullable|exists:schools,id',
                'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            if ($validation) {
                $path = '';
                if ($request->hasFile('image')) {
                    // $filename = Str::random(20) . '_' . $request->file('image')->getClientOriginalName();
                    // $request->file('image')->move(public_path('images/users'), $filename);
                    $path = $request->file('image')->store('images', 'public');
                }

                $maintenanceRequest = MaintenanceRequest::create([
                    'title' => $request->title,
                    'description' => $request->description,
                    'status' => $request->status,
                    'school_id' => $request->school_id,
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
    public function show($id)
    {
        $maintenanceRequest = MaintenanceRequest::with('users')->findOrFail($id);
        return response()->json($maintenanceRequest, Response::HTTP_OK);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update($id ,Request $request)
    {
        try {
            $maintenanceRequest = MaintenanceRequest::with('users')->findOrFail($id);
            $validation = $request->validate([
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'status' => 'nullable|in:' . implode(',', MaintenanceRequest::getStatuses()),
                'school_id' => 'nullable|exists:schools,id',
                'users' => 'nullable|array',
                'users.*' => 'exists:users,id',
                'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            if ($validation) {
                if ($request->hasFile('image')) {
                    if ($maintenanceRequest->imagePath) {
                        if (Storage::disk('public')->exists($maintenanceRequest->imagePath)) {
                            Storage::disk('public')->delete($maintenanceRequest->imagePath);
                        }
                    }
                    $path = $request->file('image')->store('images', 'public');
                    $maintenanceRequest->imagePath = $path;
                }
                $maintenanceRequest->title = $request->input('title', $maintenanceRequest->title);
                $maintenanceRequest->school_id = $request->input('school_id', $maintenanceRequest->school_id);
                $maintenanceRequest->description = $request->input('description', $maintenanceRequest->description);
                $maintenanceRequest->status = $request->input('status', $maintenanceRequest->status);
                if ($request->has('users')) {
                    $maintenanceRequest->users()->sync($request->input('users'));
                }
                $maintenanceRequest->save();

            } else {
                return $request;
            }


            return response()->json($maintenanceRequest, Response::HTTP_CREATED);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $maintenanceRequest = MaintenanceRequest::with('users')->findOrFail($id);
        if (!empty($maintenanceRequest->imagePath)) {
            if (Storage::disk('public')->exists($maintenanceRequest->imagePath)) {
                Storage::disk('public')->delete($maintenanceRequest->imagePath);
            }
        }
        $maintenanceRequest->users()->detach();

        $maintenanceRequest->delete();


        return response()->json(['message' => 'Maintenance Request deleted successfully'], Response::HTTP_OK);
    }
}
