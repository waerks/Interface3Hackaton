<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user = $_POST['user'];
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

 // Charger les utilisateurs existants
 $users = json_decode(file_get_contents('users.json'), true);

 // Vérifier si l'utilisateur existe déjà
 foreach ($users as $useri) {
    if ($useri['user'] === $user || $useri['email'] === $email) {
        echo "L'utilisateur existe déjà.";
        exit;
    }
}

// Ajouter le nouvel utilisateur
$new_user = [
    'user' => $user,
    'email' => $email
];

$users[] = $new_user;

// Enregistrer le nouvel utilisateur
$json = json_encode($users, JSON_PRETTY_PRINT);
file_put_contents('users.json', $json);
echo "Inscription réussie!!";
}