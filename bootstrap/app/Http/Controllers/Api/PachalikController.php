<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pachalik;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PachalikController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $pachaliks = Pachalik::with('annexes')->get();
            
            return response()->json([
                'success' => true,
                'data' => $pachaliks
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des pachaliks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
                'code' => 'nullable|string|max:50'
            ]);

            $pachalik = Pachalik::create($validated);

            return response()->json([
                'success' => true,
                'data' => $pachalik,
                'message' => 'Pachalik créé avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du pachalik',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $pachalik = Pachalik::with('annexes')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $pachalik
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pachalik non trouvé',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $pachalik = Pachalik::findOrFail($id);
            
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
                'code' => 'nullable|string|max:50'
            ]);

            $pachalik->update($validated);

            return response()->json([
                'success' => true,
                'data' => $pachalik,
                'message' => 'Pachalik mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du pachalik',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $pachalik = Pachalik::findOrFail($id);
            $pachalik->delete();

            return response()->json([
                'success' => true,
                'message' => 'Pachalik supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du pachalik',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
