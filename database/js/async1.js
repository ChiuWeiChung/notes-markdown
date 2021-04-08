
export const render = ()=>{
    const title = "Asynchronous JavaScript Part1";
    const url = "#javascript/AJAX_PART1"
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="javascript-asynchronous-part-1-">JavaScript中的Asynchronous (PART 1)</h1>
<h2 id="-synchronous-asynchronous-">甚麼是Synchronous? 甚麼是Asynchronous?</h2>
<h4 id="asynchronous-javascript-javascript-sever-ex-code-asynchornous-javascript-asynchronous-synchronous-first-one-single-thread-javascript-part1-code-line-by-line-execute-1-execute-2-the-end-execution-stack-execution-context-gif-">Asynchronous JavaScript的應用最典型的範例就是在使用JavaScript向Sever端提取資料，由於提取資料是需要花費時間的，若還沒取得資料就執行下一行命令(ex:處理資料的code)，就會出現異常。也因此，我們需要使用Asynchornous JavaScript來解決問題，然而何謂Asynchronous ? 這邊就先從與其對立的Synchronous談起，當我們呼叫下方程式碼的<code>first()</code>時，執行過程中由於<code>one single thread</code>的特性(<a href="">JavaScript的背後Part1</a>)，會對程式碼內的每一行code逐行執行(line by line)，因此先看到&#39;execute 1&#39;，再來&#39;execute 2&#39;，最後是&#39;The end&#39;。若用Execution Stack及Execution Context來描述會執行的過程就會像下方的GIF圖</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> first = <span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"execute 1"</span>);
        second();
        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"The end"</span>)
};
<span class="hljs-keyword">const</span> second = <span class="hljs-function"><span class="hljs-params">()</span>=&gt;</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"execute 2"</span>);
};
first();  
<span class="hljs-comment">// execute1</span>
<span class="hljs-comment">// execute2</span>
<span class="hljs-comment">// The end</span>
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/synchornous.gif?raw=true" alt="Synchronous Runtimie"></p>
<h2 id="-asynchronous-javascript">模擬Asynchronous JavaScript</h2>
<h4 id="-synchronous-settimeout-api-data-settimeout-second-argument-2000-2000-execute1-3-console-settimeout-callback-">了解Synchronous的運行後，下方程式碼利用<code>setTimeout()</code>來模擬向外部API提取資料的情境(兩秒之後才拿到data)。下方程式碼的結果顯示，因為透過setTimeout的second argument 設定為2000(即2000毫秒)，當execute1-3都已透過console印出來後並經過兩秒後才顯示<code>setTimeout()</code>的callback所回傳的訊息。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> one = <span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>)</span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'execute  1'</span>);
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">two</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'execute  2'</span>);
        setTimeout(<span class="hljs-function"><span class="hljs-params">()</span>=&gt;</span><span class="hljs-built_in">console</span>.log(<span class="hljs-string">"this is timer callback"</span>),<span class="hljs-number">2000</span>)
        <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">three</span>(<span class="hljs-params"></span>)</span>{
            <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'execute  3'</span>);
        }
        three();
    };
    two();
}
one();
<span class="hljs-comment">// execute1</span>
<span class="hljs-comment">// execute2</span>
<span class="hljs-comment">// execute3</span>
<span class="hljs-comment">// this is time callback</span>
</code></pre>
<h2 id="-callback-queue-event-loop-">執行過程發生了甚麼事? (Callback Queue &amp;Event Loop)</h2>
<h4 id="-javascript-runtime-exeuction-stack-web-apis-callback-queue-gif-console-log-execute-2-settimeout-callback-function-web-apis-2-execution-stack-callback-console-log-the-end-callback-function-callback-queue-event-loop-event-loop-stack-global-execution-context-callback-function-stack-settimeout-callback-function-first-callback-queue-execution-context-global-execution-context-">這邊我試著以JavaScript的Runtime來描述(<a href="">Exeuction Stack、WEB APIs、Callback Queue</a>)，過程如下方GIF顯示，當<code>Console.log(&quot;execute 2&quot;)</code>結束之後隨即堆疊上setTimeout，其內部的callback function會被暫時移置於WEB APIs等待2秒鐘倒數，因此Execution stack<code>不需特地暫停兩秒鐘等待callback的執行</code>，內部仍能繼續執行接下來的console.log(&#39;The end&#39;)，兩秒倒數完畢後，callback function被置於Callback Queue排隊，此時我們的重要功臣<code>Event Loop</code>出現了，<code>Event Loop</code>若偵測到Stack中只剩下Global Execution Context，會立即把callback function拖進stack內執行; 因此可理解到，<strong>SetTimeout()的callback function實際上並不在<code>first()</code>的任職期間內執行的</strong>，而是被暫放於Callback Queue，等待其他Execution Context們都功成身退後在背景(Global Execution Context)下執行的。</h4>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/eventloop2.gif?raw=true" alt="ASynchronous-like Runtimie"></p>
<p><code>NOTE: setTimeout()其實來自Web APIs (獨立於JavaScript engine之外)，舉凡DOM manipulation methos, SetTimeout, HTTP requests for AJAX, geolocation, local storage等等都都是，所以整個Execution Stack在運行時不會受到阻擋。</code></p>
<h2 id="-settimeout-remote-server-">Asynchronous的Callback Hell</h2>
<h4 id="-code-settimeout-callback-function-callback-callback-callback-hell-es6-promise-callback-hell-promise-asynchronous-javascript-part2-javascript-ajax_part2-">觀察到上述的code，可以了解到，若要處理的內容越複雜，就出現需要呼叫多次 <code>setTimeout()</code>情況，如此一來就出現多層callback function的狀況(callback之中又有callback)，後續在維護程式碼時就會非常頭痛，因此被稱為callback hell; 幸虧有ES6導入了&#39;Promise&#39;以解決callback hell的狀況，讓程式碼不那麼難堪，<code>Promise</code>的筆記會記錄在<a href="/#javascript/AJAX_Part2">Asynchronous JavaScript Part2</a>中。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> getRecipe= <span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>)</span>{

    setTimeout(<span class="hljs-function"><span class="hljs-params">()</span>=&gt;</span>{    <span class="hljs-comment">//first layer of callback</span>
        <span class="hljs-keyword">const</span> recipeID = [<span class="hljs-number">123</span>,<span class="hljs-number">456</span>,<span class="hljs-number">789</span>];  
        <span class="hljs-built_in">console</span>.log(recipeID);

        setTimeout(<span class="hljs-function">(<span class="hljs-params">id</span>)=&gt;</span>{  <span class="hljs-comment">//second layer of callback</span>
            <span class="hljs-keyword">const</span> recipe = {<span class="hljs-attr">title</span>:<span class="hljs-string">"Fresh tomato pasta"</span>, <span class="hljs-attr">publisher</span>:<span class="hljs-string">"Jonas"</span>};
            <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`<span class="hljs-subst">\${id}</span>: <span class="hljs-subst">\${recipe.title}</span>\`</span>);

            setTimeout(<span class="hljs-function">(<span class="hljs-params">id</span>)=&gt;</span>{ <span class="hljs-comment">//third layer of callback</span>
                <span class="hljs-keyword">const</span> recipe2 = {<span class="hljs-attr">titile</span>:<span class="hljs-string">"Italian pizza"</span>, <span class="hljs-attr">publisher</span>:<span class="hljs-string">"John"</span>};
                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`<span class="hljs-subst">\${id}</span>: <span class="hljs-subst">\${recipe2.titile}</span>\`</span>);
            },<span class="hljs-number">1000</span>,recipeID[<span class="hljs-number">1</span>])
        },<span class="hljs-number">1500</span>,recipeID[<span class="hljs-number">2</span>])
    },<span class="hljs-number">1500</span>)
}

getRecipe();
<span class="hljs-comment">//  (3) [123, 456, 789]</span>
<span class="hljs-comment">//  789: Fresh tomato pasta</span>
<span class="hljs-comment">//  456: Italian pizza</span>
</code></pre>

<h6 id="-">以上心得來自</h6>
<ul>
<li><a href="https://www.udemy.com/course/the-complete-javascript-course/">Jonas&#39;s JavaScript Course</a></li>
</ul>






        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}