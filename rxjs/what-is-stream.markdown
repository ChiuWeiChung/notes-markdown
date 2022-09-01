# What is stream?

The Observables are based around the idea of streams, which means that the data can come at various points of time and the number of emitted values might be theoretically infinite. It can be compared to a variable situation where the items are processed one at a time.

And most of us are used to working with arrays where all the data is already known and available to us. However, in the world of Observables, which allows us to emit the values at any point of time, we have to change our approach and think in a stream-like way. This can be confusing, so let's try to find the differences in the approach when thinking in arrays and in streams.

Let's start with the arrays. When we have an array, we immediately have the access to all of the data inside. We can see how many items does it have or, for example, what is the third item's of value. In this array, we can see a few numbers,

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

which can represent some IDs, some scores or anything else. The thing is that the data is there and we have the full access to any of these items at any time. Let's see another example. This time we have an array of strings. These might make a list of someone's friends or names of someone's children. Right here, we have an array of some points. They might represent some polygon or are a record of the points that the user clicked. In this case, we have a few fruits and vegetables in our array. This might be our shopping list or a list of things that are available at the shop nearby. What is common for all arrays is that each of the values can be easily accessed and you can see how long the array is.

Now, how should we approach a stream? How can we work with them? First, the items in a stream can come at various points of time, so let's draw a timeline. As the time passes, some data might show up in our stream. For example, let's say we've just entered a local grocery store and we go further and see some products. First, we see a lemon. We can react somehow to it or not. For example, we can take this lemon and put it into our shopping basket, if it was on our shopping list. Then we move further, time passes, we see a coconut. Again, we can take it or not. We take the action at the time we see this product. Later, we might find an onion. Again, we can do something with it or not. And even later, we could see a mushroom. And of course, this kind of a mushroom shouldn't be found in the store, so maybe if something like this happens, we might react to it by calling the store manager. If we would go further, there might or might not be more products that we will see. And if we would like to name this particular stream, we could say it's a stream of the products which we see. Each time we would enter the grocery store, we would notice different products at different points of time.

As you can see, `the stream approach is more about reacting to the things as they show up`. We don't know the next value and whether it will appear at all. We just provide some code which will react to the emitted data in case it shows up. This approach is called reactive programming, and the Observables are based around this idea. Actually, we've already used this approach in the Quick Start section, where we implemented the reaction in the Observer object, which just console logged each emitted value.

As we now know how to approach the streams, let's see some other example. We might have a stream, which would emit the latest scroll top position every time it changes. So let's say we move the scroll a little bit and a new position would be emitted by this stream. If we move the scroll a tiny bit more, a new position would be emitted again. And it can go on and on.

```console
Element scrollTop position

-------|--------|--------|--------|-------->Time Line
       20       30       58       11

```

We could have a stream representing the latest value of the text input data. For example, at first the field might be empty, then the user might start typing, and as the time passes and the user continues to type, the value of the input data might change and the stream would keep on emitting those updated values.

```console
Text Input

----|----|---------|--------|-------->Time Line
    ""  "H"      "HEL"   "HELLO"

```

The last example I'll show you here is an HTTP request. The HTTP request can also be represented by a stream. When we call some server, we have to wait some time and then the response will come. I've showed you all of these examples to give you an idea what kind of stream sources can we have and how will the data come to us when using the Observables. It's about handling each value, each notification one by one. Let's now see how to create a new Observable and subscribe to it to make it work.

```console
HTTP response

------------------|-------->Time Line
            {response:...}

```
