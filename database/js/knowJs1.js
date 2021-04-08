export const render = ()=>{
    const title = "了解JavaScript的背後Part1 (特性介紹)";
    const url = "#javascript/knowJs1";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="-javascript-part1-high-level-jit-compiled-one-single-thread-">了解JavaScript的背後Part1 (High-Level &amp; JIT Compiled &amp; One Single THread)</h1>
        <h2 id="wikipedia-javascript-">Wikipedia 上的JavaScript的介紹</h2>
        <h4 id="-javascript-javascript-often-abbreviated-as-js-is-a-programming-language-that-conforms-to-the-ecmascript-specification-javascript-is-high-level-often-just-in-time-compiled-and-multi-paradigm-it-has-curly-bracket-syntax-dynamic-typing-prototype-based-object-orientation-and-first-class-functions-javascript-javascript-1-high-level-2-jit-compiled-3-one-single-thread-">如果搜尋維基百科上的JavaScript，第一段對他的解釋就是: &quot;JavaScript often abbreviated as JS, is a programming language that conforms to the ECMAScript specification. JavaScript is <code>High-Level</code>, often <code>just-in-time compiled</code>, and <code>multi-paradigm</code>. It has curly-bracket syntax, <code>dynamic typing</code>, <code>prototype-based object-orientation</code>, and <code>first-class functions</code>.&quot; 上述落落長的解釋用了許多專有名詞去形容JavaScript的特性，讓人看了眼花撩亂，在這篇我先針對JavaScript所擁有的<code>1.High-Level</code>、<code>2.JIT Compiled</code>、<code>3.One Single Thread</code>特性做心得分享。</h4>
        <h2 id="1-high-level-programming-language">1. High-Level Programming Language</h2>
        <h4 id="high-level-compiler-or-interpreter-0-1-low-level-low-level-low-level-high-level-cpu-c-low-level-c-javascript-python-high-level-c-">High-Level的語法偏向人類較看得懂但機器就看不懂的語言，若要與機器溝通需要透過翻譯(Compiler or Interpreter)轉換成機器看得懂的二進位文件(0&amp;1); 而Low-level語法對人們而言較生硬但機器較看得懂的語言，也因此Low-Level可直接與機器溝通; 在執行上，Low-Level較容易受硬體限制，而High-Level不會收到CPU的影響，我們常見的C語言就是屬於Low-Level，想當初在接觸C語言時，認為最麻煩的是在配置變數的記憶體，JavaScript&amp;Python則屬於High-Level，宣告變數時不需要設定記憶體，但無法像C語言為了加速執行速度針對變數做記憶體的優化。</h4>
        <h2 id="2-just-in-time-compiled">2. Just-In-Time Compiled</h2>
        <h4 id="-high-level-source-code-compilation-interpretation-just-in-time-compilation-">在上一段有談到因為High-Level是人類比較看得懂的語言，在執行過程需要透過翻譯才可以與電腦溝通，於是這邊來討論Source Code是如何透過翻譯轉成電腦可以理解的語言，一般而言可分為<code>Compilation(編譯)</code> &amp; <code>Interpretation(直譯)</code> &amp;<code>Just-In-Time Compilation(即時編譯)</code>:</h4>
        <ul>
        <li>Compiler : 在代碼執行前，先將Source Code全部一次轉換成機器可以理解的語言。 優點:速度快，可獨立運行; 缺點:除錯速度慢; 代表:C語言。</li>
        <li>Interpreter : Source Code會一行一行的(step by step)轉為Machine Code。 優點:靈活性高; 缺點:速度較Compiler慢，需要執行環境(Execution context)才可執行; 代表:JavaScript</li>
        <li>Just-In-Time Compilation: 結合Compiler以及Interpreter的優點，並優化執行速度，近年有些瀏覽器(Google的V8 engine)已導入JIT Compiler。</li>
        </ul>
        <h2 id="3-one-single-thread-non-blocking-event-loop">3. One Single Thread &amp; Non-blocking event loop</h2>
        <h4 id="one-single-thread-javascript-javascript-line-by-line-one-single-thread-ex-google-map-javsscript-event-loop-event-loop-background-javascript-runtime-javascript-part-2-javascript-knowjs2-">One Single Thread主要是在描述JavaScript面對多項任務時是如何處理;在下方方程式碼輸出結果可以推論得知，輸出的順序與呼叫的順序是一致的，表現出JavaScript處理程式碼時是逐行進行(line by line)，所以在一個時間點只能夠處理一件事情，即為one single thread;然而這樣的特性可能會使人認為，若遇到需要花時間處理的任務(ex: 透過Google Map提取地圖資訊，需要時間等待)，是不是就會拖延到後面的作業了呢? 其實不然，因為JavsScript特別之處在於擁有Event Loop(事件循環)的特性，藉由Event Loop將待執行的任務拖至<code>Background</code>下執行。聽起來非常抽象，因為尚需要解釋到JavaScript的運行機制(Runtime)，這部分我把它放在<a href="/#javascript/knowjs2">JavaScript如何運行及理論 (Part 2)</a>來討論。</h4>
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
        <h6 id="-">參考資料</h6>
        <ul>
        <li><a href="http://it-easy.tw/assembly-language">電腦不難</a></li>
        <li><a href="https://www.geeksforgeeks.org/difference-between-high-level-and-low-level-languages/">GEEKSFORGEEKS</a></li>
        <li><a href="https://blog.bitsrc.io/the-jit-in-javascript-just-in-time-compiler-798b66e44143">bitsrc.io</a></li>
        <li><a href="https://www.udemy.com/course/the-complete-javascript-course/">Jonas&#39;s JavaScript Course</a></li>
        </ul>
        
    
        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}