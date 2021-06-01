# Dynamic Programming

## What is Dynamic Programming

#### A method for solving a complex problem by breakilng it down into a collection of simpler subprolbems, solving each of those subproblems just onece, and storing their solutions.

> ## Overlapping Subproblems

#### A problem is said to have overlapping subproblems if it can be broken down into subproblems which are reused several times.


## Optimal Substructure
#### A problem is said to have optimal substructre if an optimal solution can be constructed from op timal solutions of its subproblems.

> Using past knowledge to make solving a furture problem easier.

```js
// Expensive Solution
function fib(n) {
    if (n <= 2) return 1
    return fib(n - 1) + fib(n - 2)
}

let time1 = performance.now();
fib(40)
let time2 = performance.now();
console.log(time2 - time1)//1235.00
```
#### Big O notation is O(2^N)


## Memozation
#### Storing the results of expensive function calls and returning the cached result when the same inputs occur again.
```js
function fib2(n, memo = {}) {
    if (n <= 2) return 1
    if (!memo[n]) memo[n] = fib2((n - 1), memo) + fib2((n - 2), memo);
    return memo[n];
}

let time1 = performance.now(); 
fib2(40)
let time2 = performance.now(); 
console.log(time2 - time1)//0.0550001859664917
```
#### Big O notation is O(N)

```js
fib2(10000); //Uncaught RangeError: Maximum call stack size exceeded
```

## Tabulation
#### We have benn working `TOP-DOWN`, but there is another way `BOTTOM-UP`.
#### Storing the result of a previous result in a `table`(usually an array). Usually done using iteration. Better space complexity can be achieved using tabulation.
```js
function fib3(n) {
    if (n <= 2) return 1;
    const tab = [0, 1, 1];
    for (let i = 3; i <= n; i++) {
        tab[i] = tab[i - 1] + tab[i - 2]
    }
    return tab[n]
}
let time1 = performance.now(); 
fib3(40)
let time2 = performance.now(); 
console.log(time2 - time1)//0.1449
```
#### Big O notation is O(N)