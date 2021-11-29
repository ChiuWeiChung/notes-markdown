# 關於 Lazy Loading

Lazy loading means that we load certain chunks of our code certain parts of our code only when that code is needed. Because it is super important to keep in mind that with a React Single Page Application, you in the end, build one big JavaScript code bundle, and this entire bundle needs to be downloaded by every visitor of your website in order to use that site. if I enter local host free thousand here and I visit this page, all that React code that needs to be downloaded in order for React to draw all this user interface on the screen and in order for this to be reactive. So therefore, this all what we see here and what we use here only works once all our code was downloaded. 
And that means that a user, a visitor of our website has to wait until all that code was downloaded until he or she sees something on the screen, and until our web application is usable. And therefore, we wanna ensure that this initial code bundle this initial first code bundle, which is downloaded is as small as possible and certain parts of our code

<!--  -->
And that's therefore what lazy loading is about. We wanna split our code into multiple chunks, into multiple bundles, which are then each
only downloaded when they are needed. And lazy loading is easy to implement if you are using routing because you can then split your code by route. So that the code for a specific route is only downloaded when that route is visited.


<!--  -->

For example, let's say, we only wanna download the code for this new quote component, when a user really visits this Route. For this we can remove this import of new quote and instead add constant named new quote. I picked this constant name because I'm using new quote here, down here when I rendered this component. Now in here, I now wanna store the result of calling React.lazy. That's a built-in method that will help us with code splitting. React lazy then once of function, and here I use an inline arrow function, which resolves to a dynamic import. 
And this syntax might look strange now, but that is a standard modern JavaScript syntax, which is supported by this React project set up in the end. Here as a result of this function, this anonymous function which are defined here, we call import as a function. So here we use the import statement like this, now we call import as a function. And cutest function we pass the path of this import.

<!--  -->

Now with this alone though, it wouldn't work. With this if we reload and click on add a quote, we fail here and if I directly try to visit slash new quote we get an error, that **A React component suspended while rendering, but no fallback UI was specified.** Now, what does this mean?
And where is this error coming from? The problem we have here is that we are downloading this code only when it's needed. That's the entire idea behind lazy loading. But the problem with that of course, is that this download can take a couple of milliseconds or even seconds maybe. Now, whilst we're downloading this code, React is of course not able to continue, we can't load this component yet until the download completed. And that's why we need to define a fallback UI, some fallback content which can be shown if this download takes a bit longer. And for this, we need to import another thing from React, we need to import the suspense component. A special component provided by the React library itself. We need to wrap this around the code, where we use React lazy.