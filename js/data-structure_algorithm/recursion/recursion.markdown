## 遞回函式 What is recursion?

#### A process(a function in our case) that calls itself. 

## It's Everywhere!

* (JSON.parse/JSON.stringify)
* document.getElementById and DOM traversal algorithms
* Object traversal

## Behind the scence

* In almost all program languages, there is a built in data structure that mangages what happens when functions are invoked
* It's named Call stack

## The call stack

* It's a stack data structure-
* ANy time a function is invoked it is placed(pushed)
* WHen JS sees the return keyword or when the function ends, the compiler will remove(pop)
* We're used to functions being pushed on the callstack and popped off when they are done
* When we write recursive functions, we keep pushing new functions onto the call stack

## How it work 

#### Invoke the same function with a different input until you reach your base case.

#### Base case: the condition when the recursion ends.

``` js
// recursive way
function countDown(num) {
    if (num <= 0) {
        console.log('All done!');
        return;
    }
    console.log(num);
    num--;
    countDown(num);
}
```

``` js
// iterative way
function countDown(num) {
    for (let i = num; i > 0; i--) {
        console.log(i)
    }
    console.log('All done!')
}
```

## Second recursive function

#### Call stack illustration

``` js
function sumRange(num) {
    if (num === 1) return 1;
    return num + sumRange(num - 1);
}
sumRange(3) // 6
```

``` js
// iterative
function factorial(num) {
    let total = 1;
    for (i = num; i > 1; i--) {
        total *= i
    }
    return total;
}
```

``` js
// recursive 
function factorial(num) {
    if (num == 1) return num;
    return num * factorial(num - 1)
}
```

## Helper method recursion

``` js
let resullt = [];

function collectOddValues(arr) {
    let result = [];

    function helper(helperInput) {
        if (helperInput.length === 0) {
            return;
        }
        if (helperInpu[0] % 2 !== 0) {
            result.push(helperInput[0])
        }
        helper(helperInput.slice(1))
    }
    helper(arr);
    return result
}

collectOddValues([1, 2, 3, 4, 5, 6, 7, 8, 9])
```

## Pure recursion

``` js
function collectOddValues(arr) {
    let newArr = [];

    if (arr.length === 0) {
        return newArr;
    }
    if (arr[0] % 2 !== 0) {
        newArr.push(arr[0])
    }
    newArr = newArr.concat(collectOddValues(arr.slice(1)));
    return newArr
}

collectOddValues([1,2,3,4,5])
```
