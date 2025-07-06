# PostgreSQL 學習筆記 - Transaction



交易情境，小明轉帳給小美 50 塊錢

```sql
UPDATE accounts
SET balance = balance - 50
WHERE name = 'HSIAO MING'
```

因此小美的帳戶多了 50 塊錢

```sql
UPDATE accounts
SET balance = balance + 50
WHERE name = 'HSIAO MAY'
```

如果上述兩個 SQL 的操作過程中，小明從帳戶轉出給 50 塊錢是成功的，但是要執行將 50 塊錢轉帳給小美時出現了異常

Maybe unfortunately in between your server running this first query right here or this first update and the second update maybe unfortunately you have some kind of crash. Now, when you crash, you might have already ran the statement that would subtract $50 from 小明's account, but you were never able to actually run the statement. That would add 50 to 小美's account. 

Eventually your server might come back online, but you might not have any infrastructure or any code in place to detect any of these kind of half executed steps. If that was the case, then you will have withdrawn $50 from 小明's account and you've essentially got no accounting for it whatsoever.

Nothing to say that you still need to add $50 into 小美's account. Nothing to say that 小明 has $50 less than she should have and so on. So this would definitely be a scenario that would be really bad and hard for us to recover from. So this scenario is what transactions are all about. We are going to use a transaction to solve this kind of problem where we want to run some kind of updates in series and we need to make sure that all the different updates are always executed or none of them are executed.

So in other words, we need both these statements to be successfully executed or if only one is able to be executed and not the other, we need to roll them all back and undo all the changes we have made.

## Opening and Closing Transactions

We have now created that accounts table. So now we're going to take a look at how we created transaction and manage it. We're going to first begin by taking a look at a couple of different diagrams. So inside this diagram, we've got our Postgres database. We are connecting to a Postgres database by creating something called a connection. Every query to a window that you open up inside of Pgadmin or any time that you connect to your database from some other kind of application or even some code that you might write, you are creating a different and unique connection.


TODO 添加說明
```sql
BEGIN;
```

TODO 添加說明
```sql
UPDATE accounts
SET balance = balance - 50
WHERE name = 'HSIAO MING';

SELECT * FROM accounts;
```

TODO 添加說明
```sql
UPDATE accounts
SET balance = balance + 50
WHERE name = 'HSIAO MAY';

SELECT * FROM accounts;
```

TODO 添加說明
```sql
COMMIT;
```

We can roll it back if we just decide that we don't want to deal with any of the stuff. 
If we have an error in one of the statements we run, we can close this thing out with a `ROLLBACK`. And then finally, 
if there's any kind of error in the connection itself, if the connection just crashes, 
then Postgres is going to automatically just clean everything up for us.

## Transaction Lock

待解釋