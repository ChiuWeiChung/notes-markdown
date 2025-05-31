# PostgreSQL 學習筆記 - 資料合併（Union）與交集(Intersect)與差集（Except）

## 本文會用下方的資料表作為範例：

```plaintext
+----------------+  
|    products    |  
+----------------+  
| id (PK)        |  
| name           |  
| department     |  
| price          |  
| weight         |  
+----------------+  
```

---

## ✨ UNION 的使用範例

### 目標：找出「價格最高前 4 名」以及「價格/重量比最高前 4 名」的產品

```sql
(
  SELECT *
  FROM products
  ORDER BY price DESC
  LIMIT 4
)
UNION
(
  SELECT *
  FROM products
  ORDER BY price / weight DESC
  LIMIT 4
);
```

> 注意：這樣可能不會列出 8 筆資料，因為 `UNION` 會自動去除重複項目。

### 如果想保留所有結果（即使重複）：

```sql
(
  SELECT *
  FROM products
  ORDER BY price DESC
  LIMIT 4
)
UNION ALL
(
  SELECT *
  FROM products
  ORDER BY price / weight DESC
  LIMIT 4
);
```

---

## 🧠 UNION / INTERSECT / EXCEPT 快速整理

| 關鍵字           | 說明                                           |
| --------------- | --------------------------------------------- |
| `UNION`         | 合併兩筆查詢結果，去除重複                        |
| `UNION ALL`     | 合併兩筆查詢結果，不去除重複                      |
| `INTERSECT`     | 只保留兩筆查詢都有的資料，會去除重複                |
| `INTERSECT ALL` | 保留兩邊都有的資料，保留重複次數                   |
| `EXCEPT`        | 只保留第一筆查詢中有、第二筆查詢中沒有的資料，去除重複 |
| `EXCEPT ALL`    | 和上面類似，但保留重複項目                        |

> `EXCEPT` / `INTERSECT` 的結果會受到查詢順序影響。

---

## 💪 練習題：合併查詢結果

**需求：**

* 找出價格小於 170 的手機品牌。
* 再找出推出超過兩款手機的手機品牌。
* 最後將這兩個結果合併。

| name         | manufacturer | price | units_sold |
|--------------|--------------|-------|------------|
| N1280        | Nokia        | 199   | 1925       |
| Iphone 4     | Apple        | 399   | 9436       |
| Galaxy S     | Samsung      | 299   | 2359       |
| S5620 Monte  | Samsung      | 250   | 2385       |
| N8           | Nokia        | 150   | 7543       |
| Droid        | Motorola     | 150   | 8395       |
| Wave S8500   | Samsung      | 175   | 9259       |

### 解法：

```sql
SELECT
  manufacturer
FROM
  phones
WHERE
  price < 170
UNION
SELECT
  manufacturer
FROM
  phones
GROUP BY manufacturer
HAVING COUNT(*) > 2;
```

