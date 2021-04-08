# This keyword

```js
'use strict'
console.log(this);

const calcAge = function(birthYear){
    console.log(2037-birthYear);
    console.log(this);
};
calcAge(1991);

const calcAgeArrow = birthYear=>{
    console.log(2037-birthYear);
    console.log(this);
};
calcAgeArrow(1980);
```

#### arrow function doesn't get it own this keyword. arrow function use the lexical this keyword, means that it uses this keyword of its parent function or of its parents scope. In this case, what is the lexical this keyword. It is window because window is the this keywords here in the global scope.

```js
'use strict'
const jonas = {
    year:1991,
    calcAge:function(){
        console.log(this);
        console.log(2037-this.year);
    }
};
jonas.calcAge();
//{year: 1991, calcAge: ƒ}
// 46

const matilda = {
    year:2017
};
matilda.calcAge = jonas.calcAge;
matilda.calcAge(); 
//{year: 2017, calcAge: ƒ}
//20

const f = jonas.calcAge;
f();  
//Uncaught TypeError: Cannot read property 'year' of undefined

```