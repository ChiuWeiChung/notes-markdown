
## Creation Functions_2

## Creation Function #6 - forkJoin
source, as the input. You can pass an array of Observables to it. Once you subscribe to it, underneath, it will create Subscriptions to all provided input Observables. Then, it will wait for all these Observables to complete. And once this happens, it will emit a set of the latest values from all of them. This can be useful if you'd like to call multiple HTTP endpoints at the same time and wait for all of them to respond before taking further action.


```console

A         
|───A─────╂─>Time Line
          

B                 
|──────2──────────╂─>Time Line
                  

forkJoin([A,B])   
|─────[A,2]───────╂─>Time Line
                  

```

### Without forkJoin

```ts
import { ajax } from "rxjs/ajax";

const randomName$ = ajax("https://random-data-api.com/api/name/random_name");
const randomNation$ = ajax("https://random-data-api.com/api/nation/random_nation");
const randomFood$ = ajax("https://random-data-api.com/api/food/random_food");

randomName$.subscribe((value) => console.log(value.response.first_name);
randomNation$.subscribe((value) => console.log(value.response.capital);
randomFood$.subscribe((value) => console.log(value.response.dish);

```

### With forkJoin

```ts
import { forkJoin } from "rxjs";
import { ajax } from "rxjs/ajax";

const randomName$ = ajax("https://random-data-api.com/api/name/random_name");
const randomNation$ = ajax("https://random-data-api.com/api/nation/random_nation");
const randomFood$ = ajax("https://random-data-api.com/api/food/random_food");

forkJoin([randomName$, randomNation$, randomFood$]).subscribe({
  next: ([nameAjax, nationAjax, foodAjax]) => {
    console.log(`
    ${nameAjax.response.first_name},
    ${nationAjax.response.capital},
    ${foodAjax.response.dish}
    `);
  }
});

```

We've seen how would the 'forkJoin' work with the Observables using HTTP requests. Let's now have a look at a scenario in which the input Observables would have a more complicated course of the Subscriptions. Let's have a look at the diagram. As previously, we have two Observables A and B. And we've also created a new Observable using the 'forkJoin' function and subscribed to it. And the forkJoin's logic subscribed to the provided input Observables A and B, as previously. Now let's have a few notifications emitted for each Subscription and see what would be emitted by the forkJoin's logic. First, let's say the Observable A emits something. Nothing will be emitted at this point by forkJoin as we still have two inner Subscriptions running. The 'forkJoin' will just remember 'A' as the latest value emitted by the first Observable. Then let's say the Observable B emits the value '1'. Again, nothing completed so far, so the forkJoin's logic will just store it as the latest value emitted by the second Observable. And it would keep on going like this. And at this point, the second Subscription has been completed as the Observable B emitted a complete notification. At this moment, the forkJoin's logic still won't emit anything as it still has one more active Subscription which hadn't completed. Now let's say the first Observable emits one more value. It will just update the latest known value for this input Observable in the forkJoin's logic memory. And finally, if the first Observable would complete, the forkJoin's logic can emit something. At this point, it will emit the last values emitted by the source Observables and complete. As we can see 'forkJoin' waits for all of the input Observables to complete before emitting anything. Prior to that, it just keeps updating the latest known values for each inner Subscription in its memory, without emitting anything.


```console

A                   ┃
|─A─B───────────────C───>Time Line
                    ┃

B            
|──1──2──────╂─────────->Time Line
             

forkJoin([A,B])      ┃
|──────────────────[C,2]->Time Line
                     ┃

```

### Error Scenario

Let's go back to our example with HTTP requests. Let's say our request A responded first, and the request B failed and emitted an error. Due to this error, it's no longer possible to have both Subscriptions completed. So at this point, 'forkJoin' would emit this error as well. And as we know, emitting an error is a final thing which ends the Subscription to our 'forkJoin' Observable.

```console

A         
|──────A─────╂─>Time Line
          

B                 
|──────╳───────>Time Line
                  

forkJoin([A,B])   
|──────╳──────->Time Line
                  
```

