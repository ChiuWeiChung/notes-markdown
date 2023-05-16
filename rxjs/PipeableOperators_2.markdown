# Flattening Operators

In this lesson, we'll learn about Flattening Operators. They work like 'catchError', which subscribed to the provided Observable when an error happened. The Flattening Operators do something like this but for each emitted value, each next notification. This can be useful if we want to query the server each time the user changes the input values. There are a few Flattening Operators available in RxJS: concatMap, switchMap, mergeMap and exhaustMap. They differ in the way how they handle concurrency. However, the general idea is the same. We'll focus on the 'concatMap' variant as it's the safest choice if you are not sure which one to choose. However, will also talk about 'switchMap' and 'mergeMap' at the end of this part, as they are also quite widely used. And we'll also compare the differences between them side by side. Now let's have a look at the diagram. How does a Flattening Operator react to each notification type emitted by the source Observable? 

The Flattening Operators **create new inner Subscriptions to the provided Observables generated based on the next notifications received from the source**. Then, they pass the emitted values from those inner Subscriptions to the output. In other words, the Flattening Operator will react to a next notification by creating a new inner Subscription to the provided Observable. **The great thing is that as long as the source Observable keeps emitting the values, the Flattening Operator will keep on subscribing to the provided Observable for each value**. 

## Flattening Operator #1 - concatMap

To provide an example here, the source Observable might be the search query input emitting the text value, and every time the user changes it, the Flattening Operator will send a request to the server with that query and the response will be emitted to the output. 

Let's assume that we have some source Observable to which we've applied the 'concatMap' operator. As you can see, the 'concatMap' has a 'newStream$' Observable passed to it. This means that it will subscribe to this 'newStream$' Observable in reaction to the next notification coming from the source above. But before this happens, let's start by subscribing to this combination of the source and 'concatMap' operator and this operator will underneath subscribe to the source Observable.

Let's say the source Observable emits some value. **This value will reach the concatMap's logic and it will create an inner Subscription to the provided 'newStream$' Observable**. Let's say this 'newStream$' Observable always emits value '1' after some time, then value '2' and then completes after some more time. So let's see this. The concatMap's logic will pass the values '1' and '2' to the output unchanged. Generally **Flattening Operators pass all values from the inner Subscriptions to the output**. The last notification that will be emitted by the 'newStream$' Observable will be the complete notification. **The complete notification won't be passed to the output because passing the complete notification through would end the whole Subscription, and everything would stop working after handling a single value emitted by the source.** So, the complete notifications which happen in the inner Subscriptions are not passed further. 

if we would have another value emitted by the source Observable. Let's say a value 'B' was emitted sometime later. Once again, it will reach the concatMap's logic and this logic will create a new inner Subscription to the 'newStream$' Observable. As we've said previously, this 'newStream$' Observable always emits the same notifications, so this time it will also emit values '1' and 2', which will be reemitted to the output. And once again, the complete notification won't be reemitted, so the whole Subscription can still work further, waiting for new values to be emitted by the source Observable.

So, this is what the flattening is about in the Flattening Operators name. During the course of our main/ /outer Subscription, the 'concatMap' operator has created two inner Subscriptions and all the values emitted by them were flattened to the single output we can see below.


```console                 
──────A──────────────B────────────>Time Line
      ↓              ↓       
 ┌────────────────────────────────┐
 │ concatMap(()=> newObservable$) │
 └────────────────────────────────┘     
      │              │
      └───1──2─┨     └───3──4─┨          
          ↓  ↓           ↓  ↓     
──────────1──2───────────3──4─────>Time Line              
```


```ts
import { EMPTY, fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, concatMap, tap, catchError } from 'rxjs/operators';

const endpointInput: HTMLInputElement =   document.querySelector('input#endpoint');
const fetchButton = document.querySelector('button#fetch');
const apiURL = 'https://random-data-api.com/api';

fromEvent(fetchButton, 'click')
  .pipe(
    map(() => endpointInput.value),
    concatMap((value) => ajax(`${apiURL}/${value}/random_${value}`)),
  )
  .subscribe((value) => console.log(value));
```

### About Error Handling 

Let's now have a look at what happens when the inner Observable provided to 'concatMap' operator emits an error. As a side note, the behavior presented here will be the same for all Flattening Operators, not only 'concatMap'. Let's have a look at this example. So, the source Observable emits a value which reaches the Flattening Operator. In this example, let it be the 'concatMap' operator. So, a new inner Subscription is made to the Observable created using the 'apiReq' function. And let's say that this time this inner Observable emits an error after some time. What happens now? Previously, we saw that in case of the complete notification, 'concatMap' didn't reemit it to the output. This is different for the error notifications. In this case, **the inner Observable's error will be reemitted to the output. This is important to remember as the error will also end our main/outer Subscription**, so everything will stop working. And this is exactly what we've experienced in the coding section we just saw. As a side note, the Flattening Operator will also unsubscribe from the source Observable at this point, as it's no longer relevant to keep it because nothing more will happen there. Let's now see how can we prevent this error from stopping our main Subscription?

