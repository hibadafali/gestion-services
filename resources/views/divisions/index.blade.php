@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Gestion des Divisions</h2>

    <!-- Formulaire d'ajout -->
    <form method="POST" action="{{ route('divisions.store') }}">
        @csrf
        <input type="text" name="nom" placeholder="Nom de la division" required>
        <input type="number" name="entite_prefecture_id" placeholder="ID de l'entité préfectorale" required>
        <button type="submit">Ajouter</button>
    </form>

    <hr>

    <!-- Tableau des divisions -->
    <table border="1" cellpadding="10" cellspacing="0">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Entité Préfecture ID</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($divisions as $division)
            <tr>
                <td>{{ $division->id }}</td>
                <td>{{ $division->nom }}</td>
                <td>{{ $division->entite_prefecture_id }}</td>
                <td>
                    <!-- Supprimer -->
                    <form action="{{ route('divisions.destroy', $division->id) }}" method="POST" onsubmit="return confirm('Supprimer ?');" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit">Supprimer</button>
                    </form>
                    <!-- Modifier : à ajouter plus tard si tu veux -->
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
