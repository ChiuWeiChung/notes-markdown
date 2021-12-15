# 演算法筆記-淺談動態規劃 (Dynamic Programming)

> 本文為 [JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/) 之學習筆記，經自己理解歸納後以筆記形式記錄下來，部分程式碼非原創。

動態規劃事實上不僅限於電腦科學，在其他領域上也有應用到; 動態規劃是將複雜問題切割成許多相對簡單的小問題後，再針對這些小問題進行著手的方法。在電腦科學的應用上，動態規劃時常運用在有 1. 重疊子問題  (Overlapping Subproblems) 以及 2. 最佳子結構 (Optimal Substructure) 兩特性的問題上。

1. **重疊子問題 (Overlapping Subproblems)** :  
也就是將複雜問題切割後，是否有出現重複的子問題，若有出現重複子問題。

2. **最佳子結構 (Optimal Substructure)** :  
該問題的最佳解 (Big O 最低) 是否可以透過優化子問題的實現; 也可以解釋成透過過去經驗以解決未來的問題。

## 以費氏數列 (Fibonnaci Sequence) 為例

### 1.耗時的方法 (non-memoized solution)  

下方程式碼透過遞迴來解決費氏數列，在分解是意圖中可以發現，當 `fib(5)` 分解成數個小問題後 `fib(4)` 被執行了 1 次， `fib(3`) 被重複執行了 2 次， `fib(2)` 被重複執行 3 次， `fib(1)` 重複執行 2 次，由此可知， `fib(5)` 被呼叫後，有一大部分的時間是在處理**已經執行過的子程式**，該函式的時間複雜度為 O (2^n) ，因此當 input 值增加時，所需的時間會急遽增加。


```js
function fib(n) {                               
    if (n <= 2) return 1
    return fib(n - 1) + fib(n - 2)
}
fib(5) //5
// ===========Break Down==========
//               fib(5)
//             /       \
//          fib(4)    fib(3)
//          /   \       /   \
//      fib(3) fib(2) fib(2) fib(1)
//     /   \
//  fib(2) fib(1)
// ===============================
fib(40) // 102334155，在google chrome上執行會耗費許多時間 
```

### 2. Dynamic Programming (Memoized Solution)  

倘若能在子問題處理完畢的當下將結果儲存，後續碰到重複子問題時只需回傳其解即可，如此一來所花費的時間即可大幅下降。下方程式碼的時間複雜度為 O (n) ，在執行 `fib(40)` 上所需時間較 non-memoized 方法快上許多。但是在 input 為 10000 時，由於在 Call Stack 上的堆疊數量超過其限制，因此會出現異常訊息。此時可以透過列表法 (Tabulate method) 實現


```js
function fib(n, memo = {}) {
    if (n <= 2) return 1
    if (!memo[n]) memo[n] = fib((n - 1), memo) + fib((n - 2), memo);
    return memo[n];
}
fib(5) 
// ===========Break Down==========
//               fib(5)
//              /       \
//          fib(4)     重複(3)
//          /   \      /     \
//     fib(3) 重複(2) 重複(2) 重複(1)
//     /   \
//  fib(2) fib(1)
//================================
fib(40)//102334155 所需時間較non-memoized solution低
fib(10000); //Uncaught RangeError: Maximum call stack size exceeded
```


### 3. Dynamic Programming (Tabulated Solution)

上述的方法都是透過由上至下 (Top-Down) 的方式執行，在此則是透過由下至上 (Bottom-Up) 方式執行，也就是由 `fib(1)` 開始往上計算，每次計算都會將結果存在陣列內，該方法的時間複雜度仍為 O (n)。

```js
function fib(n) {
    if (n <= 2) return 1;
    const tab = [0, 1, 1];
    for (let i = 3; i <= n; i++) {
        tab[i] = tab[i - 1] + tab[i - 2]
    }
    return tab[n]
}
fib(40); //102334155
fib(10000); //Infinity
```


<!-- 
A method for solving a complex problem by breakilng it down into a collection of simpler subprolbems, solving each of those subproblems just onece, and storing their solutions.

> ## Overlapping Subproblems

A problem is said to have overlapping subproblems if it can be broken down into subproblems which are reused several times.


## Optimal Substructure
A problem is said to have optimal substructre if an optimal solution can be constructed from optimal solutions of its subproblems.

> Using past knowledge to make solving a furture problem easier. -->
<!-- We have benn working `TOP-DOWN`, but there is another way `BOTTOM-UP`.Storing the result of a previous result in a `table`(usually an array). Usually done using iteration. Better space complexity can be achieved using tabulation. -->