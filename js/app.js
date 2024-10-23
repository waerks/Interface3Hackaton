// IMPORT SCORE
window.onload = function() {
// SCORE VERS DB
// Sauvegarde le score via AJAX
  // Récupére le score depuis localStorage  
  const score = localStorage.getItem('score');

  if (score !== null) {
    document.getElementById('score-display').textContent = "Votre score est de " + score + " / 10";
    
    // Sauvegarde le score via AJAX
    const formData = new FormData();
    formData.append('score', score);

    // Envoi du score via fetch en POST
    fetch('scoreTraitement.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(result => {
        console.log(result);

        calculateAverageScore();
    })
    .catch(error => {
      console.error('Erreur lors de la sauvegarde du score:', error);
    });
  } else {
    document.getElementById('score-display').textContent = "Pas de score disponible.";
  }
};

// Fonction pour calculer la moyenne des scores
function calculateAverageScore() {
  fetch('assets/Data/scores.json')
    .then(response => response.json())
    .then(scoresData => {
      if (Array.isArray(scoresData) && scoresData.length > 0) {
        let totalScores = 0;
        let totalResponses = scoresData.length;

        // Utiliser forEach pour additionner les scores
        scoresData.forEach(element => {
          totalScores += parseInt(element.score, 10);
        });

        // Calculer la moyenne des scores
        const averageScore = totalScores / totalResponses;
        const percentage = (averageScore / 10) * 100;

        // Afficher le pourcentage arrondi et ne pas dépasser 100%
        document.getElementById('score-moyenne').textContent = "Le pourcentage de bonnes réponses est de " + Math.min(Math.round(percentage), 100) + "%";
      } else {
        document.getElementById('score-moyenne').textContent = "Pas de données de scores disponibles.";
      }
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des scores:', error);
    });
}

// SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }

//   INSTALL PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Empêche le navigateur d'afficher le prompt automatiquement
  e.preventDefault();
  deferredPrompt = e;
  
  // Affiche ton bouton d'installation
  document.querySelector('#install-button').style.display = 'block';

  document.querySelector('#install-button').addEventListener('click', (e) => {
    // Affiche le prompt d'installation
    deferredPrompt.prompt();
    
    // Attend la réponse de l'utilisateur
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('L\'utilisateur a accepté l\'installation');
      } else {
        console.log('L\'utilisateur a refusé l\'installation');
      }
      deferredPrompt = null; // Réinitialise le prompt
    });
  });
});