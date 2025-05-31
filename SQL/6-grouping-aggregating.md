# PostgreSQL 學習筆記 - 分組（Grouping）與彙總（Aggregating）

## 接下來的範例，我會用下列這三個資料表作為說明基礎：

```plaintext
+---------------+   +--------------+   +---------------+
|     users     |   |    photos    |   |   comments    |
+---------------+   +--------------+   +---------------+
| id (PK)       |   | id (PK)      |   | id (PK)       |
| username      |   | url          |   | contents      |
| email         |   | user_id (FK) |   | user_id (FK)  |
|               |   |              |   | photo_id (FK) |
+---------------+   +--------------+   +---------------+
```

---

## 使用 `GROUP BY` 來分組（Grouping）？

* `GROUP BY` 是用來把資料根據某個欄位「分組」的功能。
* 分組之後，通常會搭配彙總函數（例如 COUNT, SUM）來看每組的結果。

```sql
SELECT user_id
FROM comments
GROUP BY user_id;
```

### 舉例來看：

原本的 comments 表看起來像這樣：

```plaintext
+----+--------------+---------+----------+
| id | contents     | user_id | photo_id |
+----+--------------+---------+----------+
| 1  | hi there     |    1    |     5    |
| 2  | how are you  |    3    |     5    |
| 3  | i'm fine     |    5    |     5    |
| 4  | thank you    |    3    |     5    |
| 5  | looks great  |    2    |     4    |
| 6  | hej          |    2    |     5    |
| 7  | meow         |    1    |     5    |
+----+--------------+---------+----------+
```

用 `GROUP BY user_id` 的結果會像這樣：

```plaintext
+---------+
| user_id |
+---------+
|    1    |
|    2    |
|    3    |
|    5    |
+---------+
```

注意！用 `GROUP BY` 後，不能直接選原本沒分組的欄位：

```sql
SELECT contents FROM comments GROUP BY user_id;
-- 錯誤：不能直接選 contents，因為它沒有出現在 GROUP BY 裡，也不是 Aggregate Function!
```

---

## 如何使用 Aggregation Function?

這些函數可以幫我們把很多筆資料「濃縮」成一筆結果。

### 常見的函數有：

* `COUNT()`：算有幾筆資料。
* `SUM()`：加總數值。
* `AVG()`：算平均。
* `MIN()`：找最小值。
* `MAX()`：找最大值。

```sql
SELECT SUM(id) FROM comments;
```

錯誤示範：不能同時選原始欄位又做彙總，除非有 GROUP BY：

```sql
SELECT SUM(id), id FROM comments;
-- 錯誤：comments.id 沒有放在 GROUP BY 裡！
```

---

## 結合 GROUP BY + COUNT()

來看看一個實用的範例：

```sql
SELECT
  user_id,
  COUNT(id) AS num_comments_created
FROM
  comments
GROUP BY
  user_id;
```

這樣就可以算出每個 user\_id 各自留言了幾次。

---

## COUNT() 小細節

如果用 `COUNT(user_id)`，不會算進 NULL 值。

```sql
SELECT COUNT(user_id) FROM photos;  -- 只算有填 user_id 的
SELECT COUNT(*) FROM photos;        -- 全部都算
```

---

## 💪 練習題：每張照片有幾則留言？

```sql
SELECT photo_id, COUNT(*)
FROM comments
GROUP BY photo_id;
```

---

## 🔍 HAVING：對分組後的結果再做篩選

SQL 執行順序可以簡單理解為：

1. `FROM`：先抓資料。
2. `JOIN`：合併其他資料表。
3. `WHERE`：先做基本篩選。
4. `GROUP BY`：分組。
5. `HAVING`：再對分組後的結果做篩選。

### 🧪 範例 1：只選出留言數 > 2 且 photo\_id < 3 的照片

```sql
SELECT
  photo_id,
  COUNT(*)
FROM
  comments
WHERE
  comments.photo_id < 3
GROUP BY
  photo_id
HAVING
  COUNT(*) > 2;
```

### 🧪 範例 2：找出留言超過 20 次，且留言對象是前 50 張照片的使用者

```sql
SELECT user_id, COUNT(*)
FROM comments
WHERE photo_id < 51
GROUP BY user_id
HAVING COUNT(*) > 20;
```

### 🧪 範例 3：哪些手機廠商總營收超過 2,000,000？

資料如下：

```plaintext
+-------------+--------------+-------+------------+
| name        | manufacturer | price | units_sold |
+-------------+--------------+-------+------------+
| N1280       | Nokia        | 199   | 1925       |
| Iphone 4    | Apple        | 399   | 9436       |
| Galaxy S    | Samsung      | 299   | 2359       |
| S5620 Monte | Samsung      | 250   | 2385       |
| N8          | Nokia        | 150   | 7543       |
| Droid       | Motorola     | 150   | 8395       |
| Wave S8500  | Samsung      | 175   | 9259       |
+-------------+--------------+-------+------------+
```

解法如下：

```sql
SELECT
  manufacturer,
  SUM(price * units_sold) AS total_revenue
FROM
  phones
GROUP BY
  manufacturer
HAVING
  SUM(price * units_sold) > 2000000;
```

