import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import * as d3 from "d3";
import "./PinnedGraph.css";


const PinnedGraph = () => {

  const chartWrapperRef = useRef();
  const svgWidth = 700;
  const svgHeight = 500;
  const circleRad = 10;

  const [data, setData] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // SET UP D3 GRAPH //
    const svg = d3.select(chartWrapperRef.current)
      .append("svg")
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

    const g = svg.append("g")
    let circles = g
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('class', 'my-circle')
      .attr('r', 0) // circles start as being invisible
      .attr('cx', () => Math.random() * svgWidth)
      .attr('cy', () => Math.random() * svgHeight)
      .style('fill', 'maroon')
      .style('opacity', 0.7);


    // PINNING THE CHART //
    //This pins the SVG chart wrapper when it hits the center of the viewport
    //and releases the pin when the final textbox meets the bottom of the chart
    //we use a function to define the end point to line up the bottom of the
    //text box with the bottom of the chart
    ScrollTrigger.create({
      trigger: '#chart-wrapper',
      endTrigger: '#step-3', // id of the last text box 
      start: 'center center',
      end: 'center top',
      pin: true,
      pinSpacing: false,
      id: 'chart-pin'
    });

    // ANIMATIONS //


    // Animation 1: make the circles visible 
    ScrollTrigger.create({
      trigger: '#step-1',
      start: 'top center',
      onEnter: makeCirclesVisible,
      onLeaveBack: hideCircles,
      markers: false,
      id: 'first-box'
    });

    function makeCirclesVisible() {
      circles
        .transition()
        .duration(1000)
        .attr('r', 100)
    };
    function hideCircles() {
      circles
        .transition()
        .duration(1000)
        .attr('r', 0)
    };

    // Animation 2: Change the colour and radius 
    ScrollTrigger.create({
      trigger: '#step-2',
      start: 'top center',
      onEnter: changeCirclesColRad,
      onLeaveBack: reverseCirclesColRad,
      markers: false,
      id: 'second-box'
    });

    function changeCirclesColRad() {
      circles
        .transition()
        .duration(1000)
        .attr("r", 150)
        .style('fill', "LightSeaGreen");
    };
    function reverseCirclesColRad() {
      circles
        .transition()
        .duration(1000)
        .attr("r", 100)
        .style("fill", "maroon")
    };

    // Animation 3: Change the opacity back and forth
    ScrollTrigger.create({
      trigger: '#step-3',
      start: 'top center',
      onEnter: ChangeData,
      //onLeaveBack: reverseCirclesOpacity,
      markers: false,
      id: 'third-box'
    });

    function ChangeData() {
      circles
        .transition()
        .attr('r', (d, i) => d*10) 
    }

    function changeCirclesOpacity() {
      circles
        .transition()
        .duration(1000)
        .style('opacity', 0.9)
        .attr('cx', () => Math.random() * svgWidth)
        .attr('cy', () => Math.random() * svgHeight)
    };
    function reverseCirclesOpacity() {
      circles
        .transition()
        .duration(1000)
        .style("fill", "maroon")
        .style('opacity', 0.7);
    };



    //sets up the class toggle on each scrolling text box
    //so that it becomes opaque when in view and transparent when exiting
    gsap.utils.toArray('.step').forEach(step => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top center',
        end: 'center top',
        toggleClass: 'active',
        markers: false,
        id: 'toggle-active-class'
      });
    });



  }, [])



  return (
    <>

      <div className="heading-wrapper">
        <h1 className="red stack heading-6">
          Scrollytelling with GSAP ScrollTrigger
        </h1>
      </div>
      <p>
        GSAP is a JavaScript library that makes it easy to code high-performance
        and complex animations. GSAP has a flexible interface that is easy to use
        with D3 and other common dataviz libraries. GSAP has just released a new
        plugin called ScrollTrigger that facilitates scroll-driven animations.
        ScrollTrigger can be used along with GSAP’s own animation functions, but
        you can also use it just as a scroll watcher to trigger any function (for
        example, run some D3 code) on a particular scroll interaction. This
        document showcases how you can use ScrollTrigger to power some common
        dataviz scrollytelling patterns, but the library is extremely
        full-featured and flexible, you can see more about what’s possible
      </p>

      <div id="chart-wrapper" ref={chartWrapperRef}>
      </div>

      <article id="scroll-steps">
        <section className="step" id="step-1">
          This is the first section with some text in it
        </section>
        <section className="step" id="step-2">
          This is the second section with some text in it
        </section>
        <section className="step" id="step-3">
          This is the third section with some text in it
        </section>
      </article>

      <section>
        <p>
          This is just some text for after the graph,
          just so that we can see what happens when we end the scrollytelling
          bit of the thing. Just some more placeholder text and so on. Check why there
          is some spacing between the end of the scolly bit and the start of the next section
        </p>
        <p>
          This is just some text for after the graph,
          just so that we can see what happens when we end the scrollytelling
          bit of the thing. Just some more placeholder text and so on. Check why there
          is some spacing between the end of the scolly bit and the start of the next section
        </p>
        <p>
          This is just some text for after the graph,
          just so that we can see what happens when we end the scrollytelling
          bit of the thing. Just some more placeholder text and so on. Check why there
          is some spacing between the end of the scolly bit and the start of the next section
        </p>
      </section>

    </>
  )
};

export default PinnedGraph;