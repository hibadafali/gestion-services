<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Annexe;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AnnexeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $annexes = Annexe::with('pachalik')->get();
            
            return response()->json([
                'success' => true,
                'data' => $annexes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des annexes',
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
                'pachalik_id' => 'required|exists:pachaliks,id',
                'code' => 'nullable|string|max:50'
            ]);

            $annexe = Annexe::create($validated);

            return response()->json([
                'success' => true,
                'data' => $annexe->load('pachalik'),
                'message' => 'Annexe créée avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'annexe',
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
            $annexe = Annexe::with('pachalik')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $annexe
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Annexe non trouvée',
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
            $annexe = Annexe::findOrFail($id);
            
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
                'pachalik_id' => 'required|exists:pachaliks,id',
                'code' => 'nullable|string|max:50'
            ]);

            $annexe->update($validated);

            return response()->json([
                'success' => true,
                'data' => $annexe->load('pachalik'),
                'message' => 'Annexe mise à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de l\'annexe',
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
            $annexe = Annexe::findOrFail($id);
            $annexe->delete();

            return response()->json([
                'success' => true,
                'message' => 'Annexe supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'annexe',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
