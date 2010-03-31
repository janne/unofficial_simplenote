// Log in on page load
$(document).ready(function() {
  var signUpLink =
      "<a href='http://simplenoteapp.com/create-account'>sign up</a>";
  var optionsLink =
      "<a href='options.html'>options page</a>";

  if (!localStorage.email || !localStorage.password) {
    var message = "Please " + signUpLink + " for a Simplenote account and" +
        "then enter your credentials on the " + optionsLink + ".";
    displayStatusMessage(message);
  } else {
    chrome.extension.sendRequest({action: "login"}, function(success) {
      if (success) {
        showIndex();
        $('div#index div#toolbar input#new').click(function() {
          showNote();
        });
        $('div#index div#toolbar input#search').click(function() {
          showIndex($('#q').val());
        });
        $('input#q').focus();
      } else {
        var message = "Please correct your username and password on the" +
            optionsLink + "!";
        displayStatusMessage(message);
      }
    });
  }
});

/*
 * Displays a status message.
 * @param message The HTML content of the status message to display. All links
 *     in the message are be adjusted to open in a new window and close the
 * ß    popup.
 */
function displayStatusMessage(message) {
    $('#loader').hide();
    $('#toolbar').hide();
    $('#status').html(message);
    links = $('a');
    links.attr('target', '_blank');
    links.click(function() { window.close(); });
}

function showIndex(query) {
  $('#loader').show();
  var req = { action: "index" }
  if(query) {
    req = { action: "search", query: query };
    $('#notes').empty();
  }
  chrome.extension.sendRequest(req, function(data) {
    var count = 0;
    for(var i=0; i < data.length; i++) {
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
        count += 1;
        if (count == 10)
          break;
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
  var data = $('div#note textarea').val();
  if (data != '') {
    chrome.extension.sendRequest({action: "update", key: key, data: data}, function() {
      $('div#note textarea').hide();
      $('div#note').hide();
      showIndex();    
    });
  } else {
    $('div#note textarea').hide();
    $('div#note').hide();
    showIndex();    
  }
}

function destroyNote(key) {
  $('div#note div#toolbar input').attr('disabled', 'disabled');
  chrome.extension.sendRequest({action: "destroy", key: key}, function() {
    $('div#note textarea').hide();
    $('div#note').hide();
    showIndex();    
  });
}
