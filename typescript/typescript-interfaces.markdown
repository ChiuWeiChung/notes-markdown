## Interfaces

Interfaces with Classes allow us to get really strong code reuse in TypeScript. Interfaces create a new type, describing the property names and value types of an object.

```ts
interface Vehicle {
  name: string;
  year: number;
  broken: boolean;
  summary(): string;
}

interface Reportable {
  summary(): string;
}

const oldCivic = {
  name: "civid",
  year: 2000,
  broken: true,
  summary(): string {
    return `Name:${this.name}`;
  },
};

const printVehicle = (vehicle: Vehicle): void => {
  console.log(`Name:${vehicle.name}`);
  console.log(`Yeaer:${vehicle.year}`);
  console.log(`Broken:${vehicle.broken}`);
  console.log(vehicle.summary());
};

const drink = {
  color: "brown",
  carbonated: true,
  sugar: 40,
  summary(): string {
    return `My drink has ${this.sugar} grams of sugar`;
  },
};

// =============Functions in Interfaces

const printSummary = (item: Reportable): void => {
  console.log(item.summary());
};

printVehicle(oldCivic);
printSummary(oldCivic);
printSummary(drink);

```

## General Strategy for reusable code in TypeScript

1. Create functions that accept arguments that are typed with interfaces.
2. Objects/classes can decide to `implement` a given interface to work with a funciton.
