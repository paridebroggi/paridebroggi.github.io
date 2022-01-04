---
date: 2014-05-23 16:48:45 +0100
layout: project
category: project
subcategory: tool

keywords: "c, raytracer, computer graphics, matrices, ray, casting"
tags: [c, computer graphics]
title:  "Ray Tracer"
subtitle: "A 3D ray tracer in plain C language"
excerpt: "I created my own 3D ray tracer just to understand in depth how OpenGL and graphic engines like Unity or Unreal work under the hood."

cover_image: 2014-05-23-raytracer.jpg
project_url: https://github.com/pbrog/raytracer/
videoID: k1WmBy8khrNcYOuWcN9
---

I've always loved computer graphics. It is a mind-blowing blend of history of art and pure mathematics, two worlds everybody usually consider to be apart.

So, here is my first 3D [ray tracer](https://it.wikipedia.org/wiki/Ray_tracing){:target="_blank"}. I coded it in plain C for didactic purposes. It uses a basic, open source graphic library developed by 42 teacher Olivier Cruzet.

Once compiled and linked, the program takes as parameter the custom scene description that is to be rendered. At the moment no GPU optimization is performed (using OpenGL API was not the purpose of this project. But if you're interested in OpenGL 4 you can check my [hydrodynamic simulator](https://www.paridebroggi.com/2015/06/hydrodynamic-simulator.html){:target="_blank"}).

The ray tracer implements basic 3D objects, limited objects, custom camera view and resolution, multi colored spotlight effects, ambience light, reflection, refraction and transparency.
