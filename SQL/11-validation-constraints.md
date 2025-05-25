# Validation And Constraints

## Row-Level Validation

Things we can check for when a row is being inserted/updated

* Is a given value defined
* Is a value unique in its column?
* Is a value `>`, `<`, `>=`, `<=`, `=`, some other value?

### Applying a Null Constraint

When Creating The Table

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  price INTEGER NOT NULL -- NULL Constraint
  weight INTEGER
);
```

After The Table was created

```sql
ALTER TABLE products
ALTER COLUMN price
SET NOT NULL;
```

>if there is already null inside the price column in products table, we can't add rule above!

套用上述規則後，如果插入一個 price 為 NULL 的資料，則會出現 error

```sql
INSERT INTO
  products(name, department, weight)
VALUES
  ('shoes', 'Clothes', 5)
-- ERROR:  null value in column "price" of relation "products" violates not-null constraint
-- Failing row contains (3, shoes, Clothes, null, 5). 
```

### Default Column Values

When Creating The Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  price INTEGER DEFAULT 9999, -- HERE
  weight INTEGER
);
```

After The Table was created
```sql
ALTER TABLE products
ALTER COLUMN price
SET DEFAULT 9999;
```

### Applying a Unique Constraint

If we don't want two products with the same name!

When Creating The Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE, -- HERE
  department VARCHAR(50),
  price INTEGER,
  weight INTEGER
);
```

After The Table was created
```sql
ALTER TABLE products
ADD UNIQUE (name);
```

> We can't a the constraint after the table was created when there is a duplicate values in `name` columns.

### Applying Multi-Column Uniqueness

When Creating The Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  price INTEGER,
  weight INTEGER,
  UNIQUE (name, department) -- HERE
);
```

After The Table was created
```sql
ALTER TABLE products
ADD UNIQUE (name, department)
```

### Applying a Validation Check

When Creating The Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  price INTEGER CHECK(price > 0), -- HERE
  weight INTEGER,
);
```

After The Table was created
```sql
ALTER TABLE products
ADD CHECK (price > 0);
```
> We cannot apply a check if all the rows inside of our existing table don't already satisfy the check

### Applying a Validation Check Over Multiple Columns

```sql
CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  est_delivery TIMESTAMP NOT NULL,
  CHECK (created_at < est_delivery) -- Here
)
```

## 資料驗證應該放在哪一層？ Web Server vs Database

我們經常討論「是否應該把資料驗證邏輯寫在資料庫層」，但事實上，Web Server 也是非常常見且強大的驗證點。

無論使用的是 Node.js、Java、Python 或其他語言編寫 Web Server，都有許多現成的驗證函式庫可以協助驗證輸入資料格式與邏輯。

這引出了核心問題：**我們應該把驗證邏輯放在哪裡？Web Server 還是 Database？**

最佳答案是——**兩者皆是，各自分工**。以下我們比較這兩層的優勢與角色定位。

---

## 為什麼在 Web Server 層做驗證？

| 優點           | 說明                                                       |
| ------------ | -------------------------------------------------------- |
| 更容易處理複雜邏輯    | 例如：要根據外部 API 回傳的股價，來判斷是否新增一筆資料。這種邏輯適合在 Web Server 層處理。   |
| 彈性高、修改快      | 例如要限制產品價格大於 \$10，只需更新程式碼並部署即可。相較於修改資料庫 schema，風險與工時都低很多。 |
| 有現成函式庫       | 多數語言（如 JS、Java、Python）都有專門做驗證的套件，可快速驗證 email、電話號碼等。      |
| 外部資料驗證較適合放這層 | 若需要發送網路請求查詢外部服務，應避免放在資料庫層進行。Postgres 雖技術上可以這麼做，但不建議這樣使用。 |

簡言之，Web Server 層驗證的優勢在於**彈性高、速度快、擴充容易**。

---

## 為什麼仍然需要在 Database 層做驗證？

| 優點           | 說明                                                             |
| ------------ | -------------------------------------------------------------- |
| 可從任何資料來源保護資料 | 不只 Web Server，資料可能透過 PgAdmin、CLI 工具寫入，這些不一定會經過應用程式的驗證邏輯。 |
| 強制執行、不可繞過    | Constraint（如 `CHECK`, `NOT NULL`）是由資料庫層強制檢查的，無法繞過。             |
| 資料一致性保障      | 當加入 constraint 時，Postgres 會立即檢查現有資料是否符合。這有助於確保歷史資料也符合同樣的邏輯。    |
| 可防止部分資料不一致   | 若只在 Web Server 做驗證，資料庫中可能會存在不符合新規則的舊資料，導致資料不一致問題。              |

換句話說，Database 層的驗證提供了**最後一道防線**，保證資料完整性與一致性。

---

## 最佳實務建議

最穩健的方式是：**兩層都做驗證，但分工負責不同邏輯類型。**

| 驗證邏輯類型      | 應放置層級      |
| ----------- | ---------- |
| 較靈活、變動頻繁的邏輯 | Web Server |
| 需查詢外部資源的邏輯  | Web Server |
| 關鍵資料規則，必須正確 | Database   |

### 實例：

* 註冊時，檢查使用者名稱長度 ≥ 4：可寫在 Web Server。這條規則不嚴重，少了也不會影響系統安全。
* 產品價格必須 > 0：應在資料庫加上 `CHECK(price > 0)`。這是資料正確性的保證，不能只靠前端或 Web Server。
