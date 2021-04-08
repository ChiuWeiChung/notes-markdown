export const render = ()=>{
    const title = "了解JavaScript的背後Part3(Scope & Scope Chain)";
    const url = "#javascript/knowJs3";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="-javascript-part3-scope-scope-chain-">了解JavaScript的背後Part3(Scope &amp; Scope Chain)</h1>
<h4 id="-javascript-console-log-scope-or-console-reference-error-">在學習JavaScript的初期，會時常出現的情況: &quot;甚麼!，我明明有宣告它阿，為何無法透過console.log()印出來呢??&quot;，後面才知道Scope(範疇 or 作用域)的觀念有多重要，深深影響我們在哪裡可以&amp;不可以存取變數，有了這個觀念就可以大幅減少console中出現Reference error的悲劇，下面針對幾點專有名詞做紀錄:</h4>
<ul>
<li><h2 id="scoping">Scoping</h2>
<h4 id="-">定義我們宣告的變數在哪個區域我們可以被存取它、哪個區域不能存取它。</h4>
</li>
<li><h2 id="lexical-scoping-">Lexical scoping (語法作用域)</h2>
<h4 id="lexical-scoping-1-function-2-block-scope-of-a-variable-">Lexical Scoping的定義為: 變數在某個區域是否可/不可被存取主要是由<code>1.function(函式)</code>以及<code>2.block(區塊)</code>所宣告的位置所決定;可以存取的變數的區域稱為scope of a variable。</h4>
</li>
<li><h2 id="scope">Scope</h2>
<h4 id="-javascript-scope-1-global-scope-2-function-scope-3-block-scope-">在JavaScript內，有三種Scope，1. Global Scope 2. Function Scope 3. Block Scope，如下方筆記。</h4>
</li>
</ul>
<h2 id="-javascript-scope">三種在JavaScript的Scope</h2>
<h3 id="1-global-scope">1.Global Scope</h3>
<h4 id="-function-block-">簡單定義的話，就是在所有<code>function以及block以外</code>所宣告的變數。</h4>
<pre><code class="lang-js"><span class="hljs-attribute">const cat</span> = <span class="hljs-string">"Jumo"</span>;
<span class="hljs-attribute">const weight</span> = <span class="hljs-string">"15kg"</span>;
<span class="hljs-attribute">const age</span> = 3;
</code></pre>
<h3 id="2-function-scope">2.Function Scope</h3>
<h4 id="-function-declaration-function-expression-arrow-function-"><code>在函式內部所宣告的變數，僅能在該函式內部被存取</code>，此規則在函式宣告(function declaration)、函式表示式(function expression)、函式箭頭式(arrow function)都成立。</h4>
<pre><code class="lang-js"><span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">myCat</span>(<span class="hljs-params">currentYear</span>)</span>{
    <span class="hljs-keyword">const</span> birthday = <span class="hljs-number">2012</span>;
    <span class="hljs-keyword">const</span> age = currentYear-birthday;
    <span class="hljs-keyword">return</span> age
}
<span class="hljs-built_in">console</span>.log(birthday); <span class="hljs-comment">// ReferenceError: birthday is not defined</span>
</code></pre>
<h3 id="3-block-scope-es6-">3.Block Scope (ES6)</h3>
<h4 id="block-scope-es2015-scope-if-statement-for-loop-const-let-var-var-function-scope-block-scope-strict-mode-block-scope-">Block Scope是在ES2015中才導入的scope，定義在大括號(如if statement、for-loop的大括號)內部的變數只能在其內部被存取，這邊指的變數包含<code>const</code>、<code>let</code>(但不包含<code>var</code>，利用<code>var</code>宣告的變數屬於function scope)。因為Block Scope的出現，在<code>strict mode</code>的情況下，函式宣告也會被block scope限制。</h4>
<p><code>NOTE:Object literal的大括號不屬於block scope</code></p>
<pre><code class="lang-js"><span class="hljs-meta">'use strict'</span>
<span class="hljs-keyword">var</span> age = <span class="hljs-number">20</span>;
<span class="hljs-keyword">if</span>( age &gt;= <span class="hljs-number">18</span>){
    <span class="hljs-keyword">const</span> isAdult = <span class="hljs-literal">true</span>;  <span class="hljs-comment">// can only be accessed inside the if statement</span>
    <span class="hljs-keyword">let</span> canVote = <span class="hljs-literal">true</span>; <span class="hljs-comment">// can only accessed inside the if statement</span>
    <span class="hljs-keyword">var</span> gotoBar = <span class="hljs-literal">true</span>; <span class="hljs-comment">// var variables are function scope, can be accessed outside block scope</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getLicense</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"you are adult, go to get a drive license!"</span>)
    };
};

