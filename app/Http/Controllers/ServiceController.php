<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return Service::with(['division', 'demandes', 'indicateurs'])->get();
    }

    public function show($id)
    {
        return Service::with(['division', 'demandes', 'indicateurs'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'division_id' => 'required|exists:divisions,id',
        ]);
        return Service::create($data);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'division_id' => 'required|exists:divisions,id',
        ]);
        $service->update($data);
        return $service;
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
