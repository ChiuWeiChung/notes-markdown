# React Hooks - useState

在過去 (React 16.8之前)， React 的 Function Components 無法進行 State 的管理，因為它僅具有接收 Props 以及回傳 JSX 的的功能，若要進行 State 的管理，勢必要使用到 Class Components ，然而 Class Components 通常會需要初始化 State 、加入生命週期 (如 `componentDidMount` , `componentDidUpdate` ...) 、定義 Event Handler 等等，因此程式碼容易變得過於複雜。  

Function Components |Class Components  |
:------------------:|:---------------:|
|可回傳JSX內容       |可回傳JSX內容      |
|無法管理State       |可以管理State      |
|無法加入生命週期     |可以加入生命週期   |
|程式碼較輕量化       |程式碼可能會較複雜 |


幸虧在 React 16.8 以後出現了 React Hooks ，讓我們能在 Function Component 內進行 State 以及生命週期的操作。 有了 React Hooks ，就可以避免編寫冗長複雜的 Class Components 。

> React Hooks 只能使用在 Function Components。

## 使用 Hooks 時必須遵守的準則

1. React Hooks 僅限於使用在 Function Component 上。

2. 在 Function Component 內的頂端 (Top Level) 就使用 React Hooks。

## React Hooks 中的 useState

在 Function Components 中，我們可以過 React Hooks 所提供的 `useState()` 來定義我們的 State，在 `useState()` 的括號內部可以讓我們傳入 State 的預設值，該預設值可以是任何形式，如 Object、  Array 、 Number 、 String 、 Boolean 。

> Class Components 的 State 必須是 Object ，但在 Function Component 的 State 可以是任何形式。

呼叫 `useState()` 之後會回傳一個陣列，如下方程式碼，陣列中的第一項 `state` 就是State當下的值，第二項 `setState` 是可以用來更新State的函式，其功能如同Class Component的 `this.setState()` 。 

```js
const [state, setState] = useState(initialState)
```

> 由於程式碼中 `state` 以及 `setState` 的名稱是透過解構賦值 (Array destructuring) 得來的，其名稱可以自己任取。

## 如何更新State

`useState()` 回傳的陣列第二項是可以用來更新State的函式，如下方的 `setState()` ，其用法與 Class Components "類似"，只要在函式的括號內傳入要更新的值即可

```js
setState(newState);
```

倘若更新過程需要存取前一次的 State ，如下方程式碼，在 `setState()` 的括號內可以接受一個匿名函式，其匿名函式的第一個參數即為前次的 State ，並在函式內回傳更新後的 State。

```js
setState(prevState => prevState - 1)
```

## setState在Function與Class不同的地方

### Class Component :  

在 Class Components 當中，由於 State 的形式一直都是 Object ，在更新過程中， React 會自動將更新的值合併 (merge) 到 State 內部。如下方程式碼。

```js
// ------在Class Component內部------
// state = {name:'Allen', age:25}
this.setState({
    age: 30
})
// state = {name:'Allen', age:30}
```

### Function Component :  

由於 State 在 React Hooks 中可以是任何形式 ( Object, String , Number ...)，也因此在更新過程中， `useState` **不會自動將更新的值合併到 State 內部**。

```js
// ------在Function Component內部------
// state = {name:'Allen', age:25}
this.setState({
    age: 30
})
// state = {age:30}
```

若 State 為 Object ，在更新過程中，我們可以透過 JavaScript 中的展開運算子 ( Spread Operator )來實現物件的更新

```js
// ------在Function Component內部------
// state = {name:'Allen', age:25}
this.setState((prevState) => {
    return {
        ...prevState,
        age: 30
    }
})
// state = {name:'Allen', age:30}
```

## useState 在使用上更彈性

由於 `useState` 中的 State 不再受限於 Object 形式，因此更新 State 時不會自動合併，但我們可以在同一個 Function Component 之中加入多個 `useState()` 用來儲存不同的值，如下方程式碼，透過多個 `useState()` 的呼叫來定義 `nameState` 、 `ageState` 、 `heightState` ，也因此我們可以僅更新單一特定的State來避免影響到其他的 State 。

```js
const [nameState, setNameState] = useState('Alice');
const [ageState, setAgeState] = useState(30);
const [country, setCountry] = useState('Taiwan');
```

<!-- **useState always returns an array with exactly two elements** , the first element then alwasys is your current state snapshot, and whenver you state updated, the component will rebuild, so the functinal component  is really executed and useState executed again. But react internally saves that you already configured a state with the help of useState for functional component, and will not reinitialized it, but instead **useState** manages this state detached from you component, so independent from your component, so that the state survives renders of this functinal component. So the state suvives when functional component get executed again and therefore useState  does first value which is returned is our current state snapshot and it's a current state snapshot for this rerender cycle of this component. This means that when you update the state, you'll get the updated state here. -->

<!-- ---

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

React 17 removes the “event pooling” optimization from React. It doesn’t improve performance in modern browsers and confuses even experienced React users:. In React 17, this code works as you would expect. The old event pooling optimization has been fully removed, so you can read the event fields whenever you need them. This is a behavior change, which is why we’re marking it as breaking, but in practice we haven’t seen it break anything at Facebook. (Maybe it even fixed a few bugs!) Note that e.persist() is still available on the React event object, but now it doesn’t do anything. -->
