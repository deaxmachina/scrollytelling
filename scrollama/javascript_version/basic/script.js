/* Basic Example 
Here we just toggle the class of some steps (boxes with text) when they hit a certain positon 
in the viewport; toggling the class changes the style of the boxes
https://github.com/russellgoldenberg/scrollama/blob/master/docs/basic/index.html
*/

const scrolly = document.querySelector("#scrolly");
const article = scrolly.querySelector("article");
const step = article.querySelectorAll(".step");

// initialize the scrollama
const scroller = scrollama();

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }
  console.log(response);
  // add to color to current step
  response.element.classList.add("is-active");
}

function handleStepExit(response) {
  // response = { element, direction, index }
  console.log(response);
  // remove color from current step
  response.element.classList.remove("is-active");
}

function init() {
  // set random padding for different step heights (not required)
  step.forEach(function(step) {
    let v = 100 + Math.floor((Math.random() * window.innerHeight) / 4);
    step.style.padding = v + "px 0px";
  });

  // 1. setup the scroller with the bare-bones options - this will also initialize trigger observations
  // 2. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: ".step",
      debug: true,
      offset: 0.2
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);

  // 3. setup resize event
  window.addEventListener("resize", scroller.resize);
}

// kick things off
init();