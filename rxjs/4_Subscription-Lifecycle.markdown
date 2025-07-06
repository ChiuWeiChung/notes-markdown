## Subscription Lifecycle

This single graphic that you can see on the screen right now addresses all key elements that are important to know about the Subscription's lifecycle.

```console
            .subscribe()
                 ↓
    Subscription (Observable execution)
      ↑      ↓            ↓         ↓
      |     next        error    complete
      |      |            |         |
      |      ↓            ↓         ↓
    Observer: next     Observer  Observer
           |           (error)   (complete)
           ↓               ⬊        ⬋
    .unsubscribe()──>       Teardown
```

```mermaid
graph TD
    Sub["subscribe"] --> Exec["Subscription <br/> (Observable execution)"]

    Exec -->|error| E["error"] --> ObsE["Observer <br/>(error)"] --> Tear1["Teardown"]
    Exec -->|next| N["next"] --> ObsN["Observer <br/>(next)"]
    Exec -->|complete| C["complete"] --> ObsC["Observer <br/>(complete)"] --> Tear1["Teardown"]

    ObsN --> Unsub["unsubscribe"] --> Tear1["Teardown"]
```

Let's now go through the whole Subscription's lifecycle. At first we have some Observable which, as we know, doesn't do anything by itself. It just has some logic stored inside. Sometimes this logic can be very simple.

For example, it can emit a few static values after we subscribe and complete. On the other hand, we can have much more complicated Observables. In those, the values might come from some external server, for example. Regardless of what the source is and what happens inside of the Observable, the interface and the set of notifications that can be emitted by the Observable is the same for all of them.

OK, so we have our Observable let's subscribe to it. This executes the code inside of the Observable. At this point, a new Subscription has been created and the code inside of the Observable is running for our new Subscription. As we know, the Observable can emit notifications. The first and probably the most important one is the next notification used to emit values. Each time a new value, a new next notification is emitted by the Observable, it is passed to the Observer's handler for the next notifications. And after the next notification gets handled, the Observable's code will continue and will be able to further emit values.

This might be stopped by emitting the error or complete notification. When an error is emitted, the error handler for the provided Observer will be called and accordingly, if the complete notification would be emitted, our Observer's complete handler would be called. In these cases, namely, after emitting a complete or error notification, the Observable won't be able to emit any more values. Instead, the Subscription will get closed. And the `Teardown logic provided by the Observable will be run`. In this optional Teardown logic, the Observable can clean up after itself.

For example, it can release the resources it was using, cancel timers or intervals, or even close a connection to the server if that was the source of the Observable. The complete or error notifications are a way of saying that the Observable has no more items to emit or there was some error and the Observable won't be able to emit values anymore. There might be some Observables which never complete or error, like an infinite interval counter. We need to unsubscribe to stop the counting. So the third way to finish a Subscription, is to use the unsubscribe method on it. As you can see, there are three ways in which the Subscription can end.

One is in our hands - `unsubscribing`, and two are in the hands of the Observable's logic, which can `error` or `complete`. Regardless of the way the subscription ends, the Teardown logic will always be run. Of course, if it was provided by the Observable.

## TeardownLogic

This interface describes what should be returned by function passed to Observable constructor or static create function. Value of that interface will be used to cancel subscription for given Observable.

When I was talking about the Subscription's lifecycle, I've mentioned that when the Subscription ends, the Teardown logic is run, which allows the Observable to clean up after itself. So, let's add a console log to the Teardown logic so we can see when it's executed. Where can we put this logic? Inside of the callback that we provide to our Observable. `We can return a function and this function will be run during the Teardown phase of the Subscription`.

```ts
import { Observable } from "rxjs";

const observable$ = new Observable((subscriber) => {
  console.log("Observable executed");
  subscriber.next("Alice");
  subscriber.next("Ben");
  setTimeout(() => {
    subscriber.next("Charlie");
    subscriber.complete();
  }, 2000);

  //   Teardown Logic
  return () => {
    console.log("Teardown");
  };
});

console.log("Before subscribe");
observable$.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("complete!!"),
});
console.log("After subscribe");
```

We can see that after the Observable emitted the complete notification, which caused our Subscription to end, the Teardown logic was run. And the Teardown logic can be used by the Observable to clean up after itself to prevent memory leaks or to provide cancellation logic, for example. If we would have an Observable which would call the server using an HTTP request, we could abort that HTTP request in the Teardown logic. So if the user would unsubscribe before the request finishes, the HTTP call would be aborted. So the Teardown logic is the place to provide the behavior for the clean up and cancellation. This is an important advantage of the Observables. They provide a way to cancel ongoing processes that were initialized by the Observable.

## Example

```ts
import { Observable } from "rxjs";

const interval$ = new Observable((subscriber) => {
  let count = 1;
  const intervalId = setInterval(() => {
    console.log("emitted", count);
    subscriber.next(count++);
  }, 1000);
});

const observer = interval$.subscribe((value) => console.log(value));

setTimeout(() => {
  console.log("unsubscribe");
  observer.unsubscribe();
}, 3000);

// emitted 1
// 1
// emitted  2
// 2
// emitted  3
// 3
// unsubscribe
// emitted  4
// emitted  5
// emitted  6
// emitted  7
// .....
```

Now we can see something strange. We've unsubscribed, but the code inside of the Observable is still running. That's because we didn't clean up after ourselves properly. This is what the Teardown logic is for. So let's implement the Teardown logic, in which we'll clear the interval, so we don't have any side effects or we don't have any code running like this after the Subscription ends. To do so, we can return a function over here, at the end of our Observable logic.

```ts
import { Observable } from "rxjs";

const interval$ = new Observable((subscriber) => {
  let count = 1;
  const intervalId = setInterval(() => {
    console.log("emitted", count);
    subscriber.next(count++);
  }, 1000);

  // add teardown logic
  return () => clearInterval(intervalId);
});

const observer = interval$.subscribe((value) => console.log(value));

setTimeout(() => {
  console.log("unsubscribe");
  observer.unsubscribe();
}, 3000);
```

## Summary

- unsubscribing and error/complete notification are the ways to end the subscription.
- The purpose of the Teardown logic is to perform a clean-up or cancellation if the observable initialized some resources.
- The Teardown logic inside the observable will be executed whenever the subscription ends.