<span class="hljs-built_in">console</span>.log(isAdult); <span class="hljs-comment">//ReferenceError  isAdult is not defined</span>
<span class="hljs-built_in">console</span>.log(canVote); <span class="hljs-comment">//ReferenceError canVote is not defined</span>
<span class="hljs-built_in">console</span>.log(gotoBar); <span class="hljs-comment">//true</span>
getLicense(); <span class="hljs-comment">//getLicense is not defined</span>
</code></pre>
<h2 id="scope-chain">Scope Chain</h2>
<h4 id="scope-chain-javascript-scope-scope-scope-scope-chain-function-scope-block-scope-scope-scope-">Scope Chain是什麼?我們可以把它想像成一條<code>單行道</code>，當JavaScript所尋找的變數不存在當前的scope時，就會向外部的scope尋找，因為是單行道，所以不會往內層scope尋找，這就是所謂的Scope Chain!!，如下面範例中有許多的function scope&amp;block scope，在內部各處都宣告了變數，可以發現在<code>沒有重複宣告相同變數名稱的情況下，處於內部的scope都能存取外部scope的變數</code>，如下圖所呈現。</h4>
<pre><code class="lang-js"><span class="hljs-meta">'use strict'</span>;
<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">calcAge</span>(<span class="hljs-params">birthYear</span>)</span>{
    <span class="hljs-keyword">const</span> currentYear = <span class="hljs-keyword">new</span> <span class="hljs-built_in">Date</span>().getFullYear();
    <span class="hljs-keyword">const</span> age = currentYear -birthYear;
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">printAge</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-keyword">let</span> output = <span class="hljs-string">\`<span class="hljs-subst">\${firstName}</span>, you are <span class="hljs-subst">\${age}</span>, born in <span class="hljs-subst">\${birthYear}</span>\`</span>;
        <span class="hljs-built_in">console</span>.log(output);
        <span class="hljs-keyword">if</span>(birthYear &gt;=<span class="hljs-number">1981</span> &amp;&amp; birthYear &lt;= <span class="hljs-number">1996</span>){
            <span class="hljs-keyword">var</span> isAdult = <span class="hljs-literal">true</span>;
            <span class="hljs-keyword">const</span> str =<span class="hljs-string">\`Oh, and you're a adult,<span class="hljs-subst">\${firstName}</span>\`</span>;
            <span class="hljs-built_in">console</span>.log(str);
            <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">add</span>(<span class="hljs-params">a,b</span>)</span>{
                <span class="hljs-keyword">return</span> a+b
            }
        }
        <span class="hljs-comment">// console.log(str); //ReferenceError:</span>
        <span class="hljs-built_in">console</span>.log(isAdult); <span class="hljs-comment">// var is not block scope</span>
        <span class="hljs-comment">// add(2,3); function are block scope at strict mode; otherwise:function scope</span>
    }
    printAge();
    <span class="hljs-keyword">return</span> age;
}
<span class="hljs-keyword">const</span> firstName = <span class="hljs-string">"Rick"</span>;
calcAge(<span class="hljs-number">1991</span>);
<span class="hljs-comment">// console.log(age);  //ReferenceError</span>
<span class="hljs-comment">// printAge(); //ReferenceError</span>
</code></pre>
<p><img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/scope/scopechain.png?raw=true" alt="Scope Chain">
<img src="https://github.com/ChiuWeiChung/IMGTANK/blob/main/scope/variables%20in%20scope.png?raw=true" alt="variables in scope"></p>
<h4 id="scope-first-const-firstname-rick-if-block-scope-const-firstname-john-if-block-scope-firstname-john-rick-javascript-scope-chain-if-block-scope-firstname-">scope內部與外部有相同名稱的變數時，如下方例子，在first()內部使用了<code>const</code>宣告了firstName=&quot;Rick&quot;，而在if block scope內部又以<code>const</code>宣告了一次firstName=&quot;John&quot;，此時若在if block scope印出firstName，得到的結果是&quot;John&quot;而非&quot;Rick&quot;，原因在於JavaScript在循著Scope Chain<code>從內往外</code>尋找變數時，在if block scope內部就已經找到firstName，因此停止向外尋找直接輸出結果。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> change = <span class="hljs-literal">true</span>;
<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">first</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-keyword">const</span> firstName = <span class="hljs-string">"Rick"</span>;
    <span class="hljs-keyword">if</span> (change){
        <span class="hljs-keyword">const</span> firstName=<span class="hljs-string">"John"</span>;   
        <span class="hljs-comment">// let firstName="John";  // console.log(firstName) = &gt; John </span>
        <span class="hljs-built_in">console</span>.log(firstName); <span class="hljs-comment">// John</span>
    }
    <span class="hljs-built_in">console</span>.log(firstName); <span class="hljs-comment">//Rick</span>
}
first();
</code></pre>
<h2 id="scope-chain-vs-execution-stack">Scope Chain VS. Execution Stack</h2>
<h4 id="-javascript-scope-chain-scope-javascript-part2-execution-context-">上面有提到，JavaScript會依照Scope Chain由所處scope位置由內而外尋找變數，而在<a href="">了解JavaScript的背後Part2</a>心得中有提到<code>Execution Context堆疊方式是依照呼叫的順序</code>，這邊就兩者的關係來做探討。</h4>
<h4 id="-execution-context-first-ec-second-ec-third-ec-third-a-b-first-second-third-scope-lexical-scoping-">執行後我們以Execution Context的堆疊來看，順序為first() EC-&gt;second() EC-&gt;third() EC，但可以發現在third()內部無法存取a&amp;b的資料，原因在於雖然執行環境是依照呼叫順序first-&gt;second-&gt;third堆疊，但呼叫的順序與是否可以存取scope內部的變數無關!，如此篇開頭所提到的Lexical Scoping，<code>變數是否可以被存取與宣告的位置有關</code>。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> starter = <span class="hljs-number">1</span>;

<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">first</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-keyword">const</span> a = <span class="hljs-number">2</span>;
    second();
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">second</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-keyword">const</span> b = <span class="hljs-number">3</span>;
        third();
    }
}
<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">third</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-keyword">const</span> c =<span class="hljs-number">4</span>;
    <span class="hljs-comment">// console.log(a); // Reference error: a is not defined </span>
    <span class="hljs-comment">// console.log(b); // Reference error: b is not defined </span>
    <span class="hljs-built_in">console</span>.log(a+b+c+starter); <span class="hljs-comment">// doesn't work because can't access a&amp;b</span>
}
first();
</code></pre>
<h2 id="-">重點回顧</h2>
<h4 id="-">這邊就針對上面記錄的心得做重點回顧</h4>
<ul>
<li>JavaScript存在三種Scope: 1.Global Scope 2.Function Scope 3.Block Scope</li>
<li>let以及const屬於Block Scope; var屬於Function Scope</li>
<li>在JavaScript中，變數在哪裡可以被存取主要是由Function Scope以及Block Scope所宣告的位置做決定</li>
<li>每一個Scope都可以存取其外部的Scope的變數，即為Scope Chain</li>
<li>Scope Chain與函式被呼叫的順序無關，僅與宣告時所存在的位置有關</li>
</ul>

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}