```console                 
──────A──────────────────────────>Time Line
      ↓                
 ┌─────────────────────────────────┐
 │ concatMap((val)=> apiReq$(val)) │
 └─────────────────────────────────┘     
      │              
      └──────────────╳     
                     ↓        
─────────────────────╳──────────>Time Line              
```

Let's now have a look at how could we change things to hide the error and keep the main, the outer Subscription working further. So, even after an error gets emitted by the inner Observable, the main/outer Subscription wouldn't stop and would be able to handle further notifications emitted by the source Observable. 

Let's start with having the source Observable emit value 'A'. This value will reach the 'concatMap' operator, which will generate a new Observable using the 'apiReq$' function and subscribe to it. As there was some issue during this Subscription, an error was emitted. **We'd like to somehow convert this error into a complete notification so the inner Subscription ends without passing anything to the outer Subscription and causing it to end**. As we've said previously, if the concatMap's inner Observable would emit a complete notification, it wouldn't be passed to the output by concatMap's logic. So, if we would **add the same 'catchError' operator to the inner Observable, we would convert this error to a complete notification at the level of the inner Subscription,** so the 'concatMap' will see that the inner Subscription completed instead of emitting an error. By doing so, the main Subscription won't receive any error or complete notifications, 

If the source Observable would emit a value 'B', the 'concatMap' would generate another Observable using the 'apiReq$' function and create a new inner Subscription once again. Let's say that this time it emits a value '5' and completes. As there were no errors, the 'catchError' operator nested here at this level will just reemit this next and complete notification furter. Now, these notifications will reach the concatMap's logic and the value '5' will be reemitted, or we can say flattened to the output, and this, of course, won't happen for the complete notification as, by design, the Flattening Operators don't pass complete notifications coming from inner Subscriptions.


```console                 
─────A──────────────────────────B────────────────────>Time Line
     ↓                          ↓                                 
 ┌─────────────────────────────────────────────────────┐
 │              concatMap((val)=> apiReq$(val))        │
 └─────────────────────────────────────────────────────┘    
     │                          │             
     └────────────────╳         └─────────────5─┨
                      ↓                       ↓
    ┌──────────────────────┐    ┌──────────────────────┐
    │catchError(()=> EMPTY)│    │catchError(()=> EMPTY)│
    └──────────────────────┘    └──────────────────────┘
                      ↓                       ↓
                      ╂                    
──────────────────────────────────────────────5───>Time Line              
```

```ts
import { EMPTY, fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, concatMap, tap, catchError } from 'rxjs/operators';

const endpointInput: HTMLInputElement =   document.querySelector('input#endpoint');
const fetchButton = document.querySelector('button#fetch');
const apiURL = 'https://random-data-api.com/api';

fromEvent(fetchButton, 'click')
  .pipe(
    map(() => endpointInput.value),
    concatMap((value) => 
      ajax(`${apiURL}/${value}/random_${value}`)
      .pipe(
        catchError(() => EMPTY) 
      )
    ),
  )
  .subscribe((value) => console.log(value));
```

### Concurrency of concatMap

let's now have a look at this in a diagram. So, as I've said, everything that we've covered so far is true for all Flattening Operators, namely, the 'mergeMap', 'switchMap', 'exhaustMap' and, of course, 'concatMap' operators. So where is the difference? The difference is in how they handle concurrency. 

In other words, what would happen if multiple values would be emitted by the source Observable with not enough time between them for the previous inner Subscription to complete? 

For the 'concatMap' operator. Let's say the source Observable emits value 'A'. The inner Subscription is made by 'concatMap'. And let's say two values are emitted and passed to the output. If the source Observable would emit another value with the previous inner Subscription made for value 'A' still running, this is where the 'concatMap' specific logic kicks in. **'concatMap' will wait with handling the new value until the previous inner Subscription ends. And if it would never end, like in this example, this Observable would be stuck on handling the first value.** This might sound like a disadvantage of this operator, however, thanks to that it's the hardest to make a mistake when using it by, for example, leaving active unused inner Subscriptions. If your inner Observable would not complete, you would notice this immediately when using the 'concatMap' operator as your code wouldn't react to any of the new values coming from the source Observable. And remember that leaving active unused Subscriptions is a memory leak situation.


