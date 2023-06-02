
Let's start with a regular Subscription scenario where we don't use any Pipeable Operators, just as we did so far. So, we have some source Observable to which we can subscribe and the logic inside of this Observable will be able to emit various notifications which will reach our Observer. Just as we did so far. 


```console
    ┌──────────────┐
    │  Observable  │
    └──────────────┘
           ↓ subscribe                 
    ┌──────────────┐
    │   Observer   │
    └──────────────┘
    
```

Let's now say that we'd like to add a Pipeable Operator between our source Observable and Observer. Let's see how can we do this and how it works. Once again, we have some source Observable, and this time we will add a Pipeable Operator to it. So, an operator takes an Observable as input, which in this case is our source Observable above, and returns a newly made Observable. So, instead of changing the original source Observable, the operator creates a new one which is extended with the logic introduced by this operator. So, in the case we can see here, we have the source Observable to which we've applied an operator. This created a new Observable with the extended logic. Now, we can subscribe to this new Observable. So, let's now think what will happen when we subscribe to such combination of the source Observable and an operator. 


```console
    ┌──────────┐     ┌──────────┐
    │  Source  │     │  Source  │ 
    └──────────┘     └──────────┘
        ↓                 ↓
    ┌──────────┐    ┌──────────────┐
    │ Operator │ or │ Operator X N │ 
    └──────────┘    └──────────────┘
        ↓                 ↓
    ┌──────────┐     ┌──────────┐
    │ Observer │     │ Observer │
    └──────────┘     └──────────┘
```

So if we subscribe to such Observable, the operator's logic will be run first, which will underneath subscribe to the source Observable, which in effect will run its logic and start emitting notifications. Every time the source Observable emits something, this notification will first reach the operator's logic before reaching our Observer. So the operator's logic will decide whether this notification will reach our Observer or not. Also, it can change the emitted notifications in any way it wants or even produce its own emissions. In other words, each notification emitted by the source Observable is transformed by the operator, which decides what to do with that notification further.

We can also stack multiple operators together. Let's have a look. And once again, we need some source of emissions and then we can apply any number of operators to it. Each operator accepts an input Observable, which is the part above it in the pipeline, and returns an output Observable, which is used by the operators or our Subscription below in the pipeline. So, we can stack and a number of operators. As we have so many operators applied here, it is possible that the set of notifications which will reach our Observer will be completely different from those originally emitted by the source Observable. Summarizing, Pipeable Operators allow us to transform the notifications before they reach our Observer. We can apply as many operators as we want because **one operator's output can be another operator's input**. OK, let's now start with the first operator, which is the 'filter' operator.

### 舉單眼相機為例子



## Pipleable Operators #1 - filter

If a value gets emitted by the source, this operator will either pass it through to the output or not, based on the condition we provide to it.


```console

                              
──────A1──────B1──────A2──────B2───╂───>Time Line
       ↓      ↓       ↓       ↓  
  ┌───────────────────────────────────┐
  │          filter operator          │ filter B type 
  └───────────────────────────────────┘       
              ↓               ↓        
──────────────B1──────────────B2───╂───>Time Line
                     
```

```ts
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

interface NewsItem {
  category: 'Business' | 'Sports';
  content: string;
}

const newsFeed$ = new Observable<NewsItem>((subscriber) => {
  setTimeout(() => {
    subscriber.next({ category: 'Business', content: 'A' });
  }, 1000);
  setTimeout(() => {
    subscriber.next({ category: 'Sports', content: 'B' });
  }, 3000);
  setTimeout(() => {
    subscriber.next({ category: 'Business', content: 'C' });
  }, 4000);
  setTimeout(() => {
    subscriber.next({ category: 'Sports', content: 'D' });
  }, 6000);
  setTimeout(() => {
    subscriber.next({ category: 'Business', content: 'E' });
  }, 7000);
});

newsFeed$
  .pipe(filter((item) => item.category === 'Sports'))
  .subscribe((value) => console.log(value));

//   {category: "Sports", content: "B"}
//   {category: "Sports", content: "D"}

```


