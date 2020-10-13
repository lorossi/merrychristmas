let check_loaded;

$(document).ready(function () {
  check_loaded = setInterval(check, 100);

  $(".okbutton").click(function () {
    $(".container").hide();
  });
});

function check() {
  if ($("#p5_loading").length == 0) {
    clearInterval(check_loaded);

    $(".loading").css({
      "display": "none"
    });

    $(".okbutton").css({
      "display": "block"
    });
  }
}
