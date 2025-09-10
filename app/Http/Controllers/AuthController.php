{{ ... }}
    public function register(Request $request)
    {
-        // Désactivé : l'inscription ne peut se faire que par l'administrateur
-        abort(403, 'Inscription désactivée.');
+        // Désactivé : l'inscription ne peut se faire que par l'administrateur
+        return response()->json(['message' => 'Inscription désactivée. Seul l\'administrateur peut créer un utilisateur.'], 403);
    }
{{ ... }}
