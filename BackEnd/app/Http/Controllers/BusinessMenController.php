<?php

namespace App\Http\Controllers;

use App\Models\BusinessMan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BusinessMenController extends Controller
{

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|String',
        ]);

        if (!Auth::attempt(($credentials))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid Credentials'
            ], 401);
        }

        $BusinessMan = Auth::user();

        $Token = $BusinessMan->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Business Man Logged in successfully',
            'data' => $BusinessMan,
            'Token' => $Token
        ], 200);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:business_men,email',
            'password' => 'required|String|min:6',
            'phone' => 'required|string'
        ]);

        $data['password'] = Hash::make($request->password);

        $BusinessMan = BusinessMan::create($data);

        $Token = $BusinessMan->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Business Man registered successfully',
            'data' => $BusinessMan,
            'Token' => $Token
        ], 201);
    }

}
