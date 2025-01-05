
# 執行堆疊 (Execution Stack) 與執行環境 (Execution Context)

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 的課程筆記，內容經過消化吸收後整理成筆記形式，部分程式碼非原創。原始內容請參考上述課程連結。

---

## JavaScript Runtime

JavaScript 的程式碼執行需要先經過[直譯（interpret）](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/KnowJs1.markdown)，將程式碼轉換為機器碼（一種由 0 與 1 組成的語言，機器可以理解）。轉譯後的機器碼需在 JavaScript 引擎內執行，具體來說是透過執行堆疊 (Execution Stack, ES)。也就是說，若沒有引擎的支援，機器碼無法執行。

> 不同的瀏覽器使用不同的 JavaScript 引擎，例如 Google Chrome 的 V8 引擎是其中較為知名的一款。

---

## JavaScript 引擎中的執行堆疊 (Execution Stack) 與堆內存 (Heap)

在 JavaScript 引擎的執行過程中，每個任務 (job) 都擁有其對應的執行環境 (Execution Context, EC)。JavaScript 引擎使用執行堆疊 (Execution Stack, ES) 來管理這些執行環境，任務的執行環境會依序堆疊進入執行堆疊。

執行環境包含以下三個主要組成部分：
1. **變數**：例如 `var`、`let`、`const`、函式、`arguments` 等。
2. **範疇鏈 (Scope Chain)**：[範疇筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/scope.markdown)。
3. **This**：[This 筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/this-in-javascript.markdown)。

執行環境只有在任務被呼叫時才會堆疊至執行堆疊中。

以下範例說明了執行環境的運作：
```javascript
const myName = "Rick";                        
const first = function (){  
    var a = 1                
    b = second(2, 3);        
    const c = a + b;
    return c;
};  

const second = (x, y) => {
    let d = 4;
    return d;
};

first();  
```

在 `first()` 被呼叫前：
1. **Global 執行環境**儲存背景資訊，例如 `myName="Rick"`、`first` 及 `second` 的程式碼。
2. **First 執行環境**儲存函式內的資料，例如 `a=1`、`b=unknown`、`c=NaN`（因為尚未執行）。
3. **Second 執行環境**儲存 `arguments=[2,3]` 及 `d=4` 的資訊。

![Execution Context](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/execution%20context.png?raw=true)

---

## 執行環境 (EC) 的堆疊方式

執行環境在執行堆疊中的堆疊順序依照程式執行的順序進行。當任務執行完畢後，其執行環境會被移出堆疊。以下範例展示了此過程：

```javascript
const first = function (){
    console.log("execute 1");
    b = second();
    console.log("The end");
};
const second = () => {
    console.log("execute 2");
};

first();  
// Output:
// execute 1
// execute 2
// The end
```

![Execution Stack](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/simpleCallstack.gif?raw=true)

> 執行堆疊遵循 LIFO（Last In, First Out）原則。

---

## JavaScript Runtime = JavaScript 引擎 + WEB APIs + Callback Queue

除了 JavaScript 引擎，完整的 Runtime 還需要以下兩個核心組件：
1. **WEB APIs**：提供與 DOM、計時器函式 (如 `setTimeout`) 及 `fetch` API 等互動的功能。
2. **Callback Queue**：儲存等待執行的回呼函式。

### 執行流程
以下範例說明 Runtime 的運作流程：
1. JavaScript 引擎處理程式碼時採單線程方式，依序執行。
2. 當觸發事件（如 `onClick`）時，事件的回呼函式會進入 Callback Queue。
3. 當執行堆疊中的任務全數執行完畢後，事件環 (Event Loop) 會將回呼函式推入執行堆疊中執行。

![Event Loop](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/eventloop.gif?raw=true)

> **註**：DOM 操作、計時器函式等功能並非 JavaScript 的內建能力，而是由瀏覽器提供的 WEB APIs 支援。

---
