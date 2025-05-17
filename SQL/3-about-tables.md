# 關於設計 Table?
設計資料庫時，我們應考慮以下三個關鍵原則：
1. 標準化功能模組：
常見功能（例如：認證、留言等）通常具有傳統的資料表名稱及欄位設計。
這些名稱與結構有助於保持一致性，並便於未來擴充或維護。

2. 資源識別與區隔：
首先識別應用程式中的各項資源，並為每個資源建立單獨的資料表。
例如：users、photos、comments、likes 等。

1. 關聯性：
如果兩個資源之間存在擁有關係或關聯性，則需在資料表設計中進行反映。
例如：
* photos 與 users 之間的關聯（誰上傳了這張照片）
* comments 與 photos 之間的關聯（針對哪張照片進行留言）

## Table 關係 (Relationship) 概念說明
1.	一對一 (One to One)
	* 每筆資料僅對應另一個 Table 中的一筆資料。
	* 範例： 每個人僅有一本護照，每本護照僅對應一位持有人。
2.	一對多 (One to Many)
	* 一筆資料可對應到另一個 Table 中的多筆資料。
	* 範例： 一位父親可擁有多個孩子，但每個孩子僅對應一位父親。
3.	多對多 (Many to Many)
	* 一筆資料可對應到另一個 Table 中的多筆資料，且雙方皆可對應多筆資料。
	* 範例： 一名學生可選修多門課程，而每門課程也可包含多名學生。

## Primary Key 與 Foreign Key 的概念

* Primary Key (pk)：
    * 用於唯一標識 Table 中的每筆資料，必須為唯一且不重複的值。
* Foreign Key (fk)：
    * 用於建立資料之間的關聯，指向另一個 Table 的 Primary Key 欄位，以便於查找相關資料。

下方兩個 Table 的設計展示了 Primary Key 與 Foreign Key 的應用：
1. 在「照片資訊 Table」中：
  * id 欄位是 Primary Key，用於唯一標識每張照片。
	* user_id 欄位：Foreign Key，對應到「使用者資訊 Table」的 id 欄位，用於建立兩者之間的關聯。
2. 在「使用者資訊 Table」中：
	* id 欄位：Primary Key，唯一標識每位使用者。

### 📸 照片資訊 Table
| id  | url                                | user_id |
|-----|------------------------------------|---------|
| 1   | https://example.com/image1.png     | 4     |
| 2   | https://example.com/image2.jpg     | 4     |
| 3   | https://example.com/image3.gif     | 1     |
| 4   | https://example.com/image4.webp    | 2     |

### 👤 使用者資訊 Table
| id  | userName   | email                |
|-----|------------|----------------------|
| 1   | johndoe    | johndoe@example.com  |
| 2   | janesmith  | janesmith@example.com|
| 3   | alex_lee   | alex.lee@example.com |
| 4   | emilywang  | emily.wang@example.com |

關聯性說明：
* 照片 image1.png 和 image2.jpg 的 user_id 為 4，對應使用者 emilywang。
* 照片 image3.gif 的 user_id 為 1，對應使用者 johndoe。

如此一來，透過 Foreign Key (user_id)，我們可以輕易追蹤每張照片所屬的使用者，建立資料間的關聯性。


#### **Primary Keys vs Foreign Keys 比較**

| 特性         | **Primary Keys**              | **Foreign Keys**                  |
|--------------|------------------------------------|---------------------------------------|
| **定義**      | 每個資料表中的每一列都有唯一的 pk  | 如果一筆資料屬於另一筆資料，則該筆資料會擁有 fk |
| **唯一性**    | 同一資料表中， pk 的值必須唯一      | 同一資料表中，可以有多筆資料擁有相同的 fk |
| **名稱**      | 99% 的情況下稱為 `id`               | 名稱可變，通常為 `xxx_id`                |
| **數據類型**  | 通常為 `integer` 或 `uuid`          | 與所參照資料的 pk 類型相同                |
| **數據變動**  |  pk 一旦建立，不會改變              | 若關聯對象改變，則 fk 可能隨之變動         |


## Understanding Foreign Keys
在 SQL 中，**Foreign Keys** 是用來維護資料完整性的重要概念。它用於建立一個資料表與另一個資料表之間的關聯。

> 在資料庫設計中，當我們處理 一對多 (One-to-Many) 或 多對多 (Many-to-Many) 關聯時，「多方 (Many)」的 Table 通常會擁有 Foreign Key 欄位，以建立與另一個 Table (通常是「一方」) 的連結。 

### 以 Instagram 為例

在 Instagram 的資料庫設計中，我們可能會建立 users（使用者）、photos（照片）和 comments（評論） 三個資料表。
以下是它們的關聯性：
* photos 表中的 user_id 是 Foreign Key，對應 users 表中的 id 欄位。
* comments 表中的 user_id 和 photo_id 皆為 Foreign Key，分別對應 users 和 photos 表中的 Primary Key 欄位 (id)。

