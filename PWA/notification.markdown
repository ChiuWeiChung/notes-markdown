
1. **組件初始化**：
   - 初始化 `NotificationRequest` 組件。
   - 設置 hook：`useServiceWorkerRegistration` 和 `useServiceWorkerMessageListener`。

2. **檢查通知權限**：
   - 在組件掛載時調用 `getNotificationPermission`（`useEffect`）。
   - 檢查是否支持 `Notification` 和 `serviceWorker`。
   - 如果支持，檢查是否已有訂閱。
   - 根據訂閱狀態設置 `permissionStatus`。

3. **用戶交互**：
   - 用戶切換開關（`onCheckedChange`）。
   - 如果開啟，調用 `requestNotificationPermission`。
     - 向用戶請求通知權限。
     - 如果授予，調用 `subscribeUser`。
   - 如果關閉，調用 `unsubscribeUser`。

4. **訂閱用戶**：
   - 檢查是否支持 service worker。
   - 如果尚未註冊，則註冊 service worker。
   - 調用 `subscribePush` 訂閱推送通知。
   - 轉換 VAPID 密鑰並使用 `pushManager` 訂閱。
   - 存儲訂閱 endpoint 。

5. **取消訂閱用戶**：
   - 檢查是否支持 service worker。
   - 獲取現有訂閱。
   - 在訂閱上調用 `unsubscribe`。
   - 更新狀態並通知用戶成功或失敗。

6. **UI 更新**：
   - 如果可用，顯示訂閱 endpoint 。
   - 提供按鈕以將訂閱 endpoint 複製到剪貼板。

以下是簡單的流程圖文字表示：

```
[開始] --> [NotificationRequest 組件初始化]
   |
   v
[useEffect 檢查通知權限] --> [getNotificationPermission 設置權限狀態]
   |
   v
[用戶交互: onCheckedChange] --> [切換開關]
   |                                |
   v                                v
[requestNotificationPermission]  [unsubscribeUser 取消訂閱用戶]
   |                                |
   v                                v
[subscribeUser 訂閱用戶]        [更新狀態]
   |
   v
[subscribePush 訂閱推送]
   |
   v
[useServiceWorkerMessageListener 更新 UI]
   |
   v
[結束]

```
