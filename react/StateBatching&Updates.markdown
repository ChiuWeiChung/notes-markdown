More on State Batching & State Updates
React batches state updates - see: https://github.com/facebook/react/issues/10231#issuecomment-316644950

That simply means that calling

```js
setName('Max');
setAge(30);
```

in the same synchronous (!) execution cycle (e.g. in the same function) will NOT trigger two component re-render cycles.

Instead, the component will only re-render once and both state updates will be applied simultaneously.

Not directly related, but also sometimes misunderstood, is when the new state value is available.

Consider this code:

```js
console.log(name); // prints name state, e.g. 'Manu'
setName('Max');
console.log(name); // ??? what gets printed? 'Max'?
```

You could think that accessing the name state after setName('Max'); should yield the new value (e.g. 'Max') but this is NOT the case. Keep in mind, that the new state value is only available in the next component render cycle (which gets scheduled by calling setName()).

Both concepts (batching and when new state is available) behave in the same way for both functional components with hooks as well as class-based components with this.setState()!
