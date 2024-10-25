// SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
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