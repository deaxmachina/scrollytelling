const scrolly = d3.select("#scrolly");
const figure = scrolly.select("figure")
const article = scrolly.select("article")
const step = article.selectAll(".step")

// initialise the scrollama 
const scroller = scrollama();

/// Generic window resize listener event ///
function handleResize() {
  // 1. update the height of the step element 
  const stepHeight = Math.floor(window.innerHeight * 0.75);
  step.style("height", `${stepHeight}px`)

  // 2. Update the height and top position of the figure 
  const figureHeight = Math.floor(window.innerHeight * 0.5);
  const figureMarginTop = (window.innerHeight - figureHeight) / 2;

  figure 
    .style("height", `${figureHeight}px`)
    .style("top", `${figureMarginTop}px`)

  // 3. tell scrollama to update new element dimensions 
  scroller.resize();
};

/// Scrollama event handlers ///
function handleStepEnter(response) {
  console.log(response);
  // add class to the current step only 
  step.classed('is-active', (d, i) => i ===  response.index)

  // update the graphic based on step 
  figure.select("p").text(response.index + 1);
}


function setupStickyfill() {
  d3.selectAll(".sticky").each(function() {
    Stickyfill.add(this);
  });
};

function init() {
  setupStickyfill();

  // 1. force a resize on load to ensure proper dimensions are sent to scrollama 
  handleResize();

  // 2. setup the scroller passing options - this will also init trigger observations 
  // 3. bind scrollama event handlers 
  scroller
    .setup({
      step: ".step",
      offset: 0.33,
      debug: true
    })
    .onStepEnter(handleStepEnter);

  // setup resize event 
  window.addEventListener("resize", handleResize)
};

init();