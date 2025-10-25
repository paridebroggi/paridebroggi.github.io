---
date: 2014-12-19 22:56:03 +0100
layout: article
category: articles
subcategory: dev

tags: "angularjs, jqlite, portability, app"
title:  "More portable AngularJS apps"
subtitle: "Using HTML base tag and jqlite"
excerpt: "An easy way to improve AngularJS applications portability through the HTML base tag and jqlite."
---

![AngularJS logo]({{ site.imagesurl | append: '2014-12-19-more-portable-angularjs-app.jpg' | absolute_url }})

Sometimes our AngularJS application works flawlessy on local stack, but it is suddenly broken once uploaded on the client's production server.

Usually the cause is a routing problem, and quite often the solution is a last-second workaround. A wiser approach is to address a more portable routing from the beginning.

__Add a base tag to the index.html file__
The tag specifies the base URL for all relative URLs in a document. There can be at maximum one in a document and it must be inside the head element. Usually it is placed as first inside the head.

{% highlight html %}
<base href="/myDeployingPath/" />
{% endhighlight %}

__Create a global deployment variable__
This variable will be the JavaScript counterpart of the HTML base attribute. To set the global programmatically we use jqlite, a lighter version of jQuery provided with AngularJS. With the help of the angular.element DOM selector we grab the value of the base tag href attribute.

{% highlight js %}
var deployPath = angular.element("base").attr("href");
{% endhighlight %}

Now we can prefix all the routing paths with our brad new deployPath value. The final routing configuration of the application will look something like this (UI-Router is used instead of the default ng-Router):

{% highlight js %}
'use strict';
angular.module('myApp', ['ui.router', 'myAppControllers', 'myAppServices'])
.config(function($stateProvider, $urlRouterProvider){
  $locationProvider.html5Mode(true);
  $stateProvider
  .state('home', {
      url: "/"
      views:{
          "main":{
              templateUrl: deployPath + "views/home.html",
              controller: 'HomeCtrl'
          },
          "nestViewOne@home":{
              templateUrl: deployPath + "subviews/nested-view-one.html",
          }
      }
  })
  $urlRouterProvider.otherwise('/');
});
{% endhighlight %}

Voilà! By simply changing the href attribute of the base tag in the index.html we could deploy our application in any folder or subfolder we would like.

Remember: if you're building an hi-securized application consider using this approach only during development. Global variables are a potential weakness in your code.
