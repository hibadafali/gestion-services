<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::all();
        return response()->json(['success' => true, 'data' => $users]);
    }

    public function show($id): JsonResponse
    {
        $user = User::findOrFail($id);
        return response()->json(['success' => true, 'data' => $user]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'is_admin' => 'nullable|boolean',
            'type' => 'required|in:interne,externe',
        ]);
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_admin' => $data['is_admin'] ?? false,
            'type' => $data['type'],
        ]);
        return response()->json(['success' => true, 'data' => $user], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'is_admin' => 'nullable|boolean',
            'type' => 'sometimes|required|in:interne,externe',
        ]);
        if(isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        $user->update($data);
        return response()->json(['success' => true, 'data' => $user]);
    }

    public function destroy($id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['success' => true, 'message' => 'Utilisateur supprimé']);
    }
}
