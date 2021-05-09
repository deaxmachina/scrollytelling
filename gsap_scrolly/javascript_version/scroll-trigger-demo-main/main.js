gsap.registerPlugin(ScrollTrigger);
const purple = '#854794';
const blue = '#00A8DE';
const green = '#54AE37';
const yellow = '#FFDB00';
const orange = '#F5A336';
const red = '#E84750';
const rainbow = [red, orange, yellow, green, blue, purple];


//loads and then cleans some data I used previously in a different project
//basically just a set of points with some positions
d3.json(
  'https://gist.githubusercontent.com/will-r-chase/375d6366e6c32caf3862d1f6154f87a0/raw/f632753fc5940ac57e55276f38bca2262cb87907/landers_before2.geojson'
)
  .then(d => clean(d))
  .then(data => {
    const svgWidth = 700;
    const svgHeight = 500;
    const circleRad = 10;

    //set up a scale for when the points become a timeline
    const timeScaleTriggered = d3
      .scaleTime()
      .domain(d3.extent(data.features, d => d.properties.day))
      .range([circleRad, svgWidth - circleRad]);

    //set up SVG to fill wrapper
    const svg = d3
      .select('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

    const g = svg.append('g');

    //create some circles from our data with a random position and color
    //initially they have radius of 0 so they're not visible right away
    let circles = g
      .selectAll('circle')
      .data(data.features)
      .join('circle')
      .attr('class', 'points')
      .attr('r', 0)
      .attr('cx', () => Math.random() * svgWidth)
      .attr('cy', () => Math.random() * svgHeight)
      .style('fill', () => rainbow[Math.floor(Math.random() * rainbow.length)])
      .style('opacity', 0.7);

    //sets up the class toggle on each scrolling text box
    //so that it becomes opaque when in view and transparent when exiting
    gsap.utils.toArray('.step').forEach(step => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 80%',
        end: 'center top',
        toggleClass: 'active',
        markers: false,
        id: 'toggle-active-class'
      });
    });

    //The initial animation to show the points
    //sets the point radius to a random value from 0 to 20
    gsap.to('.points', {
      scrollTrigger: {
        trigger: '#step-1',
        start: 'top center',
        toggleActions: 'play none none reverse',
        markers: false,
        id: 'first-box'
      },
      attr: {r: () => Math.random() * 20},
      duration: 0.5,
      ease: 'power3.out'
    });

    //the animation triggered by the second text box
    //shuffles the X position of the points to a random value
    gsap.to('.points', {
      scrollTrigger: {
        trigger: '#step-2',
        start: 'top center',
        toggleActions: 'play none none reverse',
        markers: false,
        id: 'second-box'
      },
      attr: {cx: () => Math.random() * svgWidth},
      duration: 0.5,
      ease: 'power3.inOut'
    });

    //the animation triggered by the third text box
    //this just sets up the scroll trigger, but the animation
    //is done using our D3 functions, passed as callbacks to onEnter and onLeaveBack
    ScrollTrigger.create({
      trigger: '#step-3',
      start: 'top center',
      onEnter: circlesToTimeline,
      onLeaveBack: circlesToRandom,
      markers: false,
      id: 'third-box'
    });

    //This pins the SVG chart wrapper when it hits the center of the viewport
    //and releases the pin when the final textbox meets the bottom of the chart
    //we use a function to define the end point to line up the bottom of the
    //text box with the bottom of the chart
    ScrollTrigger.create({
      trigger: '#chart-wrapper',
      endTrigger: '#step-4',
      start: 'center center',
      end: () => {
        const height = window.innerHeight;
        const chartHeight = d3.select('#chart-wrapper')
          .offsetHeight;
        return `bottom ${chartHeight + (height - chartHeight) / 2}px`;
      },
      pin: true,
      pinSpacing: false,
      markers: false,
      id: 'chart-pin'
    });

    //scrubbing animation
    //sets an animation on each stacked text element
    //but gives each one a slightly different scrub value
    //so when you scroll they separate and catch up at
    //different rates


    //our custom d3 functions that stack our circles
    //into a timeline dot plot
    function circlesToTimeline() {
      circles
        .transition()
        .duration(1000)
        .attr('r', circleRad)
        .attr('cx', d => timeScaleTriggered(d.properties.day))
        .attr('cy', d => svgHeight - d.properties.id_day * 20)
        .style('opacity', 1);
    }
    //reverses the circles back to a random position
    function circlesToRandom() {
      circles
        .transition()
        .attr('r', () => Math.random() * 20)
        .attr('cx', () => Math.random() * svgWidth)
        .attr('cy', () => Math.random() * svgHeight)
        .style('opacity', 0.7);
    }
  });

const timeParse = d3.timeParse('%Y-%m-%d %H:%M:%S');
function clean(data) {
  for (const d of data.features) {
    const date = timeParse(d.properties.time);
    d.properties.date = date;
    d.properties.day = d3.timeDay(date);
  }
  return data;
}
