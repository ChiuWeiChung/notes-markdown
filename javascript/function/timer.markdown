# Timer function in JavaScript

This is really important to understand. As soon as javascript hits this line of code. it willl simply keep counting the time in the backgound, and register  the callback function to be call to be called after the time has elapsed, and then immediately, Javascript will move on to the next line. This mechanism is callsed Asynchronous JavaScript.

``` js
setTimeout(() => {
    console.log('Here is your pizza')
}, 3000);
console.log('Waiting...');
```

## How to pass arguments into the setTimeout function?


``` js
setTimeout((ing1, ing2) => {
    console.log(`Here is your pizza with ${ing1} and ${ing2}`)
}, 3000, 'olives', 'spinach');
console.log('Waiting...');
```

## How to cancel setTimeout function

``` js
const ingredients = ['olives', 'spinach']
const pizzaTimer = setTimeout((ing1, ing2) => {
    console.log(`Here is your pizza with ${ing1} and ${ing2}`)
}, 3000, ...ingredients);
console.log('Waiting...');

if (ingredients.includes('spinach')) {
    clearTimeout();
};
```

```js
setInterval(function(){
    const date = new Date();
    console.log(date);
},1000)
```
