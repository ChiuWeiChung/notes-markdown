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

## State Update : Function & Class 的差異

* **Class Component** :  
    在 Class Components 當中，由於 State 的形式一直都是 Object ，在更新過程中， React 會自動將更新的值合併 (merge) 到 State 內部。如下方程式碼。

    ```js
    // ------在Class Component內部------
    // state = {name:'Allen', age:25}
    this.setState({
        age: 30
    })
    // state = {name:'Allen', age:30}
    ```

* **Function Component** :  

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

## State 更新與批量更新

當我們在 Class Component 透過 `setState` 或在 Function Component 透過 `useState` 進行 State 的更新時，都會觸發 React 安排 Component 進行重新渲染 (re-render)。

### 什麼是批量更新 (Batch Updating) ?

該機制**主要在 Event Handler 內發生**，如下方程式碼，當點擊 `<button>` 觸發 `clickHandler` 時，並執行 `setName()` 以及 `setAge()` 兩個 State 的更新， 但在 `clickHandler` 內的 `name` 並沒有在 `setName()` 之後馬上更新 ( `name` 仍為 `'Andy'` )。

```jsx  
const Component = (props)=>{

    const[name, setName] = useState('Andy'); 
    const[age, setAge] = useState(25); 

    const clickHandler = () => {
        setName('Rick');
        console.log(name) // 仍會是 'Andy'
        setAge(30);
        console.log(age) // 仍會是 25
    }

    return(
        <button onClick={clickHandler}>Click Me!</button>
    )
}

```

#### **為什麼 State 不會再 Event Handler 內立刻更新?** 


上面的程式碼中，我們可能會認為 `name='Andy'` 應該要在 `setName('Rick')` 之後馬上更新成 `name='Rick'`，但事實上， 我們只能在 Component 重新渲染之後才可以存取新的 State。

### Scheduling 機制

React 在處理 Event Handler 內的 State 更新時，假設有 N 次的 `setState` (或`useState`)在其內部， React 會將這些 `setState` 們 (或 `useState`) 在[合適的時機點 (Scheduling)](https://felixgerschau.com/react-rerender-components/#when-does-react-re-render) 進行批量更新 (Batch Updating) ，此時的 Component 只需要重新渲染 1 次即可，這樣的機制主要可以避免 Component 重新渲染 N 次的情況出現，也因此我們無法在 Event Handler 內部立刻觀察到 State 更新後的結果。

# 參考資料
* [What the React? Sagas and side effects](https://smartcar.com/blog/what-the-react-sagas/)
* [React - The Complete Guide (incl Hooks, React Router, Redux)](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)
* [使用 React Hook](https://zh-hant.reactjs.org/docs/hooks-effect.html)
* [When does React re-render components?](https://felixgerschau.com/react-rerender-components/)
* [How and when to force a React component to re-render](https://blog.logrocket.com/how-when-to-force-react-component-re-render/)
* [React - Batch Updating](https://github.com/facebook/react/issues/10231#issuecomment-316644950)

