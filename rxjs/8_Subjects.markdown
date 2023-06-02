# Subjects

In this chapter, we'll talk about another useful RxJS concept, namely, the Subjects. A Subject allows us to multicast the values to multiple Observers. It is similar to an event emitter, where you can add and remove listeners and emit events which are sent multicasted to all listeners.

The great thing about Subject is that it uses the RxJS concepts which we've covered so far. `So the Subject is a combination of an Observable and an Observer`. This means that you can subscribe to the Subject the way you did to regular Observables and you can call next, error and complete methods on the Subject to emit/multicast these notifications to all active subscribers.


In case of a regular Observable, we could have a Cold Observable to which when we subscribed, its code the generated a separate source of data independently for each Subscription. We also had Hot Observables, like the one created using 'fromEvent', where each new Subscription just created a new connection to an already existing source of events. 

The Subject follows the second pattern and can be described as a Hot Observable, because the `Subject itself is a shared source of the notifications`. We can have multiple Subscriptions to the same Subject and once we call 'next' on this Subject, this next notification will be multicasted to all subscribers. Let's now see how the multicasting works in a diagram. 

```
      ┌───────────────────────────┐
      │                           │
      │                           │
      │            TV             │
      │                           │
      │                           │
      └───────────┬──┬────────────┘
          ┌───────┴──┴────────┐
          └─────────┼─────────┘
     ┌──────────────┼──────────────┐
     │              │              │
     ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ audience │  │ audience │  │ audience │
│    1     │  │    2     │  │    3     │
└──────────┘  └──────────┘  └──────────┘
```

So, there is a match on TV. Let's call it our Subject. That TV might emit many events: a goal may be scored, some player might get injured and so on. So our Subject may emit those events as next notifications. As we have no Observers, nobody's watching the TV, there will be no reactions. Let's now say some Observers came and subscribed to this Subject. So, if an event of a goal would be emitted by this Subject, this information will reach all Observers. And this is great because these Observers might be in completely different parts of your app and, by using Subject, you can conveniently multicast the notifications to multiple places. OK, so this is what the multicasting is about. 

You may wonder what is the source of emissions in a Subject in the actual code? What causes the Subject to emit a notification? Do you remember that I've said that the `Subject also exposes the next, error and complete methods just as the Observer does.` This means that you can call the 'next' method directly on the Subject and provide some value from any place in your code. And the next notification will be multicasted to all active Subscriptions. So the Subject is like a convenient event emitter, which you can easily incorporate into the RxJS world and mix with other Observables.


## Subject in Action

Let's have a timeline at the top, which will represent the actions taken by our code. So, this is not a Subscription of any kind, but just a representation of the time passing by while the code of our app runs. Below, we have the timeline for our Subject on which we'll call the next method and to which we'll subscribe. First, let's say our code calls next(A) on our Subject at some point of time. And the Subject will emit a next notification with value 'A' to all active Subscriptions. But as there are none, nothing will happen. Let's say we add one Subscription. If our code would call next(B) on the Subject, the next notification will reach our Subscription. And going further if we would add another Subscription to the same Subject and our code would call next(C) on this Subject, this next notification will reach all active Subscriptions. We can also call 'complete' or 'error' methods on our Subject and this will complete or error all active Subscriptions.


```console                 
   Code──────┬────────┬──────────┬────────┬───>Time
             │        │          │        │     
             │next(A) │next(B)   │next(C) │error
             │        │          │        │     
             ▼        ▼          ▼        ▼                         
Subject──────A────────B──────────C────────X───>Time
                   ▲           ▲
                   │           │ subscribe
                   │           │
                   │           └──C───────X───>
         subscribe │          
                   └───B──────────C───────X───>         
```

Let's now have a look at how to use a Subject in the code. In this coding section, we'll use a Subject to see how it can be used to multicast values to all active Subscriptions. As you can see, we have an input element to which we'll type in some values, and then we'll multicast them using the 'Emit' button. Of course, we need some Observers which will react to the values we multicast, so we have a 'Subscribe' button below which will add a new Subscription to the Subject each time we click it. Let's start by creating our Subject. I'll create a const 'value$' and use the constructor 'new Subject' which we need to import from 'rxjs'.

