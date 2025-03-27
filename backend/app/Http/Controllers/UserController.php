<?php

namespace App\Http\Controllers;

use App\Exports\UsersExport;
use App\Helpers\ModalNameHelper;
use App\Helpers\ReferenceIDHelper;
use App\Imports\UsersImport;
use App\Models\Payroll;
use App\Models\School;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin')) || $request->user()->hasRole(config('roles.teacher'))) {
            $perPage = $request->input('per_page', 5);
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');
            $school_id = $request->input('school_id');

            $users = User::with('school', 'role', 'subjects', 'grades')->where('school_id', $school_id)->orderBy($sortColumn, $sortDirection)->paginate($perPage);
            return response()->json($users, Response::HTTP_OK);
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }
    public function teachers(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {
            $perPage = $request->input('per_page', 5);
            // Get sort parameters from request
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');
            $school_id = $request->input('school_id');

            $users = User::with('teacher', 'school', 'role', 'subjects', 'grades')
                ->where('school_id', $school_id)
                ->whereHas(
                    'role',
                    function ($query) {
                        $query->where('name', config('roles.teacher'));
                    }

                )
                ->when(request('name'), function ($query, $name) {
                    if (!empty($name)) {
                        $query->where('name', 'LIKE', '%' . $name . '%');
                    }
                })
                ->whereHas(
                    'subjects',
                    function ($query) {
                        $subject = request('subject');
                        if (!empty($subject)) {
                            $query->whereId($subject);
                        }
                    }
                )
                ->whereHas(
                    'grades',
                    function ($query) {
                        $grades = request('grades');
                        if (!empty($grades)) {
                            $query->whereId($grades);
                        }
                    }
                )
                ->orderBy($sortColumn, $sortDirection);

            if ($perPage == -1) {
                return response()->json($users->get(), Response::HTTP_OK);
            }

            return response()->json($users->paginate($perPage), Response::HTTP_OK);
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    public function assignTeacherSubject(Request $request, Subject $subject)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {

            $validation = $request->validate([
                'teacher_id' => 'required|exists:users,id',
                'subject' => 'required|exists:users,id',
            ]);

            if ($validation) {
                $subject->teachers()->sync($request->input('teachers'));
                info($subject);
            } else {
                return $request;
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    public function students(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {
            $perPage = $request->input('per_page', 5);
            // Get sort parameters from request
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');
            $school_id = $request->input('school_id');
            $users = User::with('student.grade', 'school', 'role', 'subjects', 'grades', 'guardian')
                ->where('school_id', $school_id)
                ->whereHas(
                    'role',
                    function ($query) {
                        $query->where('name', config('roles.student'));
                    }

                )
                ->when(request('name'), function ($query, $name) {
                    if (!empty($name)) {
                        $query->where('name', 'LIKE', '%' . $name . '%');
                    }
                })
                // ->whereHas(
                //     'grades',
                //     function ($query) {
                //         $grades = request('grades');
                //         if (!empty($grades)) {
                //             $query->whereId($grades);
                //         }
                //     }
                // )
                ->orderBy($sortColumn, $sortDirection);
            info($users->get());
            if ($perPage == -1) {
                return response()->json($users->get(), Response::HTTP_OK);
            }
            return response()->json($users->paginate($perPage), Response::HTTP_OK);
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }
    public function admins(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff') || $request->user()->hasRole(config('roles.admin')))) {
            $perPage = $request->input('per_page', 5);
            // Get sort parameters from request
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');
            $school_id = $request->input('school_id');
            $users = User::with('school', 'role', 'subjects', 'grades', 'guardian', 'administrator')
                ->where('school_id', $school_id)
                ->whereHas(
                    'role',
                    function ($query) {
                        $query->where('name', config('roles.admin_staff'));
                    }

                )
                ->when(request('name'), function ($query, $name) {
                    if (!empty($name)) {
                        $query->where('name', 'LIKE', '%' . $name . '%');
                    }
                })
                ->orderBy($sortColumn, $sortDirection);

            if ($perPage == -1) {
                return response()->json($users->get(), Response::HTTP_OK);
            }
            return response()->json($users->paginate($perPage), Response::HTTP_OK);
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    public function parents(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {
            $perPage = $request->input('per_page', 5);
            // Get sort parameters from request
            $sortColumn = $request->input('sort_column', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');
            $school_id = $request->input('school_id');
            $users = User::with('parent', 'school', 'role', 'childrens')
                ->where('school_id', $school_id)
                ->whereHas(
                    'role',
                    function ($query) {
                        $query->where('name', config('roles.parent'));
                    }

                )
                ->when(request('name'), function ($query, $name) {
                    if (!empty($name)) {
                        $query->where('name', 'LIKE', '%' . $name . '%');
                    }
                })
                ->when(request('childName'), function ($query, $childName) {
                    if (!empty($childName)) {
                        $query->whereHas('childrens', function ($child) {
                            $child->where('name', 'LIKE', '%' . request('childName') . '%');
                        });
                    }
                })
                ->orderBy($sortColumn, $sortDirection);

            if ($perPage == -1) {
                return response()->json($users->get(), Response::HTTP_OK);
            }

            return response()->json($users->paginate($perPage), Response::HTTP_OK);
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    public function schoolStaffs(Request $request)
    {
        if (auth()->user()->hasRole(config('roles.admin_staff')) || auth()->user()->hasRole(config('roles.admin')) || auth()->user()->hasRole(config('roles.teacher'))) {
            $school_id = $request->input('school_id');

            $users = User::whereHas('role', function (Builder $query) {
                $query->whereIn('name', ['Administrator', 'Administrator Staff', 'Teacher']);
            })->where('school_id', $school_id)->get();
            return response()->json($users, Response::HTTP_OK);
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    public function addTeacher(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {
            try {
                $validation = $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users',
                    'phone' => 'required|string|max:255',
                    'address' => 'required|string|max:255',
                    'password' => 'required|string|min:8|confirmed',
                    'school_id' => 'required|exists:schools,id',
                    'roles' => 'required|array',
                    'roles.*' => 'exists:roles,id',
                    'subjects' => 'required|array',
                    'subjects.*' => 'exists:subjects,id',
                    'grades' => 'required|array',
                    'grades.*' => 'exists:grades,id',
                    "payroll_frequency" => 'required|in:daily,weekly,bi-weekly,monthly',
                    "hourly_rate" => 'nullable|decimal:0,2',
                    "net_salary" => 'nullable|decimal:0,2'
                ]);
                if ($validation) {
                    $path = '';
                    if ($request->hasFile('image')) {
                        // $filename = Str::random(20) . '_' . $request->file('image')->getClientOriginalName();
                        // $request->file('image')->move(public_path('images/users'), $filename);
                        $path = $request->file('image')->store('images', 'public');
                    }
                    $user = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'password' => bcrypt($request->password),
                    ]);


                    $user->school()->associate($request->school_id);
                    $user->role()->sync($request->roles);
                    $user->subjects()->sync($request->subjects);
                    $user->grades()->sync($request->grades);
                    $user->imagePath = $path;

                    $user->save();

                    $user->payroll()->create([
                        'payroll_frequency' => $request->payroll_frequency,
                        'net_salary' => $request->net_salary,
                        'payment_status' => 'pending',
                        'pay_date' => $this->getUpcomingPayDate($request->payroll_frequency)
                    ]);


                    $user->teacher()->create([
                        'teacher_number' => str::uuid(),
                        'address' => $request->address,
                        'birthdate' => '2024-01-01',
                        'phone' => $request->phone,
                    ]);
                    $user->teacher->save();
                } else {
                    return $request;
                }


                // return response()->json($user, Response::HTTP_CREATED);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json($e->errors(), 422);
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    public function addStudent(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {
            try {
                $validation = $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users',
                    'phone' => 'required|string|max:255',
                    'address' => 'required|string|max:255',
                    'password' => 'required|string|min:8|confirmed',
                    'school_id' => 'required|exists:schools,id',
                    'guardian_id' => 'nullable|integer',
                    'roles' => 'required|array',
                    'roles.*' => 'exists:roles,id',
                    'subjects' => 'array',
                    'subjects.*' => 'exists:subjects,id',
                    'grades' => 'required|array',
                    'grades.*' => 'exists:grades,id',
                ]);
                if ($validation) {
                    $path = '';
                    if ($request->hasFile('image')) {
                        // $filename = Str::random(20) . '_' . $request->file('image')->getClientOriginalName();
                        // $request->file('image')->move(public_path('images/users'), $filename);
                        $path = $request->file('image')->store('images', 'public');
                    }
                    $user = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'password' => bcrypt($request->password),
                    ]);


                    $user->school()->associate($request->school_id);
                    $user->role()->sync($request->roles);
                    // $user->grades()->sync($request->grades);
                    // $user->subjects()->sync($request->subjects);
                    $user->imagePath = $path;

                    $user->save();


                    $user->student()->create([
                        'student_number' => str::uuid(),
                        'address' => $request->address,
                        'birthdate' => '2024-01-01',
                    ]);
                    $user->student->grade()->associate($request->grades[0]);

                    if ($request->guardian_id) {
                        $user->student->parents()->sync($request->guardian_id);
                    }
                    $user->student->save();
                } else {
                    return $request;
                }


                // return response()->json($user, Response::HTTP_CREATED);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json($e->errors(), 422);
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    public function addParent(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {
            try {
                $validation = $request->validate([
                    'childrens' => 'required|array|exists:users,id',
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users',
                    'phone' => 'required|string|max:255',
                    'password' => 'required|string|min:8|confirmed',
                    'school_id' => 'required|exists:schools,id',
                    'roles' => 'required|array',
                    'roles.*' => 'exists:roles,id',
                ]);
                if ($validation) {
                    $user = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'password' => bcrypt($request->password),
                    ]);
                    $user->school()->associate($request->school_id);
                    $user->role()->sync($request->roles);
                    $user->save();
                    $childrens = User::whereIn('id', $request->childrens)->get();
                    foreach ($childrens as $child) {
                        $child->guardian_id = $user->id;
                        $child->save();
                    }
                } else {
                    return $request;
                }


                // return response()->json($user, Response::HTTP_CREATED);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json($e->errors(), 422);
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    // this function recive an array of existing children and associate to relative parent
    public function assignChilds(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {

            $validation = $request->validate([
                'parent_id' => 'required|exists:users,id',
                'childrens' => 'required|array|exists:users,id',
            ]);

            if ($validation) {
                $childrens = User::whereIn('id', $request->childrens)->get();

                foreach ($childrens as $child) {
                    $child->guardian_id = $request->parent_id;
                    $child->save();
                }
            } else {
                return $request;
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    public function assignParent(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {

            $validation = $request->validate([
                'child_id' => 'required|exists:users,id',
                'parent' => 'required|exists:users,id',
            ]);

            if ($validation) {
                $child = User::find($request->child_id);
                $child->guardian_id = $request->parent;
                $child->save();
                info($child);
            } else {
                return $request;
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    public function addAdmin(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff') || $request->user()->hasRole(config('roles.admin')))) {
            try {
                $validation = $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users',
                    'phone' => 'required|string|max:255',
                    'address' => 'required|string|max:255',
                    'password' => 'required|string|min:8|confirmed',
                    'school_id' => 'required|exists:schools,id',
                    'roles' => 'required|array',
                    'roles.*' => 'exists:roles,id',
                    "payroll_frequency" => 'required|in:daily,weekly,bi-weekly,monthly',
                    "hourly_rate" => 'nullable|decimal:0,2',
                    "net_salary" => 'nullable|decimal:0,2'
                ]);
                if ($validation) {
                    $path = '';
                    if ($request->hasFile('image')) {
                        // $filename = Str::random(20) . '_' . $request->file('image')->getClientOriginalName();
                        // $request->file('image')->move(public_path('images/users'), $filename);
                        $path = $request->file('image')->store('images', 'public');
                    }
                    $user = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'password' => bcrypt($request->password),
                    ]);


                    $user->school()->associate($request->school_id);
                    $user->role()->sync($request->roles);
                    $user->imagePath = $path;

                    $user->save();

                    $user->payroll()->create([
                        'payroll_frequency' => $request->payroll_frequency,
                        'net_salary' => $request->net_salary,
                        'payment_status' => 'pending',
                        'pay_date' => $this->getUpcomingPayDate($request->payroll_frequency)
                    ]);


                    $user->administrator()->create([
                        "address" => $request->address
                    ]);
                } else {
                    return $request;
                }


                // return response()->json($user, Response::HTTP_CREATED);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json($e->errors(), 422);
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    public function getUpcomingPayDate($payrollFrequency)
    {
        $payDate = null;
        switch ($payrollFrequency) {
            case 'daily':
                $payDate = Carbon::now()->add('day', 1);
                break;
            case 'weekly':
                $payDate = Carbon::now()->add('day', 7);
                break;
            case 'bi-weekly':
                $payDate = Carbon::now()->add('day', 14);
                break;
            case 'monthly':
                $payDate = Carbon::now()->add('day', 30);
                break;
        }
        return $payDate;
    }
    // Show the form for creating a new resource (not typically used in APIs)
    public function store(Request $request)
    {

        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {
            try {
                $validation = $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users',
                    'phone' => 'required|string|max:255',
                    'password' => ['required', Password::min(8)->mixedCase()->numbers()->symbols()->uncompromised(), 'confirmed'],
                    'school_id' => 'required|exists:schools,id',
                    'guardian_id' => 'nullable|integer',
                    'roles' => 'required|array',
                    'roles.*' => 'exists:roles,id',
                    'subjects' => 'required|array',
                    'subjects.*' => 'exists:subjects,id',
                    'grades' => 'required|array',
                    'grades.*' => 'exists:grades,id',
                    'numbers' => 'nullable|string',
                    'birthdate' => 'nullable|date',
                    'address' => 'nullable|string',
                    'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                ]);
                if ($validation) {
                    $path = '';
                    if ($request->hasFile('image')) {
                        $path = $request->file('image')->store('images', 'public');
                    }
                    info('path : ' . $path);
                    $user = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'guardian_id' => $request->guardian_id,
                        'password' => bcrypt($request->password),
                    ]);
                    $user->imagePath = $path;
                    $user->school()->associate($request->school_id);
                    $user->role()->sync($request->roles);
                    $user->subjects()->sync($request->subjects);
                    $user->grades()->sync($request->grades);
                    $user->save();
                    foreach ($user->role as $role) {
                        if ($user->hasRole($role->name) == config('roles.teacher')) {
                            $teacher = Teacher::create([
                                'user_id' => $user->id,
                                'teacher_number' => str::uuid(),
                                'address' => $user->address,
                                'birthdate' => '2024-01-01',
                                'phone' => $user->phone,

                            ]);
                            $teacher->subjects()->sync($request->subjects);
                            // $teacher->grades()->sync($request->grades);
                            // $user->grades()->sync($request->grades);
                            $teacher->save();
                        }
                    }
                    // to call the image in frontend `http://localhost:8000/storage/${imagePath}`;

                } else {
                    return $request;
                }


                return response()->json($user, Response::HTTP_CREATED);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json($e->errors(), 422);
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    // Display the specified resource
    public function show(User $user, Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {
            $user->load('school', 'role');
            $role = request('role');
            switch ($role) {
                case 'administrator':
                    $user->load('payroll', 'administrator');
                    break;
                case 'teacher':
                    $user->load('subjects', 'grades', 'payroll', 'teacher');
                    break;
                case 'parent':
                    $user->load('childrens', 'parent');
                    break;
                case 'student':
                    $user->load('guardian', 'subjects', 'grades', 'student');
                    break;
                default:
                    break;
            }
            return response()->json($user, Response::HTTP_OK);
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    // Update the specified resource in storage
    public function update(Request $request, User $user)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {

            try {

                //! if your data not changeing
                // To send request using put method, you have to :
                /**
                 * change the Put method to POST
                 * add new data _method: PUT
                 */

                $validation = $request->validate([
                    'name' => 'nullable|string|max:255',
                    'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
                    'phone' => 'string|max:255',
                    'address' => 'required|string|max:255',
                    'password' => 'nullable|string|min:8|confirmed',
                    'school_id' => 'nullable|exists:schools,id',
                    'roles' => 'nullable|array',
                    'roles.*' => 'exists:roles,id',
                    'subjects' => 'nullable|array',
                    'subjects.*' => 'exists:subjects,id',
                    'grades' => 'nullable|array',
                    'grades.*' => 'exists:grades,id',
                    "payroll_frequency" => 'nullable|in:daily,weekly,bi-weekly,monthly',
                    "hourly_rate" => 'nullable|decimal:0,2',
                    "net_salary" => 'nullable|decimal:0,2',
                    'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                ]);

                if ($validation) {
                    $user->name = $request->input('name', $user->name);
                    $user->email = $request->input('email', $user->email);
                    $user->phone = $request->input('phone', $user->phone);

                    if ($request->filled('password')) {
                        $user->password = bcrypt($request->input('password'));
                    }

                    // Update the school_id if provided
                    if ($request->filled('school_id')) {
                        $user->school_id = $request->input('school_id');
                    }

                    if ($request->hasFile('image')) {
                        if ($user->imagePath) {
                            if (Storage::disk('public')->exists($user->imagePath)) {
                                Storage::disk('public')->delete($user->imagePath);
                            }
                        }
                        $path = $request->file('image')->store('images', 'public');
                        $user->imagePath = $path;
                    }

                    $user->save();

                    if ($user->hasRole('Administrator Staff')) {
                        $user->administrator()->update([
                            'address' => $request->address
                        ]);
                        $user->payroll()->update([
                            'payroll_frequency' => $request->payroll_frequency,
                            'net_salary' => $request->net_salary,
                            'payment_status' => 'pending',
                            'pay_date' => $this->getUpcomingPayDate($request->payroll_frequency)
                        ]);
                    }

                    // Sync roles if provided
                    if ($request->has('roles')) {
                        $user->role()->sync($request->input('roles'));
                    }
                    if ($request->has('subjects')) {
                        $user->subjects()->sync($request->input('subjects'));
                        $user->grades()->sync($request->grades);
                    }
                    if ($request->has('grades')) {
                        $user->grades()->sync($request->input('grades'));
                    }

                    // Load relationships and return response
                    $user->load('school', 'role', 'subjects', 'grades');

                    return response()->json($user, Response::HTTP_OK);
                } else {
                    return response()->json(['error' => 'Validation Error'], 422);
                }
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json($e->errors(), 422);
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }
    public function update_admin(Request $request, User $user)
    {
        if ($request->user()->hasRole(config('roles.admin_staff'))) {
            try {

                //! if your data not changeing
                // To send request using put method, you have to :
                /**
                 * change the Put method to POST
                 * add new data _method: PUT
                 */

                $validation = $request->validate([
                    'name' => 'nullable|string|max:255',
                    'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
                    'phone' => 'string|max:255',
                    'password' => 'nullable|string|min:8|confirmed',
                    'school_id' => 'nullable|exists:schools,id',
                    'roles' => 'nullable|array',
                    'roles.*' => 'exists:roles,id',
                    'subjects' => 'nullable|array',
                    'subjects.*' => 'exists:subjects,id',
                    'grades' => 'nullable|array',
                    'grades.*' => 'exists:grades,id',
                    'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                ]);

                if ($validation) {
                    $user->name = $request->input('name', $user->name);
                    $user->email = $request->input('email', $user->email);
                    $user->phone = $request->input('phone', $user->phone);

                    if ($request->filled('password')) {
                        $user->password = bcrypt($request->input('password'));
                    }

                    // Update the school_id if provided
                    if ($request->filled('school_id')) {
                        $user->school_id = $request->input('school_id');
                    }

                    if ($request->hasFile('image')) {
                        if ($user->imagePath) {
                            if (Storage::disk('public')->exists($user->imagePath)) {
                                Storage::disk('public')->delete($user->imagePath);
                            }
                        }
                        $path = $request->file('image')->store('images', 'public');
                        $user->imagePath = $path;
                    }

                    $user->save();

                    // Sync roles if provided
                    if ($request->has('roles')) {
                        $user->role()->sync($request->input('roles'));
                    }
                    if ($request->has('subjects')) {
                        $user->subjects()->sync($request->input('subjects'));
                        $user->grades()->sync($request->grades);
                    }
                    if ($request->has('grades')) {
                        $user->grades()->sync($request->input('grades'));
                    }

                    // Load relationships and return response
                    $user->load('school', 'role', 'subjects', 'grades');

                    return response()->json($user, Response::HTTP_OK);
                } else {
                    return response()->json(['error' => 'Validation Error'], 422);
                }
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json($e->errors(), 422);
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }

    public function destroy(User $user, Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {

            if (!empty($user->imagePath)) {
                if (Storage::disk('public')->exists($user->imagePath)) {
                    Storage::disk('public')->delete($user->imagePath);
                }
            }

            $user->role()->detach();
            $user->delete();


            return response()->json(['message' => 'User deleted successfully'], Response::HTTP_OK);
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }
    public function destroy_admin(User $user, Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff'))) {

            if (!empty($user->imagePath)) {
                if (Storage::disk('public')->exists($user->imagePath)) {
                    Storage::disk('public')->delete($user->imagePath);
                }
            }
            $user->role()->detach();

            $user->delete();


            return response()->json(['message' => 'User deleted successfully'], Response::HTTP_OK);
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }
    public function export(Request $request)
    {
        $filters = $request->only(['name', 'email']);
        return Excel::download(new UsersExport($filters), 'users.xlsx');
    }

    public function import(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx',
            ]);

            Excel::import(new UsersImport, $request->file('file'));

            return response()->json(['success' => 'Users Imported Successfully']);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed for some rows.',
                'error' => $e->errors()
            ], 422);
        }
    }
    public function unblockUser(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {
            try {
                if ($request->user()->hasRole(config('roles.admin'))) {
                    $userStatus = User::whereId($request->user_id)
                        ->whereDoesntHave('role', function ($query) {
                            $query->whereIn('name', [
                                config('roles.admin'),
                                // config('roles.admin_staff'),
                            ]);
                        })
                        ->update(['blocked' => false]);
                    if (!$userStatus) {
                        return response()->json(['error' => 'Error while blocking user, please check if he is not an admin', 'userStatus' => $userStatus], Response::HTTP_FORBIDDEN);
                    } else {
                        return response()->json(['success' => 'Users blocked Successfully', 'userStatus' => $userStatus]);
                    }
                } else if ($request->user()->hasRole(config('roles.admin_staff'))) {
                    $userStatus = User::whereId($request->user_id)->update(['blocked' => false]);
                    return response()->json(['success' => 'Users blocked Successfully', 'userStatus' => $userStatus]);
                }
            } catch (ValidationException $e) {
                return response()->json([
                    'message' => 'Validation failed for some rows.',
                    'error' => $e->errors()
                ], 422);
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }
    public function blockUser(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff')) || $request->user()->hasRole(config('roles.admin'))) {
            try {
                if ($request->user()->hasRole(config('roles.admin'))) {
                    $userStatus = User::whereId($request->user_id)
                        ->whereDoesntHave('role', function ($query) {
                            $query->whereIn('name', [
                                config('roles.admin'),
                                // config('roles.admin_staff'),
                            ]);
                        })
                        ->update(['blocked' => true]);
                    if (!$userStatus) {
                        return response()->json(['error' => 'Error while blocking user, please check if he is not an admin', 'userStatus' => $userStatus], Response::HTTP_FORBIDDEN);
                    } else {
                        return response()->json(['success' => 'Users blocked Successfully', 'userStatus' => $userStatus]);
                    }
                } else if ($request->user()->hasRole(config('roles.admin_staff'))) {
                    $userStatus = User::whereId($request->user_id)->update(['blocked' => true]);
                    return response()->json(['success' => 'Users blocked Successfully', 'userStatus' => $userStatus]);
                }
            } catch (ValidationException $e) {
                return response()->json([
                    'message' => 'Validation failed for some rows.',
                    'error' => $e->errors()
                ], 422);
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }
    public function unblockAdmin(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff'))) {
            try {

                $userStatus = User::whereId($request->user_id)->update(['blocked' => false]);

                return response()->json(['success' => 'Users unblocked Successfully', 'userStatus' => $userStatus]);
            } catch (ValidationException $e) {
                return response()->json([
                    'message' => 'Validation failed for some rows.',
                    'error' => $e->errors()
                ], 422);
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }
    public function blockAdmin(Request $request)
    {
        if ($request->user()->hasRole(config('roles.admin_staff'))) {
            try {
                $userStatus = User::whereId($request->user_id)->update(['blocked' => true]);
                return response()->json(['success' => 'Users blocked Successfully', 'userStatus' => $userStatus]);
            } catch (ValidationException $e) {
                return response()->json([
                    'message' => 'Validation failed for some rows.',
                    'error' => $e->errors()
                ], 422);
            }
        } else {
            return response()->json(['error' => "You don't have access to this route"], Response::HTTP_FORBIDDEN);
        }
    }
}
