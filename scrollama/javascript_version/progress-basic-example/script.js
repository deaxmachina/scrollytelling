/*
 * Here we change the style of a couple of steps (boxes with text)
 * on the fly as we scroll through them, keeping track of the % along the element we have scrolled
 * and update the graph when we're not currently on a step; adding one new circle each time we exit a step, and 
 * removing them when we scroll back up past each step
 * Code based on Russell Goldberg: https://github.com/russellgoldenberg/scrollama/blob/master/docs/progress/index.html
 */

const scrolly = d3.select("#scrolly")
const article = scrolly.select("article")
const steps = scrolly.selectAll(".step")
const svg = d3.select("#graph-wrapper").append("svg")
  .attr("width", 400)
  .attr("height", 400)

// initialise the scrollama 
const scroller = scrollama();

// here we select the element we are currently on and 
// set its colour based on attr value and opacity based on progress 
// and also the text inside based on progress -- which we get from scrollama
function handleStepProgress(response) {
  //console.log(response)
  const el = d3.select(response.element) // element we're currently on
  const val = el.attr("data-step")
  // get colour value from the data attr and the opacity from the progress
  // so that the elements get more opaque as we scroll through it
  const rgba = `rgba(${val}, ${response.progress})` 
  el.style("background-color", rgba)
  el.select(".progress")
    .text(d3.format(".1%")(response.progress))
}

// when we enter, we want the graph to not change on enter from the top, i.e. scrolling down 
// but on enter from bottom, i.e. scrolling up, we want to remove one by one the circles that we added
// on exit during the scrolling down phase
function handleStepEnter (response) {
  console.log('enter', response)
  // svg.style("background-color", '#8a8a8a')
  // remove only the circle corresponding to the current step
  if (response.direction === 'up') {
    console.log(d3.select(`.circle-${response.index}`))
    d3.selectAll(`.circle-${response.index}`).remove() // make sure to selectAll and not select even though you're only removing 1 circle at each step   
  }
}

// when we exit while scrolling down each step, we want to add one circle, which fades in over a specific duration 
// but when we exit while scrolling up, i.e. going back, we do nothing, i.e. don't add any circles; since instead
// we remove circles using the handleStepEnter
function handleStepExit (response) {
  console.log('exit', response)
  // svg.style("background-color", 'maroon')
  const radius = 50;
  if (response.direction === 'down') {
    // append as many circles as the index of the step we're currently on (+1 since index starts from 0)
    const circles = svg
      .selectAll(".circle")
      .data(_.range(response.index + 1))
      .join(
        enter => { return enter.append("circle") },
        update => update,
        exit => {
          exit.transition().duration(1500)
            .attr("r", 0)
        }
      )
        .classed("circle", true)
        .attr("class", (d, i) => `circle-${d}`)
        .attr("fill", '#fff')
        .attr("cx", 200)
        .attr("cy", d => 100*d + radius)
        .transition().duration(1500)
          .attr("r", radius)
  }
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
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
}

init();