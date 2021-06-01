// ======Non Memoized Solution======

function fib(n) {
    if (n <= 2) return 1
    return fib(n - 1) + fib(n - 2)
}

let time1 = performance.now();
fib(40)
let time2 = performance.now();
console.log(time2 - time1)


// ========With Dynamic Programming (MEMO-IZED SOLUTION)========
function fib2(n, memo = {}) {
    if (n <= 2) return 1
    if (!memo[n]) memo[n] = fib2((n - 1), memo) + fib2((n - 2), memo);
    return memo[n];
}

let time1 = performance.now(); 
fib2(40)
let time2 = performance.now(); 
console.log(time2 - time1)


// ===========Tabulated FIB===================
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
console.log(time2 - time1)