關聯關係圖示：
```
+---------------+   +--------------+   +---------------+
|               |   |              |   |               |
|     users     |   |    photos    |   |   comments    |
|               |   |              |   |               |
+---------------+   +--------------+   +---------------+
| id (PK)       |   | id (PK)      |   | id (PK)       |
| username      |   | url          |   | contents      |
| email         |   | user_id (FK) |   | user_id (FK)  |
|               |   |              |   | photo_id (FK) |
+---------------+   +--------------+   +---------------+
```


### **📝 Comments Table**

| id  | text                | user_id | photo_id |
|-----|---------------------|---------|----------|
| 1   | Nice shot!          | 1       | 2        |
| 2   | Love this photo!    | 2       | 1        |
| 3   | Amazing colors      | 3       | 3        |
| 4   | Where was this?     | 1       | 4        |

* user_id: 指向 users 表中的 id 欄位，以標示評論的發佈者。
* photo_id: 指向 photos 表中的 id 欄位，以標示評論所屬的照片。

---

### **📷 Photos Table**

| id  | url                          | user_id |
|-----|------------------------------|---------|
| 1   | https://example.com/img1.jpg | 1       |
| 2   | https://example.com/img2.jpg | 2       |
| 3   | https://example.com/img3.jpg | 3       |
| 4   | https://example.com/img4.jpg | 1       |

* user_id: 指向 users 表中的 id 欄位，以標示照片的上傳者。


---

### **👤 Users Table**

| id  | username   | email               |
|-----|------------|---------------------|
| 1   | alice      | alice@example.com   |
| 2   | bob        | bob@example.com     |
| 3   | charlie    | charlie@example.com |
| 4   | dave       | dave@example.com    |

* id: Primary Key，唯一標識每個用戶。


# 自動產生 ID（Primary Key 與 Foreign Key）

在 PostgreSQL 中，`SERIAL` 是一種自動生成的整數型別，用於建立自動遞增的 Primary Key。  
在 Foreign Key 中，我們透過 `REFERENCES` 關鍵字來建立資料表之間的關聯。

---

## **建立 Users 資料表並產生自動遞增的 Primary Key**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50)
);
```
## ✅ 語法說明：
* SERIAL： 自動生成遞增整數 (1, 2, 3, ...) 並設定為 Primary Key。
* PRIMARY KEY： 確保 id 欄位的值是唯一且不可為空。
---

## 插入 Users 資料

```sql
INSERT INTO
  users (username)
VALUES
  ('Alice'),
  ('Stevie'),
  ('Jonathan'),
  ('Harry')
```

### ✅ 語法說明：
* 我們僅插入 username 欄位，id 欄位將自動生成遞增值。
* 插入後，id 欄位的值將依序為：1, 2, 3, 4。

---

## **建立 Photos 資料表並建立 Foreign Keys 關聯**

```sql
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(200),
  user_id INTEGER REFERENCES users(id)
);
```

### ✅ 語法說明：
* *id SERIAL PRIMARY KEY： 每張照片將擁有唯一的自動遞增 id。
* *user_id INTEGER： 將 user_id 欄位設為整數，用於參照 users 資料表中的 id 欄位。
* *REFERENCES users(id)：
* *建立 user_id 與 users 表中的 id 欄位之間的關聯。
* *確保 user_id 的值必須對應到 users 表中的有效 id 值。

---

## 插入 Photos 資料

```sql
INSERT INTO
  photos (url, user_id)
VALUES
  ('http://example.test1.jpg', 4),
  ('http://example.test2.jpg', 2),
  ('http://example.test3.jpg', 1),
  ('http://example.test4.jpg', 3),
  ('http://example.test5.jpg', 4),
  ('http://example.test6.jpg', 1),
  ('http://example.test7.jpg', 3);
```

### ✅ 語法說明：
* id 欄位將自動生成並遞增 (1, 2, 3, ...)。
* user_id 欄位必須對應到 users 表中的 id 值，否則插入將失敗。

---

## 查詢：找到 user_id = 4 的所有照片

```sql
SELECT
  *
FROM
  photos
WHERE
  user_id = 4;
```

### ✅ 語法說明：
* 我們在 photos 表中查詢 user_id 為 4 的所有照片。
* 此查詢將返回 Harry 上傳的所有照片

---

## 查詢：列出所有照片並顯示關聯用戶的資訊

```sql
SELECT
  url,
  username
FROM
  photos
  JOIN users ON user.id = photo.user_id;
```

### ✅ 語法說明：
* JOIN 關鍵字： 將 photos 表中的 user_id 與 users 表中的 id 進行連接，以顯示照片與上傳者的對應關係。
* 結果： 每張照片將顯示其 url 及對應的 username。