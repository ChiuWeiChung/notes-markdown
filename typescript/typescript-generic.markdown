## generic

idea in function

```ts
const addOne=(a:number):number=>{
    return a +1;
}
const addTwo=(a:number):number=>{
    return a +2;
}
const addThree=(a:number):number=>{
    return a +3;
}

// ==========================

const add = (a:number,b:number):number=>{
    return a+b;
}

```

idea in class

```ts
class HoldNumber{
    data:number;
}
class HoldString{
    data:string;
}

const holdNumber = new HoldNumber();
holdNumber.data=123;
const holdString = new HoldString();
holdString.data='afasdf';
```

```ts
class HoldAnything <TypeOfData>{
    data: TypeOfData;
}

const holdNumber = new HoldAnything<number>();
holdNumber.data = 123;

const holdString = new HoldAnything<string>();
holdString.data = 'asfsadf';
```