Let's also provide the type of the emitted values which in our case will be 'string'. OK, we have our Subject ready. We can use it to multicast values by using the next method on it, or we can add new Observers by creating new Subscriptions to it. Let's start with handling the 'Emit' button and use the 'fromEvent' function and the 'Emit' button's click event. OK, let's subscribe to it. And each time we click this button we'll call the value$.next method and emit the input element's value, like this. OK, we have the emissions sorted out. Let's now provide a way to add new Subscriptions. Let's use the 'fromEvent' once again and the 'Subscribe' button's click event. And I'll subscribe to it here. And whenever a click happens, we'll console log 'New Subscription' and add a new Subscription by calling 'value$.subscribe'. And for each value we'll console log this value, like this. OK, let's have a look. How it works? So, if I would type in 'A' and click 'Emit', nothing would happen as there are no active Subscriptions to

our Subject. Let's click 'Subscribe' to have one Subscription. Now, if I would type in the value 'B' and multicast it using the 'Emit' button, we can see that it will reach our single Subscription. Let's now add another Subscription. So, right now we have two Subscriptions. And if I would type in value 'C' and click 'Emit', this value will be once again multicasted, and this time, as we have two Subscriptions, it reached both of them. You can have those Subscriptions spread across distant places of your code and by using Subject you can easily communicate them by multicasting the values and keeping those parts of code updated. As a bonus, notice that we call the 'next' method on our Subject, over here. 

```typescript
import { fromEvent, Subject } from 'rxjs';

const emitButton = document.querySelector('button#emit');
const inputElement: HTMLInputElement = document.querySelector('#value-input');
const subscribeButton = document.querySelector('button#subscribe');

const $value = new Subject<String>();

fromEvent(emitButton, 'click').subscribe((event) => {
  $value.next(inputElement.value);
});

fromEvent(subscribeButton, 'click').subscribe(() => {
  console.log('New Subscribtion');
  $value.subscribe((value) => console.log(value));
});

```


You might also remember that I've said that the Subject itself is also an Observer. Let me show you one trick. We could use the 'pipe' method over here and map the click event into the input element's value and, instead of providing the handler for the next notifications, we can pass our 'value$' Subject directly, like so. So every notification emitted by the Observable above will be multicasted by our 'value$' Observer. As a side note, it will also multicast the complete and error notifications which might end all active Subscriptions, `so be aware of that when passing the Subject to the subscribe method`. In our case, we don't expect to have those notifications here. OK, let's have a look whether it indeed works as I've described it. If I would type in the value 'A' and click 'Emit', nothing happens as there are no active Subscriptions. Let's add two new Subscriptions and type in value 'B' and click 'Emit'. And both of our Subscriptions received this value. So, as you can see, the Subject is indeed like an Observer and you can even pass it directly to the subscribe method. Let's now move on and have a look at how the BehaviorSubject works.

<iframe src="https://codesandbox.io/embed/gallant-sammet-sdzeuq?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="gallant-sammet-sdzeuq"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>



## Behavior Subject

In this part, we'll see how the BehaviorSubject works. In general, it's a minor but important extension of the regular Subject. But before we talk about the BehaviorSubject, let's start with the case we had a while ago where we've used a regular Subject to multicast the event of a goal. Let's say we have two Observers watching the match from the beginning. So they were able to know the score, to count the goals. So they are aware of the score of the game. If a new Observer would join in, it would not be aware of the current state of the match. If we are not interested in single events of something happening, but more in the state of something like the score of the match, we can change our approach, and instead of emitting single events of a goal, we can emit the updated score each time it changes. So, the new Observer would also be provided with the latest score as soon as it gets emitted. Still, in such a case of adding an Observer in the middle of the game, `this new Observer still needs to wait for the score to get emitted in order to have any data to work with`. Before that, it would just wait without any information to react to. 

```console
<!-- Diagram -->
```

