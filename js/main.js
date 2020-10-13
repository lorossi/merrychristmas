let check_loaded;
let started;
let click_counter;

$(document).ready(function () {
  check_loaded = setInterval(check, 100);
  started = false;
  click_counter = 0;

  $(".okbutton").click(function () {
    $(".container").hide();
    $(".footer").css({
      "display": "inline-block"
    });
    started = true;
  });

  $("#sketch").click(function () {
    if (!started) return;

    $(".instructions").delay(2500).fadeOut(1000);
    $(".merrychristmas").delay(2500).fadeOut(1000);
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