## Pipleable Operators #2 - filter

Now, let's have a look at another operator, which is a counterpart of the one available in JavaScript arrays. Namely, the 'map' operator. So, for each emitted value, the 'map' operator can provide a new value. The new value can be calculated based on the value emitted by the source or just a new unrelated value. As it was with the 'filter' operator, the 'map' operator also isn't interested in the error and complete notifications, which are also reemitted to the output in an unchanged form.


```console
                           
──────1──────3──────5──────7───╂───>Time Line
      ↓      ↓      ↓      ↓    
┌───────────────────────────────────┐
│          map( e => e*2 )          │
└───────────────────────────────────┘     
      ↓      ↓      ↓      ↓  
──────2──────6──────10─────14──╂───>Time Line
                           
                                    
                     
```

```ts

import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

const apiURL = 'https://random-data-api.com/api';

const randomName$ = ajax<any>(`${apiURL}/name/random_name`).pipe(
  map(({ response }) => response.first_name)
);

const randomNation$ = ajax<any>(`${apiURL}/nation/random_nation`).pipe(
  map(({ response }) => response.capital)
);

const randomFood$ = ajax<any>(`${apiURL}/food/random_food`).pipe(
  map(({ response }) => response.dish)
);

forkJoin([randomName$, randomNation$, randomFood$]).subscribe(
  ([firstName, capital, dish]) =>
    console.log(`${firstName} is from ${capital} and likes to eat ${dish}.`)
);


```

## Pipleable Operators #3 - tap

The 'tap' operator works like a spy and allows us to cause some side effects without interacting with the notifications. It is useful if we have multiple operators stacked and we would like to be able to observe the notifications at any stage of this operator's pipeline to, for example, console log something to have feedback what's happening there. As I've said, it doesn't influence the notifications in any way. So, all notifications will be reemitted to the output in an unchanged form. It will just allow us to run some side effects for each notification.

```ts
import { of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

of(3, 9, 4, 11, 2)
  .pipe(
    tap((value) => console.log('Tap', value)),
    filter((value) => value > 5),
    map((value) => value * 2),
  )
  .subscribe((value) => console.log('Result', value));

// Tap 3
// Tap 9
// Result 18
// Tap 4
// Tap 11
// Result 22
// Tap 2

```

### 調換 tap operator 的順序


```ts
import { of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

of(3, 9, 4, 11, 2)
  .pipe(
    filter((value) => value > 5),
    tap((value) => console.log('Tap', value)),
    map((value) => value * 2),
  )
  .subscribe((value) => console.log('Result', value));

// Tap 9
// Result 18
// Tap 11
// Result 22

```

As a side note, the argument which you provide to the 'tap' operator over here, works the same way as the one which you pass to the subscribe method, so you can use that full Observer object. And also provide side effects for complete or error notifications if you want. OK. So, another important thing to remember is that using 'tap' won't execute the Observable. Even if you place it at the end, like so. It will just add a side effect. You still need to subscribe at the end to make everything work. So if I would remove this subscribe call and save. You can see that nothing is happening. So in this coding part, we've learned how can we use the 'tap' operator to debug and see what happens at each stage of the operators pipeline.

