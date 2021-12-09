---
date: 2015-06-14 11:22:19 +0100
layout: project
category: project
subcategory: tool

keywords: "OpenGL, simulator, hydrodynamic,fluid"
tags: [tool]
title:  "C++ Hydrodynamic Simulator"
tagline: "Water physics with C++ and OpenGL 4"
excerpt: "HDS is a hydrodynamic simulator that reproduces water behaviours in several context as rain, flood, drainage or waves. It's built with C++ and OpenGL 4.0"

cover_image: 2015-06-14-hydrodynamic-simulator.jpg
project_url: https://github.com/pbrog/glmc
videoID: x7k5rbw
playerParams:
gkParams: GK_PV5_PHOTON=1
---

Computer simulations are amazing. It's impressing how they can reveal the mathematical layer that silently hides under the world.

Some time ago I developed a [ray tracer](https://www.paridebroggi.com/2014/05/plain-c-raytracer.html) in order to  simulate the experience of vision and its related effects: shades, illumination, reflections and transparencies.

This time I chose to simulate the water behaviour under different contexts and landscapes. This [hydrodynamic simulator](https://github.com/pbrog/hydrodynamic-simulator) implements five different scenarios: rain, flood, drainage, waves and tsunami.

In order to get a real-time application I made some approximations, but still the result is quite realistic as you can see in the video above.

Every time I code a simulator I end up telling myself that computers are damn good in playing the nature role!

If you are interested in how I code it, I share some steps in this [blog post](https://www.paridebroggi.com/2015/06/optimized-cube-opengl-triangle-strip.html).
