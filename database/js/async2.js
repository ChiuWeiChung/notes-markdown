
export const render = ()=>{
    const title = "Asynchronous JavaScript Part2";
    const url = "#javascript/AJAX_Part2";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
            <h1 id="javascript-asynchronous__part-2">JavaScript中的Asynchronous__PART 2</h1>
        <h2 id="es6__promise-callback-hell-">ES6__Promise (讓我們無須面對Callback Hell)</h2>
        <h4 id="-asynchronous_part-1-callback-hell-es6-new-promise-">在Asynchronous_PART 1中有談到令程式碼難以維護的Callback Hell，但若透過ES6中的 <code>new Promise()</code>可以使程式碼更有組織。</h4>
        <h4 id="-promise-getids-getrecipes-getrelated-callback-function-resolve-handle-rejects-">舉例說明:下方程式碼中透過<code>Promise( )</code>透過建立三種物件(<code>getIDs</code>、 <code>getRecipes</code>、 <code>getRelated</code>)，執行過程中，物件內的callback function若&#39;成功執行&#39;，會將<code>resolve( )</code>所handle資料傳出；若有錯誤，執行 <code>rejects( )</code>。</h4>
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
                    <span class="hljs-keyword">const</span> recipe = {<span class="hljs-attr">title</span>:<span class="hljs-string">"Italian pizze"</span>, <span class="hljs-attr">publisher</span>:<span class="hljs-string">"Jonas"</span>};
                    resolve(<span class="hljs-string">\`<span class="hljs-subst">\${pub}</span>: <span class="hljs-subst">\${recipe.title}</span>\`</span>)
                },<span class="hljs-number">1500</span>,publisher)
            })
        }

        getIDs
        .then(<span class="hljs-function">(<span class="hljs-params">IDs</span>)=&gt;</span>{
            <span class="hljs-built_in">console</span>.log(IDs);
            <span class="hljs-keyword">return</span> getRecipes(IDs[<span class="hljs-number">2</span>]);
        })
        .then(<span class="hljs-function"><span class="hljs-params">recipe</span>=&gt;</span>{
            <span class="hljs-built_in">console</span>.log(recipe);
            <span class="hljs-keyword">return</span> getRelated(<span class="hljs-string">"Mr.Jonas"</span>)
        })
        .then(<span class="hljs-function">(<span class="hljs-params">recipe</span>)=&gt;</span>{
            <span class="hljs-built_in">console</span>.log(recipe);
        })
        .catch(<span class="hljs-function"><span class="hljs-params">error</span>=&gt;</span>{
            <span class="hljs-built_in">console</span>.log(error);
        });

        <span class="hljs-comment">// [523, 883, 432, 974]</span>
        <span class="hljs-comment">// 432: Fresh tomato pasta</span>
        <span class="hljs-comment">// Mr.Jonas: Italian pizze</span>
        </code></pre>
        <h4 id="-promise-callback-function-callback-function-then-return-getids-promise-resolve-argument-then-gerrecipes-promise-resolve-argument-then-promise-es8-es2017-async-await-part-3-">可以發現利用<code>Promise( )</code>之後，沒有出現callback function之中又有callback function的情況，取而代之的是使用<code>.then()</code>&amp; <code>return</code>來處理，getIDs完成Promise後將<code>resolve()</code>內的資料傳出並以argument帶入<code>.then()</code>處理，其內部的<code>gerRecipes()</code>完成Promise後又將<code>resolve()</code>內的資料傳出以argument帶入下一個<code>.then()</code>處理，過程就像大隊接力一樣，一棒接著一棒跑完整個流程;雖然<code>Promise</code>讓程式碼更有組織以及容易閱讀，但ES8(ES2017)提供了更簡易、方便的方法，也就是<code>Async Await</code>，這部分會在PART 3的筆記當中。</h4>

        
        
        </div>
</div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}