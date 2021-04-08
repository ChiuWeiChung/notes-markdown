export const render = ()=>{
    const title = "Intersection Observer API";
    const url = "#javascript/intersectionobserverapi";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="intersection-observer-api">Intersection Observer API</h1>
<h2 id="-">提升使用者體驗</h2>
<h4 id="-render-addeventlistener-scroll-getboundingclientrect-callback-function-getboundingclientrect-intersection-observer-api-">當使用者開啟網頁時，瀏覽器會將所有的內容全部render出來，倘若頁面含有大量圖片時，會因為太多複雜資訊要存取而導致等待時間拉長，假如可以在一開始將文字內容先呈現給使用者，待使用者滑動頁面到有圖片的元素時再渲染給使用者，如此一來可以減少使用者初次打開網頁的等待時間。在過去可以透過 <code>addEventListener()</code> 監聽 <code>scroll</code> 事件，並以 <code>getBoundingClientRect()</code> 得知目標元素的相對位置，如下方程式碼，然而卷軸每一次的滾動都會使callback function執行，滾動一次就會呼叫 <code>getBoundingClientRect()</code> 重新計算目標元素的位置，如此一來會降低網頁效能，造成不好的使用者體驗，也因此，Intersection Observer API的出現解決了這樣的窘境。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> section = document.querySelector(<span class="hljs-string">'section'</span>);
<span class="hljs-keyword">const</span> <span class="hljs-built_in">height</span> = section.getBoundingClientRect().<span class="hljs-built_in">height</span>;  <span class="hljs-comment">//得知目標元素高度</span>
window.addEventListener(<span class="hljs-string">'scroll'</span>, () =&gt; { <span class="hljs-comment">//在window添加scrool事件</span>
    <span class="hljs-keyword">const</span> viewPoint = section.getBoundingClientRect().top; <span class="hljs-comment">//計算目標元素的相對位置</span>
    <span class="hljs-keyword">if</span> (viewPoint &lt; <span class="hljs-number">0</span> &amp;&amp; viewPoint &gt; -<span class="hljs-built_in">height</span>) { 
        console.<span class="hljs-built_in">log</span>(<span class="hljs-string">'target is arrived'</span>)
    } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (viewPoint &lt; -<span class="hljs-built_in">height</span>) {
        console.<span class="hljs-built_in">log</span>(<span class="hljs-string">'target is passed'</span>);
    } <span class="hljs-keyword">else</span> {
        console.<span class="hljs-built_in">log</span>(<span class="hljs-string">'target is not arrived'</span>);
    }
});
</code></pre>
<h2 id="-intersection-observer-api">認識Intersection Observer API</h2>
<h4 id="intersection-oberserver-api-lazy-loading-infinite-scroll-intersectionobserver-callback-function-option-object-root-null-viewport-threshold-callback-function-viewport-rootmargin-margin-">Intersection Oberserver API可以實現卷軸滾動過程中觸發一些元素事件的發生，做到Lazy Loading、Infinite Scroll等網頁效能上的優化， <code>IntersectionObserver()</code> 接收兩個參數，第一個參數為callback function，第二個參數為option(object形式)，選項中的 <code>root</code> 預設值為null，以瀏覽器的viewport為範圍，也可將觀察範圍設定為目標元素的父層元素， <code>threshold</code> 決定callback function觸發的時機，也就是元素佔據viewport的比例，<code>rootMargin</code>可以定義目標元素的margin，將觀察的範圍擴大/縮小。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> targetElement = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'.target'</span>)

<span class="hljs-keyword">const</span> obsCallback = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">entries, observer</span>) </span>{ <span class="hljs-comment">//建立callback function(傳入Intersection Observer的第一個參數)</span>
    entries.forEach(<span class="hljs-function"><span class="hljs-params">entry</span> =&gt;</span> {
        <span class="hljs-built_in">console</span>.log(entry.isIntersecting); <span class="hljs-comment">// isIntersecting用來確認目標元素是否已經進入viewport，並回傳true/false</span>
    })
};

<span class="hljs-keyword">const</span> obsOptions = { <span class="hljs-comment">//建立option(傳入Intersection Observer的第二個參數)</span>
    root: <span class="hljs-literal">null</span>, <span class="hljs-comment">//預設值為null,範圍是瀏覽器的viewport</span>
    threshold: [<span class="hljs-number">0</span>, <span class="hljs-number">0.5</span>], <span class="hljs-comment">// 設定元素在viewport中的呈現多少比例時，才觸發事件(0.5為50%，可以是array也可以是單一數值)</span>
    rootMargin: <span class="hljs-string">'10px'</span> <span class="hljs-comment">// 設定root的margin，藉此可以擴大/縮小範圍</span>
};

