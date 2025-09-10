# 📋 Guide de Transfert du Projet - Gestion Services

## 🎯 Résumé du Projet
- **Backend**: Laravel (API REST) sur `http://127.0.0.1:8000`
- **Frontend**: React (SPA) dans `frontend/src/`
- **Authentification**: Token-based avec rôles (admin, interne, externe)
- **Administration**: Interface React pour gestion utilisateurs

## ✅ Problèmes Résolus

### 1. Logo sur la Page d'Accueil ✅
**Problème**: Le fichier `logo-prefecture.png` n'existait pas dans `frontend/public/`
**Solution**: Modifié `Accueil.js` pour utiliser `logo.svg` existant
```javascript
import logo from './logo.svg';
<img src={logo} alt="Logo Préfecture Marrakech" />
```

## 🚀 Procédure de Transfert du Projet

### Étape 1: Préparation pour le Transfert
```bash
# 1. Arrêter tous les serveurs en cours
# 2. Vérifier que tous les fichiers sont sauvegardés
# 3. Nettoyer les dossiers temporaires (optionnel)
```

### Étape 2: Compression du Projet
```bash
# Créer un ZIP du dossier principal
# Inclure TOUS les fichiers sauf:
# - node_modules/ (sera régénéré)
# - vendor/ (sera régénéré)
# - .env (créer une copie .env.example)
```

### Étape 3: Installation sur le Nouveau PC

#### A. Décompression
```bash
# Extraire le ZIP dans le répertoire souhaité
# Exemple: C:\Users\[Nom]\Desktop\gestion-services-nouveau\
```

#### B. Installation Backend (Laravel)
```bash
# Naviguer vers le dossier du projet
cd C:\Users\[Nom]\Desktop\gestion-services-nouveau\gestion-services-nouveau

# Installer les dépendances PHP
composer install

# Copier et configurer l'environnement
copy .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=gestion_services
# DB_USERNAME=root
# DB_PASSWORD=

# Migrer la base de données
php artisan migrate

# Créer l'utilisateur admin (si nécessaire)
php artisan tinker
# User::create(['name' => 'Admin', 'email' => 'admin@admin.com', 'password' => bcrypt('password'), 'is_admin' => true]);
```

#### C. Installation Frontend (React)
```bash
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances Node.js
npm install

# Vérifier que tout fonctionne
npm start
```

### Étape 4: Démarrage des Serveurs

#### Terminal 1 - Backend Laravel
```bash
cd C:\Users\[Nom]\Desktop\gestion-services-nouveau\gestion-services-nouveau
php artisan serve
# Serveur disponible sur: http://127.0.0.1:8000
```

#### Terminal 2 - Frontend React
```bash
cd C:\Users\[Nom]\Desktop\gestion-services-nouveau\gestion-services-nouveau\frontend
npm start
# Application disponible sur: http://localhost:3000
```

## 🔧 Dépannage Commun

### Problème: API non accessible
**Cause**: Backend Laravel non démarré
**Solution**: 
```bash
cd [dossier-projet]
php artisan serve
```

### Problème: Logo ne s'affiche pas
**Cause**: Fichier logo manquant ou mauvais chemin
**Solution**: ✅ Déjà corrigé - utilise `logo.svg` dans `src/`

### Problème: Erreurs de dépendances
**Cause**: `node_modules` ou `vendor` non installés
**Solution**:
```bash
# Pour Laravel
composer install

# Pour React
cd frontend
npm install
```

### Problème: Base de données
**Cause**: Configuration `.env` incorrecte
**Solution**:
1. Vérifier les paramètres DB dans `.env`
2. Créer la base de données manuellement
3. Exécuter `php artisan migrate`

## 👤 Connexion Admin
- **Email**: `admin@admin.com`
- **Mot de passe**: `password`
- **Accès**: Interface d'administration des utilisateurs

## 📁 Structure des Fichiers Importants
```
gestion-services-nouveau/
├── app/                    # Code Laravel
├── frontend/
│   ├── src/
│   │   ├── Accueil.js     # Page d'accueil ✅
│   │   ├── AdminUsers.js  # Gestion utilisateurs
│   │   ├── App.js         # Application principale
│   │   └── logo.svg       # Logo ✅
│   └── public/            # Fichiers statiques
├── routes/                # Routes API Laravel
├── .env                   # Configuration environnement
└── composer.json          # Dépendances PHP
```

## ⚠️ Points d'Attention
1. **Toujours** régénérer `node_modules` et `vendor` sur un nouveau PC
2. **Vérifier** que les deux serveurs (Laravel + React) sont démarrés
3. **Configurer** correctement la base de données dans `.env`
4. **Tester** la connexion admin après installation

## 🎉 Fonctionnalités Disponibles
- ✅ Page d'accueil moderne avec logo
- ✅ Authentification sécurisée par token
- ✅ Gestion des utilisateurs par l'admin
- ✅ Interface React responsive
- ✅ API Laravel fonctionnelle
- ✅ Gestion des rôles (admin, interne, externe)

---
*Guide créé le: $(date)*
*Projet: Système de Gestion Administrative - Préfecture de Marrakech*
