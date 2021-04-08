# Hoisting and TDZ

## Hoisting
#### Makes some types of variables accessible/usable in the code before they are acrually declared. "Variables lifted to the top of their scope".

## What's behind the scenes?
#### `Before execution`, code is scanned for variable declarations, and for each variable, a new property is created in the variable environment object.

|                                 |HOISTED?   |INITIAL VALUE  |SCOPE                   |
|---------------------------------|-----------|---------------     |-------------------|
|function declaration             |YES        |Actual function     |Block@strict mode  |
|var variables                    |YES        |undefined           |Function           |
|let and const variables          |No         |<uninitialized>, TDZ|Block              |
|function expressions and arrows  |Depends if using var or const/let                   |

## Variables
```js
console.log(me);
var me ="Jonas";
// undefined

console.log(job);  
let job = "teacher";
//Uncaught ReferenceError: job is not defined

console.log(year); 
const year= 1991;
//Uncaught ReferenceError: year is not defined
```
## Functions
```js
console.log(addDec(2,3));
function addDec(a,b){
    return a+b;
}
// 5

console.log(addExp(2,3));
const addExp = function(a,b){
    return a+b;
}
// Uncaught ReferenceError: Cannot access 'addExp' before initialization
console.log(addArrow(2,3));
var addArrow = (a,b)=>{
    return a+b;
}
//Uncaught TypeError: addArrow is not a function

```


## Example that we don't want it happen!
```js
if(!numProducts) deleteShoppingCart();

var numProducts = 10;

function deleteShoppingCart(){
    console.log("All Products deleted!");
}
```
