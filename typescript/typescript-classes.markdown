## Classes 

Blueprint to create an object with some fields (values) and methods (functions) to represent a `thing` .

## Modifiers

* public : this method can be called any where, any time.
* private : this method can only be called by other methods in this class.
* protected : this method can be called by other methods in this class, or by other methods in child classes. 

```ts
class Vehicle {
  constructor(public color: string) {}

  protected honk(): void {
    console.log("beep");
  }
}

const vehicle = new Vehicle("orange");
console.log(vehicle.color);

class Car extends Vehicle {
  constructor(color: string, public wheels: number) {
    super(color);
  }

  private drive(): void {
    console.log("vroom");
  }

  startDrivingProcess(): void {
    this.drive();
    this.honk();
  }
}

const car = new Car("red", 4);
car.startDrivingProcess();

```
