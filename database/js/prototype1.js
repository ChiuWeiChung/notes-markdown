export const render = () => {
    const title = "JavaScript中的Prototype觀念";
    const url = "#javascript/prototype1";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="javascript-prototype-">JavaScript中的Prototype觀念</h1>
<h2 id="-oop-">物件導向語言(OOP)</h2>
<h4 id="-oop-object-properties-methods-oop-javascript-oop-">物件導向語言(OOP)是基於 <code>物件(object)</code> 的一種編寫程式典範(風格)，透過物件，可以用來描述某些抽象或是實體的特徵(某人的出生日、學歷、姓名或是某台車的廠牌、排氣量、馬力)，物件除了可以包含上述資料(properties)以外，還可以包含methods(計算某人的年齡、車子踩油門/剎車後的速度)，而OOP之所以被發展出來，是為了使程式碼更有組織、彈性且容易維護，雖然JavaScript並不是典型的OOP，但在行為及概念上其實有些神似之處。</h4>
<h2 id="js-constructor-">JS中的建構子(Constructor)</h2>
<h4 id="class-oop-class-class-instantiation-javascript-js-constructor-array-js-const-arr-array-constructor-__proto__-constructor-arr1-arr2-constructor-array-">Class在OOP中屬於很重要的元素，Class就像一張藍圖，透過將Class的實體化(Instantiation)來創建不同的物件，而對於JavaScript而言，JS是透過Constructor(建構子)來實體化物件; 以常見的陣列(array)為例子，我們都知道陣列在JS中也是一種物件，當我們想要建立一個陣列，會直覺的透過 <code>const arr=[...]</code> 來實現，事實上，該陣列是透過它的建構子Array(Constructor)創造出來的，如下方程式碼中顯示，透過 <code>.__proto__.constructor</code> 可得知物件的建構子，並發現陣列arr1以及arr2的Constructor都是Array;</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> arr1 = [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>];
<span class="hljs-keyword">const</span> arr2 = new <span class="hljs-keyword">Array</span>(<span class="hljs-number">2</span>, <span class="hljs-number">4</span>, <span class="hljs-number">6</span>);
console.log(arr1.__proto__.<span class="hljs-keyword">constructor</span>.<span class="hljs-keyword">name</span>); <span class="hljs-comment">// Array</span>
console.log(arr1.__proto__.<span class="hljs-keyword">constructor</span> === arr2.__proto__.<span class="hljs-keyword">constructor</span>) <span class="hljs-comment">//true</span>
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/constructor.jpg?raw=true" alt="constructor"></p>
<h2 id="js-prototype-inheritance-">JS中的Prototype(原型)與Inheritance(繼承)</h2>
<h4 id="-arr-arr-push-push-arr-hasownproperty-arr-push-property-push-prototypal-inheritance-push-arr-prototype-arr-prototype-push-prototypal-delegation-">承接上面提到的arr陣列，arr可以透過 <code>.push</code> 在陣列內新增元素，然而， push指令並非真的來自陣列arr本身，透過 <code>.hasOwnProperty</code> 即可證明arr陣列本身並沒有 <code>push</code> 的property，事實上，陣列之所以可以直接使用push指令，是因為Prototypal Inheritance(原型繼承)的特性，push指令是來自陣列arr的prototype所提供的，也可以想像成arr委託它的prototype幫忙執行push這個指令，因此也可以稱為原型委派(Prototypal Delegation)。</h4>
<h4 id="-inhheritance-arr1-arr2-property-property-push-find-filter-prototype-array-prototype-method-prototype-prototype-prototype-prototype-prototype-__proto__-">如下方示意圖顯示，Inhheritance(繼承)的好處在於，當我們創建數個陣列時(arr1, arr2, ...)，每一個陣列的property就不需要存放相同的property(如push, find, filter...)，只要透過共同的prototype(Array prototype)提供即可，以此避免每個物件存放著相同的method，此外，建構子的prototype與被實體化物件的prototype是一樣的，要確認建構子的prototype可以透過指令 <code>.prototype</code> ，但要確認實體化物件的prototype則需要透過指令.<strong>proto</strong>。</h4>
<pre><code class="lang-js"><span class="hljs-selector-tag">arr</span><span class="hljs-selector-class">.hasOwnProperty</span>(<span class="hljs-string">'push'</span>) <span class="hljs-comment">// false  意即arr並沒有push這個property</span>
<span class="hljs-selector-tag">arr</span><span class="hljs-selector-class">.push</span>(<span class="hljs-number">9</span>); <span class="hljs-comment">// arr卻仍可以使用push這個指令</span>
<span class="hljs-selector-tag">console</span><span class="hljs-selector-class">.log</span>(arr) <span class="hljs-comment">// [1,2,3,9] </span>
<span class="hljs-selector-tag">console</span><span class="hljs-selector-class">.log</span>(arr.__proto__.hasOwnProperty(<span class="hljs-string">'push'</span>)) <span class="hljs-comment">// true 來自arr的prototype</span>
<span class="hljs-comment">//建構子與透過它創造出來的陣列，它們的prototype都是一樣的</span>
<span class="hljs-selector-tag">console</span><span class="hljs-selector-class">.log</span>(arr.__proto__ === Array.prototype) <span class="hljs-comment">// true</span>
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/prototype.jpg?raw=true" alt="with prototype idea"></p>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/badway.jpg?raw=true" alt="without prototype idea"></p>
<h2 id="-prototype-chain-lookup-">原型練(Prototype Chain)以及Lookup機制</h2>
<h4 id="-hasownproperty-push-property-arr-prototype-array-prototype-prototype-prototype-object-prototype-prototype-prototype-chain-arr-hasownproperty-javascript-lookup-arr-hasownproperty-property-prototype-array-prototype-prototype-object-prototype-prototype-null-">此外，上一段有透過指令 <code>.hasOwnProperty</code> 來確認物件是否擁有push的property，而該指令並非來自陣列arr本身，也不是來自它的prototype(Array prototype)，而是來自它的prototype的prototype(Object prototype)，如下方程式碼，物件其實都是由不同的prototype串起來的(物件的原型、原型的原型.、原型的原型的原型...)，稱為Prototype Chain(原型鍊)。因此當我們輸入指令 <code>arr.hasOwnProperty</code> 時，JavaScript會遵循Lookup機制，先從arr內尋找是否有 <code>hasOwnProperty</code> 的property，若沒有，再往它的prototype(Array prototype)尋找，搜尋未果的話，再往上一層prototype尋找(Object prototype)，找到會執行並停止搜尋，，若無結果就會再往上層prototype找直到撞見null。</h4>
<pre><code class="lang-js">console.<span class="hljs-built-in">log</span>(arr..hasOwnProperty(<span class="hljs-string">'hasOwnProperty'</span>)) <span class="hljs-comment">//false</span>
console.<span class="hljs-built-in">log</span>(arr.__proto__.hasOwnProperty(<span class="hljs-string">'hasOwnProperty'</span>)) <span class="hljs-comment">//false</span>
console.<span class="hljs-built-in">log</span>(arr.__proto__.__proto__.hasOwnProperty(<span class="hljs-string">'hasOwnProperty'</span>)) <span class="hljs-comment">//true</span>

console.<span class="hljs-built-in">log</span>(arr.__proto__.constructor); <span class="hljs-comment">// Array (顯示為Array的prototype)</span>
console.<span class="hljs-built-in">log</span>(arr.__proto__.__proto__.constructor); <span class="hljs-comment">// Object (顯示為Object的prototype)</span>
console.<span class="hljs-built-in">log</span>(arr.__proto__.__proto__.__proto__) <span class="hljs-comment">// null</span>
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/prototypechain.jpg?raw=true" alt="prototype chain"></p>

            

            

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return { title, markup, url };
}