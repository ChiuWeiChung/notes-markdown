## Types of observable

Let's now talk about the types of the Observables, depending on the source of emissions. So far, we had Observables which generated some notifications every time we subscribed to them. For example, we've implemented a few Observables which always returned to the same set of values. And we also saw an Observable which started a new interval and then produced the values based on the interval triggers. In these cases, for each new Subscription, the Observable produced a new set of values. The Observables which work this way are described as Cold Observables.

And on the other hand, we can have Hot Observables, where the Observable's logic connects to some common, shared source, for example, a DOM event like a click on a button. So if we would have multiple Subscriptions to the same Observable, each active Subscription would receive the same values at the same time.

## Cold Observable

First, let's start with the Observable, which we've done quite a few of - the Cold Observable. We had an Observable which when we subscribed, produced and emitted values, sometimes immediately, sometimes with a time delay. We have even created an Observable which used intervals. All those Observables produced the values independently for each Subscription. So, let's have a look at an example of a Cold Observable, which would produce and emit three values spread in time, for each new Subscription.

### Illustrator of Cold Observable #1

Let's say we subscribe to such Observable at this point of time and the code inside of the Observable is run, so it starts producing the values for this Subscription. And produces the first value after some time. Then, we create another Subscription to the same Observable at this point of time, and the Observable's logic is run again, this time for our second Subscription. And if the time would go on, we would see the values as they are produced independently for each Subscription.

```console

Subscription 1
|------A-------B--------C----------->Time Line

      Subscription 2
      |------A-------B--------C----------->Time Line


```

This is exactly how the Observables we've created so far looked like. `All values were produced independently for each Subscription`, and this is what describes them as `Cold Observables`.

### Illustrator of Cold Observable #2

The Cold Observables don't always need to emit the exact same values at the same points of time, after subscribing. In this example, we'll see a Cold Observable which will produce different results for each Subscription. Let's imagine an Observable, which would call an HTTP endpoint each time we subscribe. It would still be a Cold Observable as each Subscription would produce a separate HTTP request. Now, let's say we create three Subscriptions to such Observable at the same time. This means that each Subscription will run the Observable's logic independently. So, there will be a separate request made for each one of them. The Observable's logic will wait for the HTTP response and then emit it as a next notification and complete. So, let's wait for some request to finish. And as we know, the servers sometimes respond very quickly, sometimes slowly, and there might also be some timeout or other failure. So, let's say the first to receive the response is the second Subscription. A value with the response is emitted. And the Observable also emits a complete notification, ending the Subscription as it has nothing more to do. Then, after some more time, the first call gets the response, so the Observer for the first Subscription would receive the response and the complete notification. And lastly, let's say the third response timed out or there was some server error, which means that for the third Subscription, the Observable's code will emit an error with the error details as the payload.

```console

Subscription 1

            |
|-----------A------------->Time Line
            |

Subscription 2

     |
|----B-------------------->Time Line
     |

Subscription 3

|----------------------X-->Time Line


```

So as you can see, a Cold Observable can also emit different values for each Subscription. The important thing to remember here is that we can say that the Observable is Cold when it produces the source of the data inside of the Observable's logic. Like in this example, the Observable produced a separate, independent HTTP call for each Subscription.

## Code Example

And inside of the response, we can see the same object we just saw with some random names in it. So this endpoint responds with random names each time we call it. So I'd like to show you what would happen if we would subscribe to this Observable multiple times. So, each Subscription should make a separate HTTP call. We should have three HTTP requests made, one by each Subscription. And each Subscription should receive a random value. And we can see that each of our Subscriptions received a different response, which means that the Observable created with the 'ajax' function is an example of a Cold Observable as it produced a new source of emissions, namely a new HTTP request for each Subscription.

> ajax function will create an Observable which will send an HTTP request to the endpoint provided as an argument

```ts
import { ajax } from "rxjs/ajax";

const ajax$ = ajax<{ first_name: string }>(
  "https://random-data-api.com/api/name/random_name"
);

ajax$.subscribe((data) => console.log("Sub 1:", data.response.first_name));
ajax$.subscribe((data) => console.log("Sub 2:", data.response.first_name));
ajax$.subscribe((data) => console.log("Sub 3:", data.response.first_name));
```

## Hot Observable

Subscriptions. With Hot Observables, all Subscriptions share the same source. This is done by writing the Observable's logic in a way that it just connects to some existing source. For example, we all know the DOM events, which are emitted when we click on a button, resize the window and so on. We could create an Observable which would call 'addEventListener' when we subscribe and each time an event would be emitted, our Observable would just emit a next notification with that event.

### Illustrator of Hot Observable

每次的 subscribe 都會將元素註冊一個事件監聽器。

