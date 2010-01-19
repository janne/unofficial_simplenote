$(document).ready(function() {
  chrome.extension.sendRequest("login", function(success) {
    if (success) {
      chrome.extension.sendRequest("index", function(data) {
        $('#loader').hide();
        for(var i=0; i < data.length; i++) {
          if (!data[i].deleted) {
            $('#notes').append("<li>" + data[i].key + "</li>");
          }
        }
      });
    } else {
      $('#loader').hide();
      $('#status').html("Please check username and password!");
    }
  });
});

