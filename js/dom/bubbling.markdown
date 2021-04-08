# Bubbling aned capturing(冒泡與捕捉)

## 冒泡事件

#### 所謂的冒泡事件，指的是當子元素的DOM Event被觸發時，引起父層元素、祖父元素、曾祖父元素... 的監聽事件也隨後被觸發，如[我的Codepen](https://codepen.io/rickchiu/pen/abmdYMW)所呈現，整個html結構有外而內分別是html、body、外層div、中間層div、內層div，當我分別在三層div中都加入 `click` 的event後，其callback function會將改變該元素的background-color，可以發現倘若點擊內層元素div時，中間層以及外層的event handler也被執行，這就是所謂的冒泡事件，`內層事件觸發也會引起父層元素事件被觸發。

## 冒泡/捕捉是如何發生的?

#### 如下方示意圖，當元素 `inner div` 被點擊時，事實上，click事件並不是一開始就出現在 `inner div` ，而是出現在DOM tree的最頂端，click事件會從DOM tree的頂端開始， `沿著inner div的父層元素` 一層一層的往內走，在抵達 `inner div` 之前的過程，稱為 `捕捉階段(Capturing Phase)` ，在這個階段，click事件拜訪過的的父層元素只要有含有 `click` 的DOM event就會被觸發，但由於在 `addEventListener()` 的預設值為false(冒泡事件)，所以click事件在捕捉階段並不會觸發父層元素的event handler。

#### 當click事件抵達目標元素 `inner div` 時，稱為 `Target Phase` ，該階段會觸發目標元素的event handler，然而click事件的旅程尚未結束，因為從哪來就從哪回去，因此在抵達 `inner div` 後又會隨著原路回去，這個過程則稱為冒泡階段(Bubbling phase)，同樣地，click事件在回程路上也會觸發父層元素的event handler。

``` html
<html>

<body>
    <div class="outer">
        This is outer-div
        <div class="middle">
            This is middle-div
            <div class="inner">
                This is inner-div
            </div>
        </div>
    </div>
</body>

</html>
```

![捕捉與冒泡示意圖](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/bubbling.jpg?raw=true)

## 冒泡/捕捉的設定

#### 當父層元素在 `addEventListenr()` 中的第三個參數設定為 `true` 時，表示click事件只會在捕捉階段(capturing phase)觸發callback function，若不設定參數，則為預設值 `false` ，表示click事件只有在回程路上才會觸發父層元素的callback function。

``` js
// 設定第三個參數為true時，僅捕捉階段才會觸發callback function
outer.addEventListener('click', function() {
    console.log('outer')
}
}, true)
middle.addEventListener('click', function() {
    console.log('middle')
}, true)
inner.addEventListener('click', function() {
    console.log('inner')
})
// 點擊<div class="inner">後console.log的順序為
// "outer"
// "middle"
// "inner"
```

``` js
// 不設定則預設值為false，僅冒泡階段才會觸發callback function
outer.addEventListener('click', function() {
    console.log('outer')
}
})
middle.addEventListener('click', function() {
    console.log('middle')
})
inner.addEventListener('click', function() {
    console.log('inner')
})
// 點擊<div class="inner">後console.log的順序為
// "inner"
// "middle"
// "outer"
```

## 阻止冒泡發生

#### 可以在子元素的callback function內引入event參數(名稱任取)，並執行 `event.stopPropagation()` 即可阻止冒泡事件的發生

``` js
inner.addEventListener('click', function(e) {
    e.stopPropagation(); // 
})
```

## event.target永遠指向目標元素

#### 需要注意的是，冒泡事件過程中，每個監聽事件內的callack function中，它們的 `event.target` 都是指向被點擊的目標元素

``` js
outer.addEventListener('click', function(event) {
    console.log(`This is outer div，my event.target is`, $ {
        event.target
    })
})
middle.addEventListener('click', function(event) {
    console.log(`This is middle div，my event.target is`, $ {
        event.target
    })
})
inner.addEventListener('click', function(event) {
    console.log(`This is inner div，my event.target is`, $ {
        event.target
    })
})
// 點擊<div class="inner">後console.log的順序為 
// This is outer div，my e.target is <p>​This is inner-div​</p>​
// This is middle div，my e.target is <p>​This is inner-div​</p>​
// This is inner div，my e.target is <p>​This is inner-div​</p>​
```

## 事件委派(Event Delegation)

#### 由於冒泡/捕捉的特性而延伸出的event handling模式，藉此可以減少 `addEventListener()` 的次數，假如有多個不同元素都有DOM event的需求，我們可以將event handler設定在他們共同的父層元素，並且透過if statement來確認事件發生在哪一個元素來實現。

``` html
<html>

<body>
    <div class="container">
        <div class="outer">
            This is outer-div
            <div class="middle">
                This is middle-div
                <div class="inner">
                    This is inner-div
                </div>
            </div>
        </div>
    </div>
    <script>
        const container = document.querySelector('.container');
        //將事件處理統一交給共同的父層元素處理
        container.addEventListener('click', function(e) {
            // 透過if statement來確認點擊的元素為何
            if (e.target.classList.contains('outer')) { //如果點擊的目標元素的class為"outer" 
                e.target.style.backgroundColor = "green";
                console.log(e.target.className) // "outer"
            } else if (e.target.classList.contains('middle')) { //如果點擊的目標元素的class為"middle" 
                e.target.style.backgroundColor = "blue";
                console.log(e.target.className) //  "middle"
            } else if (e.target.classList.contains('inner')) { //如果點擊的目標元素的class為"outer" 
                e.target.style.backgroundColor = "red";
                console.log(e.target.className) //  "inner"

            }
        })
    </script>
</body>

</html>
```

