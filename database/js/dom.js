export const render = ()=>{
    const title = "DOM心得筆記";
    const url = "#javascript/DOM_NOTES";
    const markup = `
    <h1 id="dom-">DOM中的一些心得筆記整理</h1>
<h2 id="queryselectorall-getelementsby-">querySelectorAll 以及getElementsBy... 的差異</h2>
<h4 id="-dom-manipulation-html-element-document-queryselectorall-dom-">進行DOM manipulation時，有許多方法可以選取html內的element，需要注意的是，透過 document.querySelectorAll()\`所回傳的資料內容是靜態的，後續對該元素進行DOM操作不會改變該變數的內容。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">li</span>&gt;</span>1<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">li</span>&gt;</span>2<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">li</span>&gt;</span>3<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">const</span> ul = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'ul'</span>);
        <span class="hljs-keyword">const</span> li = <span class="hljs-built_in">document</span>.querySelectorAll(<span class="hljs-string">'li'</span>);
        ul.appendChild(<span class="hljs-built_in">document</span>.createElement(<span class="hljs-string">'li'</span>));
        <span class="hljs-built_in">console</span>.log(ul.childElementCount); <span class="hljs-comment">//4</span>
        <span class="hljs-built_in">console</span>.log(li); <span class="hljs-comment">// NodeList(3)[li,li,li] 沒有隨著DOM操作而更動內容</span>
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<h4 id="-document-getelementsby-dom-">但若透過 <code>document.getElementsBy...()</code> 回傳的資料是動態的，隨著DOM的操作會更新其內容，如下方範例。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">li</span>&gt;</span>1<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">li</span>&gt;</span>2<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">li</span>&gt;</span>3<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">const</span> ul = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'ul'</span>);
        <span class="hljs-keyword">const</span> li = <span class="hljs-built_in">document</span>.getElementsByTagName(<span class="hljs-string">'li'</span>);
        ul.appendChild(<span class="hljs-built_in">document</span>.createElement(<span class="hljs-string">'li'</span>));
        <span class="hljs-built_in">console</span>.log(ul.childElementCount); <span class="hljs-comment">//4</span>
        <span class="hljs-built_in">console</span>.log(li); <span class="hljs-comment">// HTMLCollection(4)[li,li,li,li]</span>
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<h2 id="-">創造或插入元素</h2>
<h4 id="-dom-element-document-createelement-">若要透過DOM創造新的element，可以透過 <code>document.createElement()</code> ，但需要注意的是，若將它傳入一變數時，它會是個獨立的個體，無法同時間存在於不同位置。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"class1"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>
            <span class="hljs-tag">&lt;<span class="hljs-name">li</span>&gt;</span>1<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>
            <span class="hljs-tag">&lt;<span class="hljs-name">li</span>&gt;</span>2<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>
            <span class="hljs-tag">&lt;<span class="hljs-name">li</span>&gt;</span>3<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">const</span> class1 = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'.class1'</span>);
        <span class="hljs-keyword">const</span> newDiv = <span class="hljs-built_in">document</span>.createElement(<span class="hljs-string">'div'</span>);
        newDiv.textContent = <span class="hljs-string">'hi, this is newDiv element'</span>;
        class1.prepend(newDiv); <span class="hljs-comment">//將newDiv作為class1的第一個子元素</span>
        class1.append(newDiv); <span class="hljs-comment">//將newDiv作為class1的最後一個子元素</span>
        class1.before(newDiv); <span class="hljs-comment">//將newDiv作為class1上方的兄弟元素 </span>
        class1.after(newDiv); <span class="hljs-comment">//將newDiv作為class1下方的兄弟元素</span>
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<h2 id="-">刪除元素</h2>
<h4 id="-remove-html-removechild-tricky-parentelement-">透過 <code>remove()</code> 可去除html內的元素，在前期版本因為只有 <code>removeChild()</code> ，所以需要使用tricky的方法，透過 <code>parentElement</code> 選取其父層元素。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"parent-class"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"child-class1"</span>&gt;</span>
            this is child class1
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"child-class2"</span>&gt;</span>
            this is child class2
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">const</span> childClass2 = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'.child-class2'</span>);
        childClass2.remove();

        <span class="hljs-comment">// childClass2.parentElement.removeChild(childClass2);  早期方法</span>
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<h2 id="-style-">改變/獲取Style資訊</h2>
<h4 id="-element-style-xxx-style-style-getcomputedstyle-">透過 <code>element.style.xxx</code> 來改變元素的style，倘若要獲取元素已存在的style資訊，可以透過 <code>getComputedStyle()</code> 來得到。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"parent-class"</span> <span class="hljs-attr">style</span>=<span class="hljs-string">"background-color:steelblue"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"child-class1"</span> <span class="hljs-attr">style</span>=<span class="hljs-string">"color:orangered"</span>&gt;</span>
            this is child class1
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"child-class2"</span>&gt;</span>
            this is child class2
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">const</span> parentClass = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">".parent-class"</span>);
        <span class="hljs-built_in">console</span>.log(getComputedStyle(parentClass).backgroundColor); <span class="hljs-comment">//"rgb(70, 130, 180)"</span>
        <span class="hljs-built_in">console</span>.log(getComputedStyle(parentClass).height); <span class="hljs-comment">//36px</span>
        parentClass.style.height = <span class="hljs-string">"40px"</span>;
        <span class="hljs-built_in">console</span>.log(getComputedStyle(parentClass).height); <span class="hljs-comment">//40ox</span>
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<h4 id="-css-file-css-variable-dom-">倘若CSS file內有設置CSS Variable，也可以透過DOM改變其內容。</h4>
<pre><code class="lang-js"><span class="hljs-regexp">//</span> -----------<span class="hljs-keyword">in</span> css file----------
<span class="hljs-regexp">//</span> :root{
<span class="hljs-regexp">//</span>     --color-primary: <span class="hljs-comment">#5ec576;</span>
<span class="hljs-regexp">//</span> }

document.documentElement.style.setProperty(<span class="hljs-string">'--color-primary'</span>, <span class="hljs-string">'orangered'</span>);
</code></pre>
<h2 id="html-attribute-">HTML 屬性(Attribute)</h2>
<h4 id="-element-attribute-element-attributename-element-getattribute-attributename-attribute-">要取得element內的attribute的方式有兩種，一種是為 <code>element.attributeName</code> 方式得到，另一種可以透過 <code>element.getAttribute(attributeName</code> )，兩種方式差異在於，若選取的attribute內容為文件位址時，第一種方式得到的是絕對位置，第二種得到的是相對位置。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">img</span> <span class="hljs-attr">src</span>=<span class="hljs-string">"img/picture.jpg"</span> <span class="hljs-attr">alt</span>=<span class="hljs-string">"my picture"</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"picture-1"</span> <span class="hljs-attr">data-img</span>=<span class="hljs-string">"1"</span> /&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">const</span> img = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'img'</span>);
        <span class="hljs-built_in">console</span>.log(img.src); <span class="hljs-comment">// file:///C:/Users/username/Desktop/xxxxxxxx/img/picture.jpg</span>
        <span class="hljs-built_in">console</span>.log(img.getAttribute(<span class="hljs-string">'src'</span>)); <span class="hljs-comment">// img/picture.jpg</span>
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<h2 id="html-data-attribute-">HTML 資料屬性 (Data Attribute)</h2>
<h4 id="-data-attribute-data-xxx-html-element-xxx-dom-element-dataset-xxx-">算是經常被使用的功能，將一些簡單的資料以data attribute(data-xxx)形式儲存在html element之內，其中xxx可以任意命名，並且透過DOM()方式( <code>element.dataset.xxx</code> )來存取。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">img</span> <span class="hljs-attr">src</span>=<span class="hljs-string">"img/picture.jpg"</span> <span class="hljs-attr">alt</span>=<span class="hljs-string">"my picture"</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"picture-1"</span> <span class="hljs-attr">data-img</span>=<span class="hljs-string">"1"</span> /&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">img</span> <span class="hljs-attr">src</span>=<span class="hljs-string">"img/picture2.jpg"</span> <span class="hljs-attr">alt</span>=<span class="hljs-string">"my picture"</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"picture-1"</span> <span class="hljs-attr">data-img</span>=<span class="hljs-string">"2"</span> /&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">img</span> <span class="hljs-attr">src</span>=<span class="hljs-string">"img/picture3.jpg"</span> <span class="hljs-attr">alt</span>=<span class="hljs-string">"my picture"</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"picture-1"</span> <span class="hljs-attr">data-img</span>=<span class="hljs-string">"3"</span> /&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">const</span> imgs = <span class="hljs-built_in">document</span>.querySelectorAll(<span class="hljs-string">'img'</span>);
        <span class="hljs-comment">// 也可以透過data-attribute選取特定元素</span>
        <span class="hljs-comment">// imgs = document.querySelectorAll('img[data-img]') </span>
        imgs.forEach(<span class="hljs-function"><span class="hljs-params">el</span> =&gt;</span> <span class="hljs-built_in">console</span>.log(el.dataset.img));
        <span class="hljs-comment">//1</span>
        <span class="hljs-comment">//2</span>
        <span class="hljs-comment">//3</span>
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<h2 id="class-">Class的用法</h2>
<h4 id="-element-classlist-xxx-class-">透過 <code>element.classList.xxx</code> 對該元素做新增、刪除、切換class等功能。</h4>
<pre><code class="lang-js">
element.classList.add(<span class="hljs-string">'a'</span>); <span class="hljs-regexp">//</span> 新增<span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">a</span> 至<span class="hljs-title">element</span>元素</span>
element.classList.remove(<span class="hljs-string">'c'</span>); <span class="hljs-regexp">//</span>將a <span class="hljs-class"><span class="hljs-keyword">class</span>自<span class="hljs-title">element</span>元素內移除</span>
element.classList.toggle(<span class="hljs-string">'c'</span>);  
element.classList.contains(<span class="hljs-string">'c'</span>);

<span class="hljs-regexp">//</span> Be careful to use this
element.className = <span class="hljs-string">'rick'</span>; <span class="hljs-regexp">//</span> 將會覆蓋元素既有的<span class="hljs-class"><span class="hljs-keyword">class</span>，因此該元素只有<span class="hljs-title">rick</span>這個<span class="hljs-title">class</span></span>
</code></pre>
<h2 id="-">事件監聽的種類</h2>
<h4 id="-addeventlistener-onevent-event-"><code>addEventListener</code> 可以重複使用，而第二種方法 <code>.onevent</code> 重複使用會覆蓋前一個event，現在大多都使用第一種方式來定義元素的事件處理器。</h4>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> h1 = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'h1'</span>);

h1.addEventListener(<span class="hljs-string">'mouseenter'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">e</span>) </span>{
    alert(<span class="hljs-string">'addEventListener: Great!'</span>);
});

h1.onmouseenter = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">e</span>) </span>{ <span class="hljs-comment">// old school way</span>
    alert(<span class="hljs-string">'addEventListener: Great!'</span>);
};
</code></pre>
<h4 id="-event-listener-removeeventlistener-">若要將Event Listener 移除的話可以透過 <code>removeEventListener</code> 來達到。</h4>
<pre><code class="lang-html"><span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"parent-class"</span> <span class="hljs-attr">style</span>=<span class="hljs-string">"background-color:steelblue"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"child-class1"</span> <span class="hljs-attr">style</span>=<span class="hljs-string">"color:orangered"</span>&gt;</span>
            this is child class1
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">const</span> child1 = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">'.child-class1'</span>);
        <span class="hljs-keyword">const</span> eventHandler = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">e</span>) </span>{
            <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'this is click event'</span>);
        }
        child1.addEventListener(<span class="hljs-string">'click'</span>, eventHandler);
        setTimeout(<span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> {              <span class="hljs-comment">// 5秒後移除child1內的事件處理器</span>
            <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'child1 event handler is removed!'</span>)
            child1.removeEventListener(<span class="hljs-string">'click'</span>, eventHandler);
        }, <span class="hljs-number">5000</span>)
    </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
</code></pre>
<h4 id="-html-javascript-htlm-">第三種方法則是在HTML文件中添加，但此方法並不被鼓勵使用，畢竟還是希望JavaScript與HTLM文件可以分離開來。</h4>
<pre><code class="lang-html">&lt;<span class="hljs-selector-tag">h1</span> onClick=<span class="hljs-string">"alert('h1 is clicked')"</span>&gt;
    Hi, This is <span class="hljs-selector-tag">header</span> <span class="hljs-number">1</span>.
&lt;/h1&gt;
</code></pre>

  

        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}