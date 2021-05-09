/* Scrolly with a sticky graphic, i.e. we scroll through steps and as we do that 
 * the sticky graphic updates 
 * Code from Russell Goldberg: https://github.com/russellgoldenberg/scrollama/blob/master/docs/sticky-side/index.html
 */

const scrolly = d3.select("#scrolly")
const figure = scrolly.select("figure")
const article = scrolly.select("article")
const step = article.selectAll(".step")

// initialise scrollama 
const scroller = scrollama();

// generic window resize listener event 
function handleResize() {
  // 1. update height of step elements - should be 75% of windows height
  const stepH = Math.floor(window.innerHeight * 0.75) 
  step.style("height", `${stepH}px`)
  // 2. update the height of the figure
  const figureHeight = window.innerHeight / 2;
  const figureMarginTop = (window.innerHeight - figureHeight) / 2;
  figure 
    .style("height", `${figureHeight}px`)
    .style("top", `${figureMarginTop}px`)
  // 3. tell scrollama to update new element dimensions 
  scroller.resize();
}

// I think this is for the sticky fill library we loaded 
// which deals with pollyfill for position sticky for older browsers? 
function setupStickyfill() {
  d3.selectAll(".sticky").each(function() {
    Stickyfill.add(this);
  });
}

// scrollama event handlers 
function handleStepEnter(response) {
  console.log(response)
  // add colour to the current step only 
  step.classed("is-active", (d, i) => i === response.index)
  // update figure based on step as well 
  figure.select("p").text(response.index + 1)
}

function init() {
  setupStickyfill();
  // 1. force a resize on load to ensure proper dimensions are sent to scrollama 
  handleResize();

  // 2. setup the scroller passing options and bind scrollama event handlers 
  scroller
    .setup({
      step: ".step",
      offset: 0.33,
      debug: true
    })
    .onStepEnter(handleStepEnter);

  // 3. setup resize event 
  window.addEventListener("resize", handleResize)

};

init();