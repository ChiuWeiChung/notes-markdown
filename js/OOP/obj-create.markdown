## Object Literal

``` js
const PersonProto = {
    calcAge() {
        console.log(2037 - this.birthYear);
    },
};

const steven = Object.create(PersonProto);
console.log(steven); // {}
steven.name ="Steven";
steven.birthYear = 1993;
steven.calcAge(); // 44;

console.log(steven.__proto__ === PersonProto); //true
```


## Inheritance between classes

```js
const PersonProto = {
    calcAge() {
        console.log(2037 - this.birthYear);
    },
    init(firstName,birthYear){
        this.firstName=firstName;
        this.birthYear=birthYear;
    }
};

const StudentProto = Object.create(PersonProto);
StudentProto.init = function(firstName,birthYear,course){
    PersonProto.init.call(this,firstName,birthYear);
    this.course=course
}
StudentProto.introduce=function(){
    console.log(`My name is ${this.firstName} and I study ${this.course}`)
}
const jay = Object.create(StudentProto);
jay.init('Jay',2010,'Computer Science');
```