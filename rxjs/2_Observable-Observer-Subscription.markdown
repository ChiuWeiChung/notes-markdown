# Observable 與 Observer 以及 Subscription

構成 RxJS 的三大要素分別是，1. Observable 2. Subscription 3. Observer

我們可以將 Observable 想像成一個水龍頭，而 Subscribe 這個動作就像再把水龍頭打開，讓飲水機的水可以流出 (stream)，而 Observer 可以想像成一個水桶，負責接收流出來的水，倘若水質清澈就繼續出水給水桶裝，倘若水質變混濁或是水桶裝滿了就關閉水龍頭 (Unsubscribe)，而判斷是否要將水龍頭繼續保持開啟讓水流出或是關上水龍頭的邏輯則是被寫在 Observable 內部，

```consol

    ┌──────────────────┐     
    │    Observable    │     
    └──────────────────┘   
       ↓            ↑
 ┌────data──────────╂───────┐
 │     ↓            ┃       │            
 │    data          ┃       │            
 │     ↓            ┃       │           
 │    data      Subscribe   │               
 │     ↓            ┃       │         
 │    data          ┃       │ ＝> Subscription            
 │     ↓            ┃       │              
 │    data          ┃       │         
 │     ↓            ┃       │                       
 │  ┌──────────────────┐    │ 
 │  │     Observer     │    │
 │  └──────────────────┘    │
 └──────────────────────────┘  
 
```

在 RxJs 當中，Observalbe 可以透過 `new Observable` 這個 constructor 來建立，並提供一個 callback function 給它，這個 callback function 主要就是讓我們將 stream 的來源放入其中，並且透過 callback function 所提供的 `subscriber` 物件來控制 stream 的發送以及終止，其中 `subscriber` 物件可以被解構成三種 `notification` ，其分別是:
1. **next** notification，發送資料，在上述舉例中就像是出水的動作。
2. **error** notification，發送錯誤，並且將 Observable 執行 Unsubscribe，在上述例子就像是遇到水質混濁發送錯誤訊息並停止裝水。
3. **complete** notification，結束並將 Observable 執行 Unsubscribe，在上述例子就像是水桶裝滿了並停止裝水

## 範例

### step 1 - 建立 Observable

如下方程式碼，當我們透過 `new Observable` 建立了一個新的 Observable，並在 callback function 內透過 `subscriber.next` 將 `Pasta` 以及 `Steak` 這兩個字串的資料發送出去。然而，單純建立 Observable 並不會產生 stream，因為還缺少了 Subscribe 這個動作以及 Observer 這個角色。

```js
import { Observable } from 'rxjs' 

// 建立 Observable
const observable$ = new Observable((subscriber) => {
  subscriber.next("Pasta");
  subscriber.next("Steak");
});
```
> 當在建立 Observable 時，通常都會在名稱後面加入 $ 符號來表示他是個 Observable 方便辨識

### step 2 - 執行 Subscribe 以及建立 Observer

此時我們要將建立完成的 Observable 進行 Subscribe 的動作，所謂的 Subscribe 基本上就是再執行 Observable 內的 callback function，在 callback function 內部會透過 `subscriber.next` 將資料發送給 Observer，而 Observable 在被 Subscribe 之後就成了一個 Subscription，而為了觀察 Observavle 所丟出來的 stream，我們必須提供 Subscription 一個 Observer，由於上述提到 `subscriber` 包含了 1.next 2.error 3.complete 這三種 notification 來分別進行資料的發送/錯誤通知/完成通知，因此當我們在定義 Observer 的時候，也理所當然地會針對這三種 notification 做出不同的應對，如下方程式碼中定義的 `observer` 的物件。
 
再完成 Observable 以及 Observer 的建立並且將其 Subscribe 之後，如下方程式碼，Observable 會依照其內部的 callback function **依序**把三組字串透過 `next notification` 丟給 observer 內的 `next handler` 接受，因此我們可以看到 console.log 出來的結果分別是 `Pasta` 、 `Steak` 以及 `Sushi`。

```js
import { Observable } from 'rxjs' 

// ===== 建立 Observable =====
const observable$ = new Observable((subscriber) => {
  subscriber.next("Pasta");
  subscriber.next("Steak");
  subscriber.next("Sushi");
  subscriber.complete();
});

// ===== 建立 Observer =====
const observer = {
  next: (value) => console.log(value), // next handler     : 會接收 Observable 傳下來的資料 ('Pasta' & 'Steak')
  error: (error)=>console.log(error),  // error handler    : 發送的錯誤會在這邊被接收並執行
  complete:()=>console.log('complete'),// complete handler : 執行後也會觸發這邊的函式 
};

// 將 Observable 執行 Subscribe，並且提供 Observer，這樣經完成了一個 Subscription
const subscription =observable$.subscribe(observer)  

// Pasta
// Steak
// Sushi
```

簡而言之，單純建立 Observable 並不會執行其內部的邏輯，因為 Observable 需要被 Subscribe 才有意義，而 Observer 是針對 Observable 所發送出的資料流 (stream)的內容(next/error/complete)做出不同的反應(react)。

若我們只在意 Observable 中 `next notification` 所傳送的資料，在 `subscribe` 之後所提供的 Observer 可以單純是一個 callback function，這個 callback function 直接作為 next handler。

```ts
observable$.subscribe((value) => console.log(value));
```

## Unsubscribing

