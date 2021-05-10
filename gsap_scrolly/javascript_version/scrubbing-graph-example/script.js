/*
 * Scrubbing a timeline animation on a pinned graph - minimal example 
 * code based on official GSAP tutorial: https://codepen.io/GreenSock/pen/WNvVOWw
 */

gsap.registerPlugin(ScrollTrigger);

/////////////////////////////
///////// Graph /////////////
/////////////////////////////
const width = 400;
const height = 400;
const svg = d3.select("#graph-wrapper")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", '#ebebeb')
const graphContainer = svg.append("g")
  .classed("graph-container", true)
const graph = graphContainer.selectAll(".circle")
  .data([0, 1, 2, 3, 4, 5, 6, 7, 8])
  .join('circle')
    .classed("circle", true)
    .attr("r", 20)
    .attr("cx", (d, i) => 40*i + 40)
    .attr("cy", (d, i) => 40*i + 40)
    .attr("fill", 'palevioletred')
    .attr("opacity", (d, i) => i < 3 ? 1 : 0) // only show the first 3 circles

/*
// attempt at creating a function for the graph depenedent on the data 
// so that we can call it later on with different data and so add more data elements
function drawGraph(data) {
  const graph = graphContainer.selectAll(".circle")
    .data(data)
    .join('circle')
      .classed("circle", true)
      .attr("r", 20)
      .attr("cx", (d, i) => 40*i + 20)
      .attr("cy", width/2)
      .attr("fill", 'plum')
      .attr("opacity", 1)
}
drawGraph([0, 1, 2])
*/

// basic option - here we add an animation on scroll to all the circles
// where the trigger is the panel - when the top of the panel hits the top of the viewport 
// we stick the graph there and scroll for 200% during which time we change the attrs of the circles
gsap.to(".circle", {
  scrollTrigger: {
    trigger: ".panel", 
    scrub: true,
    pin: true,
    start: "top top", 
    end: "+=200%", 
    markers: true,
  },
  attr: { 
    //r: i => 10*(i+1), // i is the index for the array of elements with class 'circle'
    opacity: 1
  },
  ease: 'power.3.out'
});


// More complex option - I want to have a staggered scrub, so I'm trying to get access 
// to the index of each circle in the circles array
// this is buggy for some reason 
/*
gsap.utils.toArray('.circle').forEach((circle, i) => {
  gsap.to(circle, {
    scrollTrigger: {
      trigger: ".panel", 
      //scrub: true,
      scrub: i*0.5, 
      pin: true,
      start: "top top", 
      end: "+=200%", 
      markers: true,
    },
    attr: { 
      //r: () => 50*i,
      opacity: () => 1
    },
    ease: 'power.3.out'
  });
});
*/


// I want to add elements on scrub and remove them when we scroll back
// this doesn't work now
/* 
ScrollTrigger.create({
  trigger: ".panel", 
  scrub: true,
  pin: true,
  start: "top top", 
  end: "+=200%", 
  onEnter: onEnterGraph, // custom d3 transition
  onEnterBack: onLeaveBackGraph, // custom d3 transition
  markers: false,
  id: 'third-box'
});

function onEnterGraph() {
  drawGraph([0, 1, 2, 3, 4])
};

function onLeaveBackGraph() {
  drawGraph(data)
}
*/

// as a workaround suppose that it's ok to just draw all the element 
// and on animation we display they one by one ??

