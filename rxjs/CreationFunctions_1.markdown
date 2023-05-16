# Creation Functions_1

## Creation Function #1 - of

Let's start with the 'of' creation function. The 'of' function allows us to create an Observable, which emits a set of values and completes. So, when we subscribe to such Observable, all values that we have provided as arguments will be emitted immediately as next notifications, and then, the Observable will complete, ending the Subscription.


```ts
import { Observable, of } from "rxjs";

of('One','Two','Three').subscribe(value=>console.log(value))
// One
// Two
// Three
```

### the way the Observable created using the 'of' function works.

```ts
// The idea in "of" Creation Function
function ourOwnOf(...args: string[]): Observable<string>  {
  return new Observable((subscriber) => {
    args.forEach((arg) => subscriber.next(arg));
    subscriber.complete();
  });
};

ourOwnOf("Alice", "Ben", "Charlie").subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("completed")
});

```

## Creation Function #2 - from

Now we will cover the 'from' creation function. It is used to convert other types into an Observable. For example, it can convert an array into an Observable. It works the same way as the 'of' creation function, however, in the case of 'from', you provide an array with the values instead of providing multiple arguments. **Another popular usage of 'from' is to create an Observable from Promise**. Once we subscribe to such Observable, the Promise's resolve value will be emitted as a next notification and then it will complete. If the Promise gets rejected, the Observable will emit an error notification. 'from' can also create Observables from other sources, like iterables (generator functions) and other Observable-like objects.

```ts
import { from } from "rxjs";

from(["One", "Two", "Three"]).subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("complete")
});

//One
//Two
//Thre
//Complete
```

Now, let's move on to the second part of this coding section. We'll convert a Promise into an Observable. why would we even want to do something like this? It is useful when we already have some code or API exposed as a Promise and we'd like to use this Promise in the Observable world **to be able to use all of the tools provided by RxJS as a part of more complex asynchronous code or to combine it with other Observables**.

```ts
import { from } from "rxjs";

const somePromise = new Promise((resolve, reject) => {
  resolve("hihi");
//   reject("reject!!");
});

const observableFromPromise$ = from(somePromise);
observableFromPromise$.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("complete"), // fire when resolved
  error: (err) => console.log("error", err) //fire when rejected
});


```

## Creation Function #3 - fromEvent

Let's now have a look at the 'fromEvent' creation function. The 'fromEvent' function allows us to create an Observable from various event sources. It supports multiple event targets, including the DOM event targets, the Node.js event emitter and even jQuery events. This is useful to create an Observable which will emit events each time the user clicks on a button, inputs something into a form field or resizes the window, for example. Let's now consider that we create an Observable using the 'fromEvent' function, which binds to the click event on a button DOM element. And subscribing to this Observable will work similarly to using the 'add Event Listener'. And unsubscribing will work like 'removeEventListener'. Actually, underneath, RxJS will use those methods for us.




```ts
import { fromEvent } from "rxjs";

const button = document.querySelector("button");
const clickSubscription = fromEvent(button,'click').subscribe(value=>console.log(value));

// 五秒後取消 clickSubscription 的訂閱
setTimeout(()=>{
    console.log('unsubscribe')
    clickSubscription.unsubscribe();
},5000)
```

### the way the Observable created using the 'fromEvent' function works.

And as five seconds have passed now, let's click on our button a few more times. We can see that the event handler, the event callback, is still executed every time we click. And that's because our Observable doesn't remove the event listener properly and leaves a memory leak after unsubscribing.

```ts
import { Observable } from "rxjs";


const triggerClick$ = new Observable<MouseEvent>((subscriber) => {
  const button = document.querySelector("button");
  button.addEventListener("click", (event) => {
    console.log('event callback executed');
    subscriber.next(event);
  });
});

const subscription = triggerClick$.subscribe((value) => console.log(value));

// 五秒後取消 clickSubscription 的訂閱
setTimeout(() => {
  console.log("unsubscribe");
  subscription.unsubscribe();
}, 5000);

// 五秒後，再次點擊 button ， 仍然會觸發 event callback，因為在 Observable 之中的 Event Listener 並沒有沒取消，因而造成 memory leakage。
```
### 解決 memory leakage

```ts
import { Observable } from "rxjs";


const triggerClick$ = new Observable<MouseEvent>((subscriber) => {
  const button = document.querySelector("button");
  const clickHandler = (event) => {
    console.log("Event callback executed");
    subscriber.next(event);
  };
  button.addEventListener("click", clickHandler);

  // 在被 unsubscribe 之後移除 Event Listener
  return () => button.removeEventListener("click", clickHandler);
});

const subscription = triggerClick$.subscribe((value) => console.log(value));

setTimeout(() => {
  console.log("unsubscribe");
  subscription.unsubscribe();
}, 5000);

```



## Creation Function #4 - timer

The 'timer' creation function allows us to create an Observable which will wait some time, emit a value and complete. We can compare it to the well known 'setTimeout' function. This Observable produces a new timer for each new Subscription, so let's subscribe to it. Our new timer starts counting and after the provided time, in our case, two thousand milliseconds,
which is two seconds, a next notification will be emitted with the value '0'. I'll explain what the '0' is about soon. Also, a complete notification is emitted which ends the Subscription as the timer has completed its objective. Let's see how this works in the coding section. First, let's create our Observable by using the 'timer' creation function. We need to import it from RxJS. And let's specify two thousand milliseconds as the time after which our Observable will emit the value and complete.

```ts
import { timer } from "rxjs";

console.log("hi there");

timer(2000).subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("complete")
});

// hi there 
// 0
// complete 

```
As the code below, The app has started and nothing happens, and that's OK, that's because we've unsubscribed and unsubscribing actually cancelled the timer. That's the desired behavior as Observables should clean up after themselves when the Subscription ends.

```ts
import { timer } from "rxjs";

console.log("hi there");

const subscription=timer(2000).subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("complete")
});

setTimeout(()=>{
    subscription.unsubscribe()
},1000)

```


### The way the Observable created using the 'timer' function works.

```ts
import { Observable } from "rxjs";

const timer$ = new Observable((subscriber) => {
  const timeoutId = setTimeout(() => {
    console.log("timeout");
    subscriber.next(0);
    subscriber.complete();
  }, 2000);
  // teardown function is must
  return () => clearTimeout(timeoutId);
});

const subscription = timer$.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("complete")
});

setTimeout(() => {
  subscription.unsubscribe();
  console.log("unsubscribe");
}, 1000);

```


## Creation Function #5 - interval

```ts
import { interval } from "rxjs";

const subscription = interval(1000).subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("complete")
});

setTimeout(() => {
  subscription.unsubscribe();
  console.log("unsubscribe");
}, 5000);

// 0
// 1
// 2
// 3
// 4
// unsubscribe

```
### The way the Observable created using the 'interval' function works.

```ts
const interval$ = new Observable((subscriber) => {
  let count = 0;
  const intervalId = setInterval(() => {
    console.log("hi");
    subscriber.next(count++);
  }, 1000);

  return () => clearInterval(intervalId);
});

const subscription = interval$.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log("complete")
});

setTimeout(() => {
  subscription.unsubscribe();
  console.log("unsubscribe");
}, 5000);

```


## Summary
1. Creation Functions allows us to easily create new Observables without repeating a lot of code.
2. The Creation Function of "from" can be provided an array or an Observable or a Promise as an argument.
3. The Observables created using the fromEvent function are Hot. Because they connect to an already existing event source.
4. The interval function in that configuration creates an Observable which never ends. It'd keep on emitting the values forever. We need to unsubscribe to stop the emissions.