<span class="hljs-keyword">const</span> observer = <span class="hljs-keyword">new</span> IntersectionObserver(obsCallback, obsOptions);
observer.observe(targetElement); <span class="hljs-comment">//將要觀察的元素傳入observe()</span>
</code></pre>
<h2 id="reveal-section-demo">Reveal Section DEMO</h2>
<h4 id="-codepen-https-codepen-io-rickchiu-pen-goworjn-intersection-observer-api-">在<a href="https://codepen.io/rickchiu/pen/gOwOrJN">Codepen</a>內，就是透過Intersection Observer API做到的，隨著視窗下拉時，主題會逐一浮現出來的效果。</h4>
<h2 id="lazy-loading-demo">Lazy Loading DEMO</h2>
<h4 id="-codepen-https-codepen-io-rickchiu-pen-balajpr-lazy-loading-">在<a href="https://codepen.io/rickchiu/pen/BaLaJPr">Codepen</a>中展示了lazy-loading的效果，當使用者開啟頁面時，先渲染出低解析度的圖片，待使用者滑動到特定位置時再將真正的圖片呈現給使用者。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">img</span> <span class="hljs-attr">src</span>=<span class="hljs-string">"https://media.istockphoto.com/videos/black-and-white-loading-indicator-on-dark-background
    -screen-animation-video-id1129874433?s=640x640"</span> <span class="hljs-attr">alt</span>=<span class="hljs-string">"jeremy"</span> <span class="hljs-attr">data-img</span>=<span class="hljs-string">"jeremy"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">const</span> url = <span class="hljs-string">'https://source.unsplash.com/1600x900/?surfing'</span>;
        <span class="hljs-keyword">const</span> images = <span class="hljs-built_in">document</span>.querySelectorAll(<span class="hljs-string">'.img-item'</span>);
        <span class="hljs-keyword">const</span> imgCallback = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">entries, observer</span>) </span>{
            <span class="hljs-keyword">const</span> [entry] = entries;
            <span class="hljs-keyword">if</span> (entry.isIntersecting) { <span class="hljs-comment">//確認目標元素是否已進入視窗</span>
                <span class="hljs-keyword">const</span> author = entry.target.children[<span class="hljs-number">0</span>].dataset.img <span class="hljs-comment">// 存取html data attriute的資料</span>
                entry.target.classList.remove(<span class="hljs-string">'img-blur'</span>) <span class="hljs-comment">//移除blur效果</span>
                entry.target.children[<span class="hljs-number">0</span>].src = <span class="hljs-string">\`<span class="hljs-subst">\${url}</span>,<span class="hljs-subst">\${author}</span>\`</span>; <span class="hljs-comment">//將真正的圖片網址傳入目標元素的src attribute</span>
                observer.unobserve(entry.target); <span class="hljs-comment">// 事件完成後，移除監聽事件</span>
            }
        };
        <span class="hljs-keyword">const</span> imgObserver = <span class="hljs-keyword">new</span> IntersectionObserver(imgCallback, {
            <span class="hljs-attr">root</span>: <span class="hljs-literal">null</span>,
            <span class="hljs-attr">threshold</span>: <span class="hljs-number">0.2</span>,
            <span class="hljs-attr">rootMargin</span>: <span class="hljs-string">'10px'</span>
        });
        images.forEach(<span class="hljs-function">(<span class="hljs-params">el</span>) =&gt;</span> {
            el.classList.add(<span class="hljs-string">'img-blur'</span>);
            imgObserver.observe(el)
        });
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<h2 id="infinite-scroll">Infinite Scroll</h2>
<h4 id="-page-1-page-2-unsplash-intersection-obserber-api-render-codepen-https-codepen-io-rickchiu-pen-xwjjlez-">一般而言，若網頁資訊量過多的情況下，通常會透過分頁(page 1, page 2...)來做內容的切割，倘若是屬於UNSPLASH這種免費相面共享網站，會希望使用者在同一個頁面利用滾輪就可以瀏覽大量的圖庫，然而大量的圖片資訊若要一次渲染給使用者會需要耗費大量的時間，因此會透過Intersection Obserber API做到分批渲染的功能，待瀏覽者滑動到頁面最底部時，再render新的資訊出來，如<a href="https://codepen.io/rickchiu/pen/XWjJLEz">Codepen</a>所呈現的。</h4>

            

            

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}