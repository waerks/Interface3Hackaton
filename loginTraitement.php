<?php
// prémiere ligne du script, pour accéder à la session
session_start();
//include "./user.json";

// 1. Récuperer le nom $_POST['nom'] et l'email $_POST['email']
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nom = $_POST['nom'];
    $email = $_POST['email'];
// 2. Charger les utilisateurs existants
    $users = json_decode(file_get_contents('users.json'), true);
    
// 3. Vérifier les informations de connexion
    foreach ($users as $user) {
        if ($user['nom'] === $nom && $user['email'] === $email) {
            $_SESSION['nom'] = $nom;
            echo "Connexion réussie!";
            exit;
        }
    }
    echo "Nom d'utilisateur ou email incorrect!!";
}


// 2. Chercher le login dans la BD et obtenir son password
// 3. Comparer le password reçu du formulaire avec le password de l'user obtenu de la BD