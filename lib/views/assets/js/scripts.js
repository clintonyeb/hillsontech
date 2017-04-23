(function($) {
  "use strict"; // Start of use strict
  $(".carousel").carousel({
    keyboard: false,
    pause: false,
    ride: true
  });

  $("body").scrollspy({
    target: ".navbar"
  });

  $("#more").click(function() {
    $("html, body").animate(
      {
        scrollTop: $("#services").offset().top
      },
      2000
    );
  });
})(jQuery);

particlesJS.load(
  "particles-js",
  "/assets/js/particlesjs-config.json",
  function() {}
);

window.sr = ScrollReveal({
  reset: true,
  duration: 1000,
  distance: "5rem",
  delay: 10,
  scale: 0.9,
  easing: "cubic-bezier(0.6, 0.2, 0.1, 1)",
  mobile: true,
  reset: true,
  useDelay: "once"
});

sr.reveal(".reveal");

sr.reveal(
  ".box",
  {
    duration: 2000
  },
  50
);

sr.reveal(
  ".test",
  {
    duration: 1000
  },
  50
);
