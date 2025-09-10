@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Ajouter un indicateur</h2>

    @if ($errors->any())
        <div style="color:red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('indicateurs.store') }}">
        @csrf

        <div>
            <label>Nom :</label>
            <input type="text" name="nom" required>
        </div>

        <div>
            <label>Type :</label>
            <input type="text" name="type" required>
        </div>

        <div>
            <label>Valeur :</label>
            <input type="number" name="valeurs" required>
        </div>

        <div>
            <label>Service :</label>
            <select name="service_id" required>
                <option value="">-- Choisir un service --</option>
                @foreach($services as $service)
                    <option value="{{ $service->id }}">{{ $service->nom }}</option>
                @endforeach
            </select>
        </div>

        <br>

        <button type="submit">Ajouter</button>
    </form>
</div>
@endsection