Let's now say we have an Observable, which when we subscribe, connects to this DOM event and each time a click event comes, its value is emitted as a next notification. As soon as we subscribe to this Observable, it will connect to the DOM event. So if we'd click on the button now, our Subscription will be notified about this. And if the user would click once again, it will happen again. Now, this is the most important part of the Observable being Hot. `If we would create another Subscription to this Observable, this Subscription will also run this Observable's logic, making another connection to the same DOM event`. This means that if we would click on our button once more, all Subscriptions will be notified about this fact at the same time. That is what makes the Observable to be described as Hot. So the `source is already working outside of the Observable`, so `every new Subscription will just be another connection to the same source`. And in our case, the actual source of emissions is placed outside of the Observable's logic. It's the DOM event for the already existing button. Inside of the Observable's logic we just connect to this DOM event. So, `each new Subscription is adding a new listener to this DOM event`.

```console

Click Subscription 1
|---A-------B--------C-------D---->Time Line

      Click Subscription 2
      |-----B--------C-------D--->Time Line

                      Click Subscription 3
                      |------D--->Time Line

```

### Code Example

We can see that each time I click the button, the same exact click is passed to all Subscriptions. We can say that it's multicasted. So let's summarize what happens here. When we subscribe for the first time, the code inside of the Observable is run for the first Subscription. This means that a new click event listener is added to our hello button and each event will be emitted as the next notification to the Observer provided for the first Subscription. Then, the second subscribe method run over here. And once again, the Observable's logic is run, this time for the second Subscription. And once again, a click event listener is added and the events will be emitted to the Observer provided for the second Subscription. So even though the code inside of the Observable is run independently for each Subscription, they receive the same values at the same time, because the actual source of the emissions is the globally available button's click event.
This is what makes us call this Observable hot. So a Hot Observable is the one which has the actual source of the emissions placed outside of it. And the Observable's logic just adds another connection to this source.

```ts
import { Observable } from "rxjs";

const helloButton = document.querySelector("button#hello");

const helloClick$ = new Observable<MouseEvent>((subscriber) => {
  helloButton.addEventListener("click", (event: MouseEvent) => {
    subscriber.next(event);
  });
});

helloClick$.subscribe((value) =>
  console.log("Sub 1:", value.type, value.x, value.y)
);

setTimeout(() => {
  console.log("Subscription 2 starts");
  helloClick$.subscribe((value) =>
    console.log("Sub 2:", value.type, value.x, value.y)
  );
}, 5000);
```

## Cold vs Hot

|               Cold Observable               |              Hot Observable              |
| :-----------------------------------------: | :--------------------------------------: |
|          Produces the data inside           | Multicasts the data from a common source |
|          New subscriber - new data          |      All subscribers - common data       |
| Set of values, HTTP Request, Timer/Interval |       Dom Events、State、Subjects         |

We can say that the Observable is Cold when the data is produced inside of the Observable, so each new Subscription generates the data independently from other Subscriptions. The Observable is described as Hot when the data comes from some common source, so the Observable multicast the data to all of the active Subscriptions. 

For example, a Cold Observable will generate the data inside. It might even cause some HTTP call to happen every time we subscribe. And subscribing to a Hot Observable very often doesn't cause any major logic to run. It just adds another Observer to watch the already existing source.

Now, let's see some examples of each type. First, let's have a look at a few examples of the Cold Observables. A Cold Observable might be an Observable which returns a set of values. So each time we would subscribe, we would receive the same set of notifications. Another example of a Cold Observable is making an HTTP request for each new Subscription. We also saw Cold Observables, which used 'setTimeout' or 'setInterval' inside to generate a time delay when emitting the values. As timeouts and intervals were generated inside of the Observable, it means that this was done separately for each Subscription, which is the way the Cold Observables work.

Now, let's have a look at a few Hot examples. the DOM events. If the Observable would just add a listener to an existing event source, like a button's click event, we would describe this Observable as Hot. Another example might be an Observable with the state of the app when using redux style libraries combined with the reactive approach. Subjects, which are a part of the RxJS library. They can be used to multicast notifications. A Subject is an Observable and Observer at the same time. We can subscribe to it multiple times in various parts of our app, and then, call the 'next' method on it from any place to multicast some value to all the active Subscriptions.

There might also be some more complex Observables which behave as Hot and Cold at the same time. For example, such Observable might emit some values specific to each new Subscription, which is Cold behavior, and then go on with multicasting, some other source, which is Hot behavior. There might also be an Observable, which at first is Cold and then becomes Hot. An example might be an Observable, which counts the active Subscriptions. So for the first Subscription, it might initialize a connection to the database, which is Cold behavior, and the following Subscriptions will reuse the same connection, which is Hot behavior.

## Summary

- Cold Observables create a source of emissions each time we subscribe to them.
- Hot Observables use an already existing source and multicast the data to each active Subscription.
