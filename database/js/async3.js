
export const render = ()=>{
    const title = "Asynchronous JavaScript Part3";
    const url = "#javascript/AJAX_Part3";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="javascript-asynchronous__part-3">JavaScript中的Asynchronous__PART 3</h1>
<h4 id="-part2-promise-es8-es2017-async-await-async-function-async-promise-await-await-promise-background-resolve-ids-recipe1-recipe2-">承接PART2的結尾，雖然Promise讓程式碼變得比較不難解讀，但ES8(ES2017)提供了更簡易、方便的方法，也就是Async Await，這次透過宣告Async Function (在函數前面加上<code>async</code>)，在內部將Promise的物件前面加上<code>await</code>，執行過程中，只要一遇到await的Promise會在background執行直到<code>resolve()</code>將資料傳回變數內(<code>IDs</code>、<code>recipe1</code>、<code>recipe2</code>)</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> getIDs =<span class="hljs-keyword">new</span> <span class="hljs-built_in">Promise</span>(<span class="hljs-function">(<span class="hljs-params">resolve,reject</span>)=&gt;</span>{
    setTimeout(<span class="hljs-function"><span class="hljs-params">()</span>=&gt;</span>{
        resolve([<span class="hljs-number">523</span>,<span class="hljs-number">883</span>,<span class="hljs-number">432</span>,<span class="hljs-number">974</span>]);
        <span class="hljs-comment">// reject([523,883,432,974]);</span>
    },<span class="hljs-number">1500</span>)
});

<span class="hljs-keyword">const</span> getRecipes = <span class="hljs-function">(<span class="hljs-params">recID</span>)=&gt;</span>{
    <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">Promise</span>(<span class="hljs-function">(<span class="hljs-params">resolve,reject</span>)=&gt;</span>{
        setTimeout(<span class="hljs-function">(<span class="hljs-params">ID</span>)=&gt;</span>{
         <span class="hljs-keyword">const</span> recipe = {<span class="hljs-attr">title</span>: <span class="hljs-string">"Fresh tomato pasta"</span>, <span class="hljs-attr">publisher</span>:<span class="hljs-string">"Jonas"</span>};
        resolve(<span class="hljs-string">\`<span class="hljs-subst">\${ID}</span>: <span class="hljs-subst">\${recipe.title}</span>\`</span>);
        },<span class="hljs-number">1500</span>,recID)

    })
};

<span class="hljs-keyword">const</span> getRelated = <span class="hljs-function"><span class="hljs-params">publisher</span>=&gt;</span>{
    <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">Promise</span>(<span class="hljs-function">(<span class="hljs-params">resolve,reject</span>)=&gt;</span>{
        setTimeout(<span class="hljs-function">(<span class="hljs-params">pub</span>)=&gt;</span>{
            <span class="hljs-keyword">const</span> recipe = {<span class="hljs-attr">title</span>:<span class="hljs-string">"Italian pizza"</span>, <span class="hljs-attr">publisher</span>:<span class="hljs-string">"Jonas"</span>};
            resolve(<span class="hljs-string">\`<span class="hljs-subst">\${pub}</span>: <span class="hljs-subst">\${recipe.title}</span>\`</span>)
        },<span class="hljs-number">1500</span>,publisher)
    })
}

<span class="hljs-comment">// Async Await Function</span>
<span class="hljs-keyword">async</span> <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getRecipesAW</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-keyword">const</span> IDs = <span class="hljs-keyword">await</span> getIDs;
    <span class="hljs-built_in">console</span>.log(IDs);
    <span class="hljs-keyword">const</span> recipe1 = <span class="hljs-keyword">await</span> getRecipes(IDs[<span class="hljs-number">2</span>]);
    <span class="hljs-built_in">console</span>.log(recipe1);
    <span class="hljs-keyword">const</span> recipe2 = <span class="hljs-keyword">await</span> getRelated(<span class="hljs-string">"Mr.Rick"</span>); 
    <span class="hljs-built_in">console</span>.log(recipe2);
};

getRecipesAW();
</code></pre>
<p><code>需要注意的是，Await expression只能運用在Async Function</code> </p>
<h4 id="-async-await-async-function-value-console-">這裡展示在運用Async Await時可能會遇到的失誤，當我們想要Async Function執行完畢後回傳一個value，並輸出在console，如下方程式碼</h4>
<pre><code class="lang-js"><span class="hljs-keyword">async</span> <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getRecipesAW</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-keyword">const</span> IDs = <span class="hljs-keyword">await</span> getIDs;
    <span class="hljs-built_in">console</span>.log(IDs);
    <span class="hljs-keyword">const</span> recipe1 = <span class="hljs-keyword">await</span> getRecipes(IDs[<span class="hljs-number">2</span>]);
    <span class="hljs-built_in">console</span>.log(recipe1);
    <span class="hljs-keyword">const</span> recipe2 = <span class="hljs-keyword">await</span> getRelated(<span class="hljs-string">"Mr.Rick"</span>); 
    <span class="hljs-built_in">console</span>.log(recipe2);

    <span class="hljs-keyword">return</span> recipe1;  <span class="hljs-comment">// The value I want to return</span>
};

<span class="hljs-keyword">const</span> rec = getRecipesAW();
<span class="hljs-built_in">console</span>.log(rec);  
<span class="hljs-comment">// Promise{&lt;pending&gt;}</span>
<span class="hljs-comment">// [523, 883, 432, 974]</span>
<span class="hljs-comment">// 432: Fresh tomato pasta</span>
<span class="hljs-comment">// Mr.Jonas: Italian pizze</span>
</code></pre>
<h4 id="-console-rec-const-rec-getrecipesaw-console-log-rec-synchronous-console-log-rec-getrecipesaw-value-rec-then-">很顯然，console並沒顯示rec的值，原因主要是最後兩行程式碼(<code>const rec = getRecipesAW()</code> &amp; <code>console.log(rec)</code>)是以Synchronous形式進行，當<code>console.log(rec)</code>要執行的當下，我們的<code>getRecipesAW( )</code>尚未執行完畢，因此value還沒有被傳回rec; 但這樣的情況要如何解決呢? 其實可以透過<code>.then()</code>來解決</h4>
<pre><code class="lang-js"><span class="hljs-keyword">async</span> <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getRecipesAW</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-keyword">const</span> IDs = <span class="hljs-keyword">await</span> getIDs;
    <span class="hljs-built_in">console</span>.log(IDs);
    <span class="hljs-keyword">const</span> recipe1 = <span class="hljs-keyword">await</span> getRecipes(IDs[<span class="hljs-number">2</span>]);
    <span class="hljs-built_in">console</span>.log(recipe1);
    <span class="hljs-keyword">const</span> recipe2 = <span class="hljs-keyword">await</span> getRelated(<span class="hljs-string">"Mr.Rick"</span>); 
    <span class="hljs-built_in">console</span>.log(recipe2);

    <span class="hljs-keyword">return</span> recipe1;  <span class="hljs-comment">// The value I want to return</span>
};

getRecipesAW().then(<span class="hljs-function"><span class="hljs-params">result</span>=&gt;</span><span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`show recipe1 <span class="hljs-subst">\${result}</span>\`</span>));
<span class="hljs-comment">// Promise{&lt;pending&gt;}</span>
<span class="hljs-comment">// [523, 883, 432, 974]</span>
<span class="hljs-comment">// 432: Fresh tomato pasta</span>
<span class="hljs-comment">// Mr.Jonas: Italian pizze</span>
<span class="hljs-comment">// show recipe1 432: Fresh tomato pasta</span>
</code></pre>
<h4 id="-asynchronous-javasscript-">以上是針對Asynchronous JavasScript的學習筆記，若未來有所心得會持續更新</h4>

</div>
</div>

    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}