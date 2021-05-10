/*
 * Scrubbing a timeline animation on a pinned graph - minimal example 
 * code based on official GSAP tutorial: https://codepen.io/GreenSock/pen/WNvVOWw
 */


gsap.registerPlugin(ScrollTrigger);

// add an animation on the line (with class 'line') which is 
gsap.from(".line", {
  scrollTrigger: {
    trigger: ".panel", // triggered by the panel, which is a div around the line 
    scrub: true, // it is scrubbed, meaning that it gradually updates on scroll 
    pin: true, // while we're doing the update, we pin the panel in place i.e. postion sticky
    start: "top top", // the scrubbing and the animation starts when the top of the panel hits the top of the viewport
    end: "+=200%", // and it ends after we've scrolled the equivalent of 200% of the viewport
    markers: true,
  },
  // the animation itself, which is a scale and transform on the div of the line to show a progress bar 
  scaleX: 0, 
  transformOrigin: "left center", 
  ease: "none"
});