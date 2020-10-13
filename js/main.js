let check_loaded;
let started;

$(document).ready(function () {
  check_loaded = setInterval(check, 100);
  started = false;

  $(".okbutton").click(function () {
    $(".container").hide();
    $(".instructions").css({
      "display": "inline-block"
    });
    started = true;
  });

  $("#sketch").click(function () {
    if (!started) return;
      $(".instructions").delay(5000).fadeOut(3000);
    })
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
