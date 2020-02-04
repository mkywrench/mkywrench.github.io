//
let deferredPrompt;
const installButton = document.getElementById('btnInstall');
installButton.addEventListener("click", installPWA);
//
window.addEventListener("beforeinstallprompt", saveBeforeInstallPromptEvent);
//
function saveBeforeInstallPromptEvent(evt) {
  //save event & show the install button.
  deferredInstallPrompt = evt;
  installButton.removeAttribute("hidden");
}
//end function
function installPWA(evt) {
  // show install prompt & hide the install button.
  deferredInstallPrompt.prompt();
  // Hide the install button, it can't be called twice.
  evt.srcElement.setAttribute("hidden", true);
  // Log user response to prompt.
  deferredInstallPrompt.userChoice.then(choice => {
    if(choice.outcome === "accepted") {
      console.log("User accepted the A2HS prompt", choice);
    } else {
      console.log("User dismissed the A2HS prompt", choice);
    }
    deferredInstallPrompt = null;
  });
}
//end function
//event listener for appinstalled event
window.addEventListener("appinstalled", logAppInstalled);
//
function logAppInstalled(evt) {
  console.log("Weather App was installed.", evt);
}
//end function