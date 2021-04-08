
export const render = ()=>{
    const title = "跨來源資源共用(CORS)以及同源政策的認識";
    const url = "#javascript/CORS&Same-Origin-Policy";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="-same-origin-policy-cors-">同源政策(Same-Origin Policy)以及跨來源資源共用(CORS)</h1>
<h4 id="-chrome-console-ajax-fetch-api-cors-cross-origin-resource-sharing-">會寫這個主題主要是因為之前在chrome的console頁利用Ajax <code>fetch()</code>來提取API資料時，遇到CORS(Cross Origin Resource Sharing, 跨來源資源共用)的問題，如下方程式碼:</h4>
<pre><code class="lang-js"><span class="hljs-keyword">async</span> <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getData</span>(<span class="hljs-params"></span>)</span>{
    fetch(<span class="hljs-string">\`https://www.metaweather.com/api/location/2487956/\`</span>);
};
getData();
<span class="hljs-comment">// Access to fetch at **** from origin **** has been blocked by CORS policy.....</span>
</code></pre>
<h2 id="-">發生了什麼事?</h2>
<h4 id="-fetch-api-api-javascript-fetch-request-same-origin-policy-cors-">當我們透過Fetch方式來向API取得資源是，常見的應用是向後端API拿取資料交給前端，然而，然而利用JavaScript <code>fetch()</code>發起需求(request)時，必須遵守同源政策(Same-Origin Policy)，該政策下會強制你遵守CORS的規範。</h4>
<h2 id="-">何為同源?</h2>
<h4 id="-">同源需滿足三種條件:</h4>
<ol>
<li>相同協定 (protocol)，即http/https</li>
<li>相同網域 (domain)</li>
<li>相同通訊埠 (port)</li>
</ol>
<h4 id="ex-https-example-com-a-html-">EX: 與<code>https://example.com/a.html</code> 同源的有那些</h4>
<ul>
<li><a href="https://example.com/b.html">https://example.com/b.html</a> =&gt; yes</li>
<li><a href="https://example.com/chtml">https://example.com/chtml</a> =&gt; (no, 不同protocol)</li>
<li><a href="https://subdomain.example.com/d.html">https://subdomain.example.com/d.html</a> =&gt; (no,不同domain)</li>
<li><a href="https://example.com:8080/e.html">https://example.com:8080/e.html</a> =&gt; (no,不同port)</li>
</ul>
<h2 id="cors-cross-origin-request-">CORS &amp; 跨來源請求(Cross-Origin Request)</h2>
<h4 id="-http-cross-origin-request-cors-">非同源的情況下，會產生跨來源http請求(cross-origin request); 如上面的程式碼出現的錯誤，產生的跨來源請求因為伺服器設定沒有遵守CORS規範，所以出現錯誤。</h4>
<h2 id="-">如何解決?</h2>
<h4 id="-api-cors-ex-cross-anywhere-https-github-com-rob-w-cors-anywhere-cors-anywhere-api-api-">解決的方式有兩種，一是請API的開發者開放CORS權限，這裡尙不探討，第二種比較容易，透過第三方資源來協助存取(ex: <a href="https://github.com/Rob--W/cors-anywhere/">cross-anywhere</a>)，使用方式很簡單就只是將 cors-anywhere 所提供的API網址放前面，後面加上你要訪問的API內容網址。</h4>
<p><code>這裡的第三方資源即是跨域代理伺服器(CORS PROXY)，利用伺服器端程式來繞過此問題</code></p>
<pre><code class="lang-js"><span class="hljs-keyword">async</span> <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getData</span>(<span class="hljs-params"></span>)</span>{
    fetch(<span class="hljs-string">\`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/2487956/\`</span>);
}
getData();
<span class="hljs-comment">//NO ERROR SHOWS UP</span>
</code></pre>
<p><br></p>
<h6 id="-">參考資料</h6>
<ul>
<li><a href="https://shubo.io/what-is-cors/">Shubo&#39;s Notes</a></li>
<li><a href="https://andy6804tw.github.io/2017/12/27/middleware-tutorial/#%E8%B7%A8%E4%BE%86%E6%BA%90%E8%B3%87%E6%BA%90%E5%85%B1%E4%BA%AB-cors">1010 Code</a></li>
<li><a href="https://www.udemy.com/course/the-complete-javascript-course/">Jonas&#39;s JavaScript Course</a></li>
</ul>


        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}