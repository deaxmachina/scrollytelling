/*
 * Here we change the style of a couple of steps (boxes with text)
 * on the fly as we scroll through them, keeping track of the % along the element we have scrolled
 * Code from Russell Goldberg: https://github.com/russellgoldenberg/scrollama/blob/master/docs/progress/index.html
 */

const scrolly = d3.select("#scrolly")
const article = scrolly.select("article")
const step = scrolly.selectAll(".step")

// initialise the scrollama 
const scroller = scrollama();

// here we select the element we are currently on and 
// set its colour based on attr value and opacity based on progress 
// and also the text inside based on progress -- which we get from scrollama
function handleStepProgress(response) {
  console.log(response)
  const el = d3.select(response.element) // element we're currently on
  const val = el.attr("data-step")
  // get colour value from the data attr and the opacity from the progress
  // so that the elements get more opaque as we scroll through it
  const rgba = `rgba(${val}, ${response.progress})` 
  el.style("background-color", rgba)
  el.select(".progress")
    .text(d3.format(".1%")(response.progress))
}

function resize() {
  const min = window.innerHeight * 0.5;
  const h = min + Math.random() * window.innerHeight * 0.25;
  step.style("height", Math.floor(h) + 'px')
  scroller.resize();
}

function init() {
  // 1. setup the scroller with the bare-bones settings 
  // 2. bind scrollama event handlers 
  scroller
    .setup({
      step: ".step",
      progress: true, // how far along the element we've scrolled from 0 to 1 
      debug: true
    })
    .onStepProgress(handleStepProgress)

    // setup resize event 
    resize();
    window.addEventListener("resize", resize)
    
}

init();