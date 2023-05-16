# RxJS

## 什麼是 RxJS ( Reactive Extensions Library for JavaScript )

從 RxJS 的官方文件中的介紹:

RxJS is a library for composing **asynchronous and event-based programs** by using **observable** sequences. It provides one core type, the Observable, satellite types (Observer, Schedulers, Subjects) and operators inspired by Array methods (map, filter, reduce, every, etc) to allow handling asynchronous events as collections.

>Think of RxJS as Lodash for events.

簡而言之，RxJS 提供了許多工具來幫助我們處理`一連串的「非同步」的事件`，而這邊所謂的`一連串的「非同步」的事件`，又被稱為 Stream (資料流/事件流)。

# What is stream?

## Stream vs Array

所謂的 stream 指的是資料在一條時間軸上的不同時間點被發送出來，而且 stream 可能永無止盡的繼續下去，我們也可以把 stream 想像成一條帶有許多種類產品的輸送帶，隨著時間的推進，產品也一個接著一個的被輸送帶送到目的地; 


若拿 stream 與 array 比較的話，array 在被定義的時候就已經知道它的容貌，比如陣列的長度(length)，以及第 n 個次序的值為何，然而對於 Observable 所發出的 stream 而言，stream 上的資料可能會在不同時間點被發送出來，也難以掌握發出來的資料長什麼模樣，因此在 Reactive Programming 的世界裡，由於 stream 的形式相比於 array 而言多了「時間」的變數，因此在處理 stream 的思維也與 array 不一樣。

```js
const arr = [1, 21, 37, 46, 52];
const name = ["Charlie", "Alice", "Ben"];
const coordinates = [
  { x: 10, y: 20 },
  { x: 12, y: 22 },
  { x: 31, y: 27 },
  { x: 41, y: 58 },
];
```

我們可以把 stream 想像成在吃迴轉壽司的情境，壽司在輸送帶上面被傳送，但是我們難以全權掌握接下來的幾秒鐘印入眼簾的內容有拿些，可能是鮭魚壽司、鮪魚壽司，又或者是濕紙巾、芥末醬等等...。

因此，處理 stream 主要是在針對其所發出的資料作出回應 (react)，因為我們無從得知 stream 丟出來的資料長什麼模樣，或是什麼時間點會發出，因此必須透過程式碼來對所發出來的資料作出回應，這樣的處理方式被稱為 Reactive Programming (響應式程式設計)，而 Observables 的概念也是基於 Reactive Programming 所衍伸出來的。

瀏覽器上面的各種 Element 事件也可以作為 stream 的來源，比如我們在網頁瀏覽新聞時，透過滾輪來進行頁面的滑動，此時我們可以將元素的 scroll 事件監聽器透過 Observable 進行包裝並 Subscribe，隨著滾輪的滑動，滑動的事件也會被 Observable 發送出來。

又或者將 `input` 的 click 事件監聽器透過 Observable 包裝後並 Subscribe，當使用者在輸入的過程中，其值也會透過 Observable 發送出來，也可以將 HTTP Request 加入 Observable 之中，並觀察所發送回來的 HTTP Response。

>[捲軸滑動DEMO](https://codesandbox.io/s/xenodochial-farrell-deep4c?file=/src/index.ts)

```console

元素的 scroll 事件監聽 (scrollTop position)
─────20─────30──────82──────────103───────>Time Line
        

Text Input
──────""─────"H"────"HEL"─────"HELLO"─────>Time Line
  

HTTP response
───────────────────────────────╂──────────>Time Line
                          {response:...}
```



[Reactive programming ](https://ithelp.ithome.com.tw/articles/10260636)




<!-- which can represent some IDs, some scores or anything else. The thing is that the data is there and we have the full access to any of these items at any time. Let's see another example. This time we have an array of strings. These might make a list of someone's friends or names of someone's children. Right here, we have an array of some points. They might represent some polygon or are a record of the points that the user clicked. What is common for all arrays is that each of the values can be easily accessed and you can see how long the array is. -->
<!-- 
Now, how should we approach a stream? How can we work with them? First, the items in a stream can come at various points of time, so let's draw a timeline. As the time passes, some data might show up in our stream. For example, let's say we've just entered a local grocery store and we go further and see some products. First, we see a lemon. We can react somehow to it or not. For example, we can take this lemon and put it into our shopping basket, if it was on our shopping list. Then we move further, time passes, we see a coconut. Again, we can take it or not. We take the action at the time we see this product. Later, we might find an onion. Again, we can do something with it or not. And even later, we could see a mushroom. And of course, this kind of a mushroom shouldn't be found in the store, so maybe if something like this happens, we might react to it by calling the store manager. If we would go further, there might or might not be more products that we will see. And if we would like to name this particular stream, we could say it's a stream of the products which we see. Each time we would enter the grocery store, we would notice different products at different points of time. -->



<!-- The Observables are based around the idea of streams, which means that `the data can come at various points of time and the number of emitted values might be theoretically infinite.` It can be compared to conveyor belt situation where the items are processed one at a time.

And most of us are used to working with arrays where all the data is already known and available to us. However, in the world of Observables, which allows us to emit the values at any point of time, we have to change our approach and think in a stream──like way. This can be confusing, so let's try to find the differences in the approach when thinking in arrays and in streams. -->

<!-- As you can see, `the stream approach is more about reacting to the things as they show up. We don't know the next value and whether it will appear at all.` We just provide some code which will react to the emitted data in case it shows up. This approach is called **reactive programming**, and the Observables are based around this idea. Actually, we've already used this approach in the Quick Start section, where we implemented the reaction in the Observer object, which just console logged each emitted value.

As we now know how to approach the streams, let's see some other example. We might have a stream, which would emit the latest scroll top position every time it changes. So let's say we move the scroll a little bit and a new position would be emitted by this stream. If we move the scroll a tiny bit more, a new position would be emitted again. And it can go on and on. -->

<!-- Let's start with the arrays. When we have an array, we immediately have the access to all of the data inside. We can see how many items does it have or, for example, what is the third item's of value. In this array, we can see a few numbers, -->


<!-- 
We could have a stream representing the latest value of the text input data. For example, at first the field might be empty, then the user might start typing, and as the time passes and the user continues to type, the value of the input data might change and the stream would keep on emitting those updated values.


The last example I'll show you here is an HTTP request. The HTTP request can also be represented by a stream. When we call some server, we have to wait some time and then the response will come. I've showed you all of these examples to give you an idea what kind of stream sources can we have and how will the data come to us when using the Observables. It's about handling each value, each notification one by one. Let's now see how to create a new Observable and subscribe to it to make it work. -->
