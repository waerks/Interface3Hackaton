<?php
// prémiere ligne du script, pour accéder à la session
session_start();

// 1. Récuperer le nom $_POST['nom'] et l'email $_POST['email']
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user = $_POST['user'];
    //$email = $_POST['email'];
// 2. Charger les utilisateurs existants
    $users = json_decode(file_get_contents('users.json'), true);
    
// 3. Vérifier les informations de connexion
    foreach ($users as $useri) {
        if ($useri['user'] === $user) {
            $_SESSION['user'] = $user;
            echo "Connexion réussie!";
            exit;
        }
    }
    echo "Nom d'utilisateur incorrect!!";
}


// 4. Chercher le login dans la BD et obtenir son password
// 5. Comparer le password reçu du formulaire avec le password de l'user obtenu de la BD