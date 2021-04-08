export const render = ()=>{
    const title = "了解JavaScript的背後Part6 (Primitives&Objects)";
    const url = "#javascript/knowJs6";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="-javascript-part6-primitives-objects-">了解JavaScript的背後Part6 (Primitives&amp;Objects)</h1>
<h2 id="primitives-primitive-types-objects-reference-types-">Primitives (primitive types, 基本型別)與Objects(reference types, 參考型別)</h2>
<h4 id="-javscript-number-string-boolean-undefined-null-symbol-bigint-object-literal-array-functions-">在Javscript中大致上可分為兩大型別所組成，一是基本型別，包含<code>Number</code>、<code>String</code>、<code>Boolean</code>、<code>Undefined</code>、<code>Null</code>、<code>Symbol</code>、<code>BigInt</code>;另一個型別是物件型別，包含<code>Object Literal</code>、<code>Array</code>、<code>Functions</code>....。</h4>
<h2 id="-">兩大型別的記憶體位置</h2>
<h4 id="-javascript-engine-execution-stack-heap-">在JavaScript Engine內，兩大型別的<code>值</code>存放的位置不一樣，基本型別會存放於<code>Execution Stack</code>，而物件型別則存放於<code>Heap</code>內部。</h4>
<h4 id="-dog1-jumo-dog1-jumo-adress-0001-jumo-dog1-dog2-dog2-adress-0001-judas-dog1-exeuction-stack-adress-dog1-adress-adress-0002-judas-">對於基本型別的例子中，宣告一變數名稱<code>dog1</code>，並給定一值<code>&#39;Jumo&#39;</code>，事實上，<code>dog1</code>並非直接對應我們給定的值<code>&#39;Jumo&#39;</code>，而是指向一個<code>adress(0001)</code>並且對應到值<code>&#39;Jumo&#39;</code>; 當我們將<code>dog1</code>傳入新變數<code>dog2</code>時，<code>dog2</code>也會指向同一<code>adress(0001)</code>，倘若將值<code>&#39;Judas&#39;</code>重新傳入<code>dog1</code>時，由於在<code>Exeuction Stack被adress對應的值是無法被改變</code>，<code>dog1</code>的adress會重新導向至<code>adress(0002)</code>並對應新值<code>&quot;Judas&quot;</code>。</h4>
<pre><code class="lang-js"><span class="hljs-comment">// Primitives type</span>
<span class="hljs-keyword">let</span> dog1 = <span class="hljs-string">"Jumo"</span>;
<span class="hljs-keyword">let</span> dog2 = dog1;
dog1 = <span class="hljs-string">"Judas"</span>;
console.<span class="hljs-built_in">log</span>(dog1, dog2;<span class="hljs-comment">// Judas Jumo</span>
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/types/primitive.gif?raw=true" alt="Primitive types"></p>
<h4 id="-rick-firstname-heap-adress-d30f-rick-heap-adress-execution-stack-adress-0003-adress-0003-heap-adress-d30f-anotherrick-anotherrick-lastname-chen-anotherrick-heap-adress-heap-rick-lastname-">對於參考型別而言，如下方範例，當<code>物件rick</code>被宣告時，其值<code>{firstName:...,}</code>會被存放於<code>Heap</code>內部並由<code>adress(D30F)</code>對應，然而<code>物件rick</code>並不會直接指向<code>Heap</code>內的adress，而是先指向Execution Stack內的<code>adress(0003)</code>，<code>adress(0003)</code>才會對應<code>Heap</code>內的<code>adress D30F</code>，在宣告<code>物件anotherRick</code>後並且透過<code>anotherRick.lastName</code>傳入新值<code>&quot;Chen&quot;</code>時，事實上並不會重新導向<code>物件anotherRick</code>在<code>Heap</code>內的adress，而是直接改變<code>Heap</code>內的值，也因此<code>物件rick</code>內的lastName也會同步改變。</h4>
<pre><code class="lang-js"><span class="hljs-comment">// Primitives type</span>
<span class="hljs-keyword">const</span> rick = {
    firstName:<span class="hljs-string">"Rick"</span>,
    lastName: <span class="hljs-string">"Chiu"</span>,
    age:<span class="hljs-number">27</span>
};
<span class="hljs-keyword">const</span> anotherRick = rick;
anotherRick.lastName = <span class="hljs-string">"Chen"</span>;
console.<span class="hljs-built_in">log</span>(<span class="hljs-string">"Rick:"</span>, rick); //Rick: {firstName: <span class="hljs-string">"Rick"</span>, lastName: <span class="hljs-string">"Chen"</span>, age: <span class="hljs-number">27</span>}
console.<span class="hljs-built_in">log</span>(<span class="hljs-string">"Another Rick:"</span>, anotherRick); //Another Rick: {firstName: <span class="hljs-string">"Rick"</span>, lastName: <span class="hljs-string">"Chen"</span>, age: <span class="hljs-number">27</span>}
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/types/reference.gif?raw=true" alt="Reference types"></p>
<h2 id="object-assign-">Object.assign()及其注意事項</h2>
<h4 id="-object-assign-">倘若要避免複製物件內容做改動時，連帶影響原物件，可以使用<code>Object.assign()</code>的方式。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> rick = {
    <span class="hljs-attr">firstName</span>:<span class="hljs-string">"Rick"</span>,
    <span class="hljs-attr">lastName</span>:<span class="hljs-string">"Chiu"</span>,
};
<span class="hljs-keyword">const</span> anotherRick = <span class="hljs-built_in">Object</span>.assign({},rick);
anotherRick.lastName=<span class="hljs-string">"Chen"</span>;
<span class="hljs-built_in">console</span>.log(rick.lastName); <span class="hljs-comment">//Chiu</span>
<span class="hljs-built_in">console</span>.log(anotherRick.lastName); <span class="hljs-comment">//Chen</span>
</code></pre>
<h4 id="-object-assign-not-deep-clone-object-assign-object-in-object-reference-">但需要特別注意的是，<code>Object.assign()</code>屬於<code>非深層複製(not deep clone)</code>，<code>Object.assign()</code>僅會複製屬性值。若來源物件的值是參照到一個子物件(object in object)，它只會複製它的reference，如下方程式碼。</h4>
<pre><code class="lang-js"><span class="hljs-title">const</span> rick = {
    firstName:<span class="hljs-string">"Rick"</span>,
    lastName:<span class="hljs-string">"Chiu"</span>,
    <span class="hljs-keyword">family</span>:[<span class="hljs-string">"Jason"</span>,<span class="hljs-string">"Emily"</span>,<span class="hljs-string">"Bob"</span>]
};
<span class="hljs-title">const</span> anotherRick = <span class="hljs-type">Object</span>.assign({},rick);
<span class="hljs-title">anotherRick</span>.<span class="hljs-keyword">family</span>.push(<span class="hljs-string">"John"</span>);
<span class="hljs-title">console</span>.log(rick.<span class="hljs-keyword">family</span>); // [<span class="hljs-string">"Jason"</span>, <span class="hljs-string">"Emily"</span>, <span class="hljs-string">"Bob"</span>, <span class="hljs-string">"John"</span>]
<span class="hljs-title">console</span>.log(anotherRick.<span class="hljs-keyword">family</span>); // [<span class="hljs-string">"Jason"</span>, <span class="hljs-string">"Emily"</span>, <span class="hljs-string">"Bob"</span>, <span class="hljs-string">"John"</span>]
</code></pre>
<h2 id="-">將物件轉成字串再轉回物件</h2>
<h4 id="-tricky-json-stringify-json-parse-">另外一種複製方法比較tricky，透過JSON.stringify()將物件轉成字串，再透過JSON.parse()將字串轉成物件傳入變數。</h4>
<pre><code class="lang-js"><span class="hljs-title">const</span> rick = {
    firstName:<span class="hljs-string">"Rick"</span>,
    lastName:<span class="hljs-string">"Chiu"</span>,
    <span class="hljs-keyword">family</span>:[<span class="hljs-string">"Jason"</span>,<span class="hljs-string">"Emily"</span>,<span class="hljs-string">"Bob"</span>]
};
<span class="hljs-title">const</span> anotherRick = <span class="hljs-type">JSON</span>.parse(<span class="hljs-type">JSON</span>.stringify(rick));
<span class="hljs-title">anotherRick</span>.<span class="hljs-keyword">family</span>.push(<span class="hljs-string">"John"</span>);
<span class="hljs-title">console</span>.log(rick.<span class="hljs-keyword">family</span>); // [<span class="hljs-string">"Jason"</span>, <span class="hljs-string">"Emily"</span>, <span class="hljs-string">"Bob"</span>]
<span class="hljs-title">console</span>.log(anotherRick.<span class="hljs-keyword">family</span>); // [<span class="hljs-string">"Jason"</span>, <span class="hljs-string">"Emily"</span>, <span class="hljs-string">"Bob"</span>, <span class="hljs-string">"John"</span>]
</code></pre>

            

            

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}