```ts
import { forkJoin, Observable } from "rxjs";

const a$ = new Observable((subscriber) => {
  setTimeout(() => {
    subscriber.next("a");
    subscriber.complete();
  }, 3000);
});

const b$ = new Observable((subscriber) => {
  setTimeout(() => {
    subscriber.error("yoyoyo");
  }, 1000);
});

forkJoin([a$, b$]).subscribe({
  next: (value) => console.log(value),
  error: (err) => console.log(err)
});

// yoyoyo

```

## Creation Function #7 - combineLatest

The Observable created using the 'combineLatest' creation function follows a similar pattern as the 'forkJoin' function, but emits the values more often. In other words, 'combineLatest' also accepts an array of input Observables, to which it subscribes underneath, but contrary to 'forkJoin', the combineLatest's logic will emit a new set of values each time any of the input Observables emits something new.

Let's see this in the diagram. Once again, we have some Observables A and B. And of course, there might be more of them if needed, in this example let's keep it simple and use two input Observables. OK. So, let's now create an Observable using the 'combineLatest' function and provide A and B as the input Observables. So, now we can subscribe to our 'combineLatest' Observable, which inside subscribes to the Observables A and B. Let's now see how the combineLatest's logic will react to the notifications emitted by the Observable A and B. So, the first one to emit a value is the Observable A. Important thing to notice here is that the combineLatest's logic won't emit anything at this point as it still needs a value from the remaining source, which is the Observable B. So, 'combine Latest' needs at least one value from each source to start emitting. Let's say that the Observable B emits a value '1'. And, at this point, each of the sources emitted at least one value, so the combineLatest's logic will now be able to emit an array of the latest known values from every source. And as the values would keep on getting emitted, the combineLatest's logic will keep on emitting the latest known array of values. Now, if the Observable B would complete, nothing special would happen as the Observable A can still emit a value, causing the emission of the updated array of the latest values. And if the last input Observable would complete, the combineLatest's logic would also emit a complete notification, as it's now not possible to emit any more values as all of the sources have completed.

```console

A                                           
|────A──────────B────────────C───╂──>Time Line
                                            

B                            
|────────1────────────2─╂───────────>Time Line
                             

combineLatest([A,B])
                                            
|──────[A,1]──[B,1]─[B,2]──[C,2]─╂──>Time Line
                                            

```

```ts
import { combineLatest, fromEvent } from "rxjs";

const temperatureInput = document.getElementById('temperature-input');
const conversionDropdown = document.getElementById('conversion-dropdown');
const resultText = document.getElementById('result-text');

const temperatureInputEvent$ = fromEvent(temperatureInput, 'input');
const conversionInputEvent$ = fromEvent(conversionDropdown, 'input');

combineLatest([temperatureInputEvent$, conversionInputEvent$]).subscribe(
  ([temperatureInputEvent, conversionInputEvent]) => {
    const temperature = Number(temperatureInputEvent.target['value']);
    const conversion = conversionInputEvent.target['value'];

    let result: number;
    if (conversion === 'f-to-c') {
      result = (temperature - 32) * 5/9;
    } else if (conversion === 'c-to-f') {
      result = temperature * 9/5 + 32;
    }

    resultText.innerText = String(result);
  }
);

```



### Error Scenario

To have a full picture of the 'combineLatest' Observable, let's see what would happen if an error would be emitted by one of the input Observables. As previously, as long as the source Observables keep emitting values, the combination of the latest ones will be emitted as an array by the 'combineLatest' Observable. Now, let's say that the Observable B emitted an error at this point. An error is a sign of something malfunctioning, so 'combineLatest' passes this error through. At this point, the further notifications emitted by the Observable A would make no difference, as the 'combineLatest' has errored. So, the Subscription to the Observable A will be closed by the combineLatest's Teardown logic.


```console

A                                           
|─A───────────B────────────────────>Time Line
                                        

B                            
|───────1────────────2─────╳──────>Time Line
                             

combineLatest([A,B])
                                            
|─────[A,1]──[B,1]─[B,2]───╳──────>Time Line
                                            

```

## Summary
1. The Creation Functions allow us to avoid using the 'new Observable' constructor and providing the whole logic every time we'd like to create a new one.
2. The most important feature of 'combineLatest' is that it emits an array with the latest values from all input Observables each time any of them emits something new.
