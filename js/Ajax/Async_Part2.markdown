# JavaScript中的Asynchronous (PART 2)

## ES6__Promise (讓我們無須面對Callback Hell)

在Asynchronous_PART 1中有談到令程式碼難以維護的Callback Hell，但若透過ES6中的 **new Promise()** 可以使程式碼更有組織。
舉例說明:下方程式碼中透過**Promise( )** 透過建立三種物件(**getIDs**、 **getRecipes**、 **getRelated**)，執行過程中，物件內的呼回函式 (callback function) 若成功執行，會將**resolve( )** 內的參數傳出；若有錯誤，執行 **rejects( )**。

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
            const recipe = {title:"Italian pizze", publisher:"Jonas"};
            resolve(`${pub}: ${recipe.title}`)
        },1500,publisher)
    })
}

getIDs
.then((IDs)=>{
    console.log(IDs);
    return getRecipes(IDs[2]);
})
.then(recipe=>{
    console.log(recipe);
    return getRelated("Mr.Jonas")
})
.then((recipe)=>{
    console.log(recipe);
})
.catch(error=>{
    console.log(error);
});

// [523, 883, 432, 974]
// 432: Fresh tomato pasta
// Mr.Jonas: Italian pizze
```

可以發現利用**Promise( )** 之後，沒有出現callback function之中又有callback function的情況，取而代之的是使用**then()** 以及 **return**來處理，getIDs完成Promise後將**resolve()** 內的資料傳出並以argument帶入**then()** 處理，其內部的**gerRecipes()** 完成Promise後又將**resolve()** 內的資料傳出以argument帶入下一個**then()** 處理，過程就像大隊接力一樣，一棒接著一棒跑完整個流程;雖然**Promise**讓程式碼更有組織以及容易閱讀，但ES8(ES2017)提供了更簡易、方便的方法，也就是**Async Await**，這部分會在PART 3的筆記當中