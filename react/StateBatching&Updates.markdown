## State更新與批量更新


當我們在Class Component透過 `This.setState()`或是在Function Component透過 `useState()`進行State的更新時，都會觸發Component重新執行並重新渲染 (re-render)，

React batches state updates - see: https://github.com/facebook/react/issues/10231#issuecomment-316644950

That simply means that calling

```js
const[name,setName] = useState('Andy');
const[age,setAge] = useState(25);
const clickHandler = () => {
    setName('Max');
    setAge(30);
}
```

in the same synchronous (!) execution cycle (e.g. in the same function) will NOT trigger two component re-render cycles.

Instead, the component will only re-render once and both state updates will be applied simultaneously.


## 陷阱

Not directly related, but also sometimes misunderstood, is when the new state value is available.

Consider this code:

```js
console.log(name); // prints name state, e.g. 'Andy'
setName('Max');
console.log(name); // ??? what gets printed? 'Max'?
```

You could think that accessing the name state after setName('Max'); should yield the new value (e.g. 'Max') but this is NOT the case. Keep in mind, that the new state value is only available in the next component render cycle (which gets scheduled by calling setName()).

Both concepts (batching and when new state is available) behave in the same way for both functional components with hooks as well as class-based components with this.setState()!


# 參考資料
* [When does React re-render components?](https://felixgerschau.com/react-rerender-components/)
* [How and when to force a React component to re-render](https://blog.logrocket.com/how-when-to-force-react-component-re-render/)
* [React - The Complete Guide (incl Hooks, React Router, Redux)](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)