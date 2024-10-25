// IMPORT SCORE
// window.onload = function() {
// // SCORE VERS DB
// // Sauvegarde le score via AJAX
//   // Récupére le score depuis localStorage  
//   const score = localStorage.getItem('score');

//   if (score !== null) {
//     // Sauvegarde le score via AJAX
//     const formData = new FormData();
//     formData.append('score', score);

//     // Envoi du score via fetch en POST
//     fetch('scoreTraitement.php', {
//       method: 'POST',
//       body: formData
//     })
//     .then(response => response.text())
//     .then(result => {
//         calculateAverageScore();
//     })
//     .catch(error => {
//       console.error('Erreur lors de la sauvegarde du score:', error);
//     });
//   } else {
//     document.getElementById('score-display').textContent = "Pas de score disponible.";
//   }
// };

// // Fonction pour calculer la moyenne des scores
// function calculateAverageScore() {
//   fetch('assets/Data/scores.json')
//     .then(response => response.json())
//     .then(scoresData => {
//       if (Array.isArray(scoresData) && scoresData.length > 0) {
//         let totalScores = 0;
//         let totalResponses = scoresData.length;

//         // Utiliser forEach pour additionner les scores
//         scoresData.forEach(element => {
//           totalScores += parseInt(element.score, 10);
//         });

//         // Calculer la moyenne des scores
//         const averageScore = totalScores / totalResponses;
//         const percentage = (averageScore / 10) * 100;

//         // Afficher le pourcentage arrondi et ne pas dépasser 100%
//         document.getElementById('score-moyenne').textContent = "Le pourcentage de bonnes réponses est de " + Math.min(Math.round(percentage), 100) + "%";
//       } else {
//         document.getElementById('score-moyenne').textContent = "Pas de données de scores disponibles.";
//       }
//     })
//     .catch(error => {
//       console.error('Erreur lors de la récupération des scores:', error);
//     });
// }

// SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('ServiceWorker enregistré avec succès avec le scope:', registration.scope);
      })
      .catch(err => {
        console.log('Échec de l\'enregistrement du ServiceWorker:', err);
      });
  });
}

// INSTALL PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Empêche le navigateur d'afficher le prompt d'installation automatique
  e.preventDefault();
  deferredPrompt = e;

  // Affiche le bouton d'installation
  const installButton = document.querySelector('#install-button');
  installButton.style.display = 'block';

  installButton.addEventListener('click', (e) => {
    // Affiche le prompt d'installation
    deferredPrompt.prompt();
    
    // Attends la réponse de l'utilisateur
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

// Masque le bouton une fois l'installation terminée
window.addEventListener('appinstalled', (evt) => {
  console.log('L\'application a été installée');
  document.querySelector('#install-button').style.display = 'none';
});