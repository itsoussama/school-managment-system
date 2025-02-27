<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    public function index()
    {
        $schoolId = auth()->user()->school_id;
        $perPage = request()->query('per_page', 5);
        $userRoles = [config('roles.admin_staff'), config('roles.admin'), config('roles.teacher')];
        $payrolls = Payroll::with('user.role')->whereHas('user', fn($query) =>
        $query->where('school_id', $schoolId)->whereHas('role', fn($query) =>
        $query->whereIn('name', $userRoles)));
        return response()->json($payrolls->paginate($perPage));
    }


    public function show($id)
    {
        $payroll = Payroll::findOrFail($id);
        return response()->json($payroll);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pay_period' => 'required|string',
            'salary_type' => 'required|string',
            'base_salary' => 'required|numeric',
            'hourly_rate' => 'nullable|numeric',
            'hours_worked' => 'nullable|numeric',
            'total_allowances' => 'required|numeric',
            'total_deductions' => 'required|numeric',
            'net_salary' => 'required|numeric',
            'payment_status' => 'required|string',
            'pay_date' => 'required|date',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $payroll = Payroll::create($validated);
        return response()->json($payroll, 201);
    }

    public function update(Request $request, $id)
    {
        $payroll = Payroll::findOrFail($id);
        $payroll->pay_period = $request->input('pay_period', $payroll->pay_period);
        $payroll->salary_type = $request->input('salary_type', $payroll->salary_type);
        $payroll->base_salary = $request->input('base_salary', $payroll->base_salary);
        $payroll->hourly_rate = $request->input('hourly_rate', $payroll->hourly_rate);
        $payroll->hours_worked = $request->input('hours_worked', $payroll->hours_worked);
        $payroll->total_allowances = $request->input('total_allowances', $payroll->total_allowances);
        $payroll->total_deductions = $request->input('total_deductions', $payroll->total_deductions);
        $payroll->net_salary = $request->input('net_salary', $payroll->net_salary);
        $payroll->payment_status = $request->input('payment_status', $payroll->payment_status);
        $payroll->pay_date = $request->input('pay_date', $payroll->pay_date);
        $payroll->user_id = $request->input('user_id', $payroll->user_id);
        $payroll->save();

        return response()->json($payroll);
    }

    public function destroy($id)
    {
        Payroll::destroy($id);
        return response()->json(['message' => 'Payroll deleted']);
    }
}
