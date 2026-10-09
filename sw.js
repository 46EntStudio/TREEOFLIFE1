// PWA Installation Handling
let deferredPrompt;
const installBanner = document.getElementById('install-app-banner');

// Check if app is already running in standalone mode (already installed)
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

if (isStandalone) {
  if (installBanner) installBanner.style.display = 'none';
} else {
  // Show banner on iOS Safari since it doesn't support beforeinstallprompt
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS && installBanner) {
    installBanner.style.display = 'flex';
  }
}

// Android / Chrome Install Prompt Capture
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (!isStandalone && installBanner) {
    installBanner.style.display = 'flex';
  }
});

function triggerInstallPrompt() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isIOS) {
    alert("To install on iOS:\n1. Tap the Share button at the bottom of Safari.\n2. Scroll down and tap 'Add to Home Screen'.");
    return;
  }

  if (!deferredPrompt) {
    alert("To install, open your browser menu and select 'Add to Home Screen'.");
    if (installBanner) installBanner.style.display = 'none';
    return;
  }

  // Trigger Native Android/Chrome Install Prompt
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User installed the app');
      if (installBanner) installBanner.style.display = 'none';
    }
    deferredPrompt = null;
  });
}

// Automatically hide the banner as soon as installation completes
window.addEventListener('appinstalled', () => {
  if (installBanner) installBanner.style.display = 'none';
  deferredPrompt = null;
  console.log('App successfully installed to home screen.');
});