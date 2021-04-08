## class expression

``` js
const PersonCl = class {
    ...
}
```

## class declaration 

``` js
class PersonCl {
    constructor(firstName, birthYear) {
        this.firstName = firstName;
        this.birthYear = birthYear;
    }

    // Methods will be added to .prototype property
    calcAge() {
        console.log(2037 - this.birthYear)
    }

}

const rick = new PersonCl('Rick', 1992);
console.log(rick);
rick.calcAge();

console.log(rick.__proto__ === PersonCl.prototype);

PersonCl.prototype.greet = function() {
    console.log(`Hey ${this.firstName}`);
}

rick.greet()
```

#### Classes are not hoisted

#### classes are also first-class citizen

#### classes are executed in strict mode

## Getters and Setters

``` js
const account = {
    owner: 'rick',
    movements: [200, 530, 120, 300],
    get latest() {
        return this.movements.slice(-1).pop();
    },
    set latest(mov) {
        this.movements.push(mov);
    },
}

console.log(account.latest);
account.latest = 50;
console.log(account.movements);
```

```js 
class PersonCl {

    constructor(fullName, birthYear) {
        this.fullName = fullName;
        this.birthYear = birthYear;
    }

    set fullName(name){
        if(name.includes(' ')) this._fullName = name;
        else alert( `${name} is not a full name!` )
    }

    // get buyCar(){
    //     return  "Mercedes"
    // }

    get fullName(){
        return this._fullName;
    }

}; 

const rick = new PersonCl('Rick Chiu', 1992)

``` 

## static

```js
 const div = document.querySelectorAll('div')
 Array.from(div) // [div,div,div...]
 [1,2,3,4].from()//error: [1,2,3,4].from is not a function

Number.parseFloat(12) //12

```

``` js
class PersonCl {

    constructor(fullName, birthYear) {
        this.fullName = fullName;
        this.birthYear = birthYear;
    }
    calcAge(){
        console.log(2037-this.birthYear);
    }
    static hey() {
        console.log("Hey there");
        console.log(this);
    }
};

const rick = new PersonCl('Rick Chiu', 1992)
```

## Inheritance between classes: ES6 class

``` js
class PersonCl {

    constructor(fullName, birthYear) {
        this.fullName = fullName;
        this.birthYear = birthYear;
    }
    calcAge(){
        console.log(2037-this.birthYear);
    }
    static hey() {
        console.log("Hey there");
        console.log(this);
    }
};
class StudentCl extends PersonCl {
    constructor(fullName, birthYear, course) {
        // Always needs to happen first!!
        super(fullName, birthYear) // similar to PersonCl.call(fullName,birthYear)
        this.course=course;
    }

    introduce(){
        console.log(`My name is ${this.fullName} and I study ${this.course}`)
    }
}

const martha = new StudentCl('Maratha Jones', 2012,'Computer Science');

```
