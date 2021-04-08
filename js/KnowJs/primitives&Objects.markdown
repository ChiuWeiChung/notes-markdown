# Primitives & Objects

## confusion in primitives

```js
let age= 30;
let oldAge = age;
age=31;
console.log(age);
console.log(oldAge);
// 31
// 30
```

```js
const me = {
    name:"Jonas",
    age:30
};
const friend = me;
friend.age = 27;
console.log('Friend',friend);
console.log('Me',me);
//Friend {name: "Jonas", age: 27}
//Me {name: "Jonas", age: 27}
```

## Primitives
* Number
* String
* BOolean
* Undefined
* Null
* Symbol
* BigInt

## Objects
* Object literal
* Arrays
* Functions
* Many more...

#### Primitives(Primitives types) and Objects (Reference types) have different way in storing memories. Reference types are stored in memory heap. Primitives types are store in call stack


## Primitive values example: 
#### When we declare variables, what happens in javascript engine.  in  identifer actually points to the address, not to the value. That means age is equal to address 0001, which holds the value of 30; subtle extinction should keep in mind. oldAge also point ot the address 0001. but `value at a certain memory address is immutable`, when we assign 31 to age, age variables is point to the new address 0002 simutaneously.

## Reference values examples:
#### stored in memory heap, the identifer me won't point to the address D30F directly, instead, it will point to a new piece of memory that's created in the stack. and the memory will point to the object in the heap by using the memory address as its value;The friend identifer will point to the exact same memory address as the me identifer; the adress contains the reference which then points to the object itself.

```js
        // Primitives type
let dog1 = "Jumo";
let dog2 = dog1;
dog1 = "Judas";
console.log(dog1, dog2;// Judas Jumo
```

```js
        // Reference type
const Rick = {
    firstName:"Rick",
    lastName: "Chiu",
    age:27
};
const anotherRick = Rick;
anotherRick.lastName = "Lin";
console.log("Rick:", Rick); //Rick: {firstName: "Rick", lastName: "Lin", age: 27}
console.log("Another Rick:", anotherRick); //Another Rick: {firstName: "Rick", lastName: "Lin", age: 27}
// anotherRick = {};  doesn't work
```


```js
        // Coping objects
const jessica2 = {
    firstName:"Jessica",
    lastName: "Williams",
    age:27
};
const jessicaCopy = Object.assign({},jessica2); // create completely a new object;
jessicaCopy.lastName = "Davis";
console.log("Before marriage:", jessica2);
console.log("After marriage:", jessicaCopy);
//Before marriage: {firstName: "Jessica", lastName: "Williams", age: 27}
//After marriage: {firstName: "Jessica", lastName: "Davis", age: 27}
```

```js
        // Coping objects
const jessica2 = {
    firstName:"Jessica",
    lastName: "Williams",
    age:27,
    family:["Jason","Emily","Bob"]
};
const jessicaCopy = Object.assign({},jessica2); // create completely a new object;
jessicaCopy.lastName = "Davis";
//Before marriage: {firstName: "Jessica", lastName: "Williams", age: 27}
//After marriage: {firstName: "Jessica", lastName: "Davis", age: 27}
jessicaCopy.family.push("Mary");
jessicaCopy.family.push("John");
console.log("Before marriage:", jessica2);
console.log("After marriage:", jessicaCopy);
//Before marriage: {firstName: "Jessica", lastName: "Williams", age: 27, family: Array(5)}
//After marriage: {firstName: "Jessica", lastName: "Davis", age: 27, family: Array(5)}
```

#### family object is a deeply nested object (object in the object)