如果我們不想再繼續接收 Observable 所丟出來的 stream，我們可以透過 Unsubscribe 的方式關掉它，只要把當初建立的 `subscription` 執行 `.unsubscribe` ，此時的 Observer 就不會再接收到任何 Observable 所丟出來的資料了。

如下方程式碼中，在 Observable 內的 callback function 會在 `observable$.subscribe` 之後立即發出 `Pasta`，並且分別在 2 秒以及 4 秒後分別發出 `Steak` 以及 `Sushi`，但是在外部的邏輯當中，設定了一個計時器，預計在 3 秒後將執行 unsubscribe 的動作，因此我們只會看到 Observer 接收到 `Pasta` 以及 `Steak`，因為在第 3 秒的時候，`subscription.unsubscribe` 就已經被執行了。

```ts
import { Observable } from "rxjs";

const observable$ = new Observable<string>((subscriber) => {
  subscriber.next("Pasta");
  setTimeout(() => subscriber.next("Steak"), 2000);
  setTimeout(() => subscriber.next("Sushi"), 4000);
});

const subscription = observable$.subscribe((value) => console.log(value));

setTimeout(() => {
  console.log("Unsubscribe");
  subscription.unsubscribe();
}, 3000);

// Pasta
// Steak
// Unsubscribe
```

> 上述雖然上面的程式碼所建立的 `Subscription` 順利被取消了，但事實上卻造成了 memory leaks，因為第三個 `setTimeout` 並不會因為 `Unsubscribe` 而被移除，他仍然佔據了已不在使用的記憶體空間，如何順利消除 memory leaks 這部分會寫在第三章 (Subscription 的生命週期)的心得內容當中。

## Multiple Subscriptions

上面已經講解了如何建立 Observable / Observer 以及如何去 Subscribe 來建立一個 Subscription，事實上， Observable 是可以多次被 Subscribe 的，而且每個 Subscription 都是獨立存在互不影響，因為在本章節的前期有提到，Subscribe 基本上是再執行 Observable 內部的 callback function，因此不同時機點所建立的 Subscription 基本上只是在獨立執行 Observable 內的邏輯而已。假設有一個 Observable，但我需要對他所發出來的 stream 做不同的應用，這時候就可以透過建立不同的 Observer 來進行 Subscribe，如下方的示意圖。

```consol

    ┌─────────────────────────────────────────────────────────────────────────────┐        
    │                                Observable                                   │     
    └─────────────────────────────────────────────────────────────────────────────┘   
       ↓          ↑                ↓          ↑               ↓          ↑
 ┌────data────────╂───────┐  ┌────data────────╂───────┐ ┌────data────────╂───────┐
 │     ↓          ┃       │  │     ↓          ┃       │ │     ↓          ┃       │            
 │    data        ┃       │  │    data        ┃       │ │    data        ┃       │           
 │     ↓          ┃       │  │     ↓          ┃       │ │     ↓          ┃       │           
 │    data    Subscribe   │  │    data    Subscribe   │ │    data    Subscribe   │               
 │     ↓          ┃       │  │     ↓          ┃       │ │     ↓          ┃       │                        
 │    data        ┃       │  │    data        ┃       │ │    data        ┃       │         
 │     ↓          ┃       │  │     ↓          ┃       │ │     ↓          ┃       │            
 │    data        ┃       │  │    data        ┃       │ │    data        ┃       │       
 │     ↓          ┃       │  │     ↓          ┃       │ │     ↓          ┃       │                     
 │  ┌──────────────────┐  │  │  ┌──────────────────┐  │ │  ┌──────────────────┐  │ 
 │  │    bserver A     │  │  │  │    Observer B    │  │ │  │    Observer C    │  │
 │  └──────────────────┘  │  │  └──────────────────┘  │ │  └──────────────────┘  │
 └────────────────────────┘  └────────────────────────┘ └────────────────────────┘
        Subscription A              Subscription B            Subscription C
```



如下方程式碼顯示，在定義 `observable$` 後，在不同的時機點(第 0 秒以及第 3 秒)分別建立了 `subscriptionB` 以及 `subscriptionA`，接下來觀察 console.log 出來的結果顯示，兩個 Subscription 各自執行 Observable 內的邏輯，並且分別透過他們的 Observer 進行資料的接受，彼此不受影響。


```ts
import { Observable } from "rxjs";

const observable$ = new Observable<string>((subscriber) => {
  subscriber.next("Pasta");
  setTimeout(() => subscriber.next("Steak"), 2000);
  setTimeout(() => subscriber.next("Sushi"), 4000);
});

const subscriptionA = observable$.subscribe({
  next: (value) => console.log("Subscription A: ", value)
});

setTimeout(() => {
  const subscriptionB = observable$.subscribe({
    next: (value) => console.log("Subscription B: ", value)
  });
}, 3000);

// Subscription A:  Pasta    at 0 second
// Subscription A:  Steak    at 2 second
// Subscription B:  Pasta    at 3 second
// Subscription A:  Sushi    at 4 second
// Subscription B:  Steak    at 5 second
// Subscription B:  Sushi    at 7 second
```


## 小結

* Observable 只有在被 Subscribe 才能產生 stream
* Observable 可以多次被 Subscribe，並且建立出各自獨立的 Subscription，彼此之間不受影響
* 當 Observable 被 Subscribe 時，提供的 Observer 事實上是作為 argument 被丟進 Observable 內的 callback function，也因如此資料才可以被 Observer 所接收
* Observable 可以透過在Unsubscribe 令其停止發送資料

