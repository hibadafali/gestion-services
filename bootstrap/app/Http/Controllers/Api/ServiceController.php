<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    public function __construct()
    {
        // Appliquer le middleware Admin sauf pour l'index et le show
        $this->middleware('admin')->except(['index', 'show']);
    }

    // Récupérer tous les services
    public function index(Request $request): JsonResponse
    {
        $query = Service::query();
        // Filtrage par division (optionnel)
        if ($request->has('division_id')) {
            $query->where('division_id', $request->division_id);
        }
        // Recherche par nom
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nom', 'like', "%{$search}%");
        }
        $services = $query->with('division')->orderBy('nom')->get();
        return response()->json(['success' => true, 'data' => $services]);
    }

    // Créer un nouveau service
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'division_id' => 'required|exists:divisions,id',
        ]);
        $service = Service::create($validated);
        return response()->json(['success' => true, 'data' => $service], 201);
    }

    // Afficher un service
    public function show($id): JsonResponse
    {
        $service = Service::findOrFail($id);
        return response()->json(['success' => true, 'data' => $service]);
    }

    // Modifier un service
    public function update(Request $request, $id): JsonResponse
    {
        $service = Service::findOrFail($id);
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'division_id' => 'sometimes|required|exists:divisions,id',
        ]);
        $service->update($validated);
        return response()->json(['success' => true, 'data' => $service]);
    }

    // Supprimer un service
    public function destroy($id): JsonResponse
    {
        $service = Service::findOrFail($id);
        $service->delete();
        return response()->json(['success' => true, 'message' => 'Service supprimé']);
    }
}
