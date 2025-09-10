@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Gestion des Services</h2>

    <!-- Formulaire d'ajout -->
    <form method="POST" action="{{ route('services.store') }}">
        @csrf
        <input type="text" name="nom" placeholder="Nom du service" required>
        <select name="division_id" required>
            <option value="">-- Choisir une division --</option>
            @foreach($divisions as $division)
                <option value="{{ $division->id }}">{{ $division->nom }}</option>
            @endforeach
        </select>
        <button type="submit">Ajouter</button>
    </form>

    <hr>

    <!-- Tableau des services -->
    <table border="1" cellpadding="8" cellspacing="0">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Division</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($services as $service)
            <tr>
                <td>{{ $service->id }}</td>
                <td>{{ $service->nom }}</td>
                <td>{{ $service->division->nom ?? '—' }}</td>
                <td>
                    <form action="{{ route('services.destroy', $service->id) }}" method="POST" onsubmit="return confirm('Supprimer ?');" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit">Supprimer</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
