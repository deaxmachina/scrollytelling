import React, { useState, useEffect, useRef } from "react";
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import * as d3 from "d3";
import "./LayeredScroll.css";

const LayeredScroll = () => {

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: "#sidebar",
      start: "top top", 
      pin: true, 
      pinSpacing: false 
    });

    gsap.utils.toArray(".panel").forEach((panel, i) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top top", 
        pin: true, 
        pinSpacing: false 
      });
    });
    
    ScrollTrigger.create({
      snap: 1 / 4 // snap whole page to the closest section!
    });

    gsap.set(".panel", { zIndex: (i, target, targets) => targets.length - i });
  }, [])

  return (
    <>
      <div className="description blue">
        <div>
          <h1>Layered pinning</h1>
          <p>Use pinning to layer panels on top of each other as you scroll.</p>
        </div>
      </div>


      <div id="content">
        <div id="panels">
          <section className="panel red">
            ONE  ONE  ONE  ONE  ONE  ONE  ONE
          </section>
          <section className="panel orange">
            TWO TWO TWO TWO TWO TWO TWO TWO 
          </section>
          <section className="panel purple">
            THREE THREE THREE THREE THREE 
          </section>
          <section className="panel green">
            FOUR
          </section>
          <section className="panel green">
            FOUR
          </section>
        </div>
      </div>

    </>
  )
};

export default LayeredScroll;