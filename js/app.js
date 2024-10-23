<<<<<<< HEAD
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
=======
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
>>>>>>> 5750637461ec7f5162bc50fae2a8acf59df217f8
});