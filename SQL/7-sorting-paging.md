# PostgreSQL 學習筆記 - 排序（Sorting）與分割（OFFSET）與限制數量（LIMIT）

## 接下來的範例會使用以下兩個資料表：

```plaintext
+---------------+   +----------------+ 
|     users     |   |    products    | 
+---------------+   +----------------+ 
| id (PK)       |   | id (PK)        | 
| first_name    |   | name           | 
| last_name     |   | department     | 
|               |   | price          |
|               |   | weight         |
+---------------+   +----------------+
```

---

## 📊 基本排序：`ORDER BY`

可以使用 `ORDER BY` 對結果進行排序：

```sql
SELECT *
FROM products
ORDER BY price;
-- 預設為升冪 (ASC)
```

```sql
SELECT *
FROM products
ORDER BY price DESC;
-- 降冪排序：價格由高到低
```

📌 補充說明：

* 數值欄位（如 price）會按照數字大小排序。
* 字串欄位（如 name）會按照字母順序排序（A → Z）。

---

## 🔀 多欄位排序條件

可以同時對多個欄位排序，例如：

### 先以價格升冪，再以重量升冪

```sql
SELECT *
FROM products
ORDER BY price, weight;
```

### 先以價格升冪，再以重量降冪

```sql
SELECT *
FROM products
ORDER BY price, weight DESC;
```

---

## 分頁與限制資料列數量：`OFFSET` 與 `LIMIT`

這兩個關鍵字常用於分頁顯示。

### `OFFSET`: 略過前幾筆資料

若 `users` 表有 50 筆資料，我們只想看最後 10 筆：

```sql
SELECT *
FROM users
OFFSET 40;
```

### `LIMIT`: 只取前幾筆資料

若想從第 41 筆開始，取接下來的 5 筆：

```sql
SELECT *
FROM users
OFFSET 40
LIMIT 5;
```

`OFFSET` 先運作，跳過前幾筆資料後，`LIMIT` 才會從剩下的結果中取出指定筆數。
