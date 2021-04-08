// javascript notes
import * as knowJs1 from "./js/knowJs1";
import * as knowJs2 from "./js/knowJs2";
import * as knowJs3 from "./js/knowJs3";
import * as knowJs4 from "./js/knowJs4";
import * as iffe from "./js/iffe";
import * as closure from "./js/closure";
import * as knowJs5 from "./js/knowJs5";
import * as knowJs6 from "./js/knowJs6";
import * as classes from "./js/classes";
import * as async1 from "./js/async1";
import * as async2 from "./js/async2";
import * as async3 from "./js/async3";
import * as webapis from "./js/webapis";
import * as cors from "./js/cors";
import * as fetch from "./js/fetch";
import * as bubbling from "./js/bubbling";
import * as dom from "./js/dom";
import * as intersectionobserver from "./js/intersectionobserver";
import * as prototype1 from "./js/prototype1";
import * as prototype2 from "./js/prototype2";
import * as scriptLoading from "./js/scriptloading";
// project notes
import * as busApp from "./projects/bus-app";

export const  data = {
  "javascript": [
    {
      "title": scriptLoading.render().title,
      "url": scriptLoading.render().url,
      "html": scriptLoading.render().markup,
      "date" :20201217,
      "desc" : "HTML檔案內的script tag，其存放位置會影響到JavaScript code的執行時機，當開啟一網頁時，HTML文件會從最頂部(head)開始並逐一往底部進行解析(Parse)，當解析完畢時，也就是DOMcontentLoaded事件發生的時機，而關於DOMContentLoaded事件，在[MDN](https://developer.mozilla.org/zh-TW/docs/Web/Events/DOMContentLoaded)中的解釋是 `當document被完整的讀取跟解析後就會被觸發,不會等待 stylesheets, 圖片和subframes完成讀取` ，也就是HTML檔案由上至下完整被解析後才會觸發。"
    },
    {
      "title": prototype2.render().title,
      "url": prototype2.render().url,
      "html": prototype2.render().markup,
      "date" :20201211,
      "desc" : "在JavaScript的Prototype觀念中有談到Prototype的觀念以及物件是如何調用methods，而在這裡會記錄JavaScript中的如何建立Constructor(建構子)，並且透過Constructor來將物件實體化，並連結它的prototype。"
    },
    {
      "title": prototype1.render().title,
      "url": prototype1.render().url,
      "html": prototype1.render().markup,
      "date" :20201210,
      "desc" : "物件導向語言(OOP)是基於 <code>物件(object)</code> 的一種編寫程式典範(風格)，透過物件，可以用來描述某些抽象或是實體的特徵(某人的出生日、學歷、姓名或是某台車的廠牌、排氣量、馬力)，物件除了可以包含上述資料(properties)以外，還可以包含methods(計算某人的年齡、車子踩油門/剎車後的速度)，而OOP之所以被發展出來，是為了使程式碼更有組織、彈性且容易維護，雖然JavaScript並不是典型的OOP，但在行為及概念上其實有些神似之處。"
    },
    {
      "title": bubbling.render().title,
      "url": bubbling.render().url,
      "html": bubbling.render().markup,
      "date" :20201203,
      "desc" : "所謂的冒泡事件，指的是當子元素的DOM Event被觸發時，引起父層元素、祖父元素、曾祖父元素... 的監聽事件也隨後被觸發，如[我的Codepen](https://codepen.io/rickchiu/pen/abmdYMW)所呈現，整個html結構有外而內分別是html、body、外層div、中間層div、內層div，當我分別在三層div中都加入 `click` 的event後，其callback function會將改變該元素的background-color，可以發現倘若點擊內層元素div時，中間層以及外層的event handler也被執行，這就是所謂的冒泡事件，`內層事件觸發也會引起父層元素事件被觸發。"
    },
    {
      "title": intersectionobserver.render().title,
      "url": intersectionobserver.render().url,
      "html": intersectionobserver.render().markup,
      "date" :20201126,
      "desc" : "當使用者開啟網頁時，瀏覽器會將所有的內容全部render出來，倘若頁面含有大量圖片時，會因為太多複雜資訊要存取而導致等待時間拉長，假如可以在一開始將文字內容先呈現給使用者，待使用者滑動頁面到有圖片的元素時再渲染給使用者，如此一來可以減少使用者初次打開網頁的等待時間。在過去可以透過 `addEventListener()` 監聽 `scroll` 事件，並以 `getBoundingClientRect()` 得知目標元素的相對位置，如下方程式碼，然而卷軸每一次的滾動都會使callback function執行，滾動一次就會呼叫 `getBoundingClientRect()` 重新計算目標元素的位置，如此一來會降低網頁效能，造成不好的使用者體驗，也因此，Intersection Observer API的出現解決了這樣的窘境。"
    },
    {
      "title": dom.render().title,
      "url": dom.render().url,
      "html": dom.render().markup,
      "date" :20201123,
      "desc" : "進行DOM manipulation時，有許多方法可以選取html內的element，需要注意的是，透過 document.querySelectorAll()`所回傳的資料內容是靜態的，後續對該元素進行DOM操作不會改變該變數的內容。"
    },
    {
      "title": closure.render().title,
      "url": closure.render().url,
      "html": closure.render().markup,
      "date" :20201115,
      "desc" : "學習Closure之後，要一句話解釋它的話，應該是`函式能夠存取當初被創造(宣告)當下所處位置(scope)的變數`，惡搞一點的說法就是讓函式能`飲水思源`，下方的程式碼做舉例，當函數`scoreCounting`執行後回傳另一涵式至`getScore`內部，即使`getScore`是在外部(global environment=)被宣告的，且`scoreCounting`已經執行結束的情況下，`getScore`在執行後仍能存取`scoreCounting`作用域內的`score`，原因在於函式能夠存取變數與否是由它的`出生地`所決定的，而`getScore`內部的函式是在`scoreCounting`作用域的內部被創造出來，也因此能夠存取`socre`變數。"
    },
    {
      "title": iffe.render().title,
      "url": iffe.render().url,
      "html": iffe.render().markup,
      "date" :20201113,
      "desc" : "在[Scope筆記](/#javascript/knowJs3)當中有談到，函式會產生scope，因此在函式外部無法存取函式內部的變數，也因此，在scope內部的資料是安全、保有隱私的。在編寫程式時，資料的保護是非常重要的事，我們需要盡可能地去避免資料(如variables)被外人存取、甚至是覆寫。"
    },
    {
      "title": knowJs1.render().title,
      "url": knowJs1.render().url,
      "html": knowJs1.render().markup,
      "date" :20201026,
      "desc" : "如果搜尋維基百科上的JavaScript，第一段對他的解釋就是: JavaScript often abbreviated as JS, is a programming language that conforms to the ECMAScript specification. JavaScript is `high-level`, often `just-in-time compiled`, and `multi-paradigm`. It has curly-bracket syntax, `dynamic typing`, `prototype-based object-orientation`, and `first-class functions`."
    },
    {
      "title": knowJs2.render().title,
      "url": knowJs2.render().url,
      "html": knowJs2.render().markup,
      "date" :20201028,
      "desc" : "因上一篇提到，JavaScript的source code需要靠Interpreter轉換成電腦可以理解的語言，並且由`1.JavaScript Engine`來提供的Execution Stack來執行，也就是說，沒有JS Engine就無法執行JavaScript code，但擁有Engine是不夠的，為了運作得更順暢，我們還需要`2.WEB APIs`以及`3.Callback Queue`。"
    },
    {
      "title": knowJs3.render().title,
      "url": knowJs3.render().url,
      "html": knowJs3.render().markup,
      "date" :20201103,
      "desc" : "在學習JavaScript的初期，會時常出現的情況: &quot;甚麼!，我明明有宣告它阿，為何無法透過console.log()印出來呢??&quot;，後面才知道Scope(範疇 or 作用域)的觀念有多重要，深深影響我們在哪裡可以讀取變數、哪裡不能讀取變數，有了這個觀念就可以大幅減少console中出現Reference error的悲劇，下面針對幾點專有名詞做紀錄:"
    },
    {
      "title": knowJs4.render().title,
      "url": knowJs4.render().url,
      "html": knowJs4.render().markup,
      "date" :20201106,
      "desc" : "透過function declaration宣告的函式在宣告前就可以存取它，因為呼叫過程中會被hoist，如下方範例:"
    },
    {
      "title": knowJs5.render().title,
      "url": knowJs5.render().url,
      "html": knowJs5.render().markup,
      "date" :20201109,
      "desc" : "這個主題在JavaScript中大概是最熱門及被討論的主題之一，在使用上有它的實用性，但也是最容易被誤解的keyword，這篇就針對JavaScript的this記錄學習筆記。"
    },
    {
      "title": knowJs6.render().title,
      "url": knowJs6.render().url,
      "html": knowJs6.render().markup,
      "date" :20201111,
      "desc" : "在Javscript中大致上可分為兩大型別所組成，一是基本型別，包含Number、String、Boolean、Undefined、Null、Symbol、BigInt;另一個型別是物件型別，包含Object Literal、Array、Functions....。"
    },
    {
      "title": classes.render().title,
      "url": classes.render().url,
      "html": classes.render().markup,
      "date" :20201005,
      "desc" : "classes"
    },
    {
      "title": async1.render().title,
      "url": async1.render().url,
      "html": async1.render().markup,
      "date" :20201011,
      "desc" : "一般而言，在使用JavaScript串接外部網路的資料，就很難避免使用到Asynchronous JavaScript，然而何謂Asynchronous ? Synchronous? 這邊就先從我們最常接觸的 Synchronous JavaScript談起好了，如下方程式碼:"
    },
    {
      "title": async2.render().title,
      "url": async2.render().url,
      "html": async2.render().markup,
      "date" :20201013,
      "desc" :"在Asynchronous_PART 1中有談到令程式碼難以維護的Callback Hell，但若透過ES6中的 <code>new Promise()</code>可以使程式碼更有組織。"
    },
    {
      "title": async3.render().title,
      "url": async3.render().url,
      "html": async3.render().markup,
      "date" :20201019,
      "desc" :"承接PART2的結尾，雖然Promise讓程式碼更有組織以及容易閱讀，但ES8(ES2017)提供了更簡易、方便的方法，也就是Async Await，這次透過宣告Async Function (在函數前面加上Async字眼)，在內部我們將Promise的物件前面加上Await，執行過程中，只要一遇到Await的Promise，程式碼會暫停直到Promise完成並將resolve()內部資料傳回並放置在變數(IDs、recipe1、recipe2)"
    },
    {
      "title": webapis.render().title,
      "url": webapis.render().url,
      "html": webapis.render().markup,
      "date" :20201020,
      "desc" :"API想必聽來並不陌生，英文全名是(Application Programming Interfer, 應用程式介面)，第一次看到這名詞時，很難去從字面了解他的用途，網路上解釋也很多種，;若要一句話簡單介紹的話，大概就是`[軟體與軟體之間的互動橋樑]`，開發者(developers)可以透過API將特定的功能添加到自己開發的軟體當中(添加已設計好的功能，而不用自己設計)，由於這裡是前端技術的筆記，所以會針對Web Service Api做探討"
    },
    {
      "title": cors.render().title,
      "url": cors.render().url,
      "html": cors.render().markup,
      "date" :20201025,
      "desc" :"會寫這個主題主要是因為之前在chrome的console頁利用Ajax <code>fetch()</code>來提取API資料時，遇到CORS(Cross Origin Resource Sharing, 跨來源資源共用)的問題，如下方程式碼:"
    },
    {
      "title": fetch.render().title,
      "url": fetch.render().url,
      "html": fetch.render().markup,
      "date" :20201028,
      "desc" :"這篇主要紀錄使用AJAX `fetch()`來串接外部API的心得，以下以`.then()`&`catch()`來做示範"

    }
  ],
  "projects":[
    {
      "title": busApp.render().title,
      "url": busApp.render().url,
      "html": busApp.render().markup,
      "date" :20210127,
      "desc" :"這次的專案主要起源於本身是個搭公車的通勤族，上下班前都需要查詢公車的動態，所以才決定自己也來開發一個App，雖然這樣的App比比皆是(而且更靈活、更美觀)，但主要也是想檢視自己學習到目前內化了多少，算是一個小小成果。"
    }
  ],
}