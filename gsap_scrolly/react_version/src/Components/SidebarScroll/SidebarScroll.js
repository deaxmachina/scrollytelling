import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import * as d3 from "d3";
import styled from 'styled-components';
import "./SidebarScroll.css";

// width for all the svgs 
const width = 1000; 

// Make 3 graphs and try to switch between them on scroll
const GraphFirst = () => {
  const svgRef1 = useRef();
  const svgWidth = width
  const svgHeight = 500;
  const circleRad = 100;
  const [data, setData] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    const svg = d3.select(svgRef1.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
    //.attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

  const g = svg.append("g")
  let circles = g
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('class', 'my-circle')
    .attr('r', circleRad) // circles start as being invisible
    .attr('cx', () => Math.random() * svgWidth)
    .attr('cy', () => Math.random() * svgHeight)
    .style('fill', 'maroon')
    .style('opacity', 0.7);
  }, [])
  return (
    <>
      <div className="wrapper-1">
        <svg className="svg-1" ref={svgRef1}></svg>
      </div>
    </>
  )
}

const GraphSecond = () => {
  const svgRef2 = useRef();
  const svgWidth = width;
  const svgHeight = 500;
  const circleRad = 100;
  const [data, setData] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    const svg = d3.select(svgRef2.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      //.attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

  const g = svg.append("g")
  let circles = g
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('class', 'my-circle')
    .attr('r', circleRad) // circles start as being invisible
    .attr('cx', () => Math.random() * svgWidth)
    .attr('cy', () => Math.random() * svgHeight)
    .style('fill', 'blue')
    .style('opacity', 0.7);
  }, [])
  return (
    <>
      <div className="wrapper-2">
        <svg className="svg-2" ref={svgRef2}></svg>
      </div>
    </>
  )
}

const GraphThird = () => {
  const svgRef3 = useRef();
  const svgWidth = width; 
  const svgHeight = 500;
  const circleRad = 100;
  const [data, setData] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    const svg = d3.select(svgRef3.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      //.attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

  const g = svg.append("g")
  let circles = g
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('class', 'my-circle')
    .attr('r', circleRad) // circles start as being invisible
    .attr('cx', () => Math.random() * svgWidth)
    .attr('cy', () => Math.random() * svgHeight)
    .style('fill', 'green')
    .style('opacity', 0.7);
  }, [])
  return (
    <>
      <div className="wrapper-3">
        <svg className="svg-3" ref={svgRef3}></svg>
      </div>
    </>
  )
}


const SidebarScroll = () => {

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // PINNING THE CHART //
    //This pins the SVG chart wrapper when it hits the center of the viewport
    //and releases the pin when the final textbox meets the bottom of the chart
    //we use a function to define the end point to line up the bottom of the
    //text box with the bottom of the chart
    ScrollTrigger.create({
      trigger: '#chart-wrapper',
      endTrigger: '#step-3', // id of the last text box 
      start: 'top top',
      end: 'center center',
      pin: true,
      pinSpacing: false,
      id: 'chart-pin'
    });

    // Animation 1: make the first graph appear 
    ScrollTrigger.create({
      trigger: '#step-1',
      start: 'top center',
      end: 'center top',
      onEnter: () => console.log("placeholder"),
      onLeaveBack: () => console.log("placeholder"),
      toggleClass: {targets: "#graph-1", className: "active"},
      markers: false,
      id: 'first-box',
    });

    // Animation 2: Make the second graph appear 
    ScrollTrigger.create({
      trigger: '#step-2',
      start: 'top center',
      end: 'center top',
      toggleClass: {targets: "#graph-2", className: "active"},
      markers: false,
      id: 'second-box',
    });

    // Animation 3: Make the third graph appear 
    ScrollTrigger.create({
      trigger: '#step-3',
      start: 'top center',
      end: 'center top',
      onEnter: () => console.log("placeholder"),
      toggleClass: {targets: "#graph-3", className: "active"},
      markers: false,
      id: 'third-box',
    });

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

      <div id="chart-and-steps">
        <div id="chart-wrapper">
          {/*
            <div className="rectangle" id="graph-1"></div>
            <div className="rectangle" id="graph-2"></div>
            <div className="rectangle" id="graph-3"></div>
           */}
           <div className="rectangle" id="graph-1"><GraphFirst /></div>
           <div className="rectangle" id="graph-2"><GraphSecond /></div>
           <div className="rectangle" id="graph-3"><GraphThird /></div>
 
        </div>

        <div id="scroll-steps">
          <section className="step" id="step-1">
            This is the first section with some text in it
          </section>
          <section className="step" id="step-2">
            This is the second section with some text in it
          </section>
          <section className="step" id="step-3">
            This is the third section with some text in it
          </section>
        </div>
      </div>


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

export default SidebarScroll;