```console                 
──────A────────B──────C───────────────────────>Time Line
      ↓        ↓      ↓                    
 ┌────────────────────────────────┐
 │ concatMap(()=> newObservable$) │
 └────────────────────────────────┘     
    (A)────1─────2───┨ 
           ↓     ↓ 
                   (B)─────3────4───┨  
                           ↓    ↓     
                                  (C)─5────6─┨         
                                      ↓    ↓
──────────1──────2─────────3────4─────5────6──>Time Line              
```


Such behavior is especially important if our inner Observable is, for example, an HTTP request which changes the state in the database on the server. In such case often that we want each request to be handled one after another, so we are sure that the correct latest value is actually stored on the server. So as you can see, 'concatMap' sounds like the safest choice to start with if you don't want to go into memory leak or race condition troubles.

## Flattening Operator #2 - switchMap

Let's now have a look at how the 'switchMap' operator handles concurrency. So, **we use it in the same fashion as the 'concatMap' operator. We provide the function returning an Observable for each value**. Let's now see what will happen when the source starts emitting the values. 

So first, let's say it emits a value 'A' which reaches the switchMap's logic. And as with all flattening operators a new inner Observable is generated and the switchMap's logic subscribes to this Observable. The response takes some time to finish, so we wait. And suddenly, a new value 'B' is emitted by the source Observable. So, it reaches the 'switchMap' operator. And what happens next? 'switchMap', on the other hand, doesn't wait for that to happen. Instead, it just cancels the previous Subscription by unsubscribing and immediately starts a new one for the new value. We can say that it switches to the new one.

And let's say that this new one emits some value, which is passed to the output and then completes. So, if we're not interested in waiting for the previous Subscription to finish and would like to start the new one as quickly as possible, 'switchMap' might be a good choice. 



```console                 
──────A────────B──────C────────────────>Time Line
      ↓        ↓      ↓                    
 ┌────────────────────────────────┐
 │ concatMap(()=> newObservable$) │
 └────────────────────────────────┘     
      (A)                  
      ─────────(unsubscribe A and start subscribe B)
               (B)
                ───────(unsubscribe B and start subscribe C) 
                      (C)
                        ──────6─┨           
                              ↓
──────────────────────────────6───────>Time Line              
```



### Catchup 

However, be careful of an important pitfall it might have 

1. **when using HTTP request for storing data on the server**. Imagine a scenario in which we make such call by using 'switchMap' and when a Subscription is made, **the HTTP request starts immediately and our web browser says to the operating system to initialize the HTTP request and send some data. When we cancel such Subscription, we won't receive the response, however, the request might have already been sent and will reach the server anyway.** So, unsubscribing doesn't guarantee that the request won't reach the server. 

2. if the next HTTP request would be sent very quickly, **that previous cancelled request might reach the server after our most recent request.** So the data would be out of order there. So, when using 'switchMap' together with HTTP requests, which save something on the server, the outcome might be unpredictable. 

### Using Situation

On the other hand, the 'switchMap' flattening operator is useful if **you'd like to fetch something from the server and you just care about the result of the response for the latest value coming from the source Observable.** In that case, using 'switchMap' will make your code react the quickest, and you'll also be sure that you get the response for the latest value emitted by the source Observable.

## Flattening Operator #3 - mergeMap

'mergeMap' allows us to **have multiple inner Subscriptions going on at the same time**. Let me show you what I mean in this diagram. So first, the value 'A' gets emitted by the source Observable, which reaches the 'mergeMap' operator. And this creates a new Subscription to the inner Observable. And during the course of this inner Subscription made by 'mergeMap', let's say the source Observable emits one more value 'B'. At this point, even though we already have one ongoing inner Subscription, 'mergeMap' will create a new concurrent one, like this. And as the time goes on, let's say the first inner Subscription receives a value and completes. This value will, of course, be reemitted to the output. As we wait for the second inner Subscription to receive some values, let's say the source Observable emits another value 'C'. And this also creates a new Subscription immediately. Let's say that this time the response was quick. So, the value will be reemitted to the output and also, as previously, a complete notification was emitted, which ended this inner Subscription. Lastly, let's say the second inner Subscription receives the value, which gets reemitted by our Flattening Operator to the output. And also this inner Subscription received a complete notification which ends this Subscription and leaves everything clean without any memory leaks. 


```console                 
──A────────B────────C────────────────>Time Line
  ↓        ↓        ↓                    
 ┌──────────────────────────────────┐
 │   concatMap(()=> newObservable$) │
 └──────────────────────────────────┘                       
 (A)───────────1─┨
               ↓
          (B)───────────────────────2─┨
                                    ↓
                   (C)──────3─┨            
                            ↓
───────────────1────────────3───────2──>Time Line              
```





