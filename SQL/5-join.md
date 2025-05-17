# Joins & Aggregation in PostgreSQL

資料庫中常用的兩大操作分別是 Join 和 Aggregation，透過這兩個方式，我們能有效地合併或分析資料。

---

## 1. Joins

* 用於從多個相關資料表合併列（rows），產生新的資料集合。
* 當查詢需求涉及到多個相關資源時，通常會需要使用 Join。

## 2. Aggregation

* 聚合函數是將多個列（rows）的資料，計算成一個單一數值。
* 當需求中出現「最多」、「最少」、「平均」等描述時，就是使用 Aggregation。

---

## 資料表範例

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

## 從不同資料表 JOIN 資料

範例查詢：列出每則留言內容及其對應的使用者名稱

```sql
SELECT
  contents,
  username
FROM
  comments
  JOIN users ON users.id = comments.user_id;
```

### 執行順序

1. **`FROM comments`**：從 `comments` 表中選取所有資料列。
2. **`JOIN users ON ...`**：將來自 `comments` 的每列資料，根據條件 (`users.id = comments.user_id`) 與 `users` 表進行合併。
3. **`SELECT contents, username`**：從合併後的結果中選擇所需的欄位。

---

## 關於 JOIN 的補充說明

### 1. 資料表順序對 JOIN 的影響

大多數情況下，JOIN 語句中資料表的順序不會影響結果（特別是 INNER JOIN）：

```sql
SELECT
  contents,
  username
FROM
  comments
  JOIN users ON users.id = comments.user_id;
```

上述查詢的結果與以下查詢完全相同：

```sql
SELECT
  contents,
  username
FROM
  users
  JOIN comments ON users.id = comments.user_id;
```

### 2. 欄位名稱衝突時必須明確指定來源

如果不同的表中存在相同名稱的欄位，查詢時必須清楚指明欄位來源：

```sql
SELECT
  id
FROM
  photos
  JOIN comments ON photos.id = comments.photo_id;

-- 錯誤，column reference "id" is ambiguous
```

解決方式：

```sql
SELECT
  photos.id AS photo_id
FROM
  photos
  JOIN comments ON photos.id = comments.photo_id;
```

### 3. 使用 AS 重命名資料表（Alias）

透過 `AS` 可以更簡潔地引用表名，特別是名稱較長時非常實用：

```sql
SELECT
  comments.id AS comment_id,
  p.id AS photo_id
FROM
  photos AS p
  JOIN comments ON p.id = comments.photo_id;
```

---

# PostgreSQL JOIN 方法介紹

## 📌 資料表結構

```plaintext
photos
+----+---------------------+---------+
| id | url                 | user_id |
+----+---------------------+---------+
| 1  | https://santina.net |    2    |
| 2  | https://alayna.net  |    3    |
| 3  | https://kailyn.name |    1    |
| 4  | http://banner.jpg   |  NULL   |
+----+---------------------+---------+

users
+----+----------------------+
| id | username             |
+----+----------------------+
| 1  | Reyna.Marvin         |
| 2  | Micah.Cremin         |
| 3  | Alfredo66            |
| 4  | Gerard_Mitchell42    |
+----+----------------------+
```

---

## 🔗 INNER JOIN

僅回傳 `photos.user_id = users.id` 的配對成功結果。

```sql
SELECT url, username
FROM photos
JOIN users ON users.id = photos.user_id;
```

### 🔍 示意圖：

```plaintext
photos.user_id        users.id         結果
--------------        ---------        ----------------------
      2         <-->      2            ✅ https://santina.net, Micah.Cremin
      3         <-->      3            ✅ https://alayna.net, Alfredo66
      1         <-->      1            ✅ https://kailyn.name, Reyna.Marvin
    NULL         ✗       (無對應)       ❌ 不會出現在結果中
```

### ✅ 結果表格：

```plaintext
+---------------------+--------------+
| url                 | username     |
+---------------------+--------------+
| https://santina.net | Micah.Cremin |
| https://alayna.net  | Alfredo66    |
| https://kailyn.name | Reyna.Marvin |
+---------------------+--------------+
```

---

## 🔎 JOIN 時的缺失資料問題

