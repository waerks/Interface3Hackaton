<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userInput = $_POST['nom'];
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

 // Charger le fichier JSON contenant les utilisateurs
    $jsonFilePath = __DIR__ . '/assets/Data/users.json';//obtenir le chemin complet du fichier JSON
// Lire le fichier JSON
    $jsonData = file_get_contents($jsonFilePath);//lire tout le contenu du fichier JSON( Elle retourne une chaîne de caractères)
    $users = json_decode($jsonData, true);//décoder le contenu JSON pour le transformer en un tableau PHP.

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
$json = json_encode($users, JSON_PRETTY_PRINT);//convertir le tableau PHP en une chaîne de caractères au format JSON (avec des espaces et lisible)
file_put_contents($jsonFilePath, $json);//La chaîne JSON est écrite dans le fichier users.json

echo "<script>alert('Inscription reussie'); window.location.href=' game.html' </script>";
exit;
}