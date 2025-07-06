# JavaScript簡介 Part1

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，內容經消化吸收後以筆記方式歸納記錄下來，部分程式碼非原創，原創內容請參考上述課程連結。

## Wikipedia 上的 JavaScript 的介紹
如果搜尋維基百科上的 JavaScript，第一段對他的解釋就是: 「JavaScript often abbreviated as JS, is a programming language that conforms to the ECMAScript specification. JavaScript is **High-Level**, often **just-in-time compiled**, and **multi-paradigm**. It has curly-bracket syntax, **dynamic typing**, **prototype-based object-orientation**, and **first-class functions**.」 

上述落落長的解釋用了許多專有名詞去形容 JavaScript 的特性，讓人看了眼花撩亂，在這篇我先針對JavaScript所擁有的 **1.High-Level** 、 **2.JIT Compiled** 、 **3.One Single Thread** 特性做心得分享。


## 1. High-Level Programming Language
High-Level 的語法偏向人類較看得懂但機器就看不懂的語言，若要與機器溝通需要透過翻譯 (Compiler or Interpreter) 轉換成機器看得懂的二進位文件 (0&1) 。

Low-level 語法對人們而言較生硬但機器較看得懂的語言，也因此 Low-Level 可直接與機器溝通; 在執行上Low-Level較容易受硬體限制，而 High-Level 不會收到 CPU 的影響。

常見的 C 語言就是屬於 Low-Level ，想當初在接觸 C 語言時，認為最麻煩的是在配置變數的記憶體，JavaScript&Python則屬於 High-Level ，宣告變數時不需要設定記憶體，但無法像 C 語言為了加速執行速度針對變數做記憶體的優化。


## 2. Just-In-Time Compiled
在上一段有談到因為 High-Level 是人類比較看得懂的語言，在執行過程需要透過翻譯才可以與電腦溝通，於是這邊來討論 Source Code 是如何透過翻譯轉成電腦可以理解的語言，一般而言可分為 `Compilation (編譯) ` & `Interpretation (直譯) ` & `Just-In-Time Compilation (即時編譯) `。

* **Compiler** :  
在代碼執行前，先將 Source Code 全部一次轉換成機器可以理解的語言。 優點:速度快，可獨立運行; 缺點:除錯速度慢; 代表: C 語言。
* **Interpreter** :  
Source Code 會一行一行的 (step by step) 轉為 Machine Code 。 優點:靈活性高; 缺點:速度較 Compiler 慢，需要執行環境 (Execution context) 才可執行; 代表: JavaScript 。
* **Just-In-Time Compilation** :  
結合 Compiler 以及 Interpreter 的優點，並優化執行速度，近年有些瀏覽器 ( Google 的 V8 engine) 已導入 JIT Compiler 。

## 3. One Single Thread & Non-blocking event loop
One Single Thread 主要是在描述 JavaScript 面對多項任務時是如何處理;在下方方程式碼輸出結果可以推論得知，輸出的順序與呼叫的順序是一致的，表現出 JavaScript 處理程式碼時是逐行進行 (line by line) ，所以在一個時間點只能夠處理一件事情，即為 one single thread 。

這樣的特性可能會使人誤解，若遇到需要花時間處理的任務 (ex: 透過 Google Map 提取地圖資訊，需要時間等待) ，是不是就會拖延到後面的作業了呢? 其實不然，因為 JavsScript 特別之處在於擁有[事件循環 (Event Loop) ](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/execution-stack-context.markdown)的機制，藉由事件循環機制將待執行的任務拖至背景下執行。

```js
const first = function (){
        console.log("execute 1");
        second();
        console.log("The end")
};
const second = ()=>{
        console.log("execute 2");
};
first();  
// execute1
// execute2
// The end
```


### 參考資料
* [電腦不難](http://it-easy.tw/assembly-language)
* [GEEKSFORGEEKS](https://www.geeksforgeeks.org/difference-between-high-level-and-low-level-languages/)
* [bitsrc.io](https://blog.bitsrc.io/the-jit-in-javascript-just-in-time-compiler-798b66e44143)
* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)


<!-- 
## Garbage-collected 
自動去除`不需要&老舊`的記憶體空間(Cleaning from time to time)
## Imperative paradigm & Declarative paradigm


* Concurrency model: how the JS engine handles multiple tasks happening at the same time.
* JavaScript runs in one single thread, so it can only do on thing a a time
* Sounds like it would block the single thread. However. we want non-blocking behavior
* BY using an event loop: takes long running tasks, executes them in the `background`, and puts them back in the main thread once they are finished.

# Multi-paradigm
許多程式語言可能都擁有上述三種Paradigm的其中一種，然而JavaScript最特別的地方在於中集三種Paradigm(PP、 OOP、 FP)於一身，這部分我會在另外一個主題來做紀錄
* Procedural programming (PP) : 也就是step by step方式去執行程式(one thread)
* Object-oriented programming (OOP)
* Functional programming (FP)

## First-class functions
在JavaScript當中，他的函數屬於first-class functions，意思是:
* 函數可存放於變數(variable)、物件(object)、陣列(array) (sotred in a variable, object, or array)。
* 可以做為`argument`傳入另一個函數當中 (passed as an argument to a function)。
* 也可以被另外一個函數`return` (return from a function)。


## Multi-paradigm& Prototype-based object-oriented& Dynamically-typed language;
 -->

