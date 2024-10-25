// scoreHandler.js

function sendScore(username, score) {
    const data = { nom: username, score: score };

    fetch('scoreTraitement.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Utiliser ce type pour envoyer les données
        },
        body: new URLSearchParams(data).toString() // Convertir les données en chaîne de requête
    })
    .then(response => response.text()) // Utiliser text() si le serveur renvoie un message simple
    .then(result => {
        console.log('Réponse du serveur:', result); // Afficher la réponse pour déboguer
    })
    .catch(error => console.error('Erreur lors de la sauvegarde du score:', error));
}