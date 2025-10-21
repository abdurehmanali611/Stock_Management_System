<?php

namespace App\Http\Controllers;
use App\Models\Business;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'business_name' => 'required|string',
            'business_type' => 'required|string',
            'currency' => 'required|string',
            'admin_name' => 'required|string'
        ]);

        $data['user_id'] = Auth::id();

        Business::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Business registered successfully'
        ], 201);
    }

}
