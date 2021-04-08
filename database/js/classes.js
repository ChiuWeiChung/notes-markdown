
export const render = ()=>{
    const title = "Prototype的語法糖 Class";
    const url="#javascript/class";
    const markup = `
    <div class="article-column" >
        <div class="board container-fluid note-content mt-4">
            <h1 id="es6-classes">[ES6筆記]-Classes</h1>
            <p> <code>來自Jonas&#39;s The Complete JavaScript Course 2020:Build Real Projects的學習心得</code></p>
            <h4 id="-es5-function-constructor-code-">在ES5的版本，若要建立Function constructor，主要以下方code為例</h4>
            <pre><code class="lang-js"><span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">Person5</span>(<span class="hljs-params">name,yearOfBirth,job</span>)</span>{
            <span class="hljs-keyword">this</span>.name=name;
            <span class="hljs-keyword">this</span>.yearOfBirth=yearOfBirth;
            <span class="hljs-keyword">this</span>.job=job;
            };

            Person5.prototype.calcAge=<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
            <span class="hljs-keyword">var</span> age = <span class="hljs-keyword">new</span> <span class="hljs-built_in">Date</span>().getFullYear()-<span class="hljs-keyword">this</span>.yearOfBirth;
            <span class="hljs-built_in">console</span>.log(age);

            };

            <span class="hljs-keyword">var</span> john5 = <span class="hljs-keyword">new</span> Person5(<span class="hljs-string">"John"</span>,<span class="hljs-number">1993</span>,<span class="hljs-string">"teacher"</span>);
            </code></pre>
            <h4 id="-es6-class-prototype-based-from-mdn-hoist-">但是在ES6版本，出現針對現有的Prototype-based繼承的語法糖，即為"class"，我們可以更簡易的方法來建立物件及繼承;但特別要注意的是沒有Hoist機制，因此宣告時需特別注意</h4>
            <pre><code class="lang-js"><span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Person6</span></span>{
            <span class="hljs-keyword">constructor</span>(name,yearOfBirth,job){
                <span class="hljs-keyword">this</span>.name=name;
                <span class="hljs-keyword">this</span>.yearOfBirth=yearOfBirth;
                <span class="hljs-keyword">this</span>.job=job;
            }

            calcAge(){
                <span class="hljs-keyword">var</span> age = <span class="hljs-keyword">new</span> <span class="hljs-built_in">Date</span>().getFullYear()-<span class="hljs-keyword">this</span>.yearOfBirth;
                <span class="hljs-built_in">console</span>.log(age);
            }
            <span class="hljs-comment">// static is attached to the class, it won't be inherited by class instances</span>
            <span class="hljs-keyword">static</span> sayHi(){         
                <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"hihi"</span>);
            }
            };

            <span class="hljs-keyword">const</span> john6 = <span class="hljs-keyword">new</span> Person6(<span class="hljs-string">"John"</span>,<span class="hljs-number">1995</span>,<span class="hljs-string">"engineer"</span>);
            </code></pre>
            <h4 id="-class-class-static-functionname-">利用class，物件以及函數的建立可以一次到位，若不希望class內的函數被繼承，可以使用static functionName()</h4>
            <h3 id="-class-">如何繼承Class?</h3>
            <h4 id="-es5-athlete5-person5-">在ES5中，若Athlete5要繼承Person5的內容，以下方為例:</h4>
            <pre><code class="lang-js">                    <span class="hljs-comment">// ES5</span>
            <span class="hljs-comment">// 建立Person5</span>
            <span class="hljs-keyword">var</span> Person5 = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">name,yearOfBirth,job</span>)</span>{
            <span class="hljs-keyword">this</span>.name=name;
            <span class="hljs-keyword">this</span>.yearOfBirth=yearOfBirth;
            <span class="hljs-keyword">this</span>.job=job;
            };
            Person5.prototype.calculateAge=<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
            <span class="hljs-keyword">var</span> age = <span class="hljs-keyword">new</span> <span class="hljs-built_in">Date</span>().getFullYear()-<span class="hljs-keyword">this</span>.yearOfBirth;
            <span class="hljs-built_in">console</span>.log(age);
            };

            <span class="hljs-comment">// 利用Call()來串接Person5的建構子(constructor)</span>
            <span class="hljs-keyword">var</span> Athlete5 = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">name,yearOfBirth,job,olympicGames,medals</span>)</span>{
            Person5.call(<span class="hljs-keyword">this</span>,name,yearOfBirth,job)
            <span class="hljs-keyword">this</span>.olympicGames=olympicGames;
            <span class="hljs-keyword">this</span>.medals=medals;
            };

            <span class="hljs-comment">// 使用 Object.create() 去實現類別繼承</span>
            Athlete5.prototype = <span class="hljs-built_in">Object</span>.create(Person5.prototype);

            Athlete5.prototype.wonMedal = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{
            <span class="hljs-keyword">this</span>.medals++;
            <span class="hljs-built_in">console</span>.log(<span class="hljs-keyword">this</span>.medals);
            }

            <span class="hljs-keyword">var</span> john =<span class="hljs-keyword">new</span> Athlete5(<span class="hljs-string">"John"</span>,<span class="hljs-number">1933</span>,<span class="hljs-string">"Swimmer"</span>,<span class="hljs-number">3</span>,<span class="hljs-number">10</span>)
            </code></pre>
            <h4 id="-es6-class-">在ES6中，可以使用Class方式，讓繼承更加簡潔有力</h4>
            <pre><code class="lang-js">                        <span class="hljs-comment">//  ES6</span>
            <span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Person6</span> </span>{
            constructor(name,yearOfBirth,job){
                <span class="hljs-keyword">this</span>.name=name;
                <span class="hljs-keyword">this</span>.yearOfBirth=yearOfBirth;
                <span class="hljs-keyword">this</span>.job=job;
            }
            calculateAge(){
                <span class="hljs-keyword">var</span> age = <span class="hljs-keyword">new</span> <span class="hljs-type">Date</span>().getFullYear()-<span class="hljs-keyword">this</span>.yearOfBirth;
                console.log(age);
            }
            };
            <span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Athlete6</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">Person6</span> </span>{
            constructor(name, yearOfBirth, job, olympicGames, medals){
                <span class="hljs-keyword">super</span>(name, yearOfBirth, job);
                <span class="hljs-keyword">this</span>.olympicGames=olympicGames;
                <span class="hljs-keyword">this</span>.medals=medals;
            }
            wonMedal(){
                <span class="hljs-keyword">this</span>.medals++;
                console.log(<span class="hljs-keyword">this</span>.medals);
            }
            }

            const johnAthlete6 = <span class="hljs-keyword">new</span> <span class="hljs-type">Athlete6</span>(<span class="hljs-string">"John"</span>,<span class="hljs-number">1990</span>,<span class="hljs-string">"Swimmer"</span>,<span class="hljs-number">3</span>,<span class="hljs-number">10</span>);
            johnAthlete6.wonMedal();
            johnAthlete6.calculateAge();
            </code></pre>                                                           


        </div>
    </div>
    `;

    return {title,markup,url};
}