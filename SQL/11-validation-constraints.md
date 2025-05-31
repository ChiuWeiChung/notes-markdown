# PostgreSQL 學習筆記 - 資料驗證和約束

## 概述

資料驗證和約束（Validation And Constraints）是確保資料庫資料品質和完整性的關鍵機制。透過適當的約束設定，我們可以防止不合法的資料進入資料庫，維護資料的一致性。

---

## Row-Level Validation（行級驗證）

在插入或更新資料時，我們可以檢查以下條件：

- **值是否已定義**（非 NULL）
- **值在該欄位中是否唯一**
- **值是否符合特定條件**（`>`、`<`、`>=`、`<=`、`=` 等）
- **多欄位間的邏輯關係**

---

## NOT NULL Constraint（非空約束）

### 建立資料表時套用

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  price INTEGER NOT NULL,  -- 非空約束
  weight INTEGER
);
```

### 資料表建立後新增

```sql
ALTER TABLE products
ALTER COLUMN price
SET NOT NULL;
```

> ⚠️ **重要提醒**：如果欄位中已存在 NULL 值，則無法新增 NOT NULL 約束。需先處理現有的 NULL 值。

### 驗證效果

套用約束後，若嘗試插入 price 為 NULL 的資料：

```sql
INSERT INTO products(name, department, weight)
VALUES ('shoes', 'Clothes', 5);
```

**錯誤訊息**：
```
ERROR: null value in column "price" of relation "products" violates not-null constraint
DETAIL: Failing row contains (3, shoes, Clothes, null, 5).
```

---

## Default Values（預設值）

### 建立資料表時設定

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  price INTEGER DEFAULT 9999,  -- 預設值
  weight INTEGER
);
```

### 資料表建立後新增

```sql
ALTER TABLE products
ALTER COLUMN price
SET DEFAULT 9999;
```

> 💡 **使用技巧**：預設值常與 NOT NULL 約束搭配使用，確保欄位既有值又不為空。

---

## UNIQUE Constraint（唯一約束）

### 單欄位唯一約束

防止產品名稱重複：

**建立資料表時套用**：
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,  -- 唯一約束
  department VARCHAR(50),
  price INTEGER,
  weight INTEGER
);
```

**資料表建立後新增**：
```sql
ALTER TABLE products
ADD UNIQUE (name);
```

> ⚠️ **注意**：如果欄位中已存在重複值，則無法新增唯一約束。

### 多欄位組合唯一約束

確保同一部門中的產品名稱不重複（但不同部門可以有相同名稱的產品）：

**建立資料表時套用**：
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  price INTEGER,
  weight INTEGER,
  UNIQUE (name, department)  -- 組合唯一約束
);
```

**資料表建立後新增**：
```sql
ALTER TABLE products
ADD UNIQUE (name, department);
```

---

## CHECK Constraint（檢查約束）

### 單欄位檢查約束

確保價格大於 0：

**建立資料表時套用**：
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  price INTEGER CHECK(price > 0),  -- 檢查約束
  weight INTEGER
);
```

**資料表建立後新增**：
```sql
ALTER TABLE products
ADD CHECK (price > 0);
```

### 多欄位檢查約束

確保預計交貨時間晚於建立時間：

```sql
CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  est_delivery TIMESTAMP NOT NULL,
  CHECK (created_at < est_delivery)  -- 跨欄位檢查
);
```

> ⚠️ **套用限制**：若現有資料不符合檢查條件，則無法新增 CHECK 約束。

---

## 約束管理最佳實踐

### 約束命名

建議為約束指定有意義的名稱：

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  price INTEGER,
  CONSTRAINT products_price_positive CHECK(price > 0),
  CONSTRAINT products_name_unique UNIQUE(name)
);
```

### 移除約束

```sql
-- 移除具名約束
ALTER TABLE products DROP CONSTRAINT products_price_positive;

-- 移除 NOT NULL 約束
ALTER TABLE products ALTER COLUMN price DROP NOT NULL;
```

---

## 資料驗證應該放在哪一層？

我們可以在兩個地方做資料驗證：**Web Server** 和 **Database**。最佳做法是兩者都用，但分工不同。

### Web Server 層驗證
- **優點**：彈性高、修改容易、使用者體驗好
- **適合**：格式檢查、業務邏輯、外部 API 驗證

### Database 層驗證  
- **優點**：強制執行、無法繞過、保護所有資料來源
- **適合**：重要的資料規則、完整性約束

### 實際建議

| 驗證類型 | 建議層級 |
|---------|---------|
| 使用者輸入格式 | Web Server |
| 重要資料規則 | Database |
| 複雜業務邏輯 | Web Server |

**範例**：
- 使用者名稱長度檢查 → Web Server
- 產品價格必須 > 0 → Database (`CHECK(price > 0)`)