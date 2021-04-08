export const render = () => {
    const title = "立即呼叫函式表示式(IIFE)";
    const url = "#javascript/IIFE";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="-iife-">立即呼叫函式表示式(IIFE)</h1>
<h4 id="-scope-javascript-knowjs3-scope-scope-">在<a href="/#javascript/knowJs3">Scope筆記</a>當中有談到，函式會產生scope，因此在函式外部無法存取函式內部的變數，也因此，在scope內部的資料是安全、保有隱私的。</h4>
<h2 id="-data-encapsulation-">數據封裝(Data Encapsulation)</h2>
<h4 id="-variables-">在編寫程式時，資料的保護是非常重要的事，我們需要盡可能地去避免資料(如variables)被外人存取、甚至是覆寫。</h4>
<h4 id="-console-sayhi-">下方程式碼在瀏覽器運行時，可以透過瀏覽器的console上存取<code>sayHi</code>這個函式，在資料安全上是有疑慮的。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> sayHi = <span class="hljs-function"><span class="hljs-keyword">function</span><span class="hljs-params">()</span><span class="hljs-comment">{
 console.log("Hi, how are you?");
}</span>;</span>
sayHi();
</code></pre>
<h4 id="-iife-immediately-invoked-function-expression-console-">透過IIFE(Immediately Invoked Function Expression)，在函式宣告的同時用<code>括號()</code>包覆住，在後方再加上<code>()</code>，如此一來就可以立即執行，在瀏覽器的console上也無法存取該函式，達到保護變數的目的。</h4>
<pre><code class="lang-js">(<span class="hljs-name">function</span>(){
    console.log(<span class="hljs-string">"Hi this is IIFE function call"</span>)
    const isPrivate = <span class="hljs-number">23</span><span class="hljs-comment">;</span>
})()<span class="hljs-comment">;</span>
</code></pre>
<h4 id="-es6-block-scope-scope-javascript-knowjs3-const-let-block-scope-const-let-iffes-">在ES6中，屬於block scope(<a href="/#javascript/knowJs3">Scope筆記</a>)的const、let出現之後，只要創造出block scope<code>{}</code>，就無法從外部存取以const、let宣告的變數，也因此IFFEs的使用率漸漸的下降。</h4>
<pre><code class="lang-js">{
    <span class="hljs-keyword">const</span> isPrivate = <span class="hljs-number">23</span>;
    <span class="hljs-keyword">var</span> notPrivate = <span class="hljs-number">46</span>;
}
<span class="hljs-built_in">console</span>.log(isPrivate) <span class="hljs-comment">// isPrivate is not defined</span>
<span class="hljs-built_in">console</span>.log(notePrivate) <span class="hljs-comment">// 46</span>
</code></pre>

            

            

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return { title, markup, url };
}