## DOM遍歷(DOM traversing)

``` html
<body>
    <h1>Bubbling/Captruing DEMO</h1>
    <div class="container">
        <div class="outer">
            This is outer-div
            <div class="middle">
                This is middle-div
                <div class="inner">
                    This is inner-div
                </div>
            </div>
        </div>
    </div>
    <div class="footer">Thank you for playing</div>
    <script>
        const container = document.querySelector('.container');
        const inner = document.querySelector('inner');
        // 搜尋子層元素/節點
        console.log(container.querySelector('.outer')); //以container為節點往內搜尋
        console.log(container.childNodes); // NodeList(3) [text, div.outer, text]
        console.log(container.children); //    HTMLCollection [div.outer]
        console.log(container.firstElementChild) // <div class="outer">...</div>
        //搜尋父層元素
        console.log(container.parentNode); //<body>...</body>   
        console.log(container.parentElement); //<body>...</body>
        // 選取最靠近的外層元素
        inner.closest('.outer').style.background = 'var(--gradient-secondary)';
        // 選取兄弟元素/節點
        console.log(container.previousElementSibling); //<h1>...</h1>
        console.log(container.nextElementSibling); //<div class="footer">...</div> 
        console.log(container.previousSibliing); //#text
        console.log(container.nextSibliing); //#text
    </script>
</body>
```


<!-- #### a click happnes on a link, the dom then generatea click event right away, hwoever this event is actually not generater at target element, so the element, where the event happened, in this case the click on anchor element. Instead, the event is actually generated at the root of the document, so at the very top of the dom tree. and from there, and from there, the so-called capturing phase happens. where the event then travels all to way down from the document route to the target element. and as the events travele down the tree. it will pass through every single parent elements of the target element. In our example, the HTML element, body, section , p , and finally reaches the target a. As soon as the event reaches the target. the target phase begins, where events can be handled right at the target. we do that with event listeners such as this one. so event wait for certain event to happen  on a certain element, as soon as the events occurs, it runs the attached callback function, 

#### in this example, it will simply create this alert window. This happen in the target phase. after reaching the target, the event then actually  travel all the way up to the document route again, in the so-called bubbling phase. so we say that events bubble up from the target to the document route. and just like in the capturing phase, the event passes throught all its parent elements, and really just the parents so not throught any sibling elements. so as the events travels down and up the tree, they pass throught all the parents elements.

#### By default, events can only be handled in the target and in the bubbling phase. However, we can set up event listeners in a way that they listen to events in the capturing phase instead. We can also say event propagate. which is really what capturing and bubbling is. it's events propaating from one place to another.

#### Also, actually not all types of events do have a capturing and bubbling phase. some of them are created right on the target element and so we can only handle them there. 

## Practice

#### e.target only point to the element which the first click happened.

``` js
// rgb(255, 255, 255)
const randomInt = (max, min) => {

    return Math.floor(Math.random() * (max - min + 1) + min);

}
const randomColor = () => {

    return `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`

}

document.querySelector('.nav__link').addEventListener('click', function(e) {

    this.style.backgroundColor = randomColor();
    console.log('nav__link', e.target, e.currentTarget);
    console.log(this === e.currentTarget);
    // Stop propagation
    // e.stopPropagation();

}); 
document.querySelector('.nav__links').addEventListener('click', function(e) {

    this.style.backgroundColor = randomColor();
    console.log('nav__links', e.target, e.currentTarget);
    console.log(this === e.currentTarget);

}); 
document.querySelector('.nav').addEventListener('click', function(e) {

    this.style.backgroundColor = randomColor();
    console.log('nav', e.target, e.currentTarget)
    console.log(this === e.currentTarget);

}); 
``` -->

<!-- #### Add event listener to common parent element, determine waht element originated the event.

``` js
document.querySelector('.nav__links').addEventListener('click', function(e) {

    e.preventDefault();
    // mathcing strategy
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href') // this.href will show absolute URL
        document.querySelector(id).scrollIntoView({
            behavior: 'smooth'
        });
    }

})
``` -->
<!-- 
``` js
const container = document.querySelector('.container');
// 搜尋子層元素
console.log(container.querySelector('.outer-div')); //以container為節點往內搜尋
console.log(container.childNodes); // NodeList(3) [text, div.outer, text]
console.log(container.children); //    HTMLCollection [div.outer]
console.log(container.firstElementChild) // <div class="outer">...</div>

//搜尋父層元素
console.log(container.parentNode); //<body>...</body>   
console.log(container.parentElement); //<body>...</body>

// 選取最靠近的外層元素

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('.h1').style.background = 'var(--gradient-primary)';

// 選取兄弟元素
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling); // <div class="container'>...</div>
console.log(h1.previousSibliing);
console.log(h1.nextSibliing);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(el) {
    if (e !== h1) {
        el.style.transform = 'scale(0.5)'
    }
})
``` -->