The solution in this case is the BehaviorSubject. It works like putting the score on the screen. So, whenever a new Observer is added, it will receive a next notification with the latest emitted value. So, it will instantly know the most recent state of the game and will have some data to react to. After the initial emission, it will go on the way a regular Subject works. In other words, the BehaviorSubject stores the latest emitted value in its memory and whenever a new Subscription is made, it emits that latest value to this new Subscription instantly. Let's now see this in a diagram.


```console
<!-- Diagram -->
```

Let's see how the BehaviorSubject works. The timeline at the top represents our code, which will call the methods on our BehaviorSubject with the updated score of the match. So, once again, it's not a Subscription or an Observable of any kind, it's just our code running. The second timeline represents our BehaviorSubject. So, we'll make it multicast the updated score to all active Subscriptions. The first difference from a regular Subject is that in case of the BehaviorSubject we need to provide some initial value. Let it be zero-zero in our case. Let's now add a new Subscription to this BehaviorSubject. And the new Subscription will be instantly notified with the memorised value. So it will receive a next notification with the score zero to zero, so the Observer for this Subscription will instantly have some data to react to, for example, to present it to the user. After some time, let's say there was a goal and our code called 'next' on our BehaviorSubject with the updated score. This value was then multicasted to all active Subscriptions, of which at this stage we have one. So the Observer for this Subscription was able to react to this update. After some more time, let's say another Subscription was added. And it also received an initial notification with the latest value emitted by the BehaviorSubject. This time, it was the one to zero score. So, our second Observer also had some initial data to react to. After even more time, let's say there was another goal and our code called the 'next' method on the BehaviorSubject with the updated score. And the BehaviorSubject multicasted this value to all active Subscriptions. Summarizing, the BehaviorSubject works like a regular Subject, but introduces an initial value, and thanks to that, it can be used to store the value of the state. Let's now have a look at how can we use the BehaviorSubject in the code. 


```console                 
   Code────────────────┬──────────────┬─────>Time
                       │              │        
                       │next(1:0)     │next(2:0) 
                       │              │        
Behavior               ▼              ▼        
Subject─(0:0)────────(1:0)──────────(2:0)───>
               ▲              ▲
               │    subscribe │ 
               │              │
     subscribe │            (1:0)───(2:0)───>
               │              
             (0:0)───(1:0)──────────(2:0)───>         
```


In this section, we'll see the difference between a regular Subject and the BehaviorSubject. Also, we'll see a few tricks how can we use the BehaviorSubject in a few interesting cases. As you can see, I've prepared some elements. We have a navigation bar above in which we'll display our login state - true or false, depending on the current state. And next, we have the 'Login' and 'Logout' buttons. And as you might have predicted, the 'Login' button will change the 'logged in' state to true, and the other will set it to false. Also, we'll make a single button appear depending on the state. So if we are logged in the 'Logout' button will be presented and vice versa. Finally, we'll make this 'Print state' button, print the current login state to the console. Let's start by trying to use a regular Subject for this case. So, let's define a const 'isLoggedIn$' which will be a new Subject emitting boolean values, like this. Now, let's make our buttons emit the login state changes. Let's use the 'fromEvent' function and the 'Login' button's click event and we'll subscribe to it. And whenever a click event happens, we'll make our 'isLoggedIn$' Subject emit a next notification with value 'true'. Let's copy this once, and for the 'Logout' button, we'll make the 'isLoggedIn$' Subject emit 'false'. OK, we have our buttons connected. Let's now display the login state in the navigation bar. To do so, we need to use the 'isLoggedIn$' Subject and subscribe to it. So, each time it emits a new 'isLoggedIn' state, we'll update the loggedInSpan's inner text with 'isLoggedIn' boolean converted to string, like so. Let's now see what we've managed to accomplish so far. I'll save to run the code. And if I would click 'Login', we can see that our navigation bar was updated to 'true'. If I click 'Logout', it gets changed to 'false'. Great! Let's now make a single 'Login' or 'Logout' button appear depending on the state, instead of showing both buttons all the time. So, we could add the code showing and hiding buttons in this navigation bar Subscription. However, to show you the power of the Subject, let's say that this navigation bar is a separate component placed in a different place in our code than our 'Login' and 'Logout' buttons, so we need to handle the buttons' logic separately. So, let's use our 'isLoggedIn$' Subject once again, and subscribe to it. And we'll use the 'isLoggedIn' boolean to set the 'Logout' button's style display to 'isLoggedIn', question mark, 'block' if true and 'none' if false. So the 'Logout' button will be presented if 'isLoggedIn' is true and hidden otherwise. Let's now copy this and adjust the logic for the 'Login' button to be the opposite. OK, let's run the code and have a look. If I click the 'Login' button, we can see that the 'Login' button disappears and the 'Logout' button is left. If I click the 'Logout' button, it is the other way round. So we can say that it works. However, there is one issue. If I refresh the app, we can see both buttons and we don't see the current login state in the navigation bar. That's due to the nature of the regular Subject. It's good for multicasting some value or some event, but it doesn't have the memory to keep the latest emitted state or the initial value. 
<iframe src="https://codesandbox.io/embed/divine-cdn-0xeu2x?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="divine-cdn-0xeu2x"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

