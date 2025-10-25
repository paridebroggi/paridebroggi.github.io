---
date: 2015-08-18 08:05:12 +0100
layout: article
category: articles
subcategory: dev

keywords: "swift, uicollectionview, datasource, reusable, synchronized"
tags: [dev, ios, swift, mobile]
title:  "UICollectionView with Swift"
tagline: "efficient data sourcing delegation"
excerpt: "A simple strategy to create efficient, synchronized and highly reusable data source delegate for all UICollectionView in your application"
---

![Swift Programming Language Logo]({{ site.imagesurl | append: '2015-08-18-swift-uicollectionview.jpg' | absolute_url }})

In mobile development the Model-View-Controller architecture can quickly evolve to a Massive-View-Controller nightmare where a cumbersome view controller manages almost everything in the application.

Massive view controllers are an anti-pattern because they are difficult to scale, test and maintain. A trick to avoid them is to remember these principles:

__Specialization__: one objet, one task.<br>
__Delegation__: share responsibility for targeted or iterative tasks<br>
__Communication__: when complexity increase notifications can ease<br>
__Abstraction__: make code as reusable as possible

Apple Cocoa API makes an extensive use of delegation for one-to-one communication between instances. Delegation is a powerful tool that should be employed at its best.

A common practice is to delegate anything to the view controller. This delegation strategy ends with the implementation of some methods (the ones required by the protocol we want to conform to) directly inside the body of the view controller.

{% highlight swift %}
class CustomViewController: UIViewController, UICollectionViewDataSource
{
  var data = [CustomModel]()

  override func viewDidLoad()
  {
    super.viewDidLoad()
  }

  // MARK: - DATASOURCE DELEGATE

  func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int
  {
    return self.data.count
  }

  func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell
  {
    let cell = collectionView.dequeueReusableCellWithReuseIdentifier(self.cellIdentifier, forIndexPath: indexPath) as! CustomCollectionViewCell
    cell.data = self.data[indexPath.item];
    return cell
  }
}
{% endhighlight %}

This code is sneaky because it seems to be clean an compact... until we need to scale or add new features to the application

A better strategy is to delegate some responsibilities (like data sourcing, for exemple) to external objects instanciated in the view controller, making the code more reusable, expressive and semantically coherent.

Let's consider a mobile application with several collection views distributed on indipendent view controllers. For each of them we should implement at least two methods and instanciate an array with the data. Morover we should sychronize this array with the data contained in the collection view cells for the whole view controller lifecycle.

This was the old way! The smarter one is to create a new class conformed to UICollectionViewDataSource protocol that manages everything autonomously.

This class will be reusable for any collection view with any data type. Two callbacks are used to instanciate the model and to configure the collection view cells

{% highlight swift %}
import Foundation
import UIKit

typealise createCallback = ([String : AnyObject]) -> AnyObject
typealise configCallback = (UICollectionViewCell, AnyObject) -> Void

class CollectionDataSourceManager : NSObject, UICollectionViewDataSource
{
  var items = [AnyObject]()
  let cellIdentifier : String
  let cellConfigurator : (UICollectionViewCell, AnyObject) -> Void
  let newCellCreator : ([String : AnyObject]) -> AnyObject

  init(cellIdentifier: String, newCellCreator: createCallback, cellConfigurator: configCallback)
  {
    self.cellIdentifier = cellIdentifier
    self.cellConfigurator = cellConfigurator
    self.newCellCreator = newCellCreator
    super.init()
  }

  func itemAtIndexPath(indexPath: NSIndexPath) -> AnyObject
  {
    return self.items[indexPath.item];
  }

  func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int
  {
    return self.items.count
  }

  func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell
  {
    let cell = collectionView.dequeueReusableCellWithReuseIdentifier(self.cellIdentifier, forIndexPath: indexPath) as! UICollectionViewCell
    self.cellConfigurator(cell, self.itemAtIndexPath(indexPath));
    return cell
  }

  func retrieveData(didRetrieveDataCallback: () -> Void)
  {
    // here we retrieve the data (for ex. with Alamofire)
    Alamofire.request(.GET, "https://www.app.com/api", parameters: ["foo": "bar"])
    .response { request, response, data, error in

      // do some parsing here before update the collection view
      // data array and calliing the callback closure

      self.items.append(self.newCellCreator(retrieved data)
      didRetrieveDataCallback()
    }
  }
}
{% endhighlight %}

After this, we just need to create a CollectionDataSourceManager instance in the view controller

{% highlight swift %}
class CustomViewController: UIViewController
{
  var data : CollectionDataSourceManager!

  override func viewDidLoad()
  {
    super.viewDidLoad()
    self.setCollectionView()
  }

  private func setCollectionView()
  {
    self.data = CollectionDataSourceManager(cellIdentifier: "CustomCell", newCellCreator: {CustomCellData(data: $0)}){
      let cell = $0 as! CustomCell
      cell.data = $1 as! CustomCellData
    }
    self.collectionView.dataSource = self.data
    self.data.retrieveData(){
      //here the callback to perform once data has been retrieved
      self.loader.stopAnimating()
      self.collectionView.realoadData
    }
  }
}
{% endhighlight %}

For both callbacks we use some handy Swift features: type inferring and implicit closure parameters ($0, $1).
Read the [documentation](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Closures.html)

The first callback is a one-liner that creates an instance of the model:
{% highlight swift %}
CustomCellData(data: $0)
{% endhighlight %}

The second one assigns the model to the custom UICollectionViewCell class:
{% highlight swift %}
let cell = $0 as! CustomCell
cell.data = $1 as! CustomCellData
{% endhighlight %}

That's all. Collection view delegation is done once forever. It is fully reusable and indipendent.
