### **Next.js Caching 機制筆記**
🔗 **官方文件**：[Next.js Caching - Client Router Cache](https://nextjs.org/docs/app/building-your-application/caching#4-nextjs-caching-on-the-client-router-cache)  
🔗 **Next.js 15 更新**：[Next.js 15 Caching Semantics](https://nextjs.org/blog/next-15#caching-semantics)  

⚠️ **Next.js 15 快取機制重大更新**：
Next.js App Router 原本採用預設快取的設計，目標是提供最佳效能，但允許開發者根據需求選擇退出快取機制。在 Next.js 15 中，基於社群回饋以及與 Partial Prerendering (PPR) 和第三方函式庫的互動考量，快取策略有了重大改變：

1. **GET Route Handlers 預設不再快取**
   - Next.js 14：GET 方法的 Route Handlers 預設會被快取
   - Next.js 15：預設不快取，需要明確使用 `force-static` 設定才會啟用

2. **Client Router Cache 預設不再快取頁面元件**
   - Next.js 14：自動快取頁面元件
   - Next.js 15：預設不快取，需要明確設定才會啟用

3. **特殊路由處理**
   - sitemap.ts
   - opengraph-image.tsx
   - icon.tsx
   - 其他 metadata 檔案
   這些特殊路由仍然維持預設靜態，除非使用動態函數或動態設定選項。

Next.js 的快取機制主要涉及四個層面：

1. **Request Memoization** (請求記憶化)
2. **Data Cache** (資料快取)
3. **Full Route Cache** (完整路由快取)
4. **Router Cache** (客戶端路由快取)

---

## **1. Request Memoization (請求記憶化)**
### **概念**
- 讓 **相同請求在同一次演繹週期內僅執行一次**，避免 API / 資料庫的重複請求。
- **僅適用於 `GET` 方法** 的 `fetch()`，`POST` / `DELETE` / `PUT` 不會被記憶化。
- **快取範圍：單次伺服器請求內存活，請求結束即失效**。

### **行為**
- 伺服器在**同一次請求中**，如果多次呼叫相同的 `fetch()`，Next.js 會自動返回快取結果，而不會重複請求。
- **不會跨請求共用，因此不需要 `revalidate`**。

### **範例**
```tsx
async function getData() {
  return fetch("https://api.example.com/data");
}

export default async function Page() {
  const data1 = await getData();
  const data2 = await getData(); // 這次會直接從記憶化快取讀取

  return <pre>{JSON.stringify(data1, null, 2)}</pre>;
}
```

👉 **重點：**
- **不同請求之間不共用記憶化結果**。
- **請求完成後快取即失效**，不影響 `revalidate`。

---

## **2. Data Cache (資料快取)**
### **概念**
- **在多個請求間共享快取的 API 請求結果**。
- 可透過 `fetch()` 的 `cache` 選項調整快取行為：
  - `no-store` (預設)：跳過快取，每次請求都從資料源獲取最新資料。
  - `force-cache`：Next.js **先查詢 Data Cache**，若無則發送請求並存入快取。

### **行為**
- **當 `fetch()` 被 `force-cache` 呼叫時，Next.js 會先檢查 Data Cache 是否有快取結果**。
  - **如果有快取**，則直接從快取讀取。
  - **如果沒有快取**，則請求資料源並存入快取。
- **預設使用 `no-store`，每次請求都重新獲取最新資料**，但請求期間仍會使用 Memoization。

### **範例**
```tsx
export default async function Page() {
  const res = await fetch('https://api.example.com/data', { cache: 'force-cache' }); // 會使用 Data Cache
  const data = await res.json();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

👉 **重點：**
- **Data Cache 是跨請求共享的**，適合頻繁查詢但不常變更的資料。
- **若 `cache: 'no-store'`，則不會使用 Data Cache，每次請求都獲取最新資料**。

### **Data Cache vs. Request Memoization**
| **機制**               | **快取範圍** | **持續性** | **適用場景** |
|---------------------|-------------|-----------|------------|
| **Request Memoization** | **單次請求內** | **不跨請求** | 減少同一請求內的重複 API 請求 |
| **Data Cache** | **跨請求共享** | **持續快取** | 減少 API 查詢，提高效能 |

📌 **差異點：**
1. **Request Memoization 只作用於單次請求內的記憶體，不跨請求持續存在**。
2. **Data Cache 可以跨請求共享快取，並可透過 `revalidate` 設定更新頻率**。

---

## **3. Full Route Cache (完整路由快取)**
### **概念**
- **完整的頁面快取**，確保相同的請求返回相同的快取結果。
- Next.js 會在**建置時期自動渲染並快取路由**。這是一項效能最佳化：
  - 不需要在每次請求時都在伺服器上重新渲染
  - 直接提供快取的路由內容
  - 大幅提升頁面載入速度 

### **如何避免 Full Route Cache**
1️⃣ **透過 Dynamic API 讓 Next.js 偵測頁面變動**
```tsx
export async function GET(request: Request) {
  const token = request.cookies.get('authToken');
  return Response.json({ message: `Hello, ${token}` });
}
```
📌 **這樣 Next.js 會自動判斷該頁面為動態渲染，不會使用 Full Route Cache。**

2️⃣ **透過 Route Segment Config 直接關閉快取**
```tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```
📌 **這會強制 Next.js 每次請求都重新執行 API 呼叫，確保頁面是動態的。**

### **Route Segment Config Options**
Route Segment Config 提供了多種選項來控制路由段的快取行為：

1️⃣ **動態渲染控制**
```tsx
// 強制動態渲染，完全跳過 Full Route Cache
export const dynamic = 'force-dynamic'

// 強制靜態渲染，即使使用動態函數也會靜態化
export const dynamic = 'force-static'
```

2️⃣ **資料獲取的快取行為**
```tsx
// 預設將所有 fetch 請求設為 no-store
export const fetchCache = 'default-no-store'

// 預設將所有 fetch 請求設為 force-cache
export const fetchCache = 'default-cache'

// 只快取有明確設定 cache 選項的 fetch 請求
export const fetchCache = 'only-cache'

// 強制所有 fetch 請求為 force-cache
export const fetchCache = 'force-cache'

// 強制所有 fetch 請求為 no-store
export const fetchCache = 'force-no-store'
```

3️⃣ **動態參數處理**
```tsx
// 控制是否接受不在 generateStaticParams 中的動態參數
export const dynamicParams = false // 只允許預先產生的參數
export const dynamicParams = true  // 允許任何動態參數（預設）
```

📌 **重點：**
- 這些配置選項可以**精確控制路由段的渲染和快取行為**
- `dynamic = 'force-dynamic'` 會完全跳過 Full Route Cache
- `fetchCache` 可以統一控制該路由段內所有 fetch 請求的快取行為
- `dynamicParams` 可以限制動態路由的參數範圍

### **Next.js 15 的變更**
- **GET Route Handlers 預設行為改變**：
  ```tsx
  // Next.js 15 中，這個 handler 預設不會被快取
  export async function GET() {
    return Response.json({ data: 'hello' })
  }

  // 要啟用快取，需要明確設定
  export const dynamic = 'force-static'
  export async function GET() {
    return Response.json({ data: 'hello' })
  }
  ```

---

## **4. Router Cache (客戶端路由快取)**
### **概念**
- **客戶端維護的快取**，加速返回已造訪過的頁面。
- **適用於 `next/link` 及 `router.push()` 的導航行為**，讓回到前一頁時不需重新請求 API。
- **Next.js 15 更新**：預設不再快取頁面元件 (針對 page segments 的部分)，需要明確設定才會啟用快取機制。

### **如何清除 Router Cache**
```tsx
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  return <button onClick={() => router.refresh()}>強制重新加載</button>;
};
```
📌 **這會清除 Router Cache 並重新載入頁面內容。**

### **Next.js 15 的變更**
- **頁面元件快取行為改變**：
  - 在 Next.js 14.2.0 中引入了實驗性的 `staleTimes` 配置
  - Next.js 15 中，預設不再快取頁面元件
  - 需要明確設定才能啟用快取機制
  ```tsx
  // 需要明確設定快取選項
  export const dynamic = 'force-static'
  ```

## **關於 React Server Component Payload**
### **概念**
React Server Component Payload 是一種特殊的資料格式，用於在 Next.js 中處理伺服器元件（Server Components）和客戶端元件（Client Components）之間的通訊。這就像是一個特製的包裹，裡面包含了所有需要從伺服器傳送到瀏覽器的資料。

### **包含內容**
1. **伺服器元件的渲染結果**
   - HTML 結構
   - 文字內容
   - 樣式資訊

2. **客戶端元件的相關資訊**
   - JavaScript 檔案的位置
   - 初始化所需的資料
   - 互動功能的程式碼

3. **元件之間的資料傳遞**
   - 從伺服器元件傳給客戶端元件的 props
   - 狀態資料
   - 設定資訊

### **運作方式**
```tsx
// 1. 伺服器元件：在伺服器上執行
// app/page.tsx
import ClientCounter from './ClientCounter';

export default async function Page() {
  // 在伺服器上獲取資料
  const data = await fetch('https://api.example.com/data');
  const { initialCount } = await data.json();

  return (
    <div>
      <h1>計數器示例</h1>
      {/* 將資料傳遞給客戶端元件 */}
      <ClientCounter initialCount={initialCount} />
    </div>
  );
}

// 2. 客戶端元件：在瀏覽器中執行
// app/ClientCounter.tsx
'use client';
import { useState } from 'react';

export default function ClientCounter({ initialCount }) {
  // 使用從伺服器收到的初始值
  const [count, setCount] = useState(initialCount);

  return (
    <button onClick={() => setCount(count + 1)}>
      點擊次數：{count}
    </button>
  );
}
```

### **效益**
1. **效能優化**
   - 減少傳輸的 JavaScript 大小
   - 只傳送必要的程式碼
   - 加快頁面載入速度

2. **更好的使用者體驗**
   - 伺服器渲染確保首次內容快速顯示
   - 客戶端互動功能無縫整合
   - 減少頁面閃爍

3. **開發便利性**
   - 自動處理伺服器和客戶端程式碼的分離
   - 簡化資料傳遞流程
   - 維持 React 元件的開發體驗

📌 **重點：**
- React Server Component Payload 是 Next.js 中伺服器和客戶端之間的「橋樑」
- 它自動處理了複雜的資料傳輸細節，讓開發者可以專注在功能實作
- 透過最佳化的資料傳輸格式，提供更好的應用程式效能

## 📌 總結
1. Request Memoization 只適用於 單次請求內的 API 快取，且不適用於 POST / DELETE。
2. Data Cache 能夠跨請求共用快取，並支援 revalidate 來控制快取失效時間。
3. Full Route Cache 可透過 dynamic = 'force-dynamic' 或 revalidate = 0 來關閉。
4. Router Cache 可提升前端導航速度，router.refresh() 可手動清除快取。
5. React Server Component Payload 是 RSC 傳輸的二進制格式，提升效能。
6. **Next.js 15 更新了預設的快取行為**，多數快取機制需要明確設定才會啟用。
7. **特殊路由（如 sitemap.ts、opengraph-image.tsx 等）維持預設靜態**，除非明確使用動態功能。