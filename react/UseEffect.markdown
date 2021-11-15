# UseEffect in React Hooks

If we want to fecth something whenever the compoenets gets rendered. Normally we would have used **componentDidMount** for that to fetch something when the compoenet mounts (componentDidMount() 方法會在 component 被 render 到 DOM 之後才會執行). But this is not an option for functional component unless we transform it to class based component. But there is another hook that helps with that. The **useEffect** method.

Just like **useState**, the same rules apply, you can only use it in functional components or other hooks on the root level. **useEffect**, by default, **gets executed right after every component render cycle**. The function you pass to **useEffect** will get executed.

```js
useEffect(() => {
    ...
})
```

## Trap

The Code below have one huge issue, we will end up with an infinite loop. If we fetch data in our render function, whenever component rendered, we are sending http request and then after the http request, we update our state and the component rerender again and we send another http request!

```js
const [state, setState] = useEffect('');
useEffect(() => {
    fetch('https://.....')
        .then(res => res.json())
        .then(res => {
            setState(res)
        })
})
```

**useEffect** also take a second argument, the first argument is the function which executes after every render cycle. The second argument is an array with the dependencies of your function. Only when such a dependency chaged, only then function will rerun. If we have no external dependencies and we can add an empty array. Used [] as a second argument, **useEffect** acts like **componentDidMoun**, It runs only once (after the first render).

```js
const [state, setState] = useEffect('');
useEffect(() => {
    fetch('https://.....')
        .then(res => res.json())
        .then(res => {
            setState(res)
        })
}, [])
```

 The function will only run when the value inside the array changed.

> **useEffect** acts like **componentDidUpdate**, It runs the function after every component update (re-render). With empty array in second argument, **useEffect** acts like **componentDidMount**.

## More on useEffect

---

感謝 setState()，React 現在知道 state 有所改變，並且再一次呼叫 render() 方法來了解哪些內容該呈現在螢幕上。這時候，在 render() 方法內的 this.state.date 將會有所不同，因此 render 輸出將會是更新的時間。React 相應地更新 DOM。

## useCallback

**useCallback** method allows us to wrap whatever function with, and also pass second argument to use callback, the second argument is an array. The wrapped function will survive in re-render cycle.

> 你可以把 useEffect 視為 componentDidMount，componentDidUpdate 和 componentWillUnmount 的組合。

---
useEffect 有什麼作用？ 透過使用這個 Hook，你告訴 React 你的 component 需要在 render 後做一些事情。React 將記住你傳遞的 function（我們將其稱為「effect」），並在執行 DOM 更新之後呼叫它。你可能會發現把 effect 想成發生在「render 之後」更為容易，而不是考慮「mount」和「更新」。 React 保證 DOM 在執行 effect 時已被更新。

---
我們也開始看到 Hook 如何解決動機中概述的問題。我們已經看到了 effect 清除如何避免在 componentDidUpdate 和 componentWillUnmount 中重複，如何使相關程式碼更緊密地結合在一起，並幫助我們避免 bug。我們還看到了我們可以如何根據 effect 的目的來區分 effect，這是我們在 class 中根本無法做到的。