As you can see, 'mergeMap' emits the values to the output whenever any of the inner Subscriptions receive some value. That's how other Flattening Operators work as well. In other words, it flattens all these Subscriptions into the single output we see at the bottom of the screen. Also, you can see that the order is not handled here in any way. Everything is instant and concurrent. Another important thing to watch out here is to be aware of the possible memory leaks. Notice that all of the inner Subscriptions in this diagram had a complete notification emitted at the end. This is important to remember, to make sure that the inner Observables complete at some point. In the case of 'mergeMap' is the easiest to cause big memory leaks when we forget to make sure that the inner Observables complete. This is because each value emitted by the source Observable causes a new concurrent inner Subscription to happen. So if we would have a thousand values emitted by the source at the same time, a thousand concurrent inner Subscriptions will be made. And if we wouldn't make sure that they complete at some point, over time, as more and more values get emitted by the source, this number of inner Subscriptions would keep on increasing, keep on growing, and we might have lots of memory leaks. Also, if you'd like to use it for sending HTTP requests, keep in mind that the order can also get all mixed up, both on our side and the side of the server. We don't know in what order will those requests reach the server. And also the responses can come in an unpredictable order, as we can see in the diagram. So the responses might reach our Observer in other order than we initialize them. Let's now see as side by side comparison of these Flattening Operators.

## Comparsion between concatMap, switchMap, mergeMap

That **'concatMap' operator will queue the incoming values, and as soon as the previous inner Subscription completes it will handle the next value in its buffer and create a new inner Subscription**. Thanks to that, this operator is the safest as far as memory leaks are concerned, because if we would forget to make sure that the inner Observable completes the second value coming from the source would never be handled and we would notice this issue immediately. **Also, it's 100 percent safe as far as the order in which everything gets done is concerned.** 'concatMap' makes sure that all of the values emitted by the source Observable are handled one by one in the order they were emitted and also makes sure that the previous inner Subscription gets completed before starting a new one. So summarizing, this is the safest choice if you are not sure what to choose. It might not be the perfect fit in all situations, but it will definitely be the safest one. This operator has one drawback, one disadvantage. **Due to all of this safety and handling all values one by one, it might be slow and inefficient in some scenarios. If that's your case, you can try the other ones.** 


Let's now have a look at the 'switchMap'. So, **this operator cancels the previous inner Subscription if a new value comes from the source. So, it unsubscribes from it and creates a new Subscription for the new value immediately.** From the memory leak perspective, if the inner Observable wouldn't complete, that's not a problem because **each new value emitted by the source Observable cancels the previous inner Subscription**. In other words, 'switchMap' unsubscribes from it so everything is cleaned up. 'switchMap' has only one active inner Subscription at the same time, and it's always the one for the latest value emitted by the source. **So if we receive something from the 'switchMap' operator, we are sure that it's the result of the latest value emitted by the source Observable.** This operator is good for its responsiveness as it doesn't wait for the previous inner Subscription to finish before starting a new one for the latest value emitted by the source Observable. The order is predictable in most cases in a way that the values emitted by the 'switchMap' operator are always a result of the most recent value emitted by the source. There are a few cases, though, related to, for example, storing something on the server where the request from those previous cancelled Subscriptions might actually reach the server after the requests made later due to Internet's unpredictable latency. If you just want to read something from the server, for example, fetch autocomplete search ideas, 'switchMap' is a great choice.

Lastly, let's cover the 'mergeMap' operator. It can have multiple inner Subscriptions at the same time. **It starts a new one as soon as a new value comes from the source Observable.** So, it doesn't wait for the previous one to complete and it also doesn't cancel the previous Subscriptions. So we can say that those Subscriptions happen concurrently. And there can be any number of those concurrent inner Subscriptions, and because of that, **this operator is the least safe from the memory leak perspective.** So you need to make sure that the inner Observables complete at some point. If they wouldn't, there might be a lot of unused Subscriptions hanging in the memory. Also, as these Subscriptions are concurrent, **every time any of them receive some value, this value will be flattened to the output, so we'll get this value immediately, however, we are not able to make any strong assumptions based on the order in which we receive the notifications.** 

For the most part, all Flattening Operators work the same. It's when multiple values from the source Observable are to be handled concurrently when the differences show up. As you can see, each Flattening Operator has its own nuances and has its own purpose. If in doubt and you're not sure which one to choose, I recommend starting with 'concatMap', and if you find some drawbacks in its behavior, you can move on to the other ones.


|         concatMap           |       switchMap                |          mergeMap           |
| :-------------------------: | :----------------------------: | :-------------------------: |
|       Queues/ Buffer        |  Cancels/Unsubscribes          | Concurrently                |
| Memory leaks esay to notice |  Memory leaks not dangerous    | Memory leaks hard to noticw |
| Values handled one by one   |  Quick reaction to new source  | No definite order           |
| Possible delayed reactions  |  Order mostly safe             |                             |