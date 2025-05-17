# 演算法筆記：淺談動態規劃（Dynamic Programming）

> 本文為 [JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/) 的學習筆記。內容經由理解與整理後重新撰寫，部分程式碼參考自課程內容。

動態規劃（Dynamic Programming, DP）是一種處理複雜問題的策略，透過將問題分解為多個較簡單、重複的小問題，並將已解決的子問題結果儲存起來，來避免重複計算。在實務上，這樣的策略不僅提升效率，也能大幅降低執行時間。

動態規劃在電腦科學中應用非常廣泛，從演算法課程、線上競賽到真實世界的系統優化，許多問題都可以透過 DP 來有效解決。例如：路徑最短、最大收益、最佳切割、子序列比對等等。

這種技巧特別適用於同時具備下列兩個特性的問題：

1. **重疊子問題（Overlapping Subproblems）**：

   * 問題在拆解後會出現許多重複的子問題，若不儲存先前的解，會造成重複計算。

2. **最優子結構（Optimal Substructure）**：

   * 問題的整體最佳解，可以由其子問題的最佳解組合而成。

---

## 範例說明：費氏數列（Fibonacci Sequence）

費氏數列是最常用來說明動態規劃的問題之一，因為它擁有明顯的重疊子問題與最佳子結構特性。

### 1. 基礎寫法（未記憶化）

這種方式是使用最直觀的遞迴，將問題不斷拆解成更小的 `fib(n-1)` 與 `fib(n-2)`。但缺點是當 `n` 變大時，會不斷重複運算相同的子問題，效率極低。時間複雜度為 O(2^n)。

```js
function fib(n) {
    if (n <= 2) return 1;
    return fib(n - 1) + fib(n - 2);
}

fib(5); // 5
```

📌 運算流程拆解（Breakdown）：

```plaintext
               fib(5)
             /       \
         fib(4)     fib(3)
        /     \     /     \
     fib(3) fib(2) fib(2) fib(1)
     /     \
fib(2)  fib(1)
```

```js
fib(40); // 102334155，執行時間非常長，效能低落
```

### 2. 改進：使用記憶化（Memoization）

透過額外的記憶結構（例如物件或陣列）儲存已計算過的結果，可以避免重複計算相同的子問題，大幅提升效率。
這種方式稱為「自頂向下」（Top-Down）的方法，時間複雜度為 O(n)。

```js
function fib(n, memo = {}) {
    if (n <= 2) return 1;
    if (!memo[n]) memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
}

fib(5);
```

📌 運算流程拆解：

```plaintext
               fib(5)
              /       \
         fib(4)     重複(fib(3))
         /     \       /     \
    fib(3) 重複(fib(2)) 重複(fib(2)) 重複(fib(1))
    /     \
fib(2)  fib(1)
```

```js
fib(40); // 102334155，執行速度明顯加快
fib(10000); // Stack Overflow，因為遞迴層數過深
```

這種方式適合在遞迴層數不會太深時使用，理解起來也比較直觀。

### 3. 表格法（Tabulation）

為了避免遞迴堆疊過深的問題，可以改用「自底向上」（Bottom-Up）的方式實作。這種方式會建立一個陣列，從最基本的 `fib(1)`、`fib(2)` 開始依序算到 `fib(n)`。
這是動態規劃中另一種經典技巧，稱為表格法。

```js
function fib(n) {
    if (n <= 2) return 1;
    const tab = [0, 1, 1];
    for (let i = 3; i <= n; i++) {
        tab[i] = tab[i - 1] + tab[i - 2];
    }
    return tab[n];
}

fib(10000); // 不會 Stack Overflow，但結果可能為 Infinity（超出數字範圍）
```

此方式適合處理較大規模的 input，並且能避免 call stack 的限制。

---

## 小結與比較

以下是三種實作方式的比較：

| 方法             | 時間複雜度  | 空間複雜度 | 優點         | 缺點                    |
| -------------- | ------ | ----- | ---------- | --------------------- |
| 遞迴（未記憶化）       | O(2^n) | O(n)  | 撰寫簡單、直觀    | 效率低、重複運算、速度慢          |
| 記憶化（Memoized）  | O(n)   | O(n)  | 提升效能、較容易理解 | 遞迴太深可能 Stack Overflow |
| 表格法（Tabulated） | O(n)   | O(n)  | 不使用遞迴、不會爆棧 | 實作稍複雜、需額外儲存空間         |

動態規劃的核心在於「儲存」與「重用」，不只是費氏數列，像是經典的爬樓梯問題（Climbing Stairs）、0/1 背包問題（Knapsack Problem）、最長公共子序列（Longest Common Subsequence）、硬幣找零（Coin Change）等問題都能應用動態規劃的概念來高效解決。
