# TypeScript筆記 - 其他 Utility Type

## 前言
待補稱


1. Pick
   1. 待舉例
2. Omit
   1. 待舉例
3. Extract
   1. 待舉例
4. Exclude
   1. 待舉例
5. ReturnType
   1. 待舉例
6. Record<>
   1. 待舉例

7. 讓型別更容易判讀的 Prettify 

When hover the `ComplexType` type below, we can see nested gross type, we can't even introspect properly by hovering over it.
But, prettify type below takes in a type of T and we can wrap our complex type in prettify, it would result everything. So we can get beautiful output.

```typescript
type ComplexType = {
    a: string;
    b: number;
} & {
    c: boolean;
} & Omit<{
    d: boolean;
} & Record<"d", string[]>, "d">;


type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

type ShowMe = Prettify<ComplexType>
```