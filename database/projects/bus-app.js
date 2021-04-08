export const render = ()=>{
    const title = "我的Portfolio-公車動態資訊查詢APP";
    const url = "#projects/Bus-App";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="-portfolio-app">我的Portfolio-公車動態資訊查詢APP</h1>
<h2 id="-bus-app-demo-http-chiuweichung-github-io-busapp-"><a href="http://chiuweichung.github.io/BusApp">Bus App DEMO</a></h2>
<h4 id="-app-app-">這次的專案主要起源於本身是個搭公車的通勤族，上下班前都需要查詢公車的動態，所以才決定自己也來開發一個App，雖然這樣的App比比皆是(而且更靈活、更美觀)，但主要也是想檢視自己學習到目前內化了多少，算是一個小小成果。</h4>
<h2 id="ptx-open-api-google-maps-api">PTX Open API 以及 Google Maps API</h2>
<h4 id="-app-api-ptx-api-google-maps-api-ptx-api-render-google-map-">在這個App中，串接了兩個API，一個是交通部PTX API，另一個是Google Maps API，當輸入公車號碼時，會先透過PTX API得到該公車的資訊(停靠站、公車位置、抵達時間...)，再將該公車以及站牌的位置render在Google Map上面。</h4>
<h2 id="-">心得</h2>
<h4 id="-api-document-document-library-data-structure-api-documents-api-">目前為止，我認為串接API最關鍵的地方在於有沒有熟讀它的Document(說明書)，Document基本上都會告知有哪些參數需要輸入，或是有拿些Library可以使用來優化data structure，未來可能會繼續接觸不同的API，並且累積閱讀Documents的能力，以後再接觸陌生的框架或是API時比較可以在短時間內上手</h4>
<h2 id="source-code">Source Code</h2>
<h4 id="-app-source-code-my-github-http-chiuweichung-github-io-busapp-code-refactoring-">在這裡提供該App的Source Code, <a href="https://github.com/ChiuWeiChung/BusApp">My Github</a>，Code目前僅進行部分的Refactoring，過段時間會再回來進行重新翻修</h4>
        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}