In our example, the BehaviorSubject would be a better match to what we want to achieve. So let's use it then instead of the regular Subject. BehaviorSubject can also be imported from 'rxjs', just as a regular Subject was. As you can see, after we've changed to the BehaviorSubject, we have some typing issue here. This is because the BehaviorSubject has a memory and we need to provide the initial value to its memory. So, this will be our initial login state, so let's start with 'false'. OK, we should have the issue of initial state covered now. So, let's save to see. And right now, thanks to using the BehaviorSubject, when we subscribe, we instantly get some initial value. So everything is as it should be from the moment the app starts. The navigation bar is updated and the buttons' visibility is also correct. Awesome! Moving on, the last thing we wanted to achieve in this coding section is to print the state to the console when we click on this 'Print state' button. So, let's start by using the 'fromEvent' function and the printStateButton's click event. So, when we subscribe to it, we'd like to console log 'User is logged in:' and print the 'is logged in' state, over here. So how can we get this value here? We can do it in a couple of ways. The simplest is to use the 'value' property exposed by the BehaviorSubject. In the console log, we can simply write 'isLoggedin$.value' and it will use the latest value stored by our BehaviorSubject at that time. So let's see this. As I click the 'Print state' button and change the login state and click once again, you can see that the correct value is printed to the screen. Another way of achieving this in a more reactive way is to use the 'pipe' method on the 'fromEvent' Observable and to add the 'withLatestFrom' operator imported from 'rxjs/operators'. And let's pass our 'isLoggedIn$' BehaviorSubject. So what it does is whenever a click event is emitted, the 'withLatestFrom' operator will take the latest value from the BehaviorSubject and create an array with that value added. So in the handler for the next notifications, we would have an array of the click event and the 'isLoggedIn' boolean, which we can use in the console log, like this. By the way, using 'withLatestFrom' is a very common way of selecting various pieces of the state when using NgRx in Angular projects. Coming back to our project. Let's save and have a look. And we can see that the outcome is the same. So in this coding part, we saw how the BehaviorSubject works. We've used it to store the login state and update all parts of our app whenever this state changed. We could also see the shortcomings of a regular Subject when used to store the state. And finally, we saw two ways in which we can get the latest value stored in the BehaviorSubject's memory.

<iframe src="https://codesandbox.io/embed/affectionate-pateu-jj1vgw?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="affectionate-pateu-jj1vgw"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

In this section, we've learned that the Subjects are like event emitters in the RxJS world. They allow us to multicast the notifications to all active Subscriptions. The great thing about Subject is that it combines the behavior of an Observable, to which we can subscribe and use the same way as any other Observable, and the behavior of an Observer, so we can call the next, error and complete methods if we want to multicast some value, some notification to all active Subscriptions. We also saw the BehaviorSubject and how it works. And the BehaviorSubject is an extension of the regular Subject with the addition of initial value. On top of the regular Subject's behavior, each new Subscription receives an initial next notification with the latest value memorized by the BehaviorSubject. So we can use the BehaviorSubject to conveniently store some state in it and react whenever it changes.

## Summary

1.
2.
3. Subject 與 BehaviorSubject 的使用時機 