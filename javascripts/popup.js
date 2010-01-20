// Login on page load
$(document).ready(function() {
  chrome.extension.sendRequest({action: "login"}, function(success) {
    if (success) {
      showIndex();
      $('div#index div#toolbar input#new').click(function() {
        showNote();
      });
    } else {
      $('#loader').hide();
      $('#status').html("Please check username and password!");
    }
  });
  $('input#q').focus();
});

function showIndex() {
  $('#loader').show();
  chrome.extension.sendRequest({action: "index"}, function(data) {
    for(var i=0; i < (data.length > 10 ? 10 : data.length); i++) {
      if (data[i].deleted) {
        var note = $('#' + data[i].key);
        if (note.length > 0) { note.hide(); }
      } else {
        if ($('#' + data[i].key).length == 0) {
          $('#notes').append("<li id='" + data[i].key + "'></li>");
        }
        chrome.extension.sendRequest({action: "note", key: data[i].key}, function(data) {
          var lines = data.text.split("\n", 10).filter(function(line) { return ( line.length > 0 ) });
          $('#' + data.key).html(lines[0] + "<div class='abstract'>" + lines.slice(1,3).map(function(element) { var short = element.substr(0, 67); return (short.length + 3 < element.length ? short + "..." : element ) }).join("<br />") + "</div>");
          $('#' + data.key).unbind();
          $('#' + data.key).click(function() { showNote(this.id); });
        });
      }
    }
  });
  $('div#index').show();
  $('#loader').hide();
}

function showNote(key) {
  $('#loader').show();
  $('div#index').hide();
  $('div#note').show();
  $('div#note div#toolbar input').removeAttr('disabled');
  if (key === undefined) {
    $('div#note div#toolbar input#destroy').hide();
  } else {
    $('div#note div#toolbar input#destroy').show();
  }
  chrome.extension.sendRequest({action: "note", key: key}, function(data) {
    $('div#note textarea').val(data.text);
    $('div#note textarea').show();
    $('div#note input#save').unbind();
    $('div#note input#save').click(function() {
      updateNote(key);
    });
    $('div#note input#destroy').unbind();
    $('div#note input#destroy').click(function() {
      destroyNote(key);
    });
    $('#loader').hide();
  });
}

function updateNote(key) {
  $('div#note div#toolbar input').attr('disabled', 'disabled');
  chrome.extension.sendRequest({action: "update", key: key, data: $('div#note textarea').val()}, function() {
    $('div#note textarea').hide();
    $('div#note').hide();
    showIndex();    
  });
}

function destroyNote(key) {
  $('div#note div#toolbar input').attr('disabled', 'disabled');
  chrome.extension.sendRequest({action: "destroy", key: key}, function() {
    $('div#note textarea').hide();
    $('div#note').hide();
    showIndex();    
  });
}
