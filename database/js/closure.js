export const render = () => {
    const title = "閉包(Closure)";
    const url = "#javascript/Closure";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="-closure-">閉包(Closure)</h1>
<h4 id="-closure-scope-scorecounting-getscore-getscore-global-environment-scorecounting-getscore-scorecounting-score-getscore-scorecounting-socre-">學習Closure之後，要一句話解釋它的話，應該是<code>函式能夠存取當初被創造(宣告)當下所處位置(scope)的變數</code>，惡搞一點的說法就是讓函式能<code>飲水思源</code>，下方的程式碼做舉例，當函數<code>scoreCounting</code>執行後回傳另一函式至<code>getScore</code>內部，即使<code>getScore</code>是在外部(global environment)被宣告的，且<code>scoreCounting</code>已經執行結束的情況下，<code>getScore</code>在執行後仍能存取<code>scoreCounting</code>作用域內的<code>score</code>變數，原因在於函式能夠存取變數與否是由它的<code>出生地</code>所決定的，而<code>getScore</code>內部的函式是在<code>scoreCounting</code>作用域的內部被創造出來，也因此能夠存取<code>socre</code>變數，這樣的關係稱為Closure</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> scoreCounting = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-keyword">let</span> score=<span class="hljs-number">0</span>;
    <span class="hljs-keyword">return</span> <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
        score++;
        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`score: <span class="hljs-subst">\${score}</span> \`</span>);
    }
};
<span class="hljs-keyword">const</span> getScore = scoreCounting(); <span class="hljs-comment">// function secureBooking is excuted and returned a function to booker</span>
getScore(); <span class="hljs-comment">//score: 1</span>
getScore(); <span class="hljs-comment">//score: 2 </span>
getScore(); <span class="hljs-comment">//score: 3</span>
<span class="hljs-built_in">console</span>.dir(getScore); <span class="hljs-comment">//[[Scopes]]: Scopes[3]</span>
<span class="hljs-comment">//0: Closure (secureBooking) {passengerCount: 3}</span>
</code></pre>
<h2 id="closure-example-1">Closure Example 1</h2>
<h4 id="-f-g-gvariable-h-f-f-hvariable-">下方程式碼中，變數<code>f</code>的函式是在函式<code>g</code>的作用域內<code>出生</code>的，因此執行後可存取變數<code>gVariable</code>，透過函式<code>h</code>覆蓋變數<code>f</code>內的函式，執行函數<code>f</code>後可存取變數<code>hVariable</code>。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">let</span> f ;
<span class="hljs-keyword">const</span> g = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-keyword">const</span> gVariable = <span class="hljs-number">23</span>;
    f = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(gVariable*<span class="hljs-number">2</span>);
    };
};
g(); <span class="hljs-comment">// assign function into f</span>
f(); <span class="hljs-comment">//46</span>
<span class="hljs-keyword">const</span> h =<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-keyword">const</span> hVariable = <span class="hljs-number">777</span>;
    f = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(hVariable*<span class="hljs-number">2</span>);
    };
};
h(); <span class="hljs-comment">// Re-assigning function into f</span>
f(); <span class="hljs-comment">//1554</span>
<span class="hljs-built_in">console</span>.dir(f); <span class="hljs-comment">//[[Scopes]]: Scopes[3]</span>
<span class="hljs-comment">// 0: Closure (h) {hVariable: 777}</span>
</code></pre>
<h2 id="closure-example-2">Closure Example 2</h2>
<h4 id="-settimout-callback-global-environment-boardpassengers-pergroup-">在下方範例中，雖然setTimout內的callback函式是在global environment下執行，但是在函式<code>boardPassengers</code>內被創造出來，因此，可以存取變數<code>perGroup</code>;</h4>
<h4 id="-dom-apis-settimeout-header-">同樣地，DOM也是透過瀏覽器的APIs所提供，雖然與<code>setTimeout</code>都是在外部執行，但由於也是在函式內創造出來，因此可以存取元素<code>header</code>。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> boardPassengers = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">n, wait</span>)</span>{
    <span class="hljs-keyword">const</span> perGroup = n / <span class="hljs-number">3</span> ;
    setTimeout(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`We are now boarding all <span class="hljs-subst">\${n}</span> passengers\`</span>);
        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`There are 3 groups, each with <span class="hljs-subst">\${perGroup}</span> passengers\`</span>);
    },<span class="hljs-number">1000</span>)
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`Will start boarding in <span class="hljs-subst">\${wait}</span> seconds\`</span>)
};
<span class="hljs-keyword">const</span> perGroup = <span class="hljs-number">1000</span>; <span class="hljs-comment">// closure has priority over scope chain</span>
boardPassengers(<span class="hljs-number">180</span>,<span class="hljs-number">3</span>)
</code></pre>
<pre><code class="lang-js">(<span class="hljs-name">function</span>(){
    const header = document.querySelector(<span class="hljs-string">"h1"</span>)<span class="hljs-comment">;</span>
    header.style.color=<span class="hljs-string">"red"</span><span class="hljs-comment">;</span>
    document.querySelector(<span class="hljs-string">"body"</span>).addEventListener(<span class="hljs-string">"click"</span>,function(){
        header.style.color=<span class="hljs-string">"blue"</span><span class="hljs-comment">;</span>
    })<span class="hljs-comment">;</span>
})()<span class="hljs-comment">;</span>
</code></pre>

            

            

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return { title, markup, url };
}