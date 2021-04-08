export const render = ()=>{
    const title = "了解JavaScript的背後Part5 (this keyword)";
    const url = "#javascript/knowJs5";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="-javascript-part5-this-keyword-">了解JavaScript的背後Part5 (this keyword)</h1>
<h2 id="this-keyword">this keyword</h2>
<h4 id="-this-javascript-keyword-javascript-this-"><code>this</code>這個主題在JavaScript中大概是最熱門及被討論的主題之一，在使用上有它的實用性，但也是最容易被誤解的keyword，這篇就針對JavaScript的this記錄學習筆記。</h4>
<h4 id="this-keyword-this-this-owner-obj-test-this-obj-test-">this keyword，當物件在呼叫其內部的函式時就會出現this，而該函式的this會指向<code>它的主人(owner)</code>，如下方範例，在呼叫物件obj內的<code>test</code>函式之後，印出的this是指向obj物件，也就是擁有<code>test</code>這個函式的主人。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> obj = {
    <span class="hljs-attr">firstName</span>:<span class="hljs-string">"Rick"</span>,
    <span class="hljs-attr">food</span>:<span class="hljs-string">"Steak"</span>,
    <span class="hljs-attr">test</span>:<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-keyword">this</span>); <span class="hljs-comment">//{name: "Rick", food: "Steak", test: ƒ}</span>
        <span class="hljs-built_in">console</span>.log(<span class="hljs-keyword">this</span>.firstName); <span class="hljs-comment">//Rick</span>
        <span class="hljs-built_in">console</span>.log(<span class="hljs-keyword">this</span>.food); <span class="hljs-comment">//Steak</span>
    },
};
obj.test();
</code></pre>
<h2 id="-regular-function-this-">在Regular Function內，this會指向呼叫它的物件</h2>
<h4 id="-this-owner-strict-mode-undefined-strict-mode-window-">只有呼叫物件內函式得當下，this才有意義，並且會指向呼叫它的物件(也就是owner)，倘若是一個不存在於物件內的函式，在strict mode的情況下會出現undefined，在非strict mode則會指向window。</h4>
<pre><code class="lang-js"><span class="hljs-meta">'use strict'</span>
<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">test</span>(<span class="hljs-params"></span>)</span>{
    <span class="hljs-built_in">console</span>.log(<span class="hljs-keyword">this</span>); <span class="hljs-comment">//strict mode底下會出現undefined，在非strict mode時，this會指向window</span>
}
test();
</code></pre>
<h4 id="-a-assign-b-b-this-b-a-assign-v-strict-mode-v-error-strict-mode-this-window-window-firstname-favorite-undefined-">當我們把物件A內的函式assign到另一個物件B時，物件B呼叫該函式時，this會指向呼叫它的物件，也就是物件B本身;若將物件A的函式assign到變數v之中，在strict mode呼叫該變數v會出現error，非strict mode則會將this指向window，由於window底下尚未存在firstName以及favorite的變數，故會出現undefined。</h4>
<pre><code class="lang-js"><span class="hljs-meta">'use strict'</span>
<span class="hljs-keyword">const</span> objA = {
    <span class="hljs-attr">firstName</span>:<span class="hljs-string">"Rick"</span>,
    <span class="hljs-attr">favorite</span>:<span class="hljs-string">"basketball"</span>,
    <span class="hljs-attr">foo</span>:<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`<span class="hljs-subst">\${<span class="hljs-keyword">this</span>.firstName}</span> likes to play <span class="hljs-subst">\${<span class="hljs-keyword">this</span>.favorite}</span>\`</span>);
    },
};
<span class="hljs-keyword">const</span> objB = {
    <span class="hljs-attr">firstName</span>:<span class="hljs-string">"John"</span>,
    <span class="hljs-attr">favorite</span>:<span class="hljs-string">"baseball"</span>,
};
objB.foo = objA.foo;
objB.foo(); <span class="hljs-comment">// John likes to play baseball</span>
<span class="hljs-keyword">const</span> v  = objA.foo;
v(); <span class="hljs-comment">//在strict mode出現Cannot read property 'firstName' of undefined , 非strict mode則出現undefined likes to play undefined</span>
</code></pre>
<h2 id="-arrow-function-this">在Arrow Function內的this</h2>
<h4 id="this-keyword-arrow-function-regular-function-arrow-function-this-keyword-this-parent-function-or-parent-scope-this-test-test2-this-obj-arrow-function-this-test-this-obj-">this keyword在arrow function的行為與regular function不同，arrow function(箭頭函式)<code>沒有自己的this keyword</code>，因為<code>它的this等同於上層函式、範疇(parent function or parent scope)的this</code>，如下方範例，可以看到在<code>test</code>函式內部宣告了另一個箭頭函式<code>test2</code>，並在內部印出this，結果是指向obj這個物件，因為arrow function的this指向它上層函式<code>test</code>的this，也就是obj。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> obj = {
    <span class="hljs-attr">firstName</span>:<span class="hljs-string">"Rick"</span>,
    <span class="hljs-attr">food</span>:<span class="hljs-string">"Steak"</span>,
    <span class="hljs-attr">test</span>:<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-keyword">this</span>); <span class="hljs-comment">// {firstName: "Rick", food: "Steak", test: ƒ}</span>
        <span class="hljs-keyword">const</span> test2 = <span class="hljs-function"><span class="hljs-params">()</span>=&gt;</span> <span class="hljs-built_in">console</span>.log(<span class="hljs-keyword">this</span>); <span class="hljs-comment">//{firstName: "Rick", food: "Steak", test: ƒ}</span>
        test2();
    },
};
obj.test();
</code></pre>
<h2 id="regular-function-vs-arrow-function">Regular Function VS. Arrow Function</h2>
<h4 id="-regular-function-this-arrow-function-this-or-parent-function-or-scope-this-regularobj-regular-function-this-regularobj-arrowobj-arrow-function-this-window-">經過上面的心得介紹可以統整出Regular Function的this指的是呼叫函式的物件本身，Arrow Function的this則與它的上層函式or範疇(parent function or scope)的this一樣，如下方範例，regularObj呼叫內部的regular function，它的this指向regularObj本身;倘若是arrowObj呼叫內部的arrow function，它的this指向的是window。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> regularObj = {
    <span class="hljs-attr">firstName</span>:<span class="hljs-string">"Rick"</span>,
    <span class="hljs-attr">regular</span>:<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`Hi <span class="hljs-subst">\${<span class="hljs-keyword">this</span>.firstName}</span>\`</span>);
    };
};
regularObj.regular(); <span class="hljs-comment">//Rick</span>

<span class="hljs-keyword">const</span> firstName:<span class="hljs-string">"Mary"</span>
<span class="hljs-keyword">const</span> arrowObj = {
    <span class="hljs-attr">firstName</span>:<span class="hljs-string">"Rick"</span>,
    <span class="hljs-attr">arrow</span>:<span class="hljs-function"><span class="hljs-params">()</span>=&gt;</span> <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`Hi <span class="hljs-subst">\${<span class="hljs-keyword">this</span>.firstName}</span>\`</span>);  <span class="hljs-comment">// this keyword point to window, window.firstName = Mary;</span>
};
arrowObj.arrow(); <span class="hljs-comment">// Mary</span>
</code></pre>
<h4 id="-this-keyword-isadult-isadult-calcage-this-undefined-strict-mode-">下方程式碼中，this keyword無法在isAdult中顯示，因為isAdult被宣告在calcAge內部，其內部的this會是undefined(strict mode)，然而有兩種辦法可以解決這樣的困境。</h4>
<pre><code class="lang-js"><span class="hljs-meta">'use strict'</span>
<span class="hljs-keyword">const</span> obj = {  
    <span class="hljs-attr">firstName</span>:<span class="hljs-string">"Rick"</span>,
    <span class="hljs-attr">year</span>:<span class="hljs-number">1992</span>,
    <span class="hljs-attr">calcAge</span>: <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-keyword">this</span>);  <span class="hljs-comment">// {firstName: "Rick", year: 1992, calcAge: ƒ}</span>
        <span class="hljs-built_in">console</span>.log(<span class="hljs-number">2037</span>-<span class="hljs-keyword">this</span>.year); <span class="hljs-comment">//45</span>
        <span class="hljs-keyword">const</span> isAdult = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
            <span class="hljs-keyword">const</span> now = <span class="hljs-keyword">new</span> <span class="hljs-built_in">Date</span>().getFullYear();
            <span class="hljs-built_in">console</span>.log(now-<span class="hljs-keyword">this</span>.year);<span class="hljs-comment">//NaN (this=undefined, this.year=undefined, number-undefined = NaN )</span>
        };
        isAdult();
    }
};
obj.calcAge();
</code></pre>
<h3 id="solution-1">Solution 1</h3>
<h4 id="-isadult-this-assign-self-isadult-self-">在isAdult外部先將this assign至另一個變數self，再從isAdult內部呼叫self即可解決。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> obj = {  
    <span class="hljs-attr">firstName</span>:<span class="hljs-string">"Rick"</span>,
    <span class="hljs-attr">year</span>:<span class="hljs-number">1992</span>,
    <span class="hljs-attr">calcAge</span>: <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-keyword">this</span>);  <span class="hljs-comment">// {firstName: "Rick", year: 1992, calcAge: ƒ}</span>
        <span class="hljs-built_in">console</span>.log(<span class="hljs-number">2037</span>-<span class="hljs-keyword">this</span>.year); <span class="hljs-comment">//45</span>
        <span class="hljs-keyword">const</span> self = <span class="hljs-keyword">this</span>;
        <span class="hljs-keyword">const</span> isAdult = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
            <span class="hljs-keyword">const</span> now = <span class="hljs-keyword">new</span> <span class="hljs-built_in">Date</span>().getFullYear();
            <span class="hljs-built_in">console</span>.log(now-<span class="hljs-keyword">this</span>.year);  <span class="hljs-comment">//NaN (number -undefined = Not a Number )</span>
        };
        isAdult();
    }
};
obj.calcAge();
</code></pre>
<h3 id="solution-2">Solution 2</h3>
<h4 id="-isadult-arrow-function-this-calcage-this-obj-">將isAdult改為arrow function，因為在內部的this會指向calcAge的this，也就是obj本身。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> obj = {  
    <span class="hljs-attr">firstName</span>:<span class="hljs-string">"Rick"</span>,
    <span class="hljs-attr">year</span>:<span class="hljs-number">1992</span>,
    <span class="hljs-attr">calcAge</span>: <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
        <span class="hljs-built_in">console</span>.log(<span class="hljs-keyword">this</span>);  <span class="hljs-comment">// {firstName: "Rick", year: 1992, calcAge: ƒ}</span>
        <span class="hljs-built_in">console</span>.log(<span class="hljs-number">2037</span>-<span class="hljs-keyword">this</span>.year); <span class="hljs-comment">//45</span>
        <span class="hljs-keyword">const</span> self = <span class="hljs-keyword">this</span>;
        <span class="hljs-keyword">const</span> isAdult = <span class="hljs-function"><span class="hljs-params">()</span>=&gt;</span>{
            <span class="hljs-keyword">const</span> now = <span class="hljs-keyword">new</span> <span class="hljs-built_in">Date</span>().getFullYear();
            <span class="hljs-built_in">console</span>.log(now-<span class="hljs-keyword">this</span>.year);  <span class="hljs-comment">//NaN (number -undefined = Not a Number )</span>
        };
        isAdult();
    }
};
obj.calcAge();
</code></pre>

            

            

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}