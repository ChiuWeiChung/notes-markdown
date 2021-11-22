# State 更新與批量更新

當我們在 Class Component 透過 `setState` 或在 Function Component 透過 `useState` 進行 State 的更新時，都會觸發 React 安排 Component 進行重新渲染 (re-render)。

## 什麼是批量更新 (Batch Updating) ?

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

### **為什麼 State 不會再 Event Handler 內立刻更新?** 


上面的程式碼中，我們可能會認為 `name='Andy'` 應該要在 `setName('Rick')` 之後馬上更新成 `name='Rick'`，但事實上， 我們只能在 Component 重新渲染之後才可以存取新的 State。

## Scheduling 機制

React 在處理 Event Handler 內的 State 更新時，假設有 N 次的 `setState` (或`useState`)在其內部， React 會將這些 `setState` 們 (或 `useState`) 在[合適的時機點 (Scheduling)](https://felixgerschau.com/react-rerender-components/#when-does-react-re-render) 進行批量更新 (Batch Updating) ，此時的 Component 只需要重新渲染 1 次即可，這樣的機制主要可以避免 Component 重新渲染 N 次的情況出現，也因此我們無法在 Event Handler 內部立刻觀察到 State 更新後的結果。

# 參考資料
* [When does React re-render components?](https://felixgerschau.com/react-rerender-components/)
* [How and when to force a React component to re-render](https://blog.logrocket.com/how-when-to-force-react-component-re-render/)
* [React - Batch Updating](https://github.com/facebook/react/issues/10231#issuecomment-316644950)
* [React - The Complete Guide (incl Hooks, React Router, Redux)](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)
