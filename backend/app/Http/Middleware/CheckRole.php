<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * The role to check.
     *
     * @var string
     */
    protected $role;

    /**
     * Create a new middleware instance.
     *
     * @param  string  $role
     * @return void
     */
    public function __construct(string $role)
    {
        $this->role = $role;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check() || !Auth::hasRole($this->role)) {
            return response()->json(['error' => 'Role does not exist']);
        }
        return $next($request);
    }
}
