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
        $data = MaintenanceRequest::with('users', 'school', 'resources')
            ->when(request('title'), function ($query, $title) {
                if (!empty($title)) {
                    $query->where('title', 'LIKE', '%' . $title . '%');
                }
            })
            ->where(function ($query) {
                if (!empty(request('status'))) {
                    $query->where("status", request('status'));
                }
            })
            ->orderBy($sortColumn, $sortDirection);

        if ($perPage == -1) {
            return response()->json($data->get(), Response::HTTP_OK);
        }

        return response()->json($data->paginate($perPage), Response::HTTP_OK);


        //! Note: if file not accessible like return 404, use this cammand (php artisan storage:link)
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
                'priority' => 'nullable|in:' . implode(',', MaintenanceRequest::getPeriority()),
                'users' => 'required|array',
                'users.*' => 'exists:users,id',
                'school_id' => 'nullable|exists:schools,id',
                'resource_id' => 'nullable|exists:resources,id',
                'resolved_date' => 'nullable|date',
                'file' => 'file|max:2048',
            ]);
            if ($validation) {
                $path = '';
                if ($request->hasFile('file')) {
                    // $filename = Str::random(20) . '_' . $request->file('image')->getClientOriginalName();
                    // $request->file('image')->move(public_path('images/users'), $filename);
                    $path = $request->file('file')->store('maintenance_files', 'public');
                }

                $maintenanceRequest = MaintenanceRequest::create([
                    'title' => $request->title,
                    'description' => $request->description,
                    'status' => $request->status,
                    'priority' => $request->priority,
                    'school_id' => $request->school_id,
                    'resource_id' => $request->resource_id,
                    'resolved_date' => $request->resolved_date,
                ]);
                $maintenanceRequest->file_path = $path;
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
        $maintenanceRequest = MaintenanceRequest::with('users', 'school', 'resources')->findOrFail($id);
        return response()->json($maintenanceRequest, Response::HTTP_OK);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update($id, Request $request)
    {
        try {
            $maintenanceRequest = MaintenanceRequest::with('users')->findOrFail($id);
            $validation = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'nullable|in:' . implode(',', MaintenanceRequest::getStatuses()),
                'priority' => 'nullable|in:' . implode(',', MaintenanceRequest::getPeriority()),
                'users' => 'nullable|array',
                'users.*' => 'exists:users,id',
                'school_id' => 'nullable|exists:schools,id',
                'resource_id' => 'nullable|exists:resources,id',
                'resolved_date' => 'nullable|date',
                'file' => 'file|max:2048',
            ]);
            if ($validation) {
                if ($request->hasFile('file')) {
                    if ($maintenanceRequest->imagePath) {
                        if (Storage::disk('public')->exists($maintenanceRequest->imagePath)) {
                            Storage::disk('public')->delete($maintenanceRequest->imagePath);
                        }
                    }
                    $path = $request->file('file')->store('maintenance_files', 'public');
                    $maintenanceRequest->file_path = $path;
                }
                $maintenanceRequest->title = $request->input('title', $maintenanceRequest->title);
                $maintenanceRequest->school_id = $request->input('school_id', $maintenanceRequest->school_id);
                $maintenanceRequest->description = $request->input('description', $maintenanceRequest->description);
                $maintenanceRequest->status = $request->input('status', $maintenanceRequest->status);
                $maintenanceRequest->priority = $request->input('priority', $maintenanceRequest->priority);
                $maintenanceRequest->resource_id = $request->input('resource_id', $maintenanceRequest->resource_id);
                $maintenanceRequest->resolved_date = $request->input('resolved_date', $maintenanceRequest->resolved_date);
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
        $maintenanceRequest = MaintenanceRequest::findOrFail($id);
        if (!empty($maintenanceRequest->imagePath)) {
            if (Storage::disk('public')->exists($maintenanceRequest->imagePath)) {
                Storage::disk('public')->delete($maintenanceRequest->imagePath);
            }
        }
        $maintenanceRequest->users()->detach();

        $maintenanceRequest->delete();


        return response()->json(['message' => 'Maintenance Request deleted successfully'], Response::HTTP_OK);
    }

    public function changeStatus($id, Request $request)
    {
        try {
            $maintenanceRequest = MaintenanceRequest::with('users')->findOrFail($id);
            $validation = $request->validate([
                'status' => 'nullable|in:' . implode(',', MaintenanceRequest::getStatuses()),
            ]);
            if ($validation) {
                $maintenanceRequest->status = $request->input('status', $maintenanceRequest->status);
                $maintenanceRequest->save();
            } else {
                return $request;
            }


            return response()->json($maintenanceRequest, Response::HTTP_CREATED);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }
}
