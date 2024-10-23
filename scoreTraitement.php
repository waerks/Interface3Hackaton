<?php

$scoresFile = 'assets/Data/scores.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $score = $_POST['score'];

    var_dump($_POST);

    // Charger les scores existants
    $scores = json_decode(file_get_contents($scoresFile), true);

    // Si le fichier est vide, créer un tableau vide
    if (!is_array($scores)) {
        $scores = [];
    }
    
    // Ajoute le nouveau score avec la date
    $scores[] = [
        'score' => $score,
    ];

    // Enregistrer le nouveau score
    file_put_contents($scoresFile, json_encode($scores, JSON_PRETTY_PRINT));

    echo "Score sauvegardé avec succès!";
}