# Components 優化 ( React.memo & useCallback)

黨 React Component 中的 State 被觸發更新 ( `setState` or `useState` ) 後，除了本身Component 會重新渲染之外， 會連帶其內部的 Child Components 一起重新渲染，對於簡單平滑結構的 React App 而言，Parent Component 的重新渲染不會有太大影響，但若是相對複雜的結構 (眾多 Child Components) 而言， 效能上的差異就會變得非常明顯。

## Function Component 的重新渲染

如下方程式碼，雖然 `DemoOutput` 的 Props ( `show` ) 恆為 `false` ，但在點擊 `App` 內部的 `<button>` 後觸發了 State 的更新 ( `showParagraph` )，因此連帶 `DemoOutput` 的重新渲染。

```jsx
const DemoOutput = React.memo((props) => {
  console.log("Demo Component");
  return <p>{props.show ? "Hakuna Matata" : null}</p>;
});

const App = () => {
  const [showParagraph, setShowParagraph] = useState(false);
  const clickHandler = () => {
    setShowParagraph((prevState) => !prevState);
  };
  console.log("App running");
  return (
    <div className="app">
      <DemoOutput show={false} />
      <button onClick={clickHandler}>BUTTON</button>;
    </div>
  );
};
```

![rerender-illustration](https://github.com/ChiuWeiChung/IMGTANK/blob/main/react/rerender-illustration-1.gif?raw=true)

## **React.memo** 避免不必要的渲染

由於 `DemoOutput` 的Props ( `show` ) 為定值，重新渲染不會改變回傳的結果，為了避免這樣情況發生，我們可以透過 `React.memo` 來告訴 React 在特定情況下 ( `props` 的改變) 才允許 Component 重新渲染。

```jsx
const DemoOutput = React.memo((props) => {
  console.log("Demo Component");
  return <p>{props.show ? "Hakuna Matata" : null}</p>;
});
```

被 `React.memo` 包起來的 Component 會被 React "特別關照"， 也就是**確認所傳入的Props (如 `DemoOutput` 的 `show` ) 與前一次傳入的 Props是否
相同 (=== 等概念)**，若沒有改變，便不會強迫該 Component 重新渲染。

![rerender-reactmemo-illustration](https://github.com/ChiuWeiChung/IMGTANK/blob/main/react/rerender-illustration-2.gif?raw=true)

> ** `React.memo` 僅能使用在 Function Component** ，對於 Class Component 的而言，可以透過 `React.PureComponent` 達到相同效果。

## 須注意的陷阱

雖然透過 `React.memo` 可以避免 Component 在 Props 沒有改變下重新執行，但需要注意的是如果傳入的 Props 為函式 (如 Event Handler) 的時候，即使該函式沒有變化，仍會觸發渲染機制，如下方程式碼，即將 `React.memo` 套用在 `Button` 上，觸發 Event Handler 仍會使 `Button` 發生重新渲染。

```jsx
const DemoOutput = React.memo((props) => {
  console.log("Demo Component");
  return <p>{props.show ? "Hakuna Matata" : null}</p>;
});

const Button = React.memo((props) => {
  console.log("Button Component");
  return <button onClick={props.onClick}>{props.children}</button>;
});

const App = () => {
  const [showParagraph, setShowParagraph] = useState(false);
  const clickHandler = () => {
    setShowParagraph((prevState) => !prevState);
  };
  console.log("App running");
  return (
    <div className="app">
      <DemoOutput show={false} />
      <Button onClick={clickHandler}>Click me</Button>
    </div>
  );
};
```
![usecallback-illustration-1](https://github.com/ChiuWeiChung/IMGTANK/blob/main/react/usecallback-illustration-1.gif?raw=true)

為何 `Button` 仍會重新渲染呢，若重新探討整個過程的話:

1. 我們將 `App` 內的 `clickHandler` 作為 Props 傳入 `Button` 內部。
2. 點擊 `Button` 觸發 `clickHandler` 內的 State (`showParagraph`) 發生更新。
3. **`App` 發生重新渲染 (整個 Function Component 重新執行)。**
4.  **`App` 內部的 `clickHandler` 再次被宣告。**
5. React 確認被套用 `React.memo`的 Child Components 是否在 Props 上有發生變化，有的話就重新渲染。

上面的過程中，**問題**就發生在第 3 - 4 階段，
雖然傳入的 `Button` 內的 Props (`clickHandler`) 內容一樣，但由於`App` 重新渲染，宣告了"新的 `clickHandler`"，而在 JavaScript 中，因為函式屬於物件型別 ( [型別筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/primitive-object-type.markdown) )， 在判定新舊 Props 的過程中， **`新onClick === 舊onClick` 的結果為`false`**，因此仍會觸發 `Button` 重新渲染。


## 解決的辦法 - **useCallback**

為了避免傳入函式 Props 的 `Button` 重新渲染，必須告訴 React "請記住這個函式，在非必要的情況下請不要重新宣告它"，我們可以使用 React Hooks 中的 `useCallback` 並搭配 `React.memo` 來幫助我們達到想要的效果。 `useCallback` 可以幫助我們將函式儲存起來，避免再重新渲染中又被重新宣告，如下方程式碼，將 Event Handler 做為 `useCallback` 第一個參數，其中第二個參數為 dependencies ，形式為 Array，React 會觀察 Array 內部的是否出現變化來決定 `clickHandler` 是否要被重新宣告。若 Array 為空， `clickHandler` 就永遠不會被重新宣告。

```jsx
const clickHandler = useCallback(() => {
    setShowParagraph((prevState) => !prevState);
  },[]);
```
![usecallback-illustration-2](https://github.com/ChiuWeiChung/IMGTANK/blob/main/react/usecallback-illustration-2.gif?raw=true)




