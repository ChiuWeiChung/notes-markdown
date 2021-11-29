# React 的渲染 (render) 以及 Virtual DOM

在介紹 React 的渲染 (render) 之前，先介紹 DOM 以及 React 的 Virtual DOM 之間的互動機制。

## 什麼是 DOM (Document Object Model) ?

 DOM (Document Object Model) 是透過瀏覽器產生出來的結構，並以 HTML 的形式呈現在我們的螢幕上，我們可以透過瀏覽器的 DOM API 並以 JavaScript 針對 DOM 進行內容、結構、樣式上的動態操作 ( `document.querySelector()...` )。

## 什麼是 VDOM (Virtual DOM) ?

 React 中的 Virtual DOM (VDOM) ，顧名思義是一個虛擬的 DOM ， 當我們透過 `setState` 或是 `useState` 進行 State 的更新時， Component 會重新執行並回傳更新後的內容 ， 但新內容並不會直接應用在 DOM 上，而是先應用在 VDOM 身上， **React 會將新舊 VDOM 進行比對，最後只將改動的內容應用在 DOM 身上** ， 如果新舊 VDOM 沒有差別， DOM 就不會更新， 這樣的機制稱為 Diffing。 

### **範例**:

如上面提到的， React 在更新過程中會比對新舊 VDOM 決定哪些內容要應用在真的 DOM 上面， 如下面的程式碼，當我們觸發 `<button>` 內的 Event Handler 來控制 `showParagraph` 的變化， 同時透過瀏覽器檢視 HTML 的變化，會發現只有 `<p>...</p>` 在變化 (閃爍)，證明了 React 只會針對有更動的內容應用在真實的 DOM 上。

```jsx

const App = () => {
  const [showParagraph, setShowParagraph] = useState(false);
  return (
    <div className="app">
      <h1>I love The Lion King</h1>
      <p>{showParagraph? 'hi':null} </p>
      <button onClick={() => setShowParagraph((prevState) => !prevState)}>
        Click me
      </button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

![DOM VDOM Illustration](https://github.com/ChiuWeiChung/IMGTANK/blob/main/react/DOM-VDOM-illustration.gif?raw=true)


## React 中的渲染 (render)

React 中的渲染 (render) 除了指的是執行 Class Components 內的 `render(){...}` ， 對於 Function Components 而言也等同於執行整個 Function Components 。 

### **重新渲染 (re-render) 的時機 ?**

每當 Component 內的 State 發生改變時 (透過 `setState` 或是 `useState` ) ，React 會安排 Component 進行重新渲染， 不僅僅是 Component 本身，其底下的 Child Components 也會重新渲染。

下方程式碼的 Parent Component ( `App` ) 含有兩個 Child Components ( `Content` 和 `Footer` ) ，每當點擊 `<button>` 觸發 State 的更新時， Parent Component ( `App` ) 會進行重新渲染 (re-render) ，它底下的兩個 Child Component ( `Conetnet` 和 `Footer` ) 也會進行重新渲染 (無論是否帶著 `props` )。

```jsx
const App = () => {
    const [showContent, setShowContent] = useState(false);
    const clickHandler = ()=>{
        setShowContent((prevState)=>!prevStateF)
    }
    return (
         <div>
            <h1> App </h1>
            <Content show={showContent}/>
            <button onClick={clickHandler}>Click Me</button>
            <Footer/>
        </div>
    );
};
```

上述的過程中觸發 3 次 Component ( `App` , `Content` , `Footer` ) 的 re-render，但由於 React 會比對新舊 VDOM 的差異 (僅有 `Content` 的內容改變)，因此對於 DOM 而言，實際上只有改變 1 次，且改變的部分只有 `Content` 的內容。這個機制的好處在於 DOM 不需要重新建立整個 UI ，有了 React VDOM的 Diffing 機制， 僅需要針對 DOM 中需要更動的內容進行變更即可。

## 效能影響

雖然 React 讓 DOM 可以做出最有效率的更新， 但對於複雜的結構而言 (巢狀結構， Child 內部又有 Child )，可能會出現效能議題。

如下方式意圖，假如我們在 `Parent` 內觸發了 State 的更新 ( `setState` 或是 `useState` )，除了 `Parent` 本身會進行重新渲染外，也會連帶底下的 Child Components ( `B` - `M` ) 一起重新渲染，若某些 Child Components 僅僅單純是回傳純 `JSX` 的話 (不帶 `props` )，重新渲染除了沒有意義之外，還會造成效能上的浪費。 也因此我們在建立 React App 的過程應該好好思考 Component 的架構來避免 "牽一髮而動全身" 的情況發生。

```js
// =========Component Tree=========
// 
//            Parent
//            /     \
//           B       C
//         /  \     /  \
//        D    E   F    G
//       / \      / \  / \
//      H   I    J   K L  M    
```


# 參考資料
* [When does React re-render components?](https://felixgerschau.com/react-rerender-components/)
* [How and when to force a React component to re-render](https://blog.logrocket.com/how-when-to-force-react-component-re-render/)
* [React - The Complete Guide (incl Hooks, React Router, Redux)](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)
