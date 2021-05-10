gsap.registerPlugin(ScrollTrigger);

//////////////////////////////////////////
///////// Scrubbing Animation ////////////
//////////////////////////////////////////

// sets an animation on each stacked text element 
// but gives each one a slightly different scrub value 
// so that when you scroll they separate and catch up at different rates 
// each of the elements with class 'scrub' get an animation which is triggered 
// by a scroll event via scroll trigger 
gsap.utils.toArray('.scrub').forEach((element, i) => {
  gsap.to(element, {
    scrollTrigger: {
      trigger: '.scrub-wrapper', // the container for the scrub elemetns is the trigger 
      start: 'top top', // when the top of the container hits the top of the viewport, it starts
      end: 'bottom center', // when the bottom of the container hits the middle of the viewport, it ends
      scrub: (7 - i) * 0.1, // 7 as there are 6 elements 
      //scrub: true, // if you just want to scrub the whole thing you can set true
      markers: true,
      id: 'scrub-tween'
    },
    y: () => {
      const scrubWrapper = document.querySelector('.scrub-wrapper')
      const scrubWrapperHeight = scrubWrapper.offsetHeight;
      //const scrubWrapperPosition = scrubWrapper.getBoundingClientRect().y;
      return `${scrubWrapperHeight - 50}px`
    }
  });
});


const scrubWrapperHeight = document.querySelector('.scrub-wrapper').offsetHeight;
console.log(scrubWrapperHeight)
const boundingRect = document.querySelector('.scrub-wrapper').getBoundingClientRect();
console.log(boundingRect.y)

