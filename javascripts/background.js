chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request === "login") {
    Simplenote.onLogin = function() { 
      sendResponse(true);
    };
    Simplenote.onLoginError = function() {
      sendResponse(false);
    }
    if(localStorage.email && localStorage.password) {
      Simplenote.login(localStorage.email, localStorage.password);
    }
  } else if (request === "index") {
    Simplenote.index(function(data) { sendResponse(data) });
  }

});
