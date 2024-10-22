// SCORE VERS DB
let score = 0;

// Simule un calcul de score
document.getElementById('calculate-score').addEventListener('click', function() {
    score = Math.floor(Math.random() * 100);
    document.getElementById('score-display').innerText = "Score: " + score;
});

// Sauvegarde le score via AJAX
document.getElementById('save-score').addEventListener('click', function() {
    const formData = new FormData();
    formData.append('score', score);

    // Envoi du score via fetch en POST classique
    fetch('scoreTraitement.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
    });
});