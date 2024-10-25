<?php

// Charger le fichier JSON contenant les utilisateurs
$jsonFilePath = __DIR__ . '/assets/Data/users.json';

if (!file_exists($jsonFilePath)) {
    die('Le fichier users.json est introuvable.');
}

// Lire le fichier JSON
$jsonData = file_get_contents($jsonFilePath);
$users = json_decode($jsonData, true);

if ($users === null) {
    die('Erreur de lecture du fichier JSON.');
}

if (isset($_POST['nom'])) {
    $nom = $_POST['nom'];
} else {
    $nom = null;
}

if (!$nom) {
    die('Nom d\'utilisateur non fourni.');
}

// Vérifier si l'utilisateur existe
$userFound = false;

foreach ($users as $user) {
    if ($user['nom'] === $nom) {
        $userFound = true;
        break;
    }
}

if ($userFound) {
    // Si l'utilisateur est trouvé, rediriger vers game.html
    header('Location: game.html');
    exit;
} else {
    // Si l'utilisateur n'est pas trouvé, retourner à la page de connexion avec un message d'erreur
    echo "<script>alert('Nom d\'utilisateur incorrect. Veuillez réessayer.'); window.location.href = 'login.html';</script>";
    exit;
}