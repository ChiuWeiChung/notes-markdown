export const render = ()=>{
    const title = "了解JavaScript的背後Part4 (Hoisting&Temporal Dead Zone)";
    const url = "#javascript/knowJs4";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="-javascript-part4-hoisting-temporal-dead-zone-">了解JavaScript的背後Part4 (Hoisting&amp;Temporal Dead Zone)</h1>
<h2 id="hoisting-">Hoisting (提升)</h2>
<h4 id="-function-declaration-hoist-">透過function declaration宣告的函式在宣告前就可以存取它，因為呼叫過程中會被hoist，如下方範例。</h4>
<pre><code class="lang-js">hi(); <span class="hljs-comment">// hihi</span>
<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">hi</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"hihi"</span>);
}
</code></pre>
<h4 id="-javascript-hoisting-var-is-not-defined-var-undefined-var-var-sayhi-console-log-hihi-">還有另外一個會被提升的東西，算是在JavaScript Hoisting機制中的副產物，那就是透過var宣告的變數，一般而言，若呼叫未被宣告的變數時，會出現<em>*</em> is not defined的錯誤，但若在呼叫後才透過var宣告，則會出現undefined，因為執行過程中，var已經被偷偷提升至呼叫的前方，但是它的<code>值</code>並沒有一起被提升，等同於<code>var sayHi</code>被提升到console.log前面，但是<code>=&quot;hihi&quot;</code>並沒有跟著上去。</h4>
<pre><code class="lang-js"><span class="hljs-comment">//var sayHi 執行過程被提升至console.log前方 </span>
<span class="hljs-built_in">console</span>.log(sayHi); <span class="hljs-comment">//undefined  </span>
<span class="hljs-keyword">var</span> sayHi = <span class="hljs-string">"hihi"</span>;
</code></pre>
<h4 id="-var-">雖然這樣的機制可以在以var宣告變數之前就呼叫它，但應該要盡量避免使用，避免下方的悲劇發生，因為</h4>
<pre><code class="lang-js"><span class="hljs-keyword">if</span>(!database) deleteShoppingCart();
<span class="hljs-keyword">var</span> database = <span class="hljs-number">10</span>;
<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">deleteData</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"All data deleted!"</span>);
}
</code></pre>
<h2 id="temporal-dead-zone-tdz-">Temporal Dead Zone (暫時死區, TDZ)</h2>
<h4 id="-const-let-scope-tdz-if-scope-job-tdz-">透過const、let宣告的變數，在所處的scope內部且該變數被宣告之前區域被稱為TDZ，在這區域內無法存取該變數。如下方的範例，在if scope內部，我在job被宣告之前先呼叫它，就會出現錯誤，TDZ的存在是為了避免以及捕捉錯誤的發生，並確保我們在存取之前就已經宣告該變數</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> name = <span class="hljs-string">"Rick"</span>;
<span class="hljs-keyword">const</span> <span class="hljs-built_in">date</span> = <span class="hljs-keyword">new</span> <span class="hljs-built_in">Date</span>().getFullYear();
<span class="hljs-keyword">if</span> (name===<span class="hljs-string">"Rick"</span>){
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`I am a <span class="hljs-subst">\${job}</span>\`</span>);   <span class="hljs-comment">//  Temporal Dead Zone for job variable</span>
    <span class="hljs-keyword">const</span> age = <span class="hljs-built_in">date</span><span class="hljs-number">-1992</span>;          <span class="hljs-comment">//  Temporal Dead Zone for job variable</span>
    <span class="hljs-keyword">const</span> job = <span class="hljs-string">"engineer"</span>;         
    <span class="hljs-built_in">console</span>.log(x) <span class="hljs-comment">// x is not defined</span>
}
<span class="hljs-comment">//Uncaught ReferenceError: Cannot access 'job' before initialization</span>
</code></pre>
<h2 id="-">變數特性表格</h2>
<h4 id="-var-const-let-">統整前幾篇記錄的心得，可以將var、const、let的宣告方式及函式宣告、函式表示式、箭頭函式、</h4>
<table>
<thead>
<tr>
<th></th>
<th>HOISTED?</th>
<th>INITIAL VALUE</th>
<th>SCOPE</th>
</tr>
</thead>
<tbody>
<tr>
<td>函式宣告function declaration</td>
<td>YES</td>
<td>Actual function</td>
<td>Block@strict mode</td>
</tr>
<tr>
<td>函式運算式或箭頭函式(function expressions &amp; arrows)</td>
<td>Depend on var or const/let</td>
</tr>
<tr>
<td>以var宣告的變數</td>
<td>YES</td>
<td>undefined</td>
<td>Function</td>
</tr>
<tr>
<td>以let 或 const宣告的變數</td>
<td>No</td>
<td>uninitialized, TDZ</td>
<td>Block</td>
</tr>
</tbody>
</table>

            

            

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}