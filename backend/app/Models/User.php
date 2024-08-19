<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Client\Request;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable , HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function role() : BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }
    public function school() : BelongsTo
    {
        return $this->belongsTo(School::class, 'school_id', 'id');
    }
    public function hasRole($role)
    {
        $roles = $this->role->pluck('name')->toArray();
        return in_array($role, $roles);
    }

    // public function createToken(Request $request)
    // {
    //     $user = User::find(1); // Replace with the appropriate user lookup
    //     $token = $user->createToken('MyApp')->plainTextToken;

    //     return response()->json(['token' => $token]);
    // }
}
