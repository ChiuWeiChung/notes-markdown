
# 紀錄比較瑣碎的 SQL 技巧

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