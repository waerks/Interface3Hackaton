<?php

$usersFile = 'assets/Data/users.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer le score et le nom de l'utilisateur à partir de la requête POST
    $score = $_POST['score'];
    $username = $_POST['nom'];

    // Charger les utilisateurs depuis le fichier users.json
    $users = json_decode(file_get_contents($usersFile), true);

    // Vérifier si l'utilisateur existe dans le fichier users.json
    $userFound = false;
    foreach ($users as &$user) {
        if ($user['nom'] === $username) {
            // Si l'utilisateur est trouvé, mettre à jour son score
            $user['score'] = isset($user['score']) ? $user['score'] + $score : $score; // Additionner le score existant ou définir un nouveau score
            $userFound = true;
            break; // Sortir de la boucle une fois l'utilisateur trouvé
        }
    }

    if ($userFound) {
        // Enregistrer les utilisateurs mis à jour dans users.json
        file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
        echo "Score sauvegardé avec succès pour l'utilisateur $username!";
    } else {
        echo "Utilisateur non trouvé dans users.json!";
    }
}