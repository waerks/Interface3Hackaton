<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userInput = $_POST['nom'];
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

 // Charger le fichier JSON contenant les utilisateurs
    $jsonFilePath = __DIR__ . '/assets/Data/users.json';
// Lire le fichier JSON
    $jsonData = file_get_contents($jsonFilePath);
    $users = json_decode($jsonData, true);

 // Vérifier si l'utilisateur existe déjà
    foreach ($users as $user) {
        if ($user['nom'] === $userInput || $user['email'] === $email) {
        echo "<script>alert('L\'utilisateur ou l\'email existe déjà!! Veuillez réessayer.'); window.location.href=' inscription.html'; </script>";
        exit;
    }
}

// Ajouter le nouvel utilisateur
$new_user = [
    'nom' => $userInput,
    'email' => $email
];

$users[] = $new_user;

// Enregistrer le nouvel utilisateur
$json = json_encode($users, JSON_PRETTY_PRINT);
file_put_contents($jsonFilePath, $json);

echo "<script>alert('Inscription reussie'); window.location.href=' game.html' </script>";
exit;
}