// Login on page load
$(document).ready(function() {
  chrome.extension.sendRequest({action: "login"}, function(success) {
    if (success) {
      $('#loader').hide();
      showIndex();
    } else {
      $('#loader').hide();
      $('#status').html("Please check username and password!");
    }
  });
  $('input#q').focus();
});

function showIndex() {
  chrome.extension.sendRequest({action: "index"}, function(data) {
    for(var i=0; i < (data.length > 10 ? 10 : data.length); i++) {
      if (!data[i].deleted) {
        $('#notes').append("<li id='" + data[i].key + "'></li>");
        chrome.extension.sendRequest({action: "note", key: data[i].key}, function(data) {
          var lines = data.text.split("\n", 10).filter(function(line) { return ( line.length > 0 ) });
          $('#' + data.key).html(lines[0] + "<div class='abstract'>" + lines.slice(1,3).map(function(element) { var short = element.substr(0, 67); return (short.length + 3 < element.length ? short + "..." : element ) }).join("<br />") + "</div>");
          $('#' + data.key).click(function() { showNote(this.id); });
        });
      }
    }
  });
}

function showNote(key) {
  $('#loader').show();
  $('div#index').hide();
  $('div#note').show();
  chrome.extension.sendRequest({action: "note", key: key}, function(data) {
    $('div#note textarea').val(data.text);
    $('div#note textarea').show();
    $('#loader').hide();
  });
}
