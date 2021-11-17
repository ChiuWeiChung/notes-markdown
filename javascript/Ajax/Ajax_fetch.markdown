# JavaScript-AJAX FETCH 
這篇主要紀錄使用 AJAX 筆記，利用 **fetch()** 來串接外部API，並以**then( )** 以及**catch()** 來做示範。
```js
function getWeather(woeid){
        fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`) // using cors proxy to bypss the cors issue
        .then((result)=>{
            // console.log(result);
            return result.json()
        })
        .then((data)=>{
            // console.log(data);
            const today = data.consolidated_weather[0];
            console.log(`Temperature in ${data.title} stay between ${today.min_temp} and ${today.max_temp}`)
        })
        .catch((error)=>{
            console.log(error)
        })
};
getWeather(4118);
```

當然，也可以使用ES8的Async Await Function來改寫上述程式碼，並且透過**try** 以及**catch()** 處理可能會出現的錯誤:

```js
async function getWeatherAW(woeid){
        try{
            const result = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`);
            const data = await result.json();
            const today = data.consolidated_weather[0];     
            console.log(`Temperature in ${data.title} stay between ${today.min_temp} and ${today.max_temp}`)
            return data;
        } catch(error){
            console.log(error);
        }
};

getWeatherAW(2471217);
getWeatherAW(2388929).then((data)=>{
    console.log(data);
});
```