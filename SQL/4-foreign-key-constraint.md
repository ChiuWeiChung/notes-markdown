# PostgreSQL 學習筆記 - Foreign Keys

## 與插入操作相關的 Foreign Key 限制

### Foreign Key 所參照的資料不存在時

如果嘗試在 `photos` 表插入一筆資料，而 `user_id` 並不存在於 `users` 表中，PostgreSQL 將會拋出錯誤。

```sql
INSERT INTO photos (url, user_id)
VALUES ('http://example.test6666.jpg', 6666);

-- insert or update on table "photos" violates foreign key constraint "photos_user_id_fkey"
```

這表示 PostgreSQL 正在檢查 Foreign Key 是否確實存在於參照的表（這裡是 `users`）中。因為找不到對應的記錄，因此操作失敗並拋出錯誤。

### Foreign Key 欄位設置為 NULL

若嘗試插入資料時，Foreign Key 欄位設定為 `NULL` 或根本未提供此欄位，則插入資料會成功，因為 Foreign Key 約束允許為 NULL。

```sql
INSERT INTO photos (url, user_id)
VALUES ('http://example.test888.jpg', NULL);

-- INSERT SUCCESSFUL
```

或者直接省略欄位：

```sql
INSERT INTO photos (url)
VALUES ('http://example.test999.jpg');

-- INSERT SUCCESSFUL
```

兩種情況皆可順利插入資料。

## 刪除 Foreign Key 所參照的資料

當我們嘗試刪除被參照的資料，而有其他資料仍透過 Foreign Key 參照它時，將會引發錯誤：

```sql
DELETE FROM users
WHERE id = 1;

-- update or delete on table "users" violates foreign key constraint "photos_user_id_fkey" on table "photos"
```

這個錯誤代表 PostgreSQL 偵測到有其他記錄依然參照我們試圖刪除的資料，因此禁止執行該刪除動作，以確保資料完整性。


### PostgreSQL Foreign Key Constraints: `ON DELETE` Options

在 PostgreSQL 中，當我們設定 Foreign Key 時，可以透過 `ON DELETE` 選項來定義當被參照的資料被刪除時的行為。以下是各選項的詳細說明：

---

### 1. `ON DELETE RESTRICT`

* 當有其他記錄透過 Foreign Key 參考到這筆資料時，PostgreSQL 會直接禁止這個刪除動作，並立即拋出錯誤。
* PostgreSQL 在我們嘗試刪除資料的當下就會立即檢查相關依賴。

### 2. `ON DELETE NO ACTION`（預設行為）

* 若有其他資料透過 Foreign Key 參照該筆資料，刪除操作會被禁止，並在整個 SQL 語句完成後再檢查。
* 若發現違反 Foreign Key 約束，整個語句會被回復（rollback）。

> **注意**：`RESTRICT` 與 `NO ACTION` 的差異在於檢查的時機。`RESTRICT` 立即檢查，`NO ACTION` 則延遲至整個語句完成後再檢查。

---

### 3. `ON DELETE CASCADE`

* 當我們刪除被參考的資料時，所有參考該資料的子資料也會一併自動刪除，這稱為 ON DELETE CASCADE。

```sql
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(200),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

---

### 4. `ON DELETE SET NULL`

* 當我們刪除被參考的資料時，所有參考此資料的記錄之 Foreign Key 欄位會自動被設置為 `NULL`。
* 若 Foreign Key 欄位設定了 `NOT NULL` 約束，則會發生錯誤。

```sql
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(200),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);
```

---

### 5. `ON DELETE SET DEFAULT`

* 當我們刪除被參考的資料時，所有參考此資料的記錄之 Foreign Key 欄位會自動被設置為事先設定好的預設值。
* 該預設值必須有效，否則 PostgreSQL 會拋出錯誤。

```sql
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(200),
  user_id INTEGER DEFAULT 2 REFERENCES users(id) ON DELETE SET DEFAULT
);
```