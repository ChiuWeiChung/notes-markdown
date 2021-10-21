# JavaScript中的Asynchronous (PART 3)
承接PART2的結尾，雖然Promise讓程式碼變得比較不難解讀，但ES8(ES2017)提供了更簡易、方便的方法，也就是Async Await，這次透過宣告Async Function (在函數前面加上`async`)，在內部將Promise的物件前面加上`await`，執行過程中，只要一遇到await的Promise會在background執行直到`resolve()`將資料傳回變數內(`IDs`、`recipe1`、`recipe2`)


```js
const getIDs =new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve([523,883,432,974]);
        // reject([523,883,432,974]);
    },1500)
});

const getRecipes = (recID)=>{
    return new Promise((resolve,reject)=>{
        setTimeout((ID)=>{
         const recipe = {title: "Fresh tomato pasta", publisher:"Jonas"};
        resolve(`${ID}: ${recipe.title}`);
        },1500,recID)
        
    })
};

const getRelated = publisher=>{
    return new Promise((resolve,reject)=>{
        setTimeout((pub)=>{
            const recipe = {title:"Italian pizza", publisher:"Jonas"};
            resolve(`${pub}: ${recipe.title}`)
        },1500,publisher)
    })
}

// Async Await Function
async function getRecipesAW(){
    const IDs = await getIDs;
    console.log(IDs);
    const recipe1 = await getRecipes(IDs[2]);
    console.log(recipe1);
    const recipe2 = await getRelated("Mr.Rick"); 
    console.log(recipe2);
};

getRecipesAW();
```

`需要注意的是，Await expression只能運用在Async Function` 

這裡展示在運用Async Await時可能會遇到的失誤，當我們想要Async Function執行完畢後回傳一個value，並輸出在console，如下方程式碼
```js
async function getRecipesAW(){
    const IDs = await getIDs;
    console.log(IDs);
    const recipe1 = await getRecipes(IDs[2]);
    console.log(recipe1);
    const recipe2 = await getRelated("Mr.Rick"); 
    console.log(recipe2);

    return recipe1;  // The value I want to return
};

const rec = getRecipesAW();
console.log(rec);  
// Promise{<pending>}
// [523, 883, 432, 974]
// 432: Fresh tomato pasta
// Mr.Jonas: Italian pizze
```

很顯然，console並沒顯示rec的值，原因主要是最後兩行程式碼(`const rec = getRecipesAW()` & `console.log(rec)`)是以Synchronous形式進行，當`console.log(rec)`要執行的當下，我們的`getRecipesAW( )`尚未執行完畢，因此value還沒有被傳回rec; 但這樣的情況要如何解決呢? 其實可以透過`.then()`來解決

```js
async function getRecipesAW(){
    const IDs = await getIDs;
    console.log(IDs);
    const recipe1 = await getRecipes(IDs[2]);
    console.log(recipe1);
    const recipe2 = await getRelated("Mr.Rick"); 
    console.log(recipe2);

    return recipe1;  // The value I want to return
};

getRecipesAW().then(result=>console.log(`show recipe1 ${result}`));
// Promise{<pending>}
// [523, 883, 432, 974]
// 432: Fresh tomato pasta
// Mr.Jonas: Italian pizze
// show recipe1 432: Fresh tomato pasta

```


以上是針對Asynchronous JavasScript的學習筆記，若未來有所心得會持續更新


