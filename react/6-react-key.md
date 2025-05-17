# React 中的 key：不只是一個小小的屬性！

寫過 React 列表的開發者，多少都遇過這個警告：⚠️ "Warning: Each child in a list should have a unique 'key' prop." 是的，就是它 - 那個讓你煩躁的小警告！但這不只是 React 在挑剔，我想來探討為什麼這個 `key` 屬性如此重要，以及一個錯誤的 key 如何在 user 操作過程中「炸裂」！😱

## key 的作用

### 1. 元素身份識別

React 使用 `key` 來識別列表中的每個元素。當列表更新時，React 需要知道哪些元素：
- 是新增的（需要創建）
- 是移除的（需要刪除）
- 是保留的（可以重用）

### 2. 狀態保留機制

`key` 不僅是識別元素，也決定了元素內部狀態的保留：
- 如果 `key` 保持不變，React 會保留該元素實例及其狀態
- 如果 `key` 變化或消失，React 會銷毀舊元素並創建新元素

### 3. 效能優化

有了正確的 `key`，React 可以最小化 DOM 操作：
- 只更新真正需要更新的元素
- 重用已存在的 DOM 節點
- 避免不必要的重新渲染

## 使用 index 作為 key 的問題

許多開發者會使用陣列索引 (`index`) 作為 `key`，例如：

```jsx
{items.map((item, index) => (
  <StatefulListItem key={index} id={`index-${index.toString()}`} value={item.text} />
))}
```

這在以下情況可能導致嚴重問題：

### 1. 列表項順序變化時

當列表順序變化（如排序、過濾）：
- 使用 `index` 作為 `key` 會導致元素的 `key` 與內容不匹配
- React 只看到 `key`，會誤以為元素內容變化了
- 元素狀態會錯位，不再與正確的內容關聯

### 2. 新增或刪除項目時

當在列表中間添加或刪除項目（如 `addItemToBeginning` 或 `removeFirstItem`）：
- 後續所有元素的 `index` 都會變化
- 所有受影響的元素都會重新渲染
- 內部狀態會錯亂，如輸入欄位的值會移位

## 實際範例

範程式碼中使用了 useState hook 的元件：

```jsx
function StatefulListItem({ value, id }: { value: string; id: number | string }) {
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
  // 只有在 mount 時才會觸發
    console.log('Rendering item:', value, '- ID:', id);
  }, []);
  
  return (
    <li className="mb-2">
      <div className="flex items-center gap-2">
        <span>{value}</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); }}
          placeholder="在此輸入內容"
          className="border px-2 py-1 rounded"
        />
        <span className="text-xs text-gray-500">輸入值: {inputValue}</span>
      </div>
    </li>
  );
}
```

下方範例中，錯誤的使用方式是：

```jsx
{items.map((item, index) => {return (
  // 錯誤示範：使用 index 作為 key
  <StatefulListItem key={index} id={`index-${index.toString()}`} value={item.text} />
)})}
```

當執行不同操作時會觀察到以下行為：

- **更新文字**（`updateText`）：輸入的內容保持不變（因為 index 未變）
- **新增項目**（`addItemToBeginning`）：所有項目的輸入內容會錯亂
- **刪除首項**（`removeFirstItem`）：輸入內容會移位

## Key 與元件生命週期的關係

在上面的範例中，`StatefulListItem` 元件包含一個空依賴陣列的 `useEffect`，它只會在元件掛載（mount）時執行一次：

```jsx
useEffect(() => {
  console.log('Rendering item:', value, '- ID:', id);
}, []); // dependencies 為空陣列代表該元件只有在 mount 時才會觸發
```

這段程式碼解釋了一個現象：**當元件的 key 值改變時，React 會將其視為完全不同的元件**。

### Key 變化時的行為

1. **當 key 保持不變**：元件會被重新渲染（update），但 `useEffect` 不會再次執行
2. **當 key 改變**：React 會：
   - 銷毀原有元件實例（unmount）
   - 創建全新的元件實例（mount）
   - 重新執行所有 `useEffect`，即使是空依賴陣列的 effects
   - 重置所有狀態 - 包括 `inputValue` 在內的所有狀態都回到初始值

### 如何驗證這一點

當使用 index 作為 key 並進行新增或刪除操作時，觀察控制台輸出：
- 您會發現 `console.log` 會再次執行
- 這表明元件被重新創建，而非更新
- 輸入欄位的值會重置，證明狀態已完全丟失

這正是使用 index 作為 key 的危險之處 - 它導致 React 無法正確識別元件，破壞了狀態保留和生命週期的預期行為。

## 正確使用 key 的方法

最佳實踐是使用穩定且唯一的識別符作為 `key`：

### 1. 使用資料中的唯一 ID

```jsx
{items.map((item) => (
  <StatefulListItem key={item.id} id={item.id} value={item.text} />
))}
```

### 2. 應該避免的情況

- 使用隨機值（每次渲染都會變化）
- 使用 index（當列表可能重新排序時）
- 使用非唯一值（如共享的屬性值）

## 結論

正確使用 `key` 是 React 高效渲染的關鍵：
- `key` 應該是穩定的、唯一的、可預測的
- `key` 決定了元素的身份識別和狀態保留
- 不應使用 index 作為 key