當資料表的 Foreign Key 欄位包含 `NULL` 值時，`INNER JOIN` 會忽略這些資料，導致查詢結果不完整。

### ❗ 問題場景

假設我們希望列出所有 `photos` 的 URL 與對應的 `username`，但若某筆 `photos.user_id` 是 `NULL`，如下查詢將無法顯示這筆資料：

```sql
SELECT url, username
FROM photos
JOIN users ON users.id = photos.user_id;
```

由於 `INNER JOIN` 會過濾掉無法配對的資料，像 `user_id = NULL` 的紀錄就會被排除在結果之外。

### ✅ 解法：使用其他 JOIN 類型

為了保留 `photos` 表的所有資料，無論是否能對應 `users`，我們可以改用 `LEFT JOIN`：

```sql
SELECT url, username
FROM photos
LEFT JOIN users ON users.id = photos.user_id;
```

這樣即使 `user_id` 是 NULL，該筆資料仍會顯示，`username` 欄位則為 `NULL`，確保資料完整呈現。

---

## 🔗 LEFT JOIN（LEFT OUTER JOIN）

保留 `photos` 的所有資料，右側（users）若無配對則補 NULL。

```sql
SELECT url, username
FROM photos
LEFT JOIN users ON users.id = photos.user_id;
```

### 🔍 示意圖：

```plaintext
photos.user_id        users.id         結果
--------------        ---------        ----------------------
      2         <-->      2            ✅ https://santina.net, Micah.Cremin
      3         <-->      3            ✅ https://alayna.net, Alfredo66
      1         <-->      1            ✅ https://kailyn.name, Reyna.Marvin
    NULL         ✗       (無對應)       ✅ http://banner.jpg, NULL
```

### ✅ 結果表格：

```plaintext
+---------------------+--------------+
| url                 | username     |
+---------------------+--------------+
| https://santina.net | Micah.Cremin |
| https://alayna.net  | Alfredo66    |
| https://kailyn.name | Reyna.Marvin |
| http://banner.jpg   | NULL         |
+---------------------+--------------+
```

---

## 🔗 RIGHT JOIN（RIGHT OUTER JOIN）

保留 `users` 所有資料，左側（photos）若無配對則補 NULL。

```sql
SELECT url, username
FROM photos
RIGHT JOIN users ON users.id = photos.user_id;
```

### 🔍 示意圖：

```plaintext
users.id        photos.user_id         結果
---------        --------------         ----------------------------
     1       <-->     1                 ✅ https://kailyn.name, Reyna.Marvin
     2       <-->     2                 ✅ https://santina.net, Micah.Cremin
     3       <-->     3                 ✅ https://alayna.net, Alfredo66
     4         ✗     (無對應)           ✅ NULL, Gerard_Mitchell42
```

### ✅ 結果表格：

```plaintext
+---------------------+---------------------+
| url                 | username            |
+---------------------+---------------------+
| https://santina.net | Micah.Cremin        |
| https://alayna.net  | Alfredo66           |
| https://kailyn.name | Reyna.Marvin        |
| NULL                | Gerard_Mitchell42   |
+---------------------+---------------------+
```

---

## 🔗 FULL JOIN（FULL OUTER JOIN）

保留兩邊所有資料，無配對則補 NULL。

```sql
SELECT url, username
FROM photos
FULL JOIN users ON users.id = photos.user_id;
```

### 🔍 示意圖：

```plaintext
photos.user_id        users.id         結果
--------------        ---------        ----------------------------
      2         <-->      2            ✅ https://santina.net, Micah.Cremin
      3         <-->      3            ✅ https://alayna.net, Alfredo66
      1         <-->      1            ✅ https://kailyn.name, Reyna.Marvin
    NULL         ✗       (無對應)       ✅ http://banner.jpg, NULL
   (無對應)      ✗           4          ✅ NULL, Gerard_Mitchell42
```

### ✅ 結果表格：

```plaintext
+---------------------+---------------------+
| url                 | username            |
+---------------------+---------------------+
| https://santina.net | Micah.Cremin        |
| https://alayna.net  | Alfredo66           |
| https://kailyn.name | Reyna.Marvin        |
| http://banner.jpg   | NULL                |
| NULL                | Gerard_Mitchell42   |
+---------------------+---------------------+
```
