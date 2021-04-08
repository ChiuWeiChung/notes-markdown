# Arrow Function VS. Regular Function

## This Keyword

```js
'use strict'

const jonas = {  
    firstName:"Jonas",
    year:1991,
    greet: ()=>console.log(`Hey ${this.firstname}`)
};

jonas.greet(); // equal to console.log(`Hey ${window.firstname}`)
// Hey undefined
```

```js
'use strict'

var firstName = "Matilda";
const jonas = {  
    firstName:"Jonas",
    year:1991,
    greet: ()=>{
        console.log(this);
        console.log(`Hey ${this.firstName}`);
    }
};

jonas.greet(); 
// Hey Matilda
```


```js
'use strict'
const jonas = {  
    firstName:"Jonas",
    year:1991,
    calcAge: function(){
        console.log(this);
        console.log(2037-this.year);

        const isMillenial = function(){
            console.log(this.year>=1981 && this.year<=1996);
        };
        isMillenial();
    }
};

jonas.calcAge();
// {firstName: "Jonas", year: 1991, calcAge: ƒ, greet: ƒ}
// 46
//Uncaught TypeError: Cannot read property 'year' of undefined
```

#### inside the regular function call, this keyword must be undefined. But how to solve it? There are two method below:

```js
//==============solution 1==================
'use strict'
const jonas = {  
    firstName:"Jonas",
    year:1991,
    calcAge: function(){
        console.log(this);
        console.log(2037-this.year);
        // solution 1 ------------
        const self =this;
        const isMillenial = function(){  
            console.log(self.year>=1981 && self.year<=1996);
        };
        isMillenial();
        // solution 1 ------------
    }
};

jonas.calcAge();
// {firstName: "Jonas", year: 1991, calcAge: ƒ, greet: ƒ}
// 46
//true

//==============solution 2==================
'use strict'
const jonas = {  
    firstName:"Jonas",
    year:1991,
    calcAge: function(){
        console.log(this);
        console.log(2037-this.year);
        // solution 2 ------------
        const isMillenial = ()=>{  
            console.log(this.year>=1981 && this.year<=1996);
        };
        isMillenial();
        // solution 2 ------------
    }
};

jonas.calcAge();
// {firstName: "Jonas", year: 1991, calcAge: ƒ, greet: ƒ}
// 46
//true
```


#### the arrow function uses the this keyword from its parent scope;

## Argument Keyword

#### the arrow function doesn't have arguments keyword!

```js
const regularFunction = function(a,b){
    console.log(arguments);
    return a+b;
};
regularFunction(3,5);

const arrowFunction = (a,b)=>{
    console.log(arguments);
    return a+b;
};
arrowFunction(3,5);
```
