<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:6'],
        ],
        [
            'password.min' => 'Password must be at least 6 characters.',
            'password.required' => 'Password is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please enter a valid email address.',
        ]
    );

        if (! Auth::attempt($credentials)) {
            return response()->json([
              'message' => 'Invalid email or password.',
            ], 401);
        } 

        $user = Auth::user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
          'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }
}