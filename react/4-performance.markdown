# Components 優化 ( React.memo & useCallback & useMemo)

當 React Component 中的 State 被觸發更新 ( `setState` or `useState` ) 後，除了本身Component 會重新渲染之外， 會連帶其內部的 Child Components 一起重新渲染，對於簡單平滑結構的 React App 而言，Parent Component 的重新渲染不會有太大影響，但若是相對複雜的結構 (眾多 Child Components) 而言， 效能上的差異就會變得非常明顯。

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

> **`React.memo` 僅能使用在 Function Component** ，對於 Class Component 的而言，可以透過 `React.PureComponent` 達到相同效果。

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

## 使用 React.memo 需要注意的地方

React.memo 適用於那些具有大量靜態（不變）內容的組件，可以有效地避免不必要的渲染和更新。然而，React.memo 只對比 props 的淺層相等性（shallow equality）。如果 props 包含複雜的嵌套結構，則可能需要使用其他方式來進行深層比較，例如使用自定義的比較函數或使用 immutability libraries（如 Immutable.js）來管理 props。這可以確保在需要深層比較的情況下，React.memo 可以正確地判斷是否重新渲染組件。

## 自定義 React.memo 的 Comparsion 邏輯

當 React.memo 檢測到組件的 props 發生變化時，如上述所說會使用淺層比較（shallow comparison）來判斷是否重新渲染組件。也就是說，它會將新的 props 與之前的 props 進行 === 或 strict equality 比較。但有時候，我們可能需要對比複雜的 props 結構，或者希望使用自定義的比較邏輯。這時候可以使用 arePropsEqual 參數來定義一個自定義的比較函數。

```js
const MyComponent = React.memo((props) => {
  // 組件的內容
}, arePropsEqual);
```

arePropsEqual 是一個函數，接收兩個參數，分別是新的 props 和之前的 props。該函數應返回一個 boolean，指示新的 props 是否等於之前的 props。如果返回 true，則組件不會重新渲染；如果返回 false，則組件會重新渲染。

使用 arePropsEqual 可以根據自己的需求來定義 props 的比較邏輯。例如，可以比較 props 中的特定屬性，或者進行深層比較，以確定是否重新渲染組件。這樣可以更加細粒度地控制組件的重新渲染行為，從而提升性能。

---

## useMemo 的介紹
在 React 中，useMemo 是一個自訂的 hook 函式，用於優化元件的效能。它的作用是在渲染過程中記住（或"快取"）某個值，只有當 dependencies 的變數發生變化時，才重新計算這個值。這樣可以避免不必要的計算，提升元件的效能。

useMemo 接受兩個參數：function 和 dependencies 的變數陣列。function 只會在初始渲染和 dependencies 變化時被執行，並返回計算的結果。當相依的變數沒有變化時，useMemo 會返回之前快取的值，而不重新計算。

以下是一個簡單的例子，演示如何使用 useMemo：

```js
import React, { useMemo, useState } from 'react';

const ExampleComponent = () => {
  const [count, setCount] = useState(0);

  // 使用 useMemo 緩存計算結果
  const expensiveCalculation = useMemo(() => {
    console.log('Performing expensive calculation...');
    let result = 0;
    for (let i = 0; i < 1000000000; i++) {
      result += i;
    }
    return result;
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Expensive Calculation: {expensiveCalculation}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

```

在這個例子中，我們將 expensiveCalculation 設定為一個昂貴的計算，使用 useMemo 進行緩存。每次點擊 "Increment" 按鈕時，只有 count 的值改變，expensiveCalculation 的計算結果並不會改變，因此 useMemo 會直接返回先前緩存的計算結果，不會重複執行計算。

### **什麼情況下需要用到 useMemo?**

* 避免重複複雜的計算：當需要進行昂貴的計算或複雜的資料處理時，可以使用 useMemo 緩存計算結果，避免重複計算。這對於提升效能是很有幫助的，特別是在大型資料集或計算密集型的場景下。
* 避免不必要的渲染：當一個值的變化不會影響到其他相依的元件或效果時，可以使用 useMemo 避免不必要的渲染。這可以減少渲染的次數，提升效能。
* 快取外部資源：當需要存取外部資源（例如 API 請求或計算結果）並希望在相依變數不變時保持資源的一致性時，可以使用 useMemo 來緩存資源。這可以避免不必要的請求或資源的重新計算，提升效能並減少不必要的網路流量。

總而言之，當有需要在 React 元件中優化效能或避免不必要的計算或渲染時，可以考慮使用 useMemo。此外，**需要注意的是**，useMemo 主要用於優化複雜的計算，當你的計算具有明顯的成本時，才值得使用 useMemo。對於簡單的計算或輕量級的操作，`使用 useMemo 可能不會帶來顯著的效能提升，甚至可能造成額外的開銷`。因此，在決定是否使用 useMemo 時，需要仔細評估計算的複雜性和頻率，並根據情況做出適當的選擇。

# 參考資料
* [When does React re-render components?](https://felixgerschau.com/react-rerender-components/)
* [How and when to force a React component to re-render](https://blog.logrocket.com/how-when-to-force-react-component-re-render/)
* [React - Batch Updating](https://github.com/facebook/react/issues/10231#issuecomment-316644950)
* [React - The Complete Guide (incl Hooks, React Router, Redux)](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)



