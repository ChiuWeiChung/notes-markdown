# PostgreSQL 學習筆記 - Subquery

## 本文使用的資料表結構

```plaintext
+---------------+   +----------------+   +----------------+ 
|     users     |   |    products    |   |     orders     | 
+---------------+   +----------------+   +----------------+ 
| id (PK)       |   | id (PK)        |   | id (PK)        | 
| first_name    |   | name           |   | user_id (FK)   | 
| last_name     |   | department     |   | product_id (FK)| 
|               |   | price          |   | paid           |
|               |   | weight         |   | weight         |
+---------------+   +----------------+   +----------------+
```

---

## 基本概念

**Subquery（子查詢）** 是嵌套在另一個 SQL 查詢中的查詢。它可以出現在 `SELECT`、`FROM`、`WHERE` 等多個子句中。

### 簡單範例

列出所有價格高於 'Toys' 部門最高價格的商品：

```sql
SELECT name, price
FROM products
WHERE price > (
    SELECT MAX(price)
    FROM products
    WHERE department = 'Toys'
);
```

> 💡 **執行順序**：PostgreSQL 會先執行內層的 subquery，得到 'Toys' 部門的最高價格，再用這個值與外層查詢比較。

---

## Subquery 的使用位置

Subquery 可以出現在以下位置：

```sql
SELECT
  p1.name,
  (SELECT COUNT(name) FROM products) AS total_products  -- 作為計算值
FROM (SELECT * FROM products) AS p1                     -- 作為資料來源
JOIN (SELECT * FROM products) AS p2 ON p1.id = p2.id   -- 作為聯接資料來源
WHERE p1.id IN (SELECT id FROM products);              -- 作為條件列表
```

> ⚠️ **重要提醒**：出現在 `FROM` 子句中的 subquery 必須有別名（alias）

---

## 實戰練習：計算平均價格的最大值

**問題**：計算每個 manufacturer 的平均價格，然後取出最大值

參考資料表 `phones`：

| name         | manufacturer | price | units_sold |
|--------------|--------------|-------|------------|
| N1280        | Nokia        | 199   | 1925       |
| Iphone 4     | Apple        | 399   | 9436       |
| Galaxy S     | Samsung      | 299   | 2359       |
| S5620 Monte  | Samsung      | 250   | 2385       |
| N8           | Nokia        | 150   | 7543       |
| Droid        | Motorola     | 150   | 8395       |
| Wave S8500   | Samsung      | 175   | 9259       |

**解決方案**：

```sql
SELECT MAX(p.average_price) AS max_average_price
FROM (
  SELECT AVG(price) AS average_price
  FROM phones
  GROUP BY manufacturer
) AS p;
```

**執行邏輯**：
1. 內層查詢：按 manufacturer 分組，計算每組的平均價格
2. 外層查詢：從這些平均價格中找出最大值

---

## Subquery 在 JOIN 中的應用

以下兩種寫法效果相同：

### 方法 1：使用 Subquery 的 JOIN

```sql
SELECT first_name
FROM users
JOIN (
    SELECT user_id
    FROM orders
    WHERE product_id = 3
) AS o ON o.user_id = users.id;
```

### 方法 2：傳統 JOIN + WHERE

```sql
SELECT first_name
FROM users
JOIN orders ON users.id = orders.user_id
WHERE product_id = 3;
```

> 💡 **性能考量**：在大多數情況下，方法 2 的性能會更好，因為減少了子查詢的複雜度。

---

## 進階應用範例

### 基於計算條件的查詢

列出包含價格重量比 > 50 的商品的訂單 ID：

```sql
SELECT id
FROM orders
WHERE product_id IN (
    SELECT id
    FROM products
    WHERE price / weight > 50
);
```

### 基於平均值的條件查詢

列出價格高於平均價格的商品：

```sql
SELECT name
FROM products
WHERE price > (
    SELECT AVG(price)
    FROM products
);
```

---

## NOT IN 的使用與注意事項

列出不與任何價格小於 100 的商品同部門的商品：

```sql
SELECT name
FROM products
WHERE department NOT IN (
    SELECT department
    FROM products
    WHERE price < 100
);
```

> ⚠️ **重要警告**：如果 subquery 返回的結果中包含 `NULL` 值，`NOT IN` 可能不會返回任何結果。建議使用 `NOT EXISTS` 或加上 `AND department IS NOT NULL` 條件。

**更安全的寫法**：

```sql
SELECT name
FROM products
WHERE department NOT IN (
    SELECT department
    FROM products
    WHERE price < 100
    AND department IS NOT NULL
);
```

---

## ALL 與 SOME 運算符

### ALL：比較所有值

列出比 'Industrial' 部門**所有**商品都貴的商品：

```sql
SELECT name, department, price
FROM products
WHERE price > ALL(
    SELECT price
    FROM products
    WHERE department = 'Industrial'
);
```

### SOME：比較部分值

列出比 'Industrial' 部門**至少一個**商品貴的商品：

```sql
SELECT name
FROM products
WHERE price > SOME (
    SELECT price
    FROM products
    WHERE department = 'Industrial'
);
```

> 💡 **等價關係**：
> - `> ALL` 等同於 `> MAX(...)`
> - `> SOME` 等同於 `> MIN(...)`

---

## Correlated Subquery（關聯子查詢）

### 找出各部門價格最高的商品

```sql
SELECT name, department, price
FROM products AS p1
WHERE p1.price = (
    SELECT MAX(price)
    FROM products AS p2
    WHERE p2.department = p1.department
);
```

**執行邏輯**：
1. 外層查詢遍歷每一行商品
2. 對每一行，內層查詢計算該商品所在部門的最高價格
3. 比較當前商品價格是否等於部門最高價格

### 計算每個商品的訂單數量

```sql
SELECT p1.name,
       (SELECT COUNT(*)
        FROM orders AS o1
        WHERE o1.product_id = p1.id) AS num_orders
FROM products AS p1;
```

---

## 獨立 SELECT 語句

當 subquery 返回單一值時，可以單獨執行：

```sql
SELECT (
    SELECT MAX(price)
    FROM products
) AS highest_price;
```

> ⚠️ **限制條件**：此類 subquery 必須返回恰好一行一列的結果，否則會出錯。
