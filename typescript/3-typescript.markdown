# TypeScript筆記 - Type & Interface 的抉擇

## 前言

在我初次接觸 TypeScript 時，就面臨一個讓人困擾的問題：「到底什麼情況該用 Type？什麼情況該用 Interface？」這個看似簡單的選擇題，實際上卻困擾了我很長一段時間。兩者看起來可以實現相似的功能，卻又各有特色，常讓我猜測業界是否有某種不成文的規範或最佳實踐。這個疑問曾讓我在定義新型別時猶豫不決，甚至感到些許焦慮。我相信，這應該是許多 TypeScript 初學者共同的經歷。

隨著我參與的專案規模越來越大，這個困惑不僅沒有減輕，反而衍生出了更多考量。不只是功能需求的增加，連 TypeScript 的型別檢查（type checking）速度也成為一個不得不關注的重點。雖然型別系統帶來了安全性與維護性，但如果型別檢查的速度跟不上專案成長，開發體驗很快就會變得卡頓而痛苦。最近看到一篇很棒的文章 [Type vs Interface: Which Should You Use?](https://www.totaltypescript.com/type-vs-interface-which-should-you-use)，剛好深入探討了這個議題，讓我有很多共鳴。因此想趁這個機會，把我的心得整理成筆記，一方面加深理解，一方面也希望能為其他開發者提供些許實用的指引。

---

## Type 與 Interface 在效能上的差異

參考來源：[Performance: Preferring interfaces over intersections](https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections)

### 效能考量：& (Intersection) vs extends (Interface)

- TypeScript 編譯器在處理 `interface extends` 時，效能會比處理 `type & type` 來得更好。
- 使用 `interface extends`：
  - 編譯器可以快速辨識結構，且內部有特別優化邏輯，加速型別推斷。
  - **因為 interface 在 extends 時，可以建立快取（cache），所以相同的型別推斷可以重複利用，進一步提升整體速度，特別是在大型專案或複雜繼承結構中效果明顯。**
- 使用 `type A = B & C`：
  - 編譯器需要額外計算交集結果，每次推斷都必須重新展開與比較，無法像 interface 那樣做快取，因此在型別量一大時會顯著拖慢速度。

> **小結**：如果考量效能，建議盡可能以 `interface extends` 的方式設計型別繼承結構，減少不必要的交集運算，可以有效讓專案保持較快的型別檢查速度。

---

## 使用 type 的潛在缺點：implicit index signature 問題

### 什麼是 implicit index signature？

- implicit index signature 是指 TypeScript 在處理 `type` 定義物件時，**隱含允許物件擁有任意額外屬性**的行為。
- 簡單來說，除非額外限制，否則一個以 `type` 定義的物件可以包含原本型別中沒有定義的屬性，且不會報錯，這在某些情況下會導致型別安全性問題。

### 範例比較

使用 `type`：
```typescript
type User = {
  name: string;
};

const user: User = {
  name: 'Rick',
  age: 30, // 不會報錯！
};
```

使用 `interface`：
```typescript
interface User {
  name: string;
}

const user: User = {
  name: 'Rick',
  age: 30, // ❌ 報錯：Object literal may only specify known properties
};
```

在這個例子中可以清楚看到，使用 `interface` 能夠強制物件結構符合預期，不允許隨意多出未定義的屬性，而 `type` 則比較寬鬆，這就是 implicit index signature 帶來的影響。

### 小結

- 使用 `type` 定義物件時，需要特別小心，否則可能會因為 implicit index signature 而讓型別檢查失效，引入不必要的風險。
- 如果想要加強約束，使用 `interface` 會是一個比較安全的選擇，尤其是面對需要嚴謹型別保證的業務場景。

---

## type vs interface：該使用哪一個？

參考來源：[Type vs Interface: Which Should You Use?](https://www.totaltypescript.com/type-vs-interface-which-should-you-use)

### 我的想法

- 實際上，**該使用哪一個，還是需要依照團隊的 coding style 來決定**。
  - 畢竟每個團隊的開發習慣、專案需求、技術偏好、以及歷史包袱都不太一樣，有些團隊會統一規定全部用 `type`，有些則傾向盡量用 `interface`。
- 以我的話來說：
  - 在定義物件型態時，我會選擇使用 **interface**：
    - 可以避免 implicit index signature 的問題，讓型別結構更穩固可控。
    - 雖然 interface 有宣告合併（Declaration Merging）的特性，有可能在大型專案中出現意料之外的型別擴展，但這個問題可以搭配 ESLint 的 `no-redeclare` 規則來加以規範，減少風險。
  - 在定義原始型別（primitive type）、聯集型別（union type）、或交集型別（intersection type）時，我會使用 **type**：
    - 例如：
    ```typescript
    type Status = 'pending' | 'completed' | 'failed';
    ```
    - 這類非物件型別的結構使用 `type` 比較自然且直覺。

### 總結

- `interface` 和 `type` 本質上都是定義型別的工具，各有優缺點，沒有絕對的對錯或標準答案。
- 最重要的是根據實際需求，以及團隊的共識來制定合理的使用規範。
- 如果專案偏向大型、需要高效能與型別安全，建議傾向使用 `interface` 定義物件結構，使用 `type` 定義原始型別或複合型態。
