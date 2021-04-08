export const render = ()=>{
    const title = "了解JavaScript的背後Part2 (Runtime & Event Loop)";
    const url = "#javascript/knowJs2";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="-javascript-part2-execution-stack-execution-context-">了解JavaScript的背後Part2 (Execution Stack &amp; Execution Context)</h1>
<h2 id="javascript-runtime-in-the-browser">JavaScript Runtime In the Browser</h2>
<h4 id="-part1-javascript-source-code-interpreted-code-interpreted-machine-code-0-1-">在<a href="">Part1</a>時有提到JavaScript的source code需要被Interpreted成機器可以理解的語言，因此這篇文章就來記錄Code被Interpreted之後的machine code(0&amp;1)是如何被執行的;</h4>
<h4 id="-interpreted-machine-code-1-javascript-engine-execution-stack-es-engine-machine-code-js-engine-google-chrome-v8-engine-">被Interpreted過的machine code無法直接執行，需要在<code>1.JavaScript Engine</code>所提供的<code>Execution Stack</code>(執行堆疊, ES)內部執行，也就是說，沒有Engine就無法執行machine code。不同的瀏覽器都有它自身的JS Engine，其中最著名的莫過於Google Chrome瀏覽器的V8 Engine。</h4>
<h2 id="execution-stack-es-heap-in-javascript-engine">Execution Stack(執行堆疊, 在此簡稱為ES) &amp; Heap in JavaScript Engine</h2>
<h4 id="-javascript-engine-execution-stack-execution-context-ec-ec-es-exucution-context-">程式碼在運行過程中，JavaScript Engine會提供所謂的<code>Execution Stack</code>，讓接下來應該被執行的&quot;任務們&quot;依照<strong>呼叫順序乖乖地堆疊在上面</strong>，又&quot;任務們&quot;在堆疊期間都會產生各自的Execution Context(執行環境,在這簡稱為EC)，並且<code>EC只有在任務被呼叫時才會出現在ES之上</code>，其中Exucution Context負責由三種元素組成:</h4>
<ul>
<li><code>1.Variables</code>  : 舉凡var、let、const、functions、arguments</li>
<li><code>2.Scope Chain</code> : <a href="/#javascript/knowJs3">Scope筆記</a></li>
<li><code>3.this keyword</code> :  <a href="/#javascript/knowJs5">This筆記</a></li>
</ul>
<h4 id="-variables-execution-context-ec-es-first-global-first-second-ec-global-ec-background-myname-rick-first-second-source-code-first-ec-function-scope-a-1-b-unknown-c-nan-unknown-nan-second-ec-argument-2-3-d-4-">這邊就用下方的程式碼當例子來解釋Variables是如何被存放在Execution Context當中，我在上一段有提到EC只有在被呼叫時才會堆疊在ES之上，在任務執行前(first()被呼叫前)，global、first、second EC各自儲存著不同的資料，Global EC儲存的是background的資訊(myName=&quot;Rick&quot;及first以及second 的source code)，first EC儲存了function scope內部(花括號內部)的資訊，包含a=1,b=unknown,c=NaN，此時unknown&amp; NaN原因是任務尚未被呼叫，因此僅能知道執行前的資訊，而second EC儲存了argument=[2,3]&amp; d=4的資訊。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> myName = <span class="hljs-string">"Rick"</span>;                        
<span class="hljs-keyword">const</span> first = <span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>)</span>{  
    <span class="hljs-keyword">var</span> a = <span class="hljs-number">1</span>                
    b = second(<span class="hljs-number">2</span>,<span class="hljs-number">3</span>);        
    <span class="hljs-keyword">const</span> c = a+b
    <span class="hljs-keyword">return</span> c ;
};  <span class="hljs-comment">/// ---------------------------function first's scope</span>
<span class="hljs-keyword">const</span> second = <span class="hljs-function">(<span class="hljs-params">x,y</span>)=&gt;</span>{
    <span class="hljs-keyword">let</span> d = <span class="hljs-number">4</span>
    <span class="hljs-keyword">return</span> d
};
first();
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/execution%20context.png?raw=true" alt="execution context"></p>
<h2 id="-execution-context-">執行過程中Execution Context怎麼堆疊</h2>
<h4 id="-gif-global-environment-window-first-stack-one-single-thread-line-by-line-stack-stack-">如下方程式碼的範例以及gif展示，在global environment中(即window)中，<code>first()</code>是第一個被呼叫的，因此會先第一個堆疊在Stack之上，後續執行任務也會按照one single thread的方式(line by line)堆疊在Stack之上，任務執行完畢後會被移出Stack。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> first = <span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>)</span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"execute 1"</span>);
    b = second();
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"The end"</span>);
};
<span class="hljs-keyword">const</span> second = <span class="hljs-function"><span class="hljs-params">()</span>=&gt;</span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"execute 2"</span>);
};
first();  
<span class="hljs-comment">// execute1</span>
<span class="hljs-comment">// execute2</span>
<span class="hljs-comment">// The end</span>
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/simpleCallstack.gif?raw=true" alt="Execution Stack"></p>
<h2 id="javascript-runtime-javascript-engine-web-apis-callback-queue-">JavaScript Runtime =<code>JavaScript Engine</code> + <code>WEB APIs</code> + <code>Callback Queue</code>.</h2>
<h4 id="-1-javascript-engine-2-web-apis-3-callback-queue-runtime-dom-timer-function-settimeout-fetch-api-method-web-apis-callback-queue-">然而僅有<code>1.JavaScript Engine</code>是不夠的，還需要<code>2.WEB APIs</code>以及<code>3.Callback Queue</code>才可以建構完整的Runtime，原因是在進行DOM或是Timer function(如setTimeout())、Fetch API method的時候，需要WEB APIs來提供並搭配Callback Queue，因此在下一段就來介紹這兩個元素的重要性。</h4>
<p><code>DOM、timer function(setTimeout())、navigator.geolocation method等方法是獨立於JavaScript之外，主要是由瀏覽器的WEB APIs所提供。</code></p>
<ul>
<li><code>JavaScript Engine</code>: <h4 id="-javascript-call-stack-heap-call-stack-primitives-heap-execution-stack-heap-javascript-knowjs6-">為JavaScript提供Call Stack以及Heap，其中Call Stack用來執行環境的堆疊及儲存簡單數據(Primitives)，Heap則負責儲存複雜數據如物件; <a href="/#javascript/knowJs6">Execution Stack&amp;Heap筆記</a></h4>
</li>
<li><code>WEB APIs</code>: <h4 id="javascript-global-window-object-web-apis-dom-call-timer-function-">JavaScript可以透過瀏覽器的global window object與WEB APIs，使用DOM、call timer function等功能</h4>
</li>
<li><code>Callback Queue</code>: <h4 id="-callback-functions">用來存放準備執行的callback functions</h4>
</li>
</ul>
<h2 id="javascript-">JavaScript的執行流程</h2>
<h4 id="-jonas-s-javascript-course-https-www-udemy-com-course-the-complete-javascript-course-gif-javascript-one-single-thread-onclick-event-web-apis-dom-event-listener-onclick-callback-function-callbacl-queue-event-loop-call-stack-execution-1-3-callback-function-stack-">在下方，我參照了<a href="https://www.udemy.com/course/the-complete-javascript-course/">Jonas&#39;s JavaScript Course</a>課程製作了一張gif來描述這個流程，我們知道JavaScript處理程式碼時是以one single thread方式，一行程式碼處理完再接著下一行; 例如:觸發了一個<code>onClick</code>的event(來自WEB APIs提供的DOM event listener)，此時<code>onClick</code>的callback function會先被置放於<code>Callbacl Queue</code>當中排隊，此時透過Event loop(事件環)的機制以偵測Call Stack內部的任務(Execution 1-3)都被執行完畢後，callback function才會被移至Stack中執行。</h4>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/eventloop.gif?raw=true" alt="eventloop"></p>


        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}