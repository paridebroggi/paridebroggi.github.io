---
date: 2015-10-03 23:17:32 +0100
layout: blogpost
category: blogpost
subcategory: dev

keywords: "collcetionview, uicollectionview, collection, view, scroll, pagination, paginated, center, cover, flow, uiscrollview, centered"
tags: [dev, ios, swift, mobile]
title:  "UICollectionView Pagination"
tagline: "how to center and customize"
excerpt: "Here is a trick to center a custom UICollectionView's pagination"
---
![Centred UICollectionView]({{ site.imagesurl | append: '2015-10-03-collectionview-paginated-centered-swift.jpg' | absolute_url }})

A persistent mobile design trend is to present collection views with a centred pagination. Usually the user can swipe to select the element in the middle while seeing
a preview of the other elements on the left and right sides.

Unfortunately the UICollectionFlowLayout pagination can't handle this effect natively. Enabling pagination on a collection view will work flawlessly only if cells are as wide as the collection view itself.

To achieve the centred pagination effect we need to use a workaround.

__Theory__

We will disable the scrolling of the collection view. Then we will add in foreground a paginated scroll view (the blue square in the picture above).
 We will set the scroll view width equal to the collection view cell's width plus the inset between the cells. Finally we will observe the content offset of the scroll view in the delegate and assign it to to the collection view. We will transfer the scroll view pan gesture to a container view (which contains both collection and scroll views) in order to keep the swiping experience natural.

__Practice__

1. Create a main view and drag and drop inside it a collection view. This main view will be our "Container View". Set the constraints of the collection view to 0 on all sides (in relation to its superview)

2. Add a scroll view in the same Container View and place it over the collection view, in the middle. In the interface builder activate the pagination. Set its height equal to the collection view height and its width equals to the sum of the cell width plus the inset between cells. Finally set its content size width as below:

{% highlight swift %}
// data is the array where we keep our collection view cell data
self.scrollView.contentSize.width = (self.cellWidth + self.spaceBetweenCells) * CGFloat(self.data.count)
{% endhighlight %}

3. Disable user interaction and scrolling on the collection view

4. Add to the Container View the scroll view pan gesture

{% highlight swift %}
self.containerView.addGestureRecognizer(self.scrollView.panGestureRecognizer)
{% endhighlight %}

5. In the UIScrollViewDelegate catch the scroll view content offset on the x axis and assign it to the collection view's one.
{% highlight swift %}
func scrollViewDidScroll(scrollView: UIScrollView)
{
  self.collectionView.contentOffset.x = scrollView.contentOffset.x
}
{% endhighlight %}

I shared the XCodeProject with all the details on GitHub.

![Centred UICollectionView]({{ site.imagesurl | append: '2015-10-03-paginated-collection-view.gif' | absolute_url }})
