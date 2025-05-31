# PostgreSQL 學習筆記 - 篩選（Where）與更新資料（Update）

## 使用 "WHERE" 篩選資料列

```sql
SELECT name FROM cities WHERE area > 4000;
```

在閱讀上述查詢時，我們可能會傾向於從左到右理解，並假設 PostgreSQL 以相同的順序執行查詢。
然而，最好不要以從左到右的方式思考查詢的執行過程。換句話說，不要將其視為「先 SELECT，再 FROM，最後 WHERE」。

```
+-------------------+--------------------+-------------------+
|    SELECT name    |     FROM cities    | WHERE area > 4000 |
+-------------------+--------------------+-------------------+
         ^                    ^                   ^
         |                    |                   |
        第三步               第一步               第二步       
```

這是 PostgreSQL 實際執行這些步驟的順序：
1. 首先，PostgreSQL 會查看資料來源。它分析我們的查詢，並確定我們要從 cities 資料表中提取所有資料列。
2. 在獲取所有資料來源後，它會應用篩選條件。對於每一行，它只考慮面積大於 4000 的資料列。這將過濾掉結果集中的某些資料列。
3. 對於所有剩餘的資料列，它會選擇指定的欄位。

所以，應該將執行順序視為：先執行 FROM，再執行 WHERE，最後執行 SELECT。

以上面的圖表為例，我們可以想像 FROM 語句首先執行，這將給我們 cities 表中的所有資料列。其次是 WHERE 語句，我們只要求面積大於 4000 的城市，這會排除面積小於 4000 的城市。然後，從所有剩餘的資料列中，我們只想檢索 name 欄位，這就是我們最終在應用程式中看到的輸出結果。

## 更多關於 "WHERE" 關鍵字的用法

1. `=` -> 值是否相等？
2. `>` -> 左側的值是否較大？
3. `<` -> 左側的值是否較小？
4. `>=` -> 左側的值是否大於或等於右側？
5. `<=` -> 左側的值是否小於或等於右側？
6. `<>` -> 值是否不相等？
7. `!=` -> 值是否不相等？
8. `BETWEEN` -> 值是否在兩個其他值之間？

```sql
SELECT
  name,
  area
FROM
  cities
WHERE
  area BETWEEN 1000 AND 7000;
```

9. `IN` -> 值是否存在於列表中？
```sql
SELECT
  name,
  area
FROM
  cities
WHERE
  area IN (8223);
```

10. `NOT IN` -> 值是否不存在於列表中？
```sql
SELECT
  name,
  area
FROM
  cities
WHERE
  area NOT IN (8223, 1521);
```

### 複合式篩選

可以使用 AND 或 OR 運算子組合多個條件：

```sql
SELECT
  name,
  area
FROM
  cities
WHERE
  area NOT IN (8223, 1521) AND name = 'Delhi';
```

## 更新資料列

使用 UPDATE 語句可以修改資料表中的資料：

```sql
UPDATE
  cities
SET
  population = 39505000
WHERE
  name = 'Tokyo';
```

## 刪除資料列

使用 DELETE 語句可以從資料表中刪除資料：

```sql
DELETE FROM
  cities
WHERE
  name = 'Tokyo';
```

### 注意事項

WHERE 在某些情況下可能會帶來意料之外的結果，特別是在執行更新或刪除操作時。如果我們想修改特定使用者的資料，就必須確保 WHERE 條件足夠明確，否則可能會誤改到其他擁有相同名稱的使用者。

舉例來說，資料表中可能會有多位使用者都叫做 Alex。若只使用 WHERE name = 'Alex' 來更新資料，例如變更電子信箱，那麼所有叫做 Alex 的使用者都會被更新。

因此，撰寫 WHERE 時應特別謹慎，建議使用更具辨識性的條件，例如同時指定使用者名稱與使用者 ID：

```sql
UPDATE
  users
SET
  email = 'alex@example.com'
WHERE
  name = 'Alex' AND user_id = '1398';
```
