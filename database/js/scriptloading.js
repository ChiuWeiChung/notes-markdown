export const render = () => {
    const title = "Script Tag及defer & async屬性";
    const url = "#javascript/script-loading";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="script-tag-defer-async-">Script Tag及defer &amp; async屬性</h1>
<h4 id="html-script-tag-javascript-code-html-head-parse-domcontentloaded-domcontentloaded-mdn-https-developer-mozilla-org-zh-tw-docs-web-events-domcontentloaded-document-stylesheets-subframes-html-">HTML檔案內的script tag，其存放位置會影響到JavaScript code的執行時機，當開啟一網頁時，HTML文件會從最頂部(head)開始並逐一往底部進行解析(Parse)，當解析完畢時，也就是DOMcontentLoaded事件發生的時機，而關於DOMContentLoaded事件，在<a href="https://developer.mozilla.org/zh-TW/docs/Web/Events/DOMContentLoaded">MDN</a>中的解釋是 <code>當document被完整的讀取跟解析後就會被觸發,不會等待 stylesheets, 圖片和subframes完成讀取</code> ，也就是HTML檔案由上至下完整被解析後才會觸發。</h4>
<h2 id="script-tag-head-">Script tag 放在head內</h2>
<h4 id="-script-tag-head-tag-script-body-parse-script-dom-manipulation-body-dom-manipulation-script-body-body-element-script-">如下方範例，若將script tag放置在head tag內部，如此一來，script會先被執行，後續才進行body的Parse，倘若script執行過程中，程式碼含有dom manipulation，就會出現找不到元素的錯誤，原因就在於尚未解析body內的文件時就先執行dom manipulation; 為了避免這樣的失誤，一般而言都會將script放在body的底端，這樣就可以等待body內部的element都被解析完才執行script的內容。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">head</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">meta</span> <span class="hljs-attr">charset</span>=<span class="hljs-string">"UTF-8"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">meta</span> <span class="hljs-attr">name</span>=<span class="hljs-string">"viewport"</span> <span class="hljs-attr">content</span>=<span class="hljs-string">"width=device-width, initial-scale=1.0"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">title</span>&gt;</span>Document<span class="hljs-tag">&lt;/<span class="hljs-name">title</span>&gt;</span>
    <span class="hljs-comment">&lt;!-- &lt;script&gt;
        const p = document.querySelector('.paragraph');
        console.log(p); // null (，因HTML內的body尚未被解析完畢就先執行script內的code，故找不到p元素)
    &lt;/script&gt; --&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">head</span>&gt;</span>

<span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"container"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">p</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"paragraph"</span>&gt;</span>Hi, My name is Rick<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-comment">//將script至於body底端，等HTML Parse都結束後才執行script內容</span>
        <span class="hljs-keyword">const</span> p = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'.paragraph'</span>);
        <span class="hljs-built_in">console</span>.log(p); <span class="hljs-comment">// &lt;p class="paragraph"&gt;Hi, My name is Rick&lt;/p&gt;</span>
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/beforebody.jpg?raw=true" alt="beforebody"></p>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/beforebodyend.jpg?raw=true" alt="beforebodyend"></p>
<h2 id="script-async-defer-">Script的async以及defer屬性</h2>
<h4 id="-script-src-script-async-defer-script-tag-head-body-async-defer-script-async-defer-">在現行較新版的瀏覽器，若script存在src的屬性，可以在script內部加入async或是defer的屬性，藉此以優化網頁的讀取速率，此時script tag是存在於head內部(因放置於body底端已無義)，因為async以及defer在本質上仍有差異，因此可以依照script類別的不同來選擇要使用async或是defer。</h4>
<h4 id="-async-script-html-parse-script-fetch-async-script-fecth-html-parse-script-execution-"><code>async</code> 屬性，顧名思義，遇到script時，HTML Parse 與Script Fetch 會以async方式行進，直到Script Fecth結束時，HTML Parse 才會停下來並進行Script Execution。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">head</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span> <span class="hljs-attr">async</span> <span class="hljs-attr">src</span>=<span class="hljs-string">"index.js"</span>&gt;</span><span class="undefined"></span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">head</span>&gt;</span>

<span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-comment">&lt;!-- content --&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/async.jpg?raw=true" alt="async"></p>
<h4 id="-defer-sciprt-html-parse-script-fetch-async-fetch-script-async-script-execute-html-script-javascript-code-"><code>defer</code> 屬性，解析過程遇到sciprt時，HTML Parse 與Script Fetch仍會以async方式fetch script的內容，但與 <code>async</code> 不一樣的地方在於Script Execute只會在HTML解析完畢時才執行script內的JavaScript code。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">head</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span> <span class="hljs-attr">defer</span> <span class="hljs-attr">src</span>=<span class="hljs-string">"index.js"</span>&gt;</span><span class="undefined"></span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">head</span>&gt;</span>

<span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-comment">&lt;!-- content --&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/defer.jpg?raw=true" alt="defer"></p>
<h4 id="-async-defer-script-body-script-fetch-async-"><code>async</code> 以及 <code>defer</code> 所花費的時間會比單純將script置於body底部較少(因script fetch是以async方式進行)，須特別注意的是:</h4>
<h4 id="1-async-domcontentloaded-event-html-parse-script-code-script-fecth-domcontentloaded-script-fetch-script-execute-">1. 在 <code>async</code> 的情況下，其DOMContentLoaded event在HTML Parse結束時就觸發，倘若script內的code內容龐大，可能造成Script Fecth的時間拉長，出現DOMContentLoaded觸發後Script Fetch還沒結束或Script Execute尚未執行的窘況。</h4>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/asyncng.jpg?raw=true" alt="ng async"></p>
<h4 id="2-async-script-tag-script1-script2-fetch-execute-script2-script1-script2-script1-code-script-defer-">2. 在 <code>async</code> 的情況下，script tag的先後順序並不代表執行順序，倘若先後引入了script1以及script2，由於在該機制下是誰fetch完畢就先execute，因此可能出現script2較script1先執行的狀況，倘若script2需要依賴script1內的code，就會出現錯誤; 因此在需要引入多個且互相依賴的script時，會建議使用 <code>defer</code> 。</h4>
<h4 id="3-script-third-party-scripts-script-async-">3. 倘若引入的script是third party scripts(不須與其他script互動)，則可使用 <code>async</code> 。</h4>
<h3 id="-">參考資料</h3>
<ul>
<li><a href="https://www.udemy.com/course/the-complete-javascript-course/">The Complete JavaScript Course 2020: From Zero to Expert!</a></li>
<li><a href="https://developer.mozilla.org/zh-TW/docs/Web/Events/DOMContentLoaded">MDN-DOMContentLoaded</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script">MDN-Script Element</a></li>
</ul>

            

            

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return { title, markup, url };
}