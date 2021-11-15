# useReducer

Sometimes, we have more complex state - for example if it got multiple states, multiple ways of changing it or dependencies to other states. **useState()** then often becomes hard or error-prone to use, it's easy to write bad, inefiicient or buggy code in such scenarios. **useReducer()** can be used as a replacement for **useState()** if you need "more powerful state management".

useReducer is a good choice if we update a state which depends on anothe state.

```js
const [state, dispatch] = useReducer(reducer, initialState, initFunction);
```

useReducer just like **useState**, always returns an array with exactly two values. And therefore we can use arry destructuring to pull out these values.

### state:  

The state snapshot used in the component re-render/re-evaluation cycle

### dispatch:  

A function that can be used to dispatch a new action (i.e. trigger an update of the state)

### reducer:  

```js
(prevState, action) => newState
```

A function that is triggered automatically once an action is dispatched - it receives that **latest state snapshot and should return the new, updated state**

### initialState:

The initial state.

### initFunction:  

A function to set the initial state programmatically.

---

The reducer function can be craeted outside of the component, because inside the reducer function, we won't any data that's generated inside of the component function. So the reducer function can be created outside of the scope of the component function. Because it doesn't need to interact with anything inside the component function. All the data which will be required and used inside of the reducer function will be passed into this function when it's executed by react automatically.
 

```js
const reducer = (state, action) => {
    ...
}
```

I should add example here!!!!!!!!!!!!!!!!!!!

---

## useState() vs useReducer()

Generally, when using **useState()** becomes cumbersome or you're getting a lot of bugs/ unintended behaviors, we'll know when we need useReducer().

If we have an object as a state, or a more complex state, **useReducer()** might be intersting. Because, in general, useReducer is great if we need more power. With more power, simply mean that we can write such a reducer function that can contain more complex state updating logic where we always are guaranteed to work with the newest state snapshot. And where we can move that potentially more complex logic out of our component into a separate reducer function. 

**useReducer()** can be helpful if we have different cases, different actions that can change a state.

|useState()                          |          useReducer()|
:--------------------------------:|:--------------------:|
| The main state management "tool"|Great if we need "more power"          |
|Great for independent pieces  of state/data|Should be considered if we have related pieces of state/data|
|Great if state updates are easy and limited to a few kinds of updates|Can be helpful if we have more complex state updates|
