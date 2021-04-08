export const render = () => {
    const title = "JavaScript中的Constructor&Class";
    const url = "#javascript/prototype2";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="javascript-function-constructor-class">JavaScript中的Function Constructor、Class</h1>
<h4 id="-javascript-prototype-javascript-prototype1-prototype-methods-javascript-constructor-constructor-prototype-">在<a href="/#javascript/prototype1">JavaScript的Prototype觀念</a>中有談到Prototype的觀念以及物件是如何調用methods，而在這裡會記錄JavaScript中的如何建立Constructor(建構子)，並且透過Constructor來將物件實體化，並連結它的prototype。</h4>
<h2 id="-prototype-">建立Prototype並連結物件?</h2>
<h4 id="-js-1-function-constructor-2-es6-class-oop-class-3-object-create-">在JS中，有三中方法可以做到，1. 函式建構式(function constructor)，2. ES6的class(與傳統OOP的class行為不同) 3. Object.create()。</h4>
<h2 id="1-function-constructor-">1. 函式建構式(function constructor)</h2>
<h4 id="-function-expression-person-this-xxx-property-function-constructor-arrow-function-this-">函式建構式類似函式敘述式(function expression)，但名稱第一個字母為大寫，已用來辨認為一般函式還是建構子，如下方程式碼，創建了一個 <code>Person</code> 建構子，並且透過 <code>this.xxx</code> 來定義物件內的property，必須注意的是，function constructor不能使用箭頭函式(arrow function)，因為它的this並不是指向物件本身。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> Person = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">firstName, birthYear</span>) </span>{
    <span class="hljs-keyword">this</span>.firstName = firstName;
    <span class="hljs-keyword">this</span>.birthYear = birthYear;
};
<span class="hljs-keyword">const</span> rick = <span class="hljs-keyword">new</span> Person(<span class="hljs-string">'Rick'</span>, <span class="hljs-number">1992</span>); <span class="hljs-comment">// 透過 new operator創立新的物件</span>
<span class="hljs-built_in">console</span>.log(rick); <span class="hljs-comment">// Person {firstName: "Rick", birthYear: 1992}</span>
<span class="hljs-comment">// 將methods建立在function constructor的prototype</span>
</code></pre>
<h2 id="-constructor-prototype-">物件、Constructor、Prototype的關係</h2>
<h4 id="-methods-person-10-person-10-methods-methods-prototype-person-prototype-rick-prototype-person-prototype-methodname-function-lookup-prototype-chain-">當我們在定義methods時，並不會在Person內建立，如上一篇提到，倘若創立10個由Person衍伸出的物件，10個物件內都會含有相同的methods，使的程式碼的重複性過高，為避免這種情況，會傾向將methods建立在它的prototype。此外，Person的prototype以及rick的prototype都會指向同一個物件，也因此，只要透過 <code>Person.prototype.methodName=function(){...}</code> 來定義需要使用的函式，物件在執行函式時，會透過Lookup機制，沿著Prototype Chain尋找函式名稱。</h4>
<pre><code class="lang-js"><span class="hljs-comment">// 物件的prototype以及constructor的prototype是同一個</span>
<span class="hljs-built_in">console</span>.log(rick.__proto__ === Person.prototype) <span class="hljs-comment">// true</span>
<span class="hljs-comment">// 透過在constructor的prototype定義函式</span>
Person.prototype.calcAge = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-number">2030</span> - <span class="hljs-keyword">this</span>.birthYear)
};
<span class="hljs-comment">// calcAge函式出現在物件rick的prototype</span>
<span class="hljs-built_in">console</span>.log(rick.__proto__) <span class="hljs-comment">// {calcAge: ƒ, constructor: ƒ}</span>

<span class="hljs-comment">// 執行過程中，JavaScript透過Lookup機制，沿著Prototype Chain尋找calcAge的property</span>
rick.calcAge() <span class="hljs-comment">// 38</span>
<span class="hljs-keyword">const</span> ann = <span class="hljs-keyword">new</span> Person(<span class="hljs-string">'Ann'</span>, <span class="hljs-number">1993</span>);
<span class="hljs-comment">//rick以及ann的Prototype都指向同一個</span>
rick.__proto__ === ann.__proto__ <span class="hljs-comment">//true</span>
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/relationship.jpg?raw=true" alt="relationship"></p>
<h2 id="function-constructor-">Function Constructor之間的繼承</h2>
<h4 id="-constructor-person-constructor-firstname-birthyear-property-property-country-person-rick-country-mike-stella-mike-country-stella-country-code-constructor-inheritance-">透過constructor之間的繼承，可以將實體化的物件被分類的更詳細，比如已經存在的Person Constructor具有firstName以及birthYear的property，倘若想在物件內增加新的property(如country)，又想維持Person的內容的情況下，雖然可以透過 <code>rick.country=...</code> 實現，但是若新增其他的物件(如mike, stella)時，這樣的動作仍需重複一次(mike.country=..., stella.country=...)，為了避免code的重複敘述，可以透過constructor的Inheritance來實現。</h4>
<h4 id="-constructor-taiwanese-object-create-peron-prototype-taiwanese-prototype-taiwanese-mike-">創建一個新的constructor(Taiwanese)，透過 <code>Object.create()</code> 將Peron的prototype傳入Taiwanese的prototype內，此時被Taiwanese實體化的物件mike，</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> Taiwanese = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">firstName, birthYear, country</span>) </span>{
    <span class="hljs-comment">//透過.call ==&gt;效果同this.firstName=firstName,this.birthYear=...</span>
    Person.call(<span class="hljs-keyword">this</span>, firstName, birthYear);
    <span class="hljs-keyword">this</span>.country = country;
};

