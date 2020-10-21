---
date: 2015-06-16 21:19:43 +0100
layout: blogpost
category: blogpost
subcategory: dev

tags: "opengl, cube, draw, gl_triangle_strip, triangle, strip, cube, optimized, efficient"
title:  "Optimized cube"
subtitle: "with OpenGL 4 and triangle strips"
excerpt: "This post explains how to efficiently render a cube using OpenGL 4 API and the GL_TRIANGLE_STRIP primitive"
---

![OpenGL Cube]({{ site.imagesurl | append: '2015-06-16-opengl-cube.jpg' | absolute_url }})

Theoretical background can be found in the paper [Optimizing Triangle Strips for Fast Rendering](https://www.cs.umd.edu/projects/gvil/papers/av_ts.pdf) by F. Evans, S. Skiena and A. Varshney at the State University of New York.

So you want to draw a cube with OpenGL 4? Ok, there are two different ways to do that...

__The old way (don’t try this at home!)__

OpenGL beginners usually start by googling something like "draw cube OpenGL" and they end up with a code like this:

{% highlight c %}
static const GLfloat vertices[] = {
	-1.0f,	-1.0f,	-1.0f,
	-1.0f,	-1.0f,	 1.0f,
	-1.0f,	 1.0f,	 1.0f,
	 1.0f,	 1.0f,	-1.0f,
	-1.0f,	-1.0f,	-1.0f,
	-1.0f,	 1.0f,	-1.0f,
	 1.0f,	-1.0f,	 1.0f,
	-1.0f,	-1.0f,	-1.0f,
	 1.0f,	-1.0f,	-1.0f,
	 1.0f,	 1.0f,	-1.0f,
	 1.0f,	-1.0f,	-1.0f,
	-1.0f,	-1.0f,	-1.0f,
	-1.0f,	-1.0f,	-1.0f,
	-1.0f,	 1.0f,	 1.0f,
	-1.0f,	 1.0f,	-1.0f,
	 1.0f,	-1.0f,	 1.0f,
	-1.0f,	-1.0f,	 1.0f,
	-1.0f,	-1.0f,	-1.0f,
	-1.0f,	 1.0f,	 1.0f,
	-1.0f,	-1.0f,	 1.0f,
	 1.0f,	-1.0f,	 1.0f,
	 1.0f,	 1.0f,	 1.0f,
	 1.0f,	-1.0f,	-1.0f,
	 1.0f,	 1.0f,	-1.0f,
	 1.0f,	-1.0f,	-1.0f,
	 1.0f,	 1.0f,	 1.0f,
	 1.0f,	-1.0f,	 1.0f,
	 1.0f,	 1.0f,	 1.0f,
	 1.0f,	 1.0f,	-1.0f,
	-1.0f,	 1.0f,	-1.0f,
	 1.0f,	 1.0f,	 1.0f,
	-1.0f,	 1.0f,	-1.0f,
	-1.0f,	 1.0f,	 1.0f,
	 1.0f,	 1.0f,	 1.0f,
	-1.0f,	 1.0f,	 1.0f,
	 1.0f,	-1.0f,	 1.0f
};
glDrawArrays(GL_TRIANGLES, 0, 36);
{% endhighlight %}

This crappy code works, but it is bad at least for two reasons. First: it shows a discouraged usage of modern OpenGL API. Second: it's not scalable. Once we'are done with the cube and we want to do something more complicated, we will have to start from scratch again.

<strong>The optimized way</strong>

While dealing with OpenGL API, we have to keep in mind that everything is a triangle. Any surface we would like to draw with OpenGL will be rendered through a composition of triangles. For this reason [primitive functions](https://www.opengl.org/wiki/Primitive) exclusively concern points, lines or triangles.

Another important OpenGL concept is the elements buffer object. In most cases it is a good practice to save memory and optimize the application. How to create and bind an EBO is not the purpose of this post, so I redirect to [this good tutorial](https://www.open.gl) to familiarize with it.

__GL_TRIANGLE_STRIP vs GL_TRIANGLES__

There are several ways to render triangles in OpenGL. The more intuitive one is GL_TRIANGLES, but often the most efficient is GL_TRIANGLE_STRIP. Triangles strip is the best choice for rendering a cube too.

In OpenGL rendering logic, a cube is made up by 12 triangles. The difference between GL_TRIANGLE_STRIP and GL_TRIANGLES is the way the GPU interprets the coordinates stored in the vertex array and indexed in the elements buffer.

When GL_TRIANGLES is set, we need three vertices to define each triangle we want to draw. That means:

{% highlight c %}
12 triangles * 3 vertices each = 36 elements
{% endhighlight %}

This is not an optimal drawing strategy because it requires some cube vertices to be stored several times in the elements buffer.

For instance, let’s consider the 8 vertices at the cube’s corners. Each of them is part of 3 different triangles, so it has to be stored 3 times. That means that 16 pushed vertices out of 24 will be a duplicate.

Looking closer, we notice that the adjacent triangles on each cube’s face share 2 vertices. So again, they will be pushed more than necessary. An array full of duplicates is surely not the most efficient we can build.

To overcome these problems we have to use GL_TRIANGLE_STRIP. When GL_TRIANGLE_STRIP is set, the GPU interprets the indexes stored in the elements buffer in terms of "a continuous strip made up by adjacent triangles". Like this one:

![Triangle Strip]({{ site.imagesurl | append: '2015-06-16-triangle-strip.jpg' | absolute_url }})

This new logic allows a considerable reduction of the buffer size, supposed that we know how to correctly wrap the cube in a unique triangle strip. The academic paper mentioned above explains in detail the right vertices succession to follow in order to draw a single-strip cube.

Since developers prefer code over words, here is the snippet:

{% highlight c %}
//Declaring buffer parameters
GLint	vao, vbo, ebo;

// Declares the Vertex Array, where the coordinates of all the 8 cube vertices are stored
static GLfloat vertices[] = {
	1.0,	1.0,	1.0,
	0.0f,	1.0,	1.0,
	1.0,	1.0,	0.0f,
	0.0f,	1.0,	0.0f,
	1.0,	0.0f,	1.0,
	0.0f,	0.0f,	1.0,
	0.0f,	0.0f,	0.0f,
	1.0,	0.0f,	0.0f
};

// Declares the Elements Array, where the indexs to be drawn are stored
static GLuint elements [] = {
	3, 2, 6, 7, 4, 2, 0,
	3, 1, 6, 5, 4, 1, 0
};

// OpenGL set up:
// Creates and binds Vertex Array Object
glGenVertexArrays(1, &vao);
glBindVertexArray(vao);

// Creates and binds Vertex Buffer Object (24 is the elements array size)
glGenBuffers(1, &vbo);
glBindBuffer(GL_ARRAY_BUFFER, vbo);
glBufferData(GL_ARRAY_BUFFER, 24 * sizeof(GLfloat), vertices, GL_STATIC_DRAW);

// Creates and bind Elements Buffer Object (14 is the elements array size)
glGenBuffers(1, &ebo);
glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ebo);
glBufferData(GL_ELEMENT_ARRAY_BUFFER, 14 * sizeof(GLuint), elements, GL_STATIC_DRAW);

// Call to OpenGL draw function. (14 is the elements array size)
glDrawElements(GL_TRIANGLE_STRIP, 14, GL_UNSIGNED_INT, 0);
{% endhighlight %}

Even if there are still some duplicates, the use of GL_TRIANGLE_STRIP reduced the size of the elements buffer up to 60%. Surely, passing from 36 elements to 14 is not a big deal in terms of performance gain. But imagine if you have to draw millions of cubes and you couldn't use OpenGL instances because they are all different one to another... In that case adopting or not GL_TRAINGLE_STRIP will be determinant.
