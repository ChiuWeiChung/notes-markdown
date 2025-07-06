
# Event Loop 、Web APIs 與 (Micro)task Queue

> 本筆記基於 [Lydia Hallie 的影片](https://www.youtube.com/watch?v=eiC58R16hb8&list=LL&index=3&ab_channel=LydiaHallie) 整理，深入探討 JavaScript 的 Event Loop 運作機制。

---

## 什麼是 Event Loop？

JavaScript 的Event Loop 是一種機制，用於協調執行堆疊（Call Stack）、Web APIs 和任務佇列（Callback Queue）之間的工作流程。它確保非同步操作得以有序執行。

---

## 組成部分

1. **執行堆疊（Call Stack）**
   - JavaScript 單執行緒運行，所有程式碼的執行都發生在執行堆疊中。
   - 當函式被呼叫時，其執行環境會被推入堆疊頂部；執行結束後，環境會被彈出。

2. **Web APIs**
   - 瀏覽器提供的功能，例如 `setTimeout`、DOM 操作、HTTP 請求等，並非 JavaScript 語言的一部分。
   - 這些 API 在非同步操作中扮演了重要角色。

3. **任務佇列（Callback Queue）**
   - 任務佇列分為：
     - **Task Queue**：包含 `setTimeout`、`setInterval`、HTTP 請求等。
     - **Micro Task Queue**：包含 `Promise` 的 `.then()`、`MutationObserver` 等。
   -  Micro Task Queue 的執行優先於 Task Queue 。

---

## Event Loop 的工作流程

1. **執行堆疊執行程式碼**
   - 程式碼的同步部分首先在執行堆疊中執行。

2. **非同步操作移交至 Web APIs**
   - 例如 `setTimeout` 設定的計時器，會交由 Web APIs 處理。

3. **完成後推入任務佇列**
   - 當非同步操作完成後，回呼函式被放入相應的任務佇列中。

4. **Event Loop 檢查並執行任務**
   - 當執行堆疊為空時，Event Loop 會從 Micro Task Queue 中取出任務執行，接著處理 Task Queue。

---

## 範例程式碼

```javascript
console.log('Start');

setTimeout(() => {
    console.log('Task Queue');
}, 0);

Promise.resolve().then(() => {
    console.log('Micro Task');
});

console.log('End');

// Output:
// Start
// End
// Micro Task
// Task Queue
```

步驟解析
1.	console.log('Start') 和 console.log('End') 屬於同步程式碼，直接執行。
2.	setTimeout 的回呼函式被放入 Task Queue 佇列。
3.	Promise.resolve().then 的回呼函式被放入 Micro Task 佇列。
4.	當同步程式碼執行完後，Event Loop 會優先執行 Micro Task，最後執行 Task Queue。

## `setTimeout` 的運作機制

1. **執行過程**：
   - 當執行到 `setTimeout` 時，該函式會被添加到執行堆疊（Call Stack）。
   - 然而，`setTimeout` 並不會立即執行回呼函式（Callback），而是將回呼函式註冊到 **Timers API** 中，並設置延遲時間（Delay）。
   - 延遲時間完成後，瀏覽器會將回呼函式移到 **任務佇列（Task Queue）** 中，等待執行堆疊清空後再執行。

2. **重要概念**：
   - **延遲** 是指回呼函式從 `Timers API` 移到任務佇列的時間，而非函式執行的時間。
   - 如果執行堆疊中仍有任務，回呼函式仍需等待執行堆疊清空後才能被執行。

3. **範例執行流程**：
   ```javascript
   console.log("Start");

   setTimeout(() => {
       console.log("100ms Timer");
   }, 100);

   setTimeout(() => {
       console.log("2000ms Timer");
   }, 2000);

   console.log("End");
   ```

   - **執行順序**：
     1. `console.log("Start")` 被執行並立即打印。
     2. 第一個 `setTimeout` 註冊回呼函式至 `Timers API`，設定 100 毫秒的延遲。
     3. 第二個 `setTimeout` 註冊回呼函式至 `Timers API`，設定 2000 毫秒的延遲。
     4. `console.log("End")` 被執行並立即打印。
     5. 100 毫秒後，第一個回呼函式移到任務佇列，執行堆疊清空後執行，打印 "100ms Timer"。
     6. 2000 毫秒後，第二個回呼函式移到任務佇列，執行堆疊清空後執行，打印 "2000ms Timer"。

---

## Microtask 與 Promise 的運作機制

1. **Microtask Queue**：
   - 微任務佇列（Microtask Queue）專門用來處理 `Promise` 的回呼函式（`then`、`catch`、`finally`）以及其他微任務（例如 `MutationObserver`）。
   - 微任務的執行優先級高於宏任務，會在每次事件循環（Event Loop）中被優先處理。

2. **事件循環中的執行順序**：
   - 當執行堆疊清空後，事件循環會先檢查微任務佇列，將所有微任務移至執行堆疊執行。
   - 微任務執行完後才會處理宏任務（如 `setTimeout` 的回呼函式）。

3. **範例執行流程**：
   ```javascript
   console.log("Start");

   setTimeout(() => {
       console.log("Task Queue");
   }, 0);

   Promise.resolve().then(() => {
       console.log("Micro Task");
   });

   console.log("End");
   ```

   - **執行順序**：
     1. `console.log("Start")` 被執行並立即打印。
     2. `setTimeout` 註冊回呼函式至 `Timers API`。
     3. `Promise.resolve().then` 的回呼函式被添加到微任務佇列。
     4. `console.log("End")` 被執行並立即打印。
     5. Microtask Queue 的回呼函式被執行，打印 "Micro Task"。
     6. Task Queue 的回呼函式被執行，打印 "Task Queue"。

---



## 總結

- **`setTimeout`** 的回呼函式會在指定延遲後進入 **任務佇列**，等待執行堆疊清空後執行。
- **Promise** 的回呼函式（`then`、`catch` 等）會進入 **微任務佇列**，並在事件循環中優先處理。
- 微任務與宏任務的執行順序遵循以下規則：
  1. 執行同步程式碼。
  2. 清空微任務佇列。
  3. 執行一個宏任務，然後重複步驟 2。

- 了解事件環與任務佇列的細節，對於 Debug 和程式優化至關重要。

---
