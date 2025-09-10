<!DOCTYPE html>
<html>
<head>
    <title>Gestion des services</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <!-- Barre de navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light px-4">
        <a class="navbar-brand" href="/">MonApp</a>
        <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="{{ url('/divisions') }}">Divisions</a></li>
            <li class="nav-item"><a class="nav-link" href="{{ url('/services') }}">Services</a></li>
        </ul>
    </nav>

    <!-- Contenu de la page -->
    <div class="container py-4">
        @yield('content')
    </div>
</body>
</html>
