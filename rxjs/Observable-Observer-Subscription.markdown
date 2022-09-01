Let's start with the Observable.The idea of an Observable is very simple. It's based around a single callback function with a set of rulesand guarantees regarding the interface and behavior. In short, once the Observable is executed, it can emit some notifications. And there are three types of notifications: `next`, `error` and `complete`. For now, we'll focus on the next notifications, which allow us to emit values.

OK, let's have a look at the following code snippet.A new Observable can be created by using the 'new Observable' constructor to which we pass the logic of the Observable as a callback function. We can see that in this case, the logic is very simple. The Observable will call next on the subscriber twice with values Alice and Ben. The questions right here are: What is this `subscriber` object? What does this `next` method do?

```js
const observable$ = new Observable((subscriber) => {
  subscriber.next("Alice");
  subscriber.next("Ben");
});
```

And how can we make this Observable execute this callback? To answer these questions, let's have a look at two more types provided by RxJS. First, the `Observer` object. Let's see an example how an Observer object can look like. As you can see, our Observer has a next function defined. Notice that 'next' is used in both, our Observer object and the Observable's logic above. And that's not a coincidence. The next function in the Observer provides the behavior for the next notifications emitted by the Observable. Now, how can we connect our Observer to the Observable we have above?

```js
const observe = {
  next: (value) => console.log(value),
};
```

Let's summarize what we know so far. `The Observable on its own doesn't run any code`. It's just a special object which has some callback function stored inside. `The Observer just describes the reaction to each emitted value`. We need to somehow run the callback inside of this Observable and pass our Observer to it to make it work.

## How can we do this? Subscription

The Subscription is what executes the Observable. In short, we can say that it runs the callback inside of the Observable and passes our Observer object to it. Let's now have a look at how can we start such Subscription? Each Observable exposes the subscribe method, so to start a new Subscription, we simply call the subscribe method on the Observable and we can pass the Observer as an argument.

```js
observable$.subscribe(observer);
```

Now, let's see what would happen if we would run the code that we have on the screen right now. So first, the subscribe method gets called on our Observable that we have created above. At this point, a new Subscription is made, which means that the callback in the Observable run with the provided Observer converted into a subscriber object. What is important to know at this point is that each time the next method is used on the subscriber a next value is emitted and in effect, the next handler of our Observer is called with that emitted value. To sum up, each new Subscription runs the Observable with the provided Observer and each emitted value by the Observable will call the Observer's next handler with the provided value. And our Observer will just console log each emitted value.

## Code Example

```ts
import { Observable } from "rxjs";

const observable$ = new Observable<string>((subscriber) => {
  console.log("Observable executed");
  subscriber.next("Alice");
  subscriber.next("Ben");
  subscriber.next("Charlie");
});

const observer = {
  next: (value) => console.log(value),
};

observable$.subscribe(observer);
```

OK, now it works! We can see all of the emitted values that they were console logged. As a side note, you might have noticed that we provide an Observer object to the subscribe method, but in the function with the Observable's logic, we have a subscriber object instead. This is because when we subscribe, our Observer gets wrapped into a subscriber object and this is done to provide some of the Observable interface guarantees, like not delivering notifications after the Subscription gets closed or providing default handlers for the notification types which are not covered by our Observer. To put it in a simple way, it's a transparent step which makes the Observables more predictable and easier to use. And that's done automatically by RxJS, so we don't need to worry about that step.

So instead of passing the Observer object, we can simply pass a single function to the subscribe method, like so. And this function will act as the next notification handler. So, let's clear the console now and see if the outcome is the same. So as we can see, the result is exactly the same, and this shorthand version, this shorthand way looks less complicated and it's much easier to read.

```ts
observable$.subscribe((value) => console.log(value));
```

So it's really convenient to use it, if you're interested in reacting to the next notifications only and in real life situations it will be like this very often.

## Unsubscribing

If we are no longer interested in receiving values from the Observable, we should unsubscribe. In our current case, unsubscribing wouldn't cause any spectacular effect as all three values are emitted immediately after subscribing. To better see the unsubscribing in action, let's modify our Observable a bit and spread the values in time by using 'setTimeout'.

```ts
import { Observable } from "rxjs";

const observable$ = new Observable<string>((subscriber) => {
  console.log("Observable executed");
  subscriber.next("Alice");
  setTimeout(() => subscriber.next("Ben"), 2000);
  setTimeout(() => subscriber.next("Charlie"), 4000);
});

const subscription = observable$.subscribe((value) => console.log(value));

setTimeout(() => {
  console.log("Unsubscribe");
  subscription.unsubscribe();
}, 3000);

