
export const render = ()=>{
    const title = "利用fetch()串接API";
    const url = "#javascript/AJAX_FETCH";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
        <h1 id="javascript-ajax-fetch">JavaScript-AJAX FETCH</h1>
        <h4 id="-ajax-fetch-api-then-catch-">這篇主要紀錄使用AJAX <code>fetch()</code>來串接外部API的心得，以下以<code>.then()</code>&amp;<code>catch()</code>來做示範</h4>
        <pre><code class="lang-js"><span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getWeather</span>(<span class="hljs-params">woeid</span>)</span>{
                fetch(<span class="hljs-string">\`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/<span class="hljs-subst">\${woeid}</span>/\`</span>) <span class="hljs-comment">// using cors proxy to bypss the cors issue</span>
                .then(<span class="hljs-function">(<span class="hljs-params">result</span>)=&gt;</span>{
                    <span class="hljs-comment">// console.log(result);</span>
                    <span class="hljs-keyword">return</span> result.json()
                })
                .then(<span class="hljs-function">(<span class="hljs-params">data</span>)=&gt;</span>{
                    <span class="hljs-comment">// console.log(data);</span>
                    <span class="hljs-keyword">const</span> today = data.consolidated_weather[<span class="hljs-number">0</span>];
                    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`Temperature in <span class="hljs-subst">\${data.title}</span> stay between <span class="hljs-subst">\${today.min_temp}</span> and <span class="hljs-subst">\${today.max_temp}</span>\`</span>)
                })
                .catch(<span class="hljs-function">(<span class="hljs-params">error</span>)=&gt;</span>{
                    <span class="hljs-built_in">console</span>.log(error)
                })
        };
        getWeather(<span class="hljs-number">4118</span>);
        </code></pre>
        <h4 id="-es8-async-await-function-try-catch-">當然，也可以使用ES8的Async Await Function來改寫上述程式碼，並且透過<code>try</code>&amp;<code>catch()</code>處理可能會出現的錯誤:</h4>
        <pre><code class="lang-js"><span class="hljs-keyword">async</span> <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getWeatherAW</span>(<span class="hljs-params">woeid</span>)</span>{
                <span class="hljs-keyword">try</span>{
                    <span class="hljs-keyword">const</span> result = <span class="hljs-keyword">await</span> fetch(<span class="hljs-string">\`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/<span class="hljs-subst">\${woeid}</span>/\`</span>);
                    <span class="hljs-keyword">const</span> data = <span class="hljs-keyword">await</span> result.json();
                    <span class="hljs-keyword">const</span> today = data.consolidated_weather[<span class="hljs-number">0</span>];     
                    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\`Temperature in <span class="hljs-subst">\${data.title}</span> stay between <span class="hljs-subst">\${today.min_temp}</span> and <span class="hljs-subst">\${today.max_temp}</span>\`</span>)
                    <span class="hljs-keyword">return</span> data;
                } <span class="hljs-keyword">catch</span>(error){
                    <span class="hljs-built_in">console</span>.log(error);
                }
        };
        
        getWeatherAW(<span class="hljs-number">2471217</span>);
        getWeatherAW(<span class="hljs-number">2388929</span>).then(<span class="hljs-function">(<span class="hljs-params">data</span>)=&gt;</span>{
            <span class="hljs-built_in">console</span>.log(data);
        });
        </code></pre>
        


        </div>
    </div>
    `;
    // elements.board.insertAdjacentHTML("afterbegin",markup);

    return {title,markup,url};
}