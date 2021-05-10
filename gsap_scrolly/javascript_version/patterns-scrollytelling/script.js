gsap.registerPlugin(ScrollTrigger);
const purple = '#854794';
const blue = '#00A8DE';
const green = '#54AE37';
const yellow = '#FFDB00';
const orange = '#F5A336';
const red = '#E84750';
const rainbow = [red, orange, yellow, green, blue, purple];

const dataUrl = 'https://gist.githubusercontent.com/will-r-chase/375d6366e6c32caf3862d1f6154f87a0/raw/f632753fc5940ac57e55276f38bca2262cb87907/landers_before2.geojson'

// helper functions for cleaning the data 
const timeParse = d3.timeParse('%Y-%m-%d %H:%M:%S');
function clean(data) {
  for (const d of data.features) {
    const date = timeParse(d.properties.time);
    d.properties.date = date;
    d.properties.day = d3.timeDay(date);
  }
  return data;
}

// dimensions
const svgWidth = 700;
const svgHeight = 500;
const circleRad = 10; 

// draw the svg container
const svg = d3.select("svg")
.attr('preserveAspectRatio', 'xMinYMin meet')
.attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
const g = svg.append("g")


//////////////////////////////////////////////////////////////
/////// GSAP ScrollTrigger which is not data-dependent ///////
//////////////////////////////////////////////////////////////
// The two scroll triggered things below are not data-dependent
// They just pin the graph container in place (i.e. make the graph sticky)
// and define style changes on the text boxes as they are scrolled in and out 
// of view. As these don't depend on the data, we can put them here and don't 
// have to put them in the graph drawing function, which is async as it waits for 
// the data to load from external source

// set up the class 'toggle' on each scrolling text box 
// so that it becomes opaque when in view and transparent when exiting 
gsap.utils.toArray('.step').forEach(step => {
  ScrollTrigger.create({
    trigger: step,
    start: 'top 80%', /* when the top of the step hits the 80% mark down the viewport */
    end: 'center top', /* when the center of the step hits the very top of the viewport */
    toggleClass: 'active',
    markers: false,
    id: 'toggle-active-class'
  });
});

// This pins the SVG chart wrapper when it hits the center of the viewport the first time we start scrolling 
// and then releases the pin when the final textbox meets the bottom of the chart 
// We use a function to define the end point to line up the bottom of the text box with the bottom of the chart 
ScrollTrigger.create({
  trigger: '#chart-wrapper',
  endTrigger: '#step-4',
  start: 'center center',
  end: () => {
      const height = window.innerHeight;
      const chartHeight = document.querySelector('#chart-wrapper').offsetHeight;
      return `bottom ${chartHeight + (height - chartHeight) / 2}px`
  },
  pin: true,
  pinSpacing: false,
  markers: false,
  id: 'chart-pin'
});

//////////////////////////////////////////////////////
//// Main function to draw graph with async data /////
//////////////////////////////////////////////////////
const drawGraph = async () => {
  let data = await d3.json(dataUrl);
  data = clean(data)

  // set up a scale for when the points become a timeline 
  const timeScaleTriggered = d3.scaleTime()
    .domain(d3.extent(data.features, d => d.properties.day))
    .range([circleRad, svgWidth - circleRad]) // use the radius of circle as padding on left and right so that circles don't go out of bounds


  // create some circles from data with a random position and color 
  // initially they have radius 0 so they are not visible right away 
  let circles = g 
    .selectAll(".points")
    .data(data.features)
    .join("circle")
      .attr("class", 'points')
      .attr("r", 10)
      .attr("cx", () => Math.random() * svgWidth)
      .attr("cy", () => Math.random() * svgHeight)
      .style("fill", () => rainbow[Math.floor(Math.random() * rainbow.length)])
      .style("opacity", 0.7)


  ////////////////////////////////
  ///// Animation on step 1 /////
  ///////////////////////////////
  // the initial animation to show the points - sets the points radius to a radom value from 0 to 20 
  // add gsap animation to the class 'points' which we created above with d3
  gsap.to('.points', {
    // the animation is triggered via a scroll trigger
    scrollTrigger: {
      trigger: '#step-1', // when the step-1 div's top
      start: 'top center', // hits the center of the viewport 
      toggleActions: 'play none none reverse', // this allows us to reverse the animation when we hit the same spot but scrolling up
      markers: false,
      id: 'first-box'
    },
    // we animate the attr radius for 0.5 seconds with the given ease
    attr: { r: () => Math.random() * 30 },
    duration: 0.5,
    ease: 'power.3.out'
  });


  ////////////////////////////////
  ///// Animation on step 2 /////
  ///////////////////////////////
  // the animation triggered by the second text box - shuffle the X position of the points to random value 
  // we add an animation to the class 'points' which will be triggered by a scroll event, i.e. 
  // scrollTrigger, which is 
  gsap.to('.points', {
    scrollTrigger: {
      trigger: '#step-2', // attached to the div with id of step-2 
      start: 'top center', // and will start when the top of this div hits the center of the viewport
      toggleActions: 'play none none reverse', // the animation will play; and then it will reverse when as we are scrolling back up, the top of the div hits the center of the viewport again
      markers: false,
      id: 'second-box'
    },
    // we animate the cx attribute of the points as per the function and duration below
    attr: { cx: () => Math.random() * svgWidth },
    duration: 0.5,
    ease: 'power3.inOut'
  });


  ////////////////////////////////
  ///// Animation on step 3 /////
  ///////////////////////////////
  // the animation triggered by the third text box 
  // this just sets up the scroll trigger, but the animation itself is 
  // done using out D3 functions, which are passed as callbacks to onEnter and onLeaveBack
  ScrollTrigger.create({
    trigger: '#step-3', // scroll trigger will start when the div with id of step-3
    start: 'top center', // has its top aligned with the center of the viewport and when that happens the callbacks below are triggered
    onEnter: circlesToTimeline, // custom d3 transition
    onLeaveBack: circlesToRandom, // custom d3 transition
    markers: false,
    id: 'third-box'
  });

  // custom D3 function to stack the circles into a timeline dot plot 
  function circlesToTimeline() {
    circles
      .transition().duration(1000)
        .attr("r", circleRad)
        .attr("cx", d => timeScaleTriggered(d.properties.day))
        .attr("cy", d => svgHeight - d.properties.id_day * 20)
        .style("opacity", 1)
  };

  // custom D3 function to reverse the circles back to random position 
  function circlesToRandom() {
    circles 
      .transition().duration(700)
        .attr("r", () => Math.random() * 20)
        .attr("cx", () => Math.random() * svgWidth) // repeat as defined originally
        .attr("cy", () => Math.random() * svgHeight) // repeat as defined originally
        .style("opacity", 0.7) // repeat as defined originally
  }






};

drawGraph();