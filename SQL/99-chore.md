# 紀錄比較瑣碎的 SQL 技巧

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

## `DISTINCT`

what unique departments are there?

```sql
SELECT
  DISTINCT department
FROM
  products
```

What number of unique departments we have inside of our products?

```sql
SELECT
  COUNT(DISTINCT department)
FROM
  products
```

Give every unique combination of department and name put together. 
```sql
SELECT
  DISTINCT department,
  name
FROM
  products
```

In this way, we will never see a row where have the same department and same name. 

## `GREATEST`

Find the greatest value in a List
```sql
SELECT GREATEST(200, 10, 30)
-- greatest 200
```


## `LEAST`

Find the least value in a List
```sql
SELECT LEAST(1000,20,50,100)
-- least 20
```

## `CASE`

Print each product and its price. Also print a description of the price.
```sql
SELECT
  name,
  price,
  CASE
    WHEN price > 600 THEN 'high'
    WHEN price > 300 THEN 'medium'
    ELSE 'cheap'
  END
FROM
  products;
```

## COALESCE

makes sure that you get back a value that is not null if you provide an argument that is not null
```sql
SELECT COALESCE(NULL,5)
-- 5
```

```sql
SELECT COALESCE((NULL)::BOOLEAN::INTEGER, 0 )
-- 3
```
待解釋



## STRING_AGG

若我們希望「一篇文章的所有 tag 變成一行」，可使用 string_agg 聚合
```sql
SELECT 
  posts.id, 
  posts.title, 
  posts.visible, 
  STRING_AGG(tags.name, ', ') AS tag_names
FROM 
  posts
LEFT JOIN post_tags ON posts.id = post_tags.post_id
LEFT JOIN tags ON post_tags.tag_id = tags.id
GROUP BY posts.id
ORDER BY posts.id;
```

這樣每篇文章會變成一行，tag_names 為逗號分隔的字串。
