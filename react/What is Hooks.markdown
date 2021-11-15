# What is React Hooks?

Function Components     | Class-based Components|
:-----------------------:|:--------------------:|
| 可回傳JSX內容          |可回傳JSX內容          |
|無法管理"State"         |可以管理"State         |
|無法加入生命週期         |可以加入生命週期       |
|程式碼較輕量化           |程式碼可能會較複雜、冗長|

Function Components withotu React Hooks were limited to outputting content. We could only use functional component for outputting something. They received props and returned JSX. 

In the past only Class-based component could contain and manage "state" to change what your application shows on the screen. But the downside(缺點) with cbc is that they have more overhead more extra code than functional components. Cbc need a constructor to initialize a state. add extra life cycle methods and therefore cbc can quickkly grow in size. They definitely have more code to write than functinal Components. Because CBC were the only kind of components that could manage "state", we have to convert functinal components to cbc if we wanted to manage "state" or we want to add lifecycle methods prior to React 16.8. 

That's why we had Class-based components. But with the release of React version 16.8 in 2018, React Hooks were introduced, It is a feature that now allow you to manage State in Functinal Components and to kind of add life cycle methods as well.

With React Hooks, we don't need to create Class-based components anymore. React Hooks are special functions that **can only be used in functinal components** (and custom hooks).

To mark those special functions so that you don't accidentally use in the wrong place. They are start with the "use" word. The built in React Hooks are all called **useState**, **useEffect**, **useRef**.... And if we build our own custom hooks, the also have to be named like this.

These functions add extra capabilities to functinal components. For example, **useState()** adds functionality that allows functinal components to manage internal state.

```js
useState();
```

**useState** can be initialized with a default state and that state can be anything, **it can be an object, an array, a number, string, boolean, value. It doesn't have to be an object. It can be any value.**

```js
const [state, setState] = useState(initialState)
```

> That's an important difference to class-based state (always was an object!).

**useState always returns an array with exactly two elements** , the first element then alwasys is your current state snapshot, and whenver you state updated, the component will rebuild, so the functinal component  is really executed and useState executed again. But react internally saves that you already configured a state with the help of useState for functional component, and will not reinitialized it, but insead **useState** manages this state detached from you component, so independent from your component, so that the state survives renders of this functinal component. So the state suvives when functional component get executed again and therefore useState  does first value which is returned is our current state snapshot and it's a current state snapshot for this rerender cycle of this component. This means that when you update the state, you'll get the updated state here.

## 如何更新State

That's where the second element in the array is helpful. First element in the array is our current state snapshot. second element is a function that allows us to update our current state.

```js
setState(newState);
```

or

```js
setState(prevState => prevState - 1)
setState(prevState => prevState + 1)
```

In Class-based components, state have to be an object and react merged it for you automatically.

Unlike the setState method found in class components, **useState does not automatically merge update objects**. You can replicate this behavior by combining the function updater form with object spread syntax:

```js
const [state, setState] = useState({});
setState(prevState => {
    // Object.assign would also work
    return {
        ...prevState,
        ...updatedValues
    };
});
```

## 使用上更彈性

We can add another state with multiple **useState** which can store in different variables in which it can set with different functions. So We dont't have to manually merge anything because these are managed independently. If we updated one, the other one will be kept around and vice versa, because as I mentioned already, Theses states survive rerender cycles, so they survive updates of other states. We don't have to merge manually because it's not an object anymore. But instead of two separate strings which were managing a state.

```js
const [nameState, setNameState] = useState('');
const [ageState, setAgeState] = useState('');
const [heightState, setHeightState] = useState('');
const [scoreState, setScoreState] = useState('');
```

## Rules of Hooks

1. We must only use the hooks in functional components or inside of other custom hooks.
2. We always have to **use the hooks on the root level in our component**

## Passing State Data Across Components

---

## The Problem With React 16 And Earlier:

### Event Pooling:

When we're passing a function into the **setState** function, the anonymous function in the **setState** function is a closure.  That is a simply function that closes over surrounding values.
 In this case, it closes over our event here. The **event** is fed into the **onChange** anonymous function, and in that funciton which we have herre upon a change, we're calling these **setState** function, then we also defing another nested function inside setState function.

 The problem with that is that in the inner function, We use something from the outer function, we using the event, then the event will be locked in for the first keystroke.
 Which means that for subsequent keystrokes we don't use the new keystroke event, but the previous one, which of course is then reused and which caused this error.

 Normally that wouldn't be a problem, because the inner function is state updating function (**setState**), and therefore it closes over a event object, which means it saves this event object for its execution so that when does inter state updating cuntion runs, which happens asynchronously, we're guaranteed to use the event that was triggered for that keystorkes, so it was created for the keystroke. The problem with evetns and that's now really exclusive to evetns and react.  Just is that **React event** are not the native theme events, but special sysnthetic evets created by React, which basically replicate the native DOM events it would normally get, but react adds a special factor to that. It pulls these event objects, which simply means it reuses event objects. So instead of creating a new event object for every keystroke, it instead reuses the previous object. and the consequence of this is that for the second keystroke, since we have a closure and we locked in the event for the first keystroke, for the second keystroke, we still reuse the same object we had for the first keystroke and that simply the problem here, we're reusing the wrong event object because of the way react handles event objects.

```js
function handleChange(e) {
    setData(data => ({
        ...data,
        // This crashes in React 16 and earlier:
        text: e.target.value
    }));
}
```

From [React Org](https://reactjs.org/blog/2020/08/10/react-v17-rc.html#no-event-pooling): This is because React reused the event objects between different events for performance in old browsers, and set all event fields to null in between them. With React 16 and earlier, you have to call e.persist() to properly use the event, or read the property you need earlier. 

React 17 removes the “event pooling” optimization from React. It doesn’t improve performance in modern browsers and confuses even experienced React users:. In React 17, this code works as you would expect. The old event pooling optimization has been fully removed, so you can read the event fields whenever you need them. This is a behavior change, which is why we’re marking it as breaking, but in practice we haven’t seen it break anything at Facebook. (Maybe it even fixed a few bugs!) Note that e.persist() is still available on the React event object, but now it doesn’t do anything.
