# Data Types

下方內容如果有 markdown 語法 & 排版上不適合的地方，請協助修正，以方便讀者閱讀

## Numbers Types
### PostgreSQL Numeric Types 對照表

### 1. 整數型（無小數點）

| 型別       | 範圍                                      |
|------------|-------------------------------------------|
| `smallint` | -32,768 到 +32,767                        |
| `integer`  | -2,147,483,648 到 +2,147,483,647          |
| `bigint`   | -9,223,372,036,854,775,808 到 +9,223,372,036,854,775,807 |

### 2.浮點數型（有小數點）

| 型別              | 精度 / 範圍                                                |
|-------------------|-------------------------------------------------------------|
| `decimal`         | 最多 131072 位於小數點前，16383 位於小數點後               |
| `numeric`         | 同 `decimal`，為精確數值型                                   |
| `real`            | 約 6 位有效數字，範圍 1E-37 到 1E37                         |
| `double precision`| 約 15 位有效數字，範圍 1E-307 到 1E308                      |
| `float`           | 等同於 `real` 或 `double precision`，依實現細節而定         |

### 3.自動遞增整數（無小數點，自動遞增）

| 型別          | 範圍                                      |
|---------------|-------------------------------------------|
| `smallserial` | 1 到 32,767                               |
| `serial`      | 1 到 2,147,483,647                        |
| `bigserial`   | 1 到 9,223,372,036,854,775,807            |

### Numeric Types Fast Rules

* 'id' column of any table : Mark the column as `SERIAL`.
* Need to store a number without a decimal: Mark the column as `INTEGER`.
* Need to store a number with a decimal and this data need to be very accurate: Mark the column as `NUMERIC`.
  * ex: Bank balance, grams of gold, scientific calculations.
* Need to store a number with a decimal and the decimal doesn't make a big difference: Mark the column as `DOUBLE PRECISION`.
  * ex: Kilograms of trash in a landfill, liters of water in a lake, air pressure in a tire.


```sql
SELECT (1.99999::REAL - 1.99998::REAL)
SELECT (1.99999::DOUBLE PRECISION - 1.99998::DOUBLE PRECISION)
SELECT (1.99999::FLOAT - 1.99998::FLOAT)
```

的結果與

```sql
SELECT (1.99999::DECIMAL - 1.99998::DECIMAL)
SELECT (1.99999::NUMERIC - 1.99998::NUMERIC)
```

不同，原因在 Performance 與 Precision 之間的考量

---

## Character Types

| Type          | Range                                                                               |
|---------------|-------------------------------------------------------------------------------------|
| `CHAR`        | Store some characters, length will always be 5 even if PG has to insert spaces      |
| `VARCHAR`     | Store any length of string                                                          |
| `VARCHAR(40)` | Store a string up to 40 characters, automatically remove extra characters           |
| `TEXT`        | Store any length of string                                                          |

> There is no performance difference between theses character types.


## Boolean Types

| VALUE                        | RESULT     |
|------------------------------|-----------|
| `true`, `'yes'`, on, 1, t, y |  TRUE     |
| `false`, `'no'`, off, 0, f, n|  TRUE     |
| null                         |  NULL     |


## Date Types

### DATE
| VALUE                  | RESULT              |
|------------------------|---------------------|
| `1980-11-20`           | 20 November 1980    |
| `Nov-20-1980`          | 20 November 1980    |
| `20-Nov-1980`          | 20 November 1980    |
| `1980-November-20`     | 20 November 1980    |
| `November 20, 1980`    | 20 November 1980    |

### TIME
| VALUE                  | RESULT              |
|------------------------|---------------------|
| `01:23 AM`             | 01:23:00            |
| `05:23 PM`             | 17:23:00            |
| `23:12`                | 23:12:00            |

### TIME WITH TIME ZONE
| VALUE                  | RESULT              |
|------------------------|---------------------|
| `01:23 AM EST`         | 01:23:00-05:00      |
| `05:23 PM PST`         | 17:23:00-08:00      |
| `05:23 PM UTC`         | 17:23:00+00:00      |

### INTERVAL
| VALUE                  | RESULT              |
|------------------------|---------------------|
| `1 day`                | 1 day               |
| `1 D 20 H 30 M 45 S`   | 1 day 20:30:45      |