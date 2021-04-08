export const render = ()=>{
    const title = "冒泡與捕捉事件";
    const url = "#javascript/Bubbling";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="bubbling-aned-capturing-">Bubbling aned capturing(冒泡與捕捉)</h1>
<h2 id="-">冒泡事件</h2>
<h4 id="-dom-event-codepen-https-codepen-io-rickchiu-pen-abmdymw-html-html-body-div-div-div-div-click-event-callback-function-background-color-div-event-handler-">所謂的冒泡事件，指的是當子元素的DOM Event被觸發時，引起父層元素、祖父元素、曾祖父元素... 的監聽事件也隨後被觸發，如<a href="https://codepen.io/rickchiu/pen/abmdYMW">我的Codepen</a>所呈現，整個html結構有外而內分別是html、body、外層div、中間層div、內層div，當我分別在三層div中都加入 <code>click</code> 的event後，其callback function會將改變該元素的background-color，可以發現倘若點擊內層元素div時，中間層以及外層的event handler也被執行，這就是所謂的冒泡事件，\`內層事件觸發也會引起父層元素事件被觸發。</h4>
<h2 id="-">冒泡/捕捉是如何發生的?</h2>
<h4 id="-inner-div-click-inner-div-dom-tree-click-dom-tree-inner-div-inner-div-capturing-phase-click-click-dom-event-addeventlistener-false-click-event-handler-">如下方示意圖，當元素 <code>inner div</code> 被點擊時，事實上，click事件並不是一開始就出現在 <code>inner div</code> ，而是出現在DOM tree的最頂端，click事件會從DOM tree的頂端開始， <code>沿著inner div的父層元素</code> 一層一層的往內走，在抵達 <code>inner div</code> 之前的過程，稱為 <code>捕捉階段(Capturing Phase)</code> ，在這個階段，click事件拜訪過的的父層元素只要有含有 <code>click</code> 的DOM event就會被觸發，但由於在 <code>addEventListener()</code> 的預設值為false(冒泡事件)，所以click事件在捕捉階段並不會觸發父層元素的event handler。</h4>
<h4 id="-click-inner-div-target-phase-event-handler-click-inner-div-bubbling-phase-click-event-handler-">當click事件抵達目標元素 <code>inner div</code> 時，稱為 <code>Target Phase</code> ，該階段會觸發目標元素的event handler，然而click事件的旅程尚未結束，因為從哪來就從哪回去，因此在抵達 <code>inner div</code> 後又會隨著原路回去，這個過程則稱為冒泡階段(Bubbling phase)，同樣地，click事件在回程路上也會觸發父層元素的event handler。</h4>
<pre><code class="lang-html">&lt;html&gt;

&lt;body&gt;
    &lt;<span class="hljs-keyword">div</span> <span class="hljs-built_in">class</span>=<span class="hljs-string">"outer"</span>&gt;
        This <span class="hljs-keyword">is</span> outer-<span class="hljs-keyword">div</span>
        &lt;<span class="hljs-keyword">div</span> <span class="hljs-built_in">class</span>=<span class="hljs-string">"middle"</span>&gt;
            This <span class="hljs-keyword">is</span> <span class="hljs-keyword">middle</span>-<span class="hljs-keyword">div</span>
            &lt;<span class="hljs-keyword">div</span> <span class="hljs-built_in">class</span>=<span class="hljs-string">"inner"</span>&gt;
                This <span class="hljs-keyword">is</span> inner-<span class="hljs-keyword">div</span>
            &lt;/<span class="hljs-keyword">div</span>&gt;
        &lt;/<span class="hljs-keyword">div</span>&gt;
    &lt;/<span class="hljs-keyword">div</span>&gt;
&lt;/body&gt;

&lt;/html&gt;
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/bubbling.jpg?raw=true" alt="捕捉與冒泡示意圖"></p>
<h2 id="-">冒泡/捕捉的設定</h2>
<h4 id="-addeventlistenr-true-click-capturing-phase-callback-function-false-click-callback-function-">當父層元素在 <code>addEventListenr()</code> 中的第三個參數設定為 <code>true</code> 時，表示click事件只會在捕捉階段(capturing phase)觸發callback function，若不設定參數，則為預設值 <code>false</code> ，表示click事件只有在回程路上才會觸發父層元素的callback function。</h4>
<pre><code class="lang-js"><span class="hljs-comment">// 設定第三個參數為true時，僅捕捉階段才會觸發callback function</span>
outer.addEventListener(<span class="hljs-string">'click'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'outer'</span>)
}
}, <span class="hljs-literal">true</span>)
middle.addEventListener(<span class="hljs-string">'click'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'middle'</span>)
}, <span class="hljs-literal">true</span>)
inner.addEventListener(<span class="hljs-string">'click'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'inner'</span>)
})
<span class="hljs-comment">// 點擊&lt;div class="inner"&gt;後console.log的順序為</span>
<span class="hljs-comment">// "outer"</span>
<span class="hljs-comment">// "middle"</span>
<span class="hljs-comment">// "inner"</span>
</code></pre>
<pre><code class="lang-js"><span class="hljs-comment">// 不設定則預設值為false，僅冒泡階段才會觸發callback function</span>
outer.addEventListener(<span class="hljs-string">'click'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'outer'</span>)
}
})
middle.addEventListener(<span class="hljs-string">'click'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'middle'</span>)
})
inner.addEventListener(<span class="hljs-string">'click'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'inner'</span>)
})
<span class="hljs-comment">// 點擊&lt;div class="inner"&gt;後console.log的順序為</span>
<span class="hljs-comment">// "inner"</span>
<span class="hljs-comment">// "middle"</span>
<span class="hljs-comment">// "outer"</span>
</code></pre>
<h2 id="-">阻止冒泡發生</h2>
<h4 id="-callback-function-event-event-stoppropagation-">可以在子元素的callback function內引入event參數(名稱任取)，並執行 <code>event.stopPropagation()</code> 即可阻止冒泡事件的發生</h4>
<pre><code class="lang-js">inner.addEventListener(<span class="hljs-string">'click'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span><span class="hljs-params">(e)</span> </span>{
    e.stopPropagation(); <span class="hljs-comment">// </span>
})
</code></pre>
<h2 id="event-target-">event.target永遠指向目標元素</h2>
<h4 id="-callack-function-event-target-">需要注意的是，冒泡事件過程中，每個監聽事件內的callack function中，它們的 <code>event.target</code> 都是指向被點擊的目標元素</h4>
<pre><code class="lang-js">outer.addEventListener(<span class="hljs-string">'click'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span><span class="hljs-params">(event)</span> {</span>
    console.<span class="hljs-built_in">log</span>(\`This <span class="hljs-keyword">is</span> outer div，my event.target <span class="hljs-keyword">is</span>\`, $ {
        event.target
    })
})
middle.addEventListener(<span class="hljs-string">'click'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span><span class="hljs-params">(event)</span> {</span>
    console.<span class="hljs-built_in">log</span>(\`This <span class="hljs-keyword">is</span> middle div，my event.target <span class="hljs-keyword">is</span>\`, $ {
        event.target
    })
})
inner.addEventListener(<span class="hljs-string">'click'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span><span class="hljs-params">(event)</span> {</span>
    console.<span class="hljs-built_in">log</span>(\`This <span class="hljs-keyword">is</span> inner div，my event.target <span class="hljs-keyword">is</span>\`, $ {
        event.target
    })
})
// 點擊&lt;div class=<span class="hljs-string">"inner"</span>&gt;後console.<span class="hljs-built_in">log</span>的順序為 
// This <span class="hljs-keyword">is</span> outer div，my <span class="hljs-keyword">e</span>.target <span class="hljs-keyword">is</span> <span class="hljs-symbol">&lt;p&gt;</span>​This <span class="hljs-keyword">is</span> inner-div​&lt;/<span class="hljs-keyword">p</span>&gt;​
// This <span class="hljs-keyword">is</span> middle div，my <span class="hljs-keyword">e</span>.target <span class="hljs-keyword">is</span> <span class="hljs-symbol">&lt;p&gt;</span>​This <span class="hljs-keyword">is</span> inner-div​&lt;/<span class="hljs-keyword">p</span>&gt;​
// This <span class="hljs-keyword">is</span> inner div，my <span class="hljs-keyword">e</span>.target <span class="hljs-keyword">is</span> <span class="hljs-symbol">&lt;p&gt;</span>​This <span class="hljs-keyword">is</span> inner-div​&lt;/<span class="hljs-keyword">p</span>&gt;​
</code></pre>
<h2 id="-event-delegation-">事件委派(Event Delegation)</h2>
<h4 id="-event-handling-addeventlistener-dom-event-event-handler-if-statement-">由於冒泡/捕捉的特性而延伸出的event handling模式，藉此可以減少 <code>addEventListener()</code> 的次數，假如有多個不同元素都有DOM event的需求，我們可以將event handler設定在他們共同的父層元素，並且透過if statement來確認事件發生在哪一個元素來實現。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">html</span>&gt;</span>

<span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"container"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"outer"</span>&gt;</span>
            This is outer-div
            <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"middle"</span>&gt;</span>
                This is middle-div
                <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"inner"</span>&gt;</span>
                    This is inner-div
                <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
            <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">const</span> container = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'.container'</span>);
        <span class="hljs-comment">//將事件處理統一交給共同的父層元素處理</span>
        container.addEventListener(<span class="hljs-string">'click'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">e</span>) </span>{
            <span class="hljs-comment">// 透過if statement來確認點擊的元素為何</span>
            <span class="hljs-keyword">if</span> (e.target.classList.contains(<span class="hljs-string">'outer'</span>)) { <span class="hljs-comment">//如果點擊的目標元素的class為"outer" </span>
                e.target.style.backgroundColor = <span class="hljs-string">"green"</span>;
                <span class="hljs-built_in">console</span>.log(e.target.className) <span class="hljs-comment">// "outer"</span>
            } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (e.target.classList.contains(<span class="hljs-string">'middle'</span>)) { <span class="hljs-comment">//如果點擊的目標元素的class為"middle" </span>
                e.target.style.backgroundColor = <span class="hljs-string">"blue"</span>;
                <span class="hljs-built_in">console</span>.log(e.target.className) <span class="hljs-comment">//  "middle"</span>
            } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (e.target.classList.contains(<span class="hljs-string">'inner'</span>)) { <span class="hljs-comment">//如果點擊的目標元素的class為"outer" </span>
                e.target.style.backgroundColor = <span class="hljs-string">"red"</span>;
                <span class="hljs-built_in">console</span>.log(e.target.className) <span class="hljs-comment">//  "inner"</span>

            }
        })
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>

<span class="hljs-tag">&lt;/<span class="hljs-name">html</span>&gt;</span>
</code></pre>
<h2 id="dom-dom-traversing-">DOM遍歷(DOM traversing)</h2>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">h1</span>&gt;</span>Bubbling/Captruing DEMO<span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"container"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"outer"</span>&gt;</span>
            This is outer-div
            <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"middle"</span>&gt;</span>
                This is middle-div
                <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"inner"</span>&gt;</span>
                    This is inner-div
                <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
            <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"footer"</span>&gt;</span>Thank you for playing<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">const</span> container = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'.container'</span>);
        <span class="hljs-keyword">const</span> inner = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'inner'</span>);
        <span class="hljs-comment">// 搜尋子層元素/節點</span>
        <span class="hljs-built_in">console</span>.log(container.querySelector(<span class="hljs-string">'.outer'</span>)); <span class="hljs-comment">//以container為節點往內搜尋</span>
        <span class="hljs-built_in">console</span>.log(container.childNodes); <span class="hljs-comment">// NodeList(3) [text, div.outer, text]</span>
        <span class="hljs-built_in">console</span>.log(container.children); <span class="hljs-comment">//    HTMLCollection [div.outer]</span>
        <span class="hljs-built_in">console</span>.log(container.firstElementChild) <span class="hljs-comment">// &lt;div class="outer"&gt;...&lt;/div&gt;</span>
        <span class="hljs-comment">//搜尋父層元素</span>
        <span class="hljs-built_in">console</span>.log(container.parentNode); <span class="hljs-comment">//&lt;body&gt;...&lt;/body&gt;   </span>
        <span class="hljs-built_in">console</span>.log(container.parentElement); <span class="hljs-comment">//&lt;body&gt;...&lt;/body&gt;</span>
        <span class="hljs-comment">// 選取最靠近的外層元素</span>
        inner.closest(<span class="hljs-string">'.outer'</span>).style.background = <span class="hljs-string">'var(--gradient-secondary)'</span>;
        <span class="hljs-comment">// 選取兄弟元素/節點</span>
        <span class="hljs-built_in">console</span>.log(container.previousElementSibling); <span class="hljs-comment">//&lt;h1&gt;...&lt;/h1&gt;</span>
        <span class="hljs-built_in">console</span>.log(container.nextElementSibling); <span class="hljs-comment">//&lt;div class="footer"&gt;...&lt;/div&gt; </span>
        <span class="hljs-built_in">console</span>.log(container.previousSibliing); <span class="hljs-comment">//#text</span>
        <span class="hljs-built_in">console</span>.log(container.nextSibliing); <span class="hljs-comment">//#text</span>
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>

            

            

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}