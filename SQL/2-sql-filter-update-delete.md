# 篩選與更新資料

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

需要特別注意的是，WHERE 語句在某些情況下可能會有點棘手。
當我們編寫 WHERE 語句時，如果我們試圖更新或刪除特定記錄，需要確保我們的 WHERE 條件足夠具體，以便只更新或刪除一個城市。
舉例來說，我們可能知道或不知道，世界上有些城市是以其他城市命名的。例如，在美國實際上有一些城市叫做「Shanghai」，與中國的上海同名。
所以，我們可以想像，如果我們的城市資料表最終變得足夠大，我們可能會有另一個名為「Shanghai」的城市，但其國家/地區是「United States」。
如果我們嘗試更新中國上海的人口值，而只提供了名稱「Shanghai」作為條件，那麼不僅中國的上海會被更新為新值，美國的上海也會被更新為相同的新值。
因此，在編寫 WHERE 語句時，我們需要謹慎，確保條件足夠具體（例如同時指定城市名和國家/地區）：

```sql
UPDATE
  cities
SET
  population = 39505000
WHERE
  name = 'Shanghai' AND country = 'China';
```
