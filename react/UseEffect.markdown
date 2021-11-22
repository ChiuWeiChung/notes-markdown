# React Hooks - useEffect

## 什麼是 "Effect" (或稱 "Side Effect")?

我們使用 React 的最終目的就是要將 Components 的內容呈現在頁面上， 並根據使用者的操作 (點擊按鈕、輸入欄位資訊..... 等等) 所造成 State、 Props 的變化，進行 UI 上的動態挑整。

而所謂的 "Side Effect" 指的是如 Http 請求、執行Timer Function ( `setTimeout` , `setInterval` ) ..... 等等， 由於上面有談到 React 的主要功能是將 Component 內容呈現在 DOM 上，因此 React 必須**透過某些機制來 "另外處理" 這些 "Side Effect"**。

## 疑慮 - 在 Component 內直接塞入 Side Effect

**當 State 發生改變會觸發整個 Component 重新渲染 (re-render)， React 透過新舊 VDOM 比對來決定哪些內容要更新在 DOM 上頭**， 假如上述的過程中出現了 Side Effect 的介入，就可能出現一些 Bugs (如 Infinite Loop) ，如下方程式碼，我直接在 `App` 內部建立一個 Timer Function ( `setTimeout` )，希望在 1 秒之後改變 `show` 的 State，然而這樣的行為卻造成 Infinite Loop 的發生。

```jsx
const App = () => {
  const [show, setShow] = useState(false);

  setTimeout(()=>{
    setShow(prevShow=>!prevShow)
  },1000)

  return (
    <div className="app">
      <h1>{show?'Boo!':'You have 1 sec to run!'}</h1>
    </div>
  );
};
```