<span class="hljs-comment">//  透過Object.create繼承Person.prototype</span>
Taiwanese.prototype = <span class="hljs-built_in">Object</span>.create(Person.prototype);

<span class="hljs-comment">//  在定義Taiwanese prototype內的函式時，需在Object.create()之後</span>
<span class="hljs-comment">//  避免prototype內容被Person.prototype覆蓋</span>
Taiwanese.prototype.sayHi = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`Hi! My name is <span class="hljs-subst">\${<span class="hljs-keyword">this</span>.firstName}</span> and I am a Taiwanese!\`</span>)
}

<span class="hljs-keyword">const</span> andy = <span class="hljs-keyword">new</span> Taiwanese(<span class="hljs-string">'Andy'</span>, <span class="hljs-number">1992</span>, <span class="hljs-string">'Taiwanese'</span>);
andy.calcAge(); <span class="hljs-comment">//38</span>
</code></pre>
<h2 id="-prototype-chain">繼承後的Prototype Chain</h2>
<pre><code class="lang-js">console.<span class="hljs-built_in">log</span>(andy.__proto.constructor.<span class="hljs-built_in">name</span>); <span class="hljs-comment">//Person </span>
<span class="hljs-comment">// 上方照理來說，應是Taiwanese，但因為透過Object.create將Person prototype傳入，所以被Taiwanese被Person覆蓋</span>
console.<span class="hljs-built_in">log</span>(andy.__proto.__proto__.constructor.<span class="hljs-built_in">name</span>); <span class="hljs-comment">// Person</span>
console.<span class="hljs-built_in">log</span>(andy.__proto.__proto__.__proto__.constructor.<span class="hljs-built_in">name</span>); <span class="hljs-comment">// Object</span>
console.<span class="hljs-built_in">log</span>(andy.__proto.__proto__.__proto__.__proto__); <span class="hljs-comment">// null</span>
</code></pre>
<h2 id="2-es6-class">2. ES6的Class</h2>
<h4 id="es6-class-function-constructor-class-function-constructor-syntactic-sugar-data-methods-class-hoisted-">ES6的class其實是第一種方法(Function Constructor)的另一中表現方式，因為class可以讓程式碼更有更有組織、容易判讀，所以又被稱為Function Constructor的語法糖(syntactic sugar)，可以將data以及methods都寫在一起即可，因此最常被拿來使用。 <code>需要注意的是，class不會被hoisted</code> ，所以在使用前必須先行宣告。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">class</span> Person <span class="hljs-comment">{
    // 將資料置於constructor(){}</span>內部
    <span class="hljs-function"><span class="hljs-keyword">constructor</span><span class="hljs-params">(firstName, birthYear)</span> <span class="hljs-comment">{
        this.firstName = firstName;
        this.birthYear = birthYear;
    }</span>
    <span class="hljs-comment">// 下方定義的函式，事實上是被存放在Person.prototype內部</span>
    <span class="hljs-title">calcAge</span><span class="hljs-params">()</span> <span class="hljs-comment">{
        console.log(2030 - this.firstName)
    }</span>
}
<span class="hljs-title">const</span> <span class="hljs-title">stella</span> = <span class="hljs-title">new</span> <span class="hljs-title">Person</span><span class="hljs-params">("Stella", 1990)</span>;</span>
console.log(stella); <span class="hljs-comment">//Person {firstName: "Stella", birthYear: 1990}</span>
</code></pre>
<h2 id="class-static">class中的static</h2>
<h4 id="-prototype-methods-static-">倘若不想要物件繼承prototype內的methods，可以在函式宣告前面加上 <code>static</code></h4>
<pre><code class="lang-js"><span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Person</span> </span>{
    <span class="hljs-keyword">constructor</span>(firstName, birthYear) {
        <span class="hljs-keyword">this</span>.firstName = firstName;
        <span class="hljs-keyword">this</span>.birthYear = birthYear;
    }
    calcAge() {
        <span class="hljs-built_in">console</span>.log(<span class="hljs-number">2030</span> - <span class="hljs-keyword">this</span>.firstName)
    }
    <span class="hljs-comment">// static擺在函式宣告前面</span>
    <span class="hljs-keyword">static</span> whoAmI() {
        <span class="hljs-built_in">console</span>.log(<span class="hljs-keyword">this</span>.prototype.constructor.name)
    }
}
Person.whoAmI(); <span class="hljs-comment">// Person</span>
<span class="hljs-keyword">const</span> stella = <span class="hljs-keyword">new</span> Person(<span class="hljs-string">"Stella"</span>, <span class="hljs-number">1990</span>);
stella.__proto__.hasOwnProperty(<span class="hljs-string">'calcAge'</span>) <span class="hljs-comment">// true</span>
stella.__proto__.hasOwnProperty(<span class="hljs-string">'whoAmI'</span>) <span class="hljs-comment">// false</span>
</code></pre>
<h2 id="class-">class之間的繼承</h2>
<h4 id="class-extedns-classname-">class之間的繼承，可以透過 <code>extedns className</code> 來實現，</h4>
<pre><code class="lang-js"><span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Taiwanese</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">Person</span> </span>{
    <span class="hljs-keyword">constructor</span>(firstName, birthYear, country) {
        <span class="hljs-comment">// super類似constructor之間繼承時，使用Person.call()的概念</span>
        <span class="hljs-comment">// super必須定義在前!</span>
        <span class="hljs-keyword">super</span>(firstName, birthYear)
        <span class="hljs-keyword">this</span>.country = country;
    }
    sayHi() {
        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`Hi! My name is <span class="hljs-subst">\${<span class="hljs-keyword">this</span>.firstName}</span> and I am <span class="hljs-subst">\${<span class="hljs-keyword">this</span>.country}</span>\`</span>)
    }
};

<span class="hljs-keyword">const</span> rick = <span class="hljs-keyword">new</span> Taiwanese(<span class="hljs-string">'Rick'</span>, <span class="hljs-number">1992</span>, <span class="hljs-string">'Taiwanese'</span>);
<span class="hljs-comment">// Prototype Chain</span>
<span class="hljs-built_in">console</span>.log(rick.__proto__.constructor.name); <span class="hljs-comment">// Taiwanese</span>
<span class="hljs-built_in">console</span>.log(rick.__proto__.__proto__.constructor.name); <span class="hljs-comment">// Person</span>
<span class="hljs-built_in">console</span>.log(rick.__proto__.__proto__.__proto.constructor.name); <span class="hljs-comment">//Object</span>
</code></pre>
<h2 id="3-object-create-">3. Object.create()</h2>
<h4 id="object-literal-prototype-object-create-">object literal也可以作為prototype，並透過 <code>Object.create()</code> 傳入。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> Person = {
    calcAge() {
        <span class="hljs-built_in">console</span>.log(<span class="hljs-number">2030</span> - <span class="hljs-keyword">this</span>.birthYear)
    }
};
<span class="hljs-keyword">const</span> allen = <span class="hljs-built_in">Object</span>.create(Person)
allen.calcAge(); <span class="hljs-comment">// 37;</span>
<span class="hljs-built_in">console</span>.log(allen.__proto__ === Person)
</code></pre>
<h2 id="object-literal-">Object literal 的繼承</h2>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> Person={
    calcAge() {
        <span class="hljs-built_in">console</span>.log(<span class="hljs-number">2030</span> - <span class="hljs-keyword">this</span>.birthYear)
    },
    setData(firstName,birthYear){
        <span class="hljs-keyword">this</span>.firstName=firstName;
        <span class="hljs-keyword">this</span>.birthYear=birthYear;
    }
};

<span class="hljs-keyword">const</span> Taiwanese = <span class="hljs-built_in">Object</span>.create(Person);
Taiwanese.setData=<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">firstName,birthYear,country</span>)</span>{
    Person.setData.call(<span class="hljs-keyword">this</span>,firstName,birthYear);
    <span class="hljs-keyword">this</span>.country=country;
};

<span class="hljs-keyword">const</span> ted = <span class="hljs-built_in">Object</span>.create(Taiwanese);
ted.setData(<span class="hljs-string">'Ted'</span>,<span class="hljs-number">1990</span>,<span class="hljs-string">'Taiwanese'</span>);
<span class="hljs-built_in">console</span>.log(ted.__proto__); <span class="hljs-comment">//{setData: ƒ}</span>
<span class="hljs-built_in">console</span>.log(ted.__proto__.__proto__); <span class="hljs-comment">// {calcAge: ƒ, setData: ƒ}</span>
</code></pre>


            

            

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return { title, markup, url };
}