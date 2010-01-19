$(document).ready(function() {
  $("#email").val(localStorage.email);
  $("#password").val(localStorage.password);
});

function save_options() {
  localStorage.email = $("#email").val();
  localStorage.password = $("#password").val();
}
