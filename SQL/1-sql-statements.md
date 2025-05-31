# PostgreSQL 學習筆記 - 什麼是 SQL

1. SQL 是用於與資料庫互動的標準化查詢語言
   * Oracle
   * MS SQL Server
   * MySQL
   * PostgreSQL

2. PostgreSQL 的挑戰
   1. 撰寫高效能查詢以擷取所需資訊
   2. 設計資料庫的結構（Schema）
   3. 理解何時使用進階功能（如索引、視圖、存儲過程等）
   4. 在生產環境中管理資料庫（效能優化、安全性設定、備份還原等）

3. 資料庫設計流程
   1. 確定我們要儲存的實體類型
   2. 定義這些實體具有的屬性
   3. 確定每個屬性所包含的資料類型

## 基本範例

### 建立資料表

```sql
CREATE TABLE cities (
  name VARCHAR(50),
  country VARCHAR(50),
  population INTEGER,
  area INTEGER
);
```

1. CREATE TABLE：關鍵字（Keywords），告訴資料庫我們想要執行的操作。通常以大寫字母書寫。
2. cities：識別符（Identifier），告訴資料庫我們要操作的對象。通常以小寫字母書寫。
3. VARCHAR(50)：可變長度字元。用於儲存文字！若輸入超過 50 個字元的字串，系統會回傳錯誤。
4. INTEGER：不含小數點的整數（範圍從 -2,147,483,647 到 +2,147,483,647）。

### 插入資料到資料表

```sql
INSERT INTO
  cities (name, country, population, area)
VALUES('Tokyo', 'Japan', 37468000, 8223
```

#### 插入多筆資料

```sql
INSERT INTO
  cities (name, country, population, area)
VALUES
  ('Delhi', 'India', 28514000, 1484),
  ('Shanghai', 'China', 25582000, 6341),
  ('Sao Paulo', 'Brazil', 21650000, 1521);
```

### 使用 SELECT 查詢資料

取得資料表中的所有欄位

```sql
SELECT * FROM cities;
```

可以選擇特定欄位進行查詢：

```sql
SELECT area, name FROM cities;
SELECT area, population FROM cities;
SELECT name, name, name FROM cities;
```

1. 第一個查詢從 cities 表中僅擷取 area 和 name 欄位
2. 第二個查詢從 cities 表中僅擷取 area 和 population 欄位
3. 第三個查詢展示了可以多次選擇同一欄位（在這個例子中，name 欄位被選擇了三次）

### 計算欄位

可以在查詢中進行計算並為計算結果命名：

```sql
SELECT name, population / area AS density FROM cities;
```

這個查詢計算了每個城市的人口密度（人口除以面積），並將結果欄位命名為 density。

### 字串運算子與函數

在 PostgreSQL 中，我們可以使用多種方法處理和操作字串資料：

#### 字串連接

1. `||` 運算子：連接兩個或多個字串

```sql
SELECT
  name || ', ' || country AS location
FROM
  cities;
```

輸出結果：
| location          |
|-------------------|
| Tokyo, Japan      |
| Delhi, India      |
| Shanghai, China   |
| Sao Paulo, Brazil |

2. `CONCAT()` 函數：連接多個字串，功能與 `||` 相似

```sql
SELECT
  CONCAT(name, ', ', country) AS location
FROM
  cities;
```

輸出結果：
| location          |
|-------------------|
| Tokyo, Japan      |
| Delhi, India      |
| Shanghai, China   |
| Sao Paulo, Brazil |

#### 字串處理函數

PostgreSQL 提供多種實用的字串處理函數：

1. `LOWER(string)` - 將字串轉換為小寫
2. `LENGTH(string)` - 計算字串的字元數
3. `UPPER(string)` - 將字串轉換為大寫

這些函數可以組合使用：

```sql
SELECT
  UPPER(CONCAT(name, ', ', country)) AS location,
  LENGTH(name) AS name_length
FROM
  cities;
```

輸出結果：
| location          | name_length |
|-------------------|-------------|
| TOKYO, JAPAN      | 5           |
| DELHI, INDIA      | 5           |
| SHANGHAI, CHINA   | 8           |
| SAO PAULO, BRAZIL | 9           |

#### 其他常用字串函數

1. `TRIM(string)` - 移除字串前後的空白
2. `SUBSTRING(string, start, length)` - 從指定位置擷取子字串
3. `REPLACE(string, from, to)` - 替換字串中的指定文字

範例：

```sql
SELECT
  name,
  SUBSTRING(name, 1, 3) AS first_three_chars,
  REPLACE(country, 'a', 'A') AS replaced_country
FROM
  cities;
```