> [Medium: Information is King — tap() — how to console.log in RxJS!](https://medium.com/@jaywoz/information-is-king-tap-how-to-console-log-in-rxjs-7fc09db0ad5a)


## Pipleable Operators #4 - debounceTime


 The 'debounceTime' operator introduces the time dimension. It is about debouncing the incoming values. So if we would provide two seconds as the debounce time and our source Observable would emit quickly three values. The 'debounceTime' operator would wait for the emissions to settle down, and after two seconds of no new emissions, it would reemit just the latest value. **This is useful to avoid putting excessive pressure on some recalculation logic to avoid performance issues or, for example, to reduce the frequency of HTTP requests sent to the server**. 


OK, let's have some notifications coming. Let's say the source Observable emits a value 'A' after one second. It will first reach the logic of the 'debounceTime' operator, which will wait for two seconds in case a new value comes. As no values were emitted during this time by the source Observable, the 'debounceTime' operator will reemit this value of further. Moving on, let's say a value 'B' was emitted at the four second mark, so it will reach the debounceTime logic, which will wait for two seconds before reemitting it. However, as a new value came a second later, the value 'B' gets forgotten. And the counting starts over for the new value 'C'. And if nothing would be emitted for the following two seconds, the value 'C' would be reemited to the output.

```console

───1───────────5───7───────────>Time Line
   1s  2s  3s  4s  5s  6s  7s
   ↓           ↓   ↓
┌──────────────────────────────┐
│   debounceTime(2000)         │
└──────────────────────────────┘    
   └───────┐       └───────┐
           ↓               ↓
───────────1───────────────7───>Time Line
   1s  2s  3s  4s  5s  6s  7s
                                    
```


This is useful if the logic which we would like to run for the updated value would require a lot of calculations and might cause slowdowns. So for better user interface responsiveness, we might want to debounce the emitted values by using the 'debounceTime' operator.

Another case is when we would like to store the setting of this slider on the server. Without debouncing every minor movement of the slider would trigger a new HTTP request, so in the short while, dozens of new HTTP requests might be generated.

### without debounceTime operator

```ts
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
const sliderInput = document.querySelector('input#slider');

fromEvent(sliderInput, 'input')
  .pipe(map((event) => event.target['value']))
  .subscribe((value) => console.log(value));

```
GIF 補充

```ts

import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';


const sliderInput = document.querySelector('input#slider');
fromEvent(sliderInput, 'input')
  .pipe(
    debounceTime(2000),
    map((event) => event.target['value'])
  )
  .subscribe((value) => console.log(value));



```

GIF 

## Pipleable Operators #5 - catchError


Let's now have a look at the 'catchError' operator. **It can be used to provide a fallback source in case the original source fails. So, this operator won't change the emitted values and complete notifications. It will just pass them through in an unchanged form.** This operator is interested in the error notifications only. 'catchError' allows us to provide a fallback Observable which will be used in case the original source emits an error. If that would happen the catchError's logic would not reemit that error, but subscribe to the provided fallback Observable instead. And all notifications received by this new inner Subscription will be passed to the output.


```console

──────A──────B──────╳────────>Time Line
      ↓      ↓      ↓
    ┌─────────────────────┐
    │ carchError Operator │
    └─────────────────────┘     
      ↓      ↓      ↓
                    ╂ complete notification
                    
──────A──────B──────╂───────>Time Line                          
                     
```

```ts
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const failingHttpRequest$ = new Observable((subscriber) => {
  setTimeout(() => {
    subscriber.error(new Error('Timeout'));
  }, 3000);
});

failingHttpRequest$
  .pipe(catchError((error) => of(error.message)))
  .subscribe({
    next:(value) => console.log('result: ', value),
    complete:()=>console.log('complete'),
  });

// result: Timeout
// complete
```


OK, so now we know how to provide some fallback Observable in case an error happens. And sometimes we don't want to provide any fallback value if something fails, but, instead, we would like to just catch the error and not show anything. How can we do this? Let's have a look at another interesting Observable provided by RxJS. Before having a look at another popular use of 'catchError', let's introduce a built-in Observable provided by RxJS. It's called 'EMPTY' and this Observable is empty, as it says. So once you subscribe to it, it doesn't emit any values. It will immediately complete instead.

```ts
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

const failingHttpRequest$ = new Observable((subscriber) => {
  setTimeout(() => {
    subscriber.error(new Error('Timeout'));
  }, 3000);
});

failingHttpRequest$.pipe(catchError((error) => EMPTY)).subscribe({
  next: (value) => console.log('result', value),
  complete: () => console.log('complete'),
});

// complete
```