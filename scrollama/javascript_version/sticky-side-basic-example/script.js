/* 
 * Basic example of a sticky graph which updates based on triggers of steps
 * We have change in update of properties and change in update of the type of graph 
 * which in this case is just the position of the circles
 */

const scrolly = d3.select("#scrolly-wrapper")
const figure = scrolly.select("figure")
const graphWrapper = d3.select("#graph-wrapper")
const article = scrolly.select("article")
const step = d3.selectAll(".step")


//////////////////////////////////////////////////////////
//////////////////// Graph ///////////////////////////////
//////////////////////////////////////////////////////////
// place some graph inside the figure to begin with 
const data = [
  {id: 1, x: 50, y: 50, fill: "#011627", value: 30},
  {id: 1, x: 300, y: 70, fill: "#fdfffc", value: 50},
  {id: 1, x: 100, y: 250, fill: "#2ec4b6", value: 30},
  {id: 1, x: 350, y: 300, fill: "#e71d36", value: 40},
  {id: 1, x: 200, y: 200, fill: "#ff9f1c", value: 70}
]

const width = 400;
const height = 400; // this is the same as the height of the container set in css
const svg = graphWrapper.append("svg")
  .attr("width", width)
  .attr("height", height)

const circles = svg.selectAll("circle")
  .data(data)
  .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.value)
    .attr("fill", d => d.fill)



//////////////////////////////////////////////////////////
////////////////// Scrollama /////////////////////////////
//////////////////////////////////////////////////////////
// initialise scrollama 
const scroller = scrollama();
// define what happens on step enter
function handleStepEnter(response) {
  console.log(response)

  // 1. change the style of the step i.e. the current block of text
  step.classed("is-active", (d, i) => i === response.index)

  // 2. Change the graph separately for each step
   updateVis(response.index);
}

function updateVis(stepIndex) {
      circles
      .transition().duration(1000)
        .attr("cx", d => d.x)
        .attr("cy", d => adjustYValue(stepIndex, d.y))
        .attr("r", d => adjustRadius(stepIndex, d.value))
        .attr("fill", d => d.fill)
  }

  function adjustRadius(stepIndex, value) {
    if (stepIndex === 1) {
      return value * 1.5;
    }
    if (stepIndex === 2) {
      return 20;
    }
    return value;
  }

  function adjustYValue(stepIndex, value) {
    return (stepIndex === 2) ? 350 : value;
  }

// main function to call scroller
function init() {
  // set up the scroller and the scrollama event handlers 
  scroller
    .setup({
      step: ".step",
      offset: 0.33,
      debug: true
    })
    .onStepEnter(handleStepEnter)
}

init();