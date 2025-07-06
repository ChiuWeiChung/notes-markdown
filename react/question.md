
<!-- Create a Catalog for me -->
# React 面試題目目錄

## 基礎概念
- [1. React 中的 lifting state up 是什麼？為什麼需要這樣做？](#1-react-中的-lifting-state-up-是什麼為什麼需要這樣做)
- [2. 什麼是 React 的 concurrent rendering？與傳統 rendering 有何不同？](#2-什麼是-react-的-concurrent-rendering與傳統-rendering-有何不同)

## 核心機制
- [3. React 的 reconciliation（協調）機制是什麼？](#3-react-的-reconciliation協調機制是什麼)
- [4. 請解釋什麼是 hydration？SSR（Server Side Rendering）與 CSR 有何差異？](#4-請解釋什麼是-hydrationssrserver-side-rendering與-csr-有何差異)

## 錯誤處理與架構
- [5. 請說明 React 中的錯誤邊界（Error Boundary）是什麼？如何實作？](#5-請說明-react-中的錯誤邊界error-boundary是什麼如何實作)
- [6. 在 React 專案中你會如何分層（如 Container vs Presentational component）？](#6-在-react-專案中你會如何分層如-container-vs-presentational-component)

## 錯誤處理進階
- [7. React 錯誤邊界只能在哪些情境下使用？](#7-react-錯誤邊界只能在哪些情境下使用)

## Context 與狀態管理
- [8. React Context 的用途是什麼？它有哪些限制？](#8-react-context-的用途是什麼它有哪些限制)

## Hooks 應用
- [9. React 中 useRef 有哪些應用場景？](#9-react-中-useref-有哪些應用場景)

## 實際問題解決
- [10. 你正在開發一個 React 元件，當使用者點擊「儲存」按鈕時，會發送 API 請求將表單資料儲存至伺服器。目前遇到的問題是：使用者快速連續點擊按鈕時，可能觸發多次請求，導致資料狀態混亂或重複送出。](#10-一個元件在快速重複點擊後發生資料不一致你會怎麼處理)

## 效能優化
- [11. 什麼是 key prop？它為什麼對於 list rendering 很重要？](#11-什麼是-key-prop它為什麼對於-list-rendering-很重要)

---

**總計：11 題 React 面試題目**



### 1. React 中的 lifting state up 是什麼？為什麼需要這樣做？

**定義：** 將多個元件共享的 state 上移到最近的共同父元件，由其統一管理。

**用途：** 讓子元件共享狀態、避免重複管理與狀態不一致。

---

### 2. 什麼是 React 的 concurrent rendering？與傳統 rendering 有何不同？

**傳統 rendering：** 單一、同步、一旦開始無法中斷。

**Concurrent rendering：** React 18 引入的機制，可中斷並排程不同優先級的更新，讓 UI 更流暢。

---

### 3. React 的 reconciliation（協調）機制是什麼？

**定義：** React 比對前後 Virtual DOM 的差異，以最小 DOM 操作方式更新畫面。

**特點：** 根據 key、型別與位置決定是否重用或重建節點。

---

### 4. 請解釋什麼是 hydration？SSR（Server Side Rendering）與 CSR 有何差異？

**Hydration：** React 在瀏覽器接手伺服器傳來的靜態 HTML，附加互動功能的過程。

**SSR vs CSR：**

* SSR：HTML 由 server 預先渲染，SEO 佳，需 hydration。
* CSR：HTML 由 client 自行建構，首屏白但互動快。

---

### 5. 請說明 React 中的錯誤邊界（Error Boundary）是什麼？如何實作？

**定義：** 一種 class component，可捕捉其子元件 render、constructor、lifecycle 中的錯誤。

**實作：** 實作 `getDerivedStateFromError()` 與 `componentDidCatch()` 方法。

---

### 6. 在 React 專案中你會如何分層（如 Container vs Presentational component）？

**分層目的：** 關注點分離。

* Container Component：資料處理、API 請求、狀態控制。
* Presentational Component：純粹呈現 UI，不包含邏輯。

---

### 7. React 錯誤邊界只能在哪些情境下使用？

**可以捕捉：**

* 子元件 render error
* constructor error
* lifecycle（如 componentDidMount）error

**不能捕捉：**

* `onClick` 等事件錯誤
* 非同步錯誤（如 fetch）
* Hook 中 throw 的錯誤

---

### 8. React Context 的用途是什麼？它有哪些限制？

**用途：** 傳遞跨層級資料（如 auth、theme）避免 props drilling。

**限制：**

* 所有使用該 context 的元件會在 value 改變時重新 render。
* 不適合高頻變動的資料。

---

### 9. React 中 useRef 有哪些應用場景？

* DOM 存取（focus、scroll 等）
* 保留跨 render 的值（如 counter）
* 清除 timer（ref 保存 setTimeout id）
* 記錄前一筆資料

---

### 10. 一個元件在快速重複點擊後發生資料不一致，你會怎麼處理？

**解法：**

* 加上 loading flag 防止重複觸發
* 使用 `AbortController` 中止舊的請求
* 使用 `debounce` 或 `throttle` 限制觸發頻率

---

### 11. 什麼是 key prop？它為什麼對於 list rendering 很重要？

**key 的作用：** 幫助 React 正確辨識 list 中的元素，決定保留、更新或移除哪些節點。

**為什麼重要：**

* 提高效能（避免重建 DOM）
* 維持元素狀態（如 input value 不跳動）

**建議：** 優先使用資料的唯一 id；避免用 index 作為 key。
