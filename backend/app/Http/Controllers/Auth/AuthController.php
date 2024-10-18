<?php

namespace App\Http\Controllers\Auth;

use App\Enums\TokenAbility;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $expiryMinutes = (int)config('token.time_expired');
        $credentials = $request->only('email', 'password');
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        if ($user->blocked) {
            return response()->json(['error' => 'User is blocked'], 403);
        }
        $accessToken = $user->createToken('access_token', [TokenAbility::ACCESS_API->value], Carbon::now()->addMinutes(config('sanctum.ac_expiration')));
        $refreshToken = $user->createToken('refresh_token', [TokenAbility::ISSUE_ACCESS_TOKEN->value], Carbon::now()->addMinutes(config('sanctum.rt_expiration')));
        return response()->json([
            'user' => $user,
            'token' => $accessToken->plainTextToken,
            'refresh_token' => $refreshToken->plainTextToken
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
    public function refreshToken(Request $request)
    {
        if ($request->user()->blocked) {
            return response()->json(['error' => 'User is blocked'], 403);
        }
        $user = $request->user();
        $user->tokens()->whereNotIn('id', function ($query) use ($user) {
            $query->select('id')
                    ->from('personal_access_tokens')
                    ->where('abilities', 'like', '%issue-access-token%');
        })->delete();

        $accessToken = $request->user()->createToken('access_token', [TokenAbility::ACCESS_API->value], Carbon::now()->addMinutes(config('sanctum.ac_expiration')));
        return response(['message' => "Token regenerate", 'token' => $accessToken->plainTextToken]);
    }
}
