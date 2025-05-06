# IndexedDB 資料存放與持久性處理

## 📌 IndexedDB 的資料存放位置
IndexedDB 的資料存放在使用者的本地磁碟，具體存放位置取決於使用的瀏覽器和作業系統。

### **🔹 各瀏覽器的 IndexedDB 存放路徑**

#### **Chrome（基於 Chromium 的瀏覽器，如 Edge, Brave, Opera）**
- **Windows**:
  ```
  C:\Users\{使用者名稱}\AppData\Local\Google\Chrome\User Data\Default\IndexedDB\
  ```
- **Mac**:
  ```
  ~/Library/Application Support/Google/Chrome/Default/IndexedDB/
  ```
- **Linux**:
  ```
  ~/.config/google-chrome/Default/IndexedDB/
  ```

#### **Firefox**
- **Windows**:
  ```
  C:\Users\{使用者名稱}\AppData\Roaming\Mozilla\Firefox\Profiles\{Profile名稱}\storage/default/
  ```
- **Mac**:
  ```
  ~/Library/Application Support/Firefox/Profiles/{Profile名稱}/storage/default/
  ```
- **Linux**:
  ```
  ~/.mozilla/firefox/{Profile名稱}/storage/default/
  ```

#### **Safari**
- **Mac**:
  ```
  ~/Library/Safari/Databases/
  ```

### **📌 IndexedDB 的存放格式**
- **Chromium 瀏覽器（Chrome, Edge）**：使用 **LevelDB**，資料存放在 `.ldb` 檔案。
- **Firefox**：使用 **SQLite** 資料庫來存放 IndexedDB。

## **📌 IndexedDB 可能被刪除的情況**

1. **使用者手動清除網站數據**（如 Chrome、Firefox 的「清除快取」功能）✅
2. **瀏覽器存儲空間不足**，會刪除低優先級網站的 IndexedDB（🚫 可用 `navigator.storage.persist()` 防止）
3. **長時間未使用（30-60 天）**，某些瀏覽器會清除 IndexedDB（🚫 可定期存取來防止）
4. **無痕模式（Incognito / Private Mode）**，IndexedDB 會儲存於記憶體，關閉後刪除

---

## **✅ 避免 IndexedDB 被刪除的方法**

### **1️⃣ 使用 `navigator.storage.persist()` 讓 IndexedDB 優先保留**
```javascript
async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.log(`Persistent storage granted: ${isPersisted}`);
  }
}
requestPersistentStorage();
```
🚨 **這僅防止存儲空間不足時的自動刪除，無法防止使用者手動清除**。

### **2️⃣ 定期存取 IndexedDB，防止長時間未使用**
```javascript
function keepIndexedDBAlive() {
  const request = indexedDB.open('myDatabase');
  request.onsuccess = () => {
    console.log('IndexedDB 存取成功');
    request.result.close();
  };
}
setInterval(keepIndexedDBAlive, 24 * 60 * 60 * 1000); // 每 24 小時存取一次
```
✅ **適用於所有瀏覽器，包括 Safari**。

### **3️⃣ 監測存儲空間，提前提醒用戶**
```javascript
async function checkStorageQuota() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    console.log(`Quota: ${estimate.quota} bytes`);
    console.log(`Used: ${estimate.usage} bytes`);
  }
}
checkStorageQuota();
```
✅ 若存儲空間不足，可提示用戶清理不必要的數據。

### **4️⃣ 提供本地備份與恢復功能**
```javascript
async function exportIndexedDB() {
  const db = await indexedDB.open('myDatabase');
  const transaction = db.result.transaction('myStore', 'readonly');
  const store = transaction.objectStore('myStore');
  const data = [];

  store.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      data.push(cursor.value);
      cursor.continue();
    } else {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'backup.json';
      a.click();
    }
  };
}
```
✅ **使用者可下載備份，即使 IndexedDB 被刪除，也能手動還原**。

### **5️⃣ 提醒使用者不要清除網站數據**
```javascript
window.addEventListener('beforeunload', (event) => {
  event.preventDefault();
  event.returnValue = '您即將清除數據，請確保已備份。';
});
```
🚨 **但 Chrome 會限制此功能，僅在特定情境下觸發**。

---

## **📌 結論**
| 操作 | IndexedDB 會被刪除嗎？ | `navigator.storage.persist()` 作用 |
|------|----------------|----------------|
| **存儲空間不足時** | ❌ 不會被刪除 | ✅ 讓 IndexedDB 更不容易被清除 |
| **使用者手動清除快取** | ✅ 會被刪除 | 🚫 無法防止 |
| **無痕模式** | ✅ 會被刪除 | 🚫 無法防止 |
| **長時間未使用** | ❓ 可能被刪除 | ✅ 讓 IndexedDB 優先保留 |

📌 **建議的最佳做法**
1. **優先使用 `navigator.storage.persist()` 來請求持久存儲（如果支援）**。
2. **定期訪問 IndexedDB（例如每 24 小時讀取一次）**，避免被當成長期未使用的數據。
3. **檢查可用存儲空間**，若不足則提醒使用者釋放空間。
4. **避免存放過量數據，必要時定期清理 IndexedDB**。

這樣可以大幅降低 IndexedDB 被瀏覽器自動刪除的風險！🚀

