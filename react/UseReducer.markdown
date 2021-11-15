If one of the states would depend on another state. When we depend on the older state or we need to update new state base on the other new state and never state object, then there is a better way than using **useState**.

```js
const [state, dispatch] = useReducer(reducer, initialState)

// 盡量寫在Functional Component外面，避免re-render
const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case "SET":
            return action.ingredients;
        case "ADD":
            return [...currentIngredients, action.ingredient];
        case "DELETE":
            return currentIngredients.filter((ing) => ing.id !== action.id);
        default:
            throw new Error("Should not get there!");
    }
};
```

Reducers are functions that take some input and returns an output in the ned and **useReducer** use the state to give we a clearly defined way of defining state changes and state updates and it will also manage them for us.

> Whilst the concept of reducer functions is similar, **useReducer()** has absolutely NO connection to the Redux library!

It all starts with you defining a reducer and you typically do that outside of your component so that reducer function isn't recreated whenever the component re-render.

> When working with **useReducer()**, React will re-render the component whenever your reducer returns the new state.