// Observable executed
// Alice
// Ben
// Unsubscribe
```

So, the first value will be emitted immediately. Then, the second will be emitted after 2000 milliseconds. And the last one will be emitted after 4000 milliseconds.
OK, let's run this to have a preview of how the values are emitted right now. We see that the values are the same, but emitted with a time delay. OK, so right now we'll be able to see the unsubscribing in action.

Let's cancel our Subscription after three seconds. This means that we should receive the first two emissions, but not the third one, as it happens, four seconds after subscribing. So in order to unsubscribe, we need to get to the reference to our Subscription. The Subscription is returned by the subscribe method. So we simply need to keep our Subscription. Like so. Now, let's add a 'setTimeout' over here. And use our Subscription, and run the unsubscribe method on our Subscription after 3000 milliseconds. And let's also add console log over here, so we can see at which point we unsubscribe. OK, let's run this code. And we can see that we have successfully unsubscribed, and because of that, we didn't receive the third value. In our example, the Subscription gets closed before the third next notification gets emitted, so it's not passed to the Observer.

As a side note, we shouldn't leave any code running like this after we unsubscribe. We should probably cancel the remaining setTimeouts after unsubscribing, so as not to risk any unwanted side effects or memory leaks, but we'll touch this topic later in the course. For the purpose of this example, let's leave it like this. OK, we saw how can we create a new Observable, how can we subscribe to it to run the code inside of it and how to react to the values by providing the Observer. We've also learned about a very useful single function shorthand version of the Observer. Let's now have a look at one more scenario.

## Multiple Subscriptions

We have one more important thing to cover here. What would happen if we would call the subscribe method on the same Observable multiple times? What difference would it make or will it make any difference if we would pass the same or different Observers as an argument? Let's have a look. Now, what would happen if we would create one more Subscription to the same Observable and use the same Observer? In this case, the new Subscription will run the Observable's logic once more, and it will produce the data, the emissions independently from the first Subscription. All in all, `subscribing is about executing the callback inside of the Observable, and each Subscription is a separate execution of the Observable`. So, if you would create another Subscription to the same Observable but with a different Observer provided, the logic inside of the Observable would be run once more, again, independently from the other executions. And the only difference here is that the reaction to the emitted values might be different as we've provided a different Observer. So the most important thing to remember here is that each new Subscription runs the code embedded in the Observable, in this callback independently from the other Subscriptions. So subscribing is just like running a regular function with the Observer object passed as an argument.

Now we have two Subscriptions in our code. The first one will start immediately and the other will do so one second after that. So before we run this, let's try to predict the outcome of our current code. Let's have a look at the function with our Observable's logic once more. So, it generates the first value 'Alice' immediately, then the value 'Ben' after 2000 milliseconds, and lastly, the value 'Charlie' after four seconds. We've said previously that `subscribing is just like calling the function inside of the Observable`. So the first Subscription, which starts immediately, will run this Observable's logic first, and will get the notifications, the emissions as we've just described it, like: 'Alice' immediately, then 'Ben' after two seconds, and lastly, 'Charlie' after four seconds after the Subscription starts. And in the meantime, one second after the first Subscription starts, the second Subscription will also run this Observable's logic and will also get these emissions in the same way, like: 'Alice' immediately then 'Ben', and lastly, 'Charlie'. So in other words, these Subscriptions will execute our Observable's logic independently from each other. And as the second Subscription is made a second later, we will see a one second delay, a one second difference between the emitted values in the console.

```ts
import { Observable } from "rxjs";

const observable$ = new Observable<string>((subscriber) => {
  console.log("Observable executed");
  subscriber.next("Alice");
  setTimeout(() => subscriber.next("Ben"), 2000);
  setTimeout(() => subscriber.next("Charlie"), 4000);
});

console.log("Subscription 1 starts");
const subscription = observable$.subscribe((value) =>
  console.log("Subscription 1: ", value)
);

setTimeout(() => {
  console.log("Subscription 2 starts");
  const subscription = observable$.subscribe((value) =>
    console.log("Subscription 2:", value)
  );
}, 1000);

// Subscription 1 starts
// Observable executed
// Subscription 1:
// Alice
// Subscription 2 starts
// Observable executed
// Subscription 2:
// Alice
// Subscription 1:
// Ben
// Subscription 2:
// Ben
// Subscription 1:
// Charlie
// Subscription 2:
// Charlie
```

So, as you can see, `subscribing is just like calling the function inside of the Observable`. And in other words, each time we call the subscribe method on the Observable, the function embedded inside of the Observable is run. So each Subscription is a separate independent Observable's execution.

## Summary

- We need to subscribe to an Observable to run its logic
- When we subscribe a few times to the same Observable, the logic of the observable will be run independently for each new Subscription.
- Each time we subscribe to an observable, the provided observer is wrapped into a subscriber object and passed to the Observable's logic and the logic will be executed.
- When we have an Observable which never ends and keeps emitting the values, we can unsubscribe.
