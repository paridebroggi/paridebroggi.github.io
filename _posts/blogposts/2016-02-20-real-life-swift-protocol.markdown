---
date: 2016-02-20 23:17:12 +0100
layout: blogpost
category: blogpost
subcategory: dev

keywords: "swift, protocols, protocol, protocol oriented, protocol extension, default, implementation"
tags: [dev, ios, swift, mobile]
title:  "Swift Protocols"
tagline: "Real life needs for Protocols"
excerpt: "Some practical examples on how to use Protocol Oriented Programming architecture in a modern mobile app with Swift."
---

![The Duke of Protocols]({{ site.imagesurl | append: '2016-02-20-swift-protocols.jpg' | absolute_url }})

"In an Object Oriented universe, if you just want a banana what you get is a gorilla holding the banana and the entire jungle". This old joke by Joe Armstrong (the creator of Erlang) is still a clever objection against OOP and its key concept of inheritance.

Armstrong’s good point is that sometimes you simply don’t need the implicit environment that a subclass silently brings with her. In everyday programming this issue of OOP is quite common.

Let’s say we are developing an app where 10 view controllers out of 30 deal with keyboard notifications. There are several ways to address this specific requirement with OOP, but none of them is a perfect solution.

__Crappy solution__ <br>
We implement the code to handle keyboard notification wherever we need it. This would be the worst solution, because of an awful code duplication. Rewrite manually ten times the same thing goes against the concept of computer science itself.

__Extension__ <br>
We could use an extension of UIViewController in order to make available the keyboard handling methods to all UIViewController instances. This works, but it is far too much! We will be sharing some methods with all the view controllers of the world when we need to reach just 10 of them. This solution is not so brilliant.

__Inheritance + Extension__ <br>
We could create a subclass named BaseViewController that inherits from UIViewController. Then we make all the view controllers of our app inherit from this Base Class. Finally we will extend this class with the keyboard handling methods. This is a good improvement, but we are still sharing keyboard methods with 20 view controllers that won’t ever use them. The best among the worse.

__Delegation__ <br>
In iOS, when you run out of solutions, you still have one. The last solution is delegation. We could make a KeyboardHandlerDelegate. Delegation works fine, but it’s overkilling. We want to optimise our code and we end up with instantiating a delegate object each time we need to handle keyboard notifications. Not so smart.

<h3>Protocols</h3>
So how can we properly provide 10 view controllers out of 30 with keyboard handling methods? The example above is about keyboard notifications, but we could talk about login/logout methods, helpers methods to handle  and customise alerts, animation/transition routine methods and all the generic stuff we usually reuse in a mobile application.

A very good solution to this kind of problems is provided by Protocol Oriented Programming. Swift  implements POP in a very nice way, giving us the possibility to extends Protocol with a default implementation that can be targeted with where clauses.

Protocol Oriented Programming can give us exactly what we need, when we need and basically with no tradeoffs.


Here is an exemple of a very basic KeyboardNotificationProtocol

{% highlight swift %}
import UIKit

protocol KeyboardNotifications {

  func keyboardAnimation(notification: NSNotification)

}

extension KeyboardNotifications where Self: UIViewController {

  func dismissKeyboard() {
    view.endEditing(true)
  }

  func registerForKeyboardNotifications() {
    NSNotificationCenter.defaultCenter().addObserver(self, selector: Selector("keyboardAnimation:"), name: UIKeyboardWillShowNotification, object: nil)
    NSNotificationCenter.defaultCenter().addObserver(self, selector: Selector("keyboardAnimation:"), name: UIKeyboardWillHideNotification, object: nil)
  }

  func unregisterFromKeyboardNotifications() {
    NSNotificationCenter.defaultCenter().removeObserver(self, name: UIKeyboardWillShowNotification, object: nil)
    NSNotificationCenter.defaultCenter().removeObserver(self, name: UIKeyboardWillHideNotification, object: nil)
  }

}
{% endhighlight %}

The KeyboardNotifications protocol should be considered as a new tool in our toolbox that we can grab at the right time to accomplish the right thing. Here is how to use it on a view controller that needs to handle keyboard notifications

{% highlight swift %}
import UIKit

class ViewControllerWithKeyboardNotifications: UIViewController {

  override func viewWillAppear(animated: Bool) {
    super.viewWillAppear(animated)
    registerForKeyboardNotifications()
  }

  override func viewDidDisappear(animated: Bool) {
    super.viewDidDisappear(animated)
    unregisterFromKeyboardNotifications()
  }

}

// MARK: - HANDLING KEYBOARD NOTIFICATIONS
extension SendBillViewController: KeyboardNotifications {

  func keyboardAnimation(notification: NSNotification) {
	// HANDLE NOTIFICATIONS HERE
  }

}
{% endhighlight %}


A thumb rule to know when it is useful to use protocols could be: "Do I always need this specific thing? Do I need it twice?". If your answers are NO and YES, you'd probably  better implementing a Protocol. Protocols are the best solution to handle peculiars and individual needs that you can’t address correctly with inheritance.


Here is another protocol to handle alerts.

{% highlight swift %}
import UIKit

protocol GenericAlertView { }

extension GenericAlertView where Self: UIViewController {

  func displaySingleButtonAlertView(
    title: String,
    message: String = "",
    buttonLabel: String,
    style:  UIAlertActionStyle = .Cancel,
    handler: ((UIAlertAction) -> Void)? = nil,
    completion: (() -> Void)? = nil
    ){
      let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
      alertController.addAction(UIAlertAction(title: buttonLabel, style: style, handler: handler))
      self.presentViewController(alertController, animated: true, completion: completion)
  }

  func displayDoubleButtonAlertView(
    title: String,
    message: String = "",
    firstButtonLabel: String,
    secondButtonLabel: String,
    firstStyle:  UIAlertActionStyle = .Destructive,
    secondStyle:  UIAlertActionStyle = .Default,
    firstHandler: ((UIAlertAction) -> Void)? = nil,
    secondHandler: ((UIAlertAction) -> Void)? = nil,
    completion: (() -> Void)? = nil
    ){
      let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
      alertController.addAction(UIAlertAction(title: firstButtonLabel, style: firstStyle, handler: firstHandler))
      alertController.addAction(UIAlertAction(title: secondButtonLabel, style: secondStyle, handler: secondHandler))
      self.presentViewController(alertController, animated: true, completion: completion)
  }
}
{% endhighlight %}

Some story as before. When we need our view controller to be able to display alert views we just have to affiliate it to our GenericAlertView protocol

{% highlight swift %}
import UIKit

class ViewController: GenericAlertView {

  override func viewDidAppear(animated: Bool) {
    super.viewDidAppear(animated)
    displaySingleButtonAlertView("Hey! I can display alerts.", buttonLabel: "Close")
  }

}
{% endhighlight %}
