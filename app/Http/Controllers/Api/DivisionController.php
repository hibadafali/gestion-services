<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DivisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $divisions = Division::with('services')->get();
            
            return response()->json([
                'success' => true,
                'data' => $divisions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des divisions',
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

            $division = Division::create($validated);

            return response()->json([
                'success' => true,
                'data' => $division,
                'message' => 'Division créée avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la division',
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
            $division = Division::with('services')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $division
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Division non trouvée',
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
            $division = Division::findOrFail($id);
            
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
                'code' => 'nullable|string|max:50'
            ]);

            $division->update($validated);

            return response()->json([
                'success' => true,
                'data' => $division,
                'message' => 'Division mise à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la division',
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
            $division = Division::findOrFail($id);
            $division->delete();

            return response()->json([
                'success' => true,
                'message' => 'Division supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la division',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
