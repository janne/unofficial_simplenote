$(document).ready(function() {
  chrome.extension.sendRequest({action: "login"}, function(success) {
    if (success) {
      chrome.extension.sendRequest({action: "index"}, function(data) {
        $('#loader').hide();
        for(var i=0; i < data.length; i++) {
          if (!data[i].deleted) {
            $('#notes').append("<li id='" + data[i].key + "'></li>");
            chrome.extension.sendRequest({action: "note", key: data[i].key}, function(data) {
              $('#' + data.key).text(data.text);
            });
          }
        }
      });
    } else {
      $('#loader').hide();
      $('#status').html("Please check username and password!");
    }
  });
});

