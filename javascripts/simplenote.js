var Simplenote = {
  root: "https://simple-note.appspot.com/api/",
  login: function(email, password) {
    Simplenote.email = email;
    jQuery.ajax({
      type: "POST",
      url: Simplenote.root + "login",
      data: Base64.encode("email=" + email + "&password=" + password),
      dataType: "text",
      success: function (response) {
        if (typeof Simplenote.onLogin === "function") {
          Simplenote.onLogin();
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        if (typeof Simplenote.onLoginError === "function") {
          Simplenote.onLoginError(textStatus);
        }
      }
    });
  },
  index: function(callback) {
    jQuery.ajax({
      url: Simplenote.root + "index",
      dataType: "json",
      success: function(data) {
        callback(data);
      }
    });
  },
  note: function(key, callback) {
    jQuery.ajax({
      url: Simplenote.root + "note?key=" + key,
      dataType: "text",
      success: function(data) {
        callback(data);
      }
    });
  },
  update: function(key, data, callback) {
    var url = Simplenote.root + "note";
    if (key) { url += "?key=" + key; }
    jQuery.ajax({
      type: "POST",
      url: url,
      data: Base64.encode(data),
      success: callback
    });
  }
};