![useeffect-illustration-1](https://github.com/ChiuWeiChung/IMGTANK/blob/main/react/useEffect-illustration-1.gif?raw=true)

會出現 Infinite Loop 的原因在於我們"**直接**"在 `App` 直接引入 Side Effect ( `setTimeout` )，當 `App` 執行時:

1. 最開始，React 將 `App` 所回傳的內容呈現給 DOM
2. 歷經 1 秒後， `setTimeout` 內部的回呼函式被執行，觸發 State 更新， `App` 被迫重新渲染。
3. `App` 重新渲染， "**新的 `setTimeout`**" 再次被宣告。
4. 1 秒後， `setTimeout` 內部的回呼函式被執行，觸發 State 更新， `App` 被迫重新渲染。
5. `App` 重新渲染， "**新的 `setTimeout`**" 再次被宣告。
    .....無限循環

上面的情況顯示了直接在 Component 內部執行 Side Effect 會導致無限迴圈的 Bug ，為了"另外處理"這些 Side Effect ，React Hooks 提供了一個可以在 Function Component 內部執行 Side Effect 的函式，也就是 `useEffect` 。

## **useEffect**

React Hooks 中的 `useEffect` 作用在於告訴 React 我們的 Function Component 需要在渲染後做一些事 (如 Side Effect ) ，`useEffect()` 接收兩個參數:

```jsx
useEffect( ()=>{...} , [dependencies])
```

* 第一個參數為匿名函式 :  
該函式會在 Function Component **每次渲染結束後且 dependencies 改變的狀況下執行 (第一次渲染後一定會執行)**，因此我們可以將 Side Effect 放在該函式內部。

* 第二個參數為 dependencies :  
形式為 Array 的 dependencies，React 會依據 dependencies 是否有改變來決定匿名函式是否應重新執行。若為空 Array (沒有 dependencies 作為重新執行的依據) 時，匿名函式僅會在 Function Component 完成渲染後執行一次。

 > `useEffect` 在 dependencies 為空 Array 的時，其行為就是 Class Component 的 `ComponentDidMount` (僅在 Component 第一次渲染完畢後才執行)，當需要 React 觀察 dependencies 的變化來決定是否執行 `useEffect` 內匿名函式，則可以想像成 `componentDidUpdate` 的行為。

### **將 Side Effect 帶入 useEffect**

如下方程式碼，因為 dependencies 為空的陣列，`useEffect` 內的匿名函式只會在 `App` 第一次渲染完畢後才會執行，並僅執行一次，因此避免了 Infinite Loop 的出現。

```jsx
const App = () => {
  const [show, setShow] = useState(false);

  useEffect(()=>{ 
    setTimeout(()=>{
      setShow(prevShow=>!prevShow)
    },1000)
  }, []); // 空 Array 時，使用上就像 ComponentDidMount

  return (
    <div className="app">
      <h1>{show?'Boo!':'You have 1 sec to run!'}</h1>
    </div>
  );
}
```

## 需要清除的 Effect

在某些情況下，我們可能想要清除某些 Effect，這時候就需要使用到 `useEffect` 內的 cleanup 函式幫忙清除這些 Effect，避免造成 memory leak！

### **沒有 cleanup 可能造成的情況**

如下方程式碼是一個計時器，因為 `App` 在初期渲染完畢後會執行 `useEffect` 內的匿名函式，並在 1 秒後進行 `set` 的更新，React 發現 State (`sec`) 已經更新，又再次觸發 App 重新渲染，React 觀察到 dependencies 內的 `sec` 不一樣了，並再次執行 `useEffect` 內的函式，這樣的現象周而復始形成了計時器。

**"但是"**，若在 `App` 內部加入一個重新計時的 `<button>` 時，卻出現了問題，按下 `<button>` 重製 `sec` 後，顯示在頁面上的數字並沒有按照每秒增加 1 的速度更新， 其原因在於計時器並沒有停止計時， 當我們按下 `<button>` 的時，觸發了 State 的更新 (`sec===0`)，因此 `App`重新渲染產生新的計時器，此時等於有兩台計時器在同時進行，也因此每多按一下， `set` 的數字增加的越快。

```jsx
// 沒有 cleannp function 
const App = () => {
  const [sec, setSec] = useState(0);

  useEffect(()=>{
   const timer= setTimeout(()=>{
      setSec(preSec=>preSec+1);
    },1000);
  }, [sec]);
  
  return (
    <div className="app">
      <p>Time : {sec}</p>
      <button onClick={()=>setSec(0)} >Reset Timer</button>
    </div>
  );
}
```

![useeffect-cleanup-illustration](https://github.com/ChiuWeiChung/IMGTANK/blob/main/react/useEffect-cleanup-illustration-1.gif?raw=true)

```js
// ======計時開始======
//         |
//       set + 1
//         |-------------(按下Button 觸發 App
//  (最初的計時器仍存在)   重新渲染產生新計時器)
//       set + 1               |
//         |                set + 1
//       set + 1               |
//         |                set + 1-----(再次按下 Button 重
//       set + 1               |         新渲染產生新計時器)
//         |                set + 1         |
//       set + 1               |         set + 1 
//        ...                ...           ...
```

### **使用 cleanup function**

為了解決這個 Bug ，我們必須在 `useEffect` 中的匿名函式"**尾端**"回傳一個用來清除 Effect 的函式， 該函式會在兩個時間點執行，分別是 :

1. 下次匿名函式被呼叫之前
2. Function Component 被 `Unmount` 之前


```jsx
 useEffect(()=>{
   const timer= setTimeout(()=>{
      setSec(preSec=>preSec+1);
    },1000);
    return ()=> clearTimeout(timer)
  }, [sec]);
```

![useeffect-cleanup-illustration-2](https://github.com/ChiuWeiChung/IMGTANK/blob/main/react/useEffect-cleanup-illustration-2.gif?raw=true) 


## 總結

綜合上述的特性，我們可以把 `useEffect` 當作 Class Component 中的 `componentDidMount` + `componentDidUpdate` + `componentWillUnmount` 的集合體。

1. 當作為第二個參數的 dependencies 為空 Array 時，行為就像 `componentDidMount`。
2. 將 State 或是 Props 作為第二個參數傳遞時，行為就像 `componentDidUpdate`。
3. 在昨為第一個參數的匿名函式內的尾端回傳一個　cleanup 函式，行為就像 `componentWillUnmount`。

# 參考資料
* [What the React? Sagas and side effects](https://smartcar.com/blog/what-the-react-sagas/)
* [React - The Complete Guide (incl Hooks, React Router, Redux)](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)
* [使用 React Hook](https://zh-hant.reactjs.org/docs/hooks-effect.html)
