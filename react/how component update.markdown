```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

const DemoOutput = (props) => {
  console.log("Demo Component");
  return <p>{props.show ? "Hakuna Matata" : null}</p>;
};

const Button = (props) => {
  console.log("Button Component");
  return <button onClick={props.onClick}>{props.children}</button>;
};

const App = () => {
  const [showParagraph, setShowParagraph] = useState(false);
  console.log("App running");
  return (
    <div className="app">
      <h1>I love The Lion King</h1>
      <DemoOutput show={showParagraph} />
      <Button onClick={() => setShowParagraph((prevState) => !prevState)}>
        Click me
      </Button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

將 `DemoOutput` 的 `show props` 改為 `false` ，

when I click Toggle Paragraph. If I do that, you see app running, okay, we changed the state there
but you also see DemoOutput running. And that's interesting. The props didn't change, right?

So why was DemoOutput re-executed? Well, let's take it step by step. The app function is re-executed because state changed here.
Now, what is part of that app function? Of course, this return statement and there we return some js code.
Now, all those js elements here in the end are like function calls to the respect of component functions.
So we call the function for the DemoOutput component. We call the function for the button component.
That's why those child components are also re-executed and re-evaluated just because the parent component changed
because they are part of the parent components, function body. And if the parent component function runs again
of course the child component functions also run again. So in the end, the prop value doesn't even matter here for this component to be executed again, 
it's just a fact that the parent changed. Changes in props might lead to actual changes on the real Dom but for the function to be re-evaluated
it's enough that the parent component was re-evaluated. Of course, the fact that DemoOutput runs again does not mean that the real Dom is touched.

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

const DemoOutput = (props) => {
  console.log("Demo Component");
  return <p>{props.show ? "Hakuna Matata" : null}</p>;
};

const Button = (props) => {
  console.log("Button Component");
  return <button onClick={props.onClick}>{props.children}</button>;
};

const App = () => {
  const [showParagraph, setShowParagraph] = useState(false);
  console.log("App running");
  return (
    <div className="app">
      <h1>I love The Lion King</h1>
      <DemoOutput show={false} />
      <Button onClick={() => setShowParagraph((prevState) => !prevState)}>
        Click me
      </Button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

# Issue

This of course brings up one question though, here we have a very simple app just one route component with two child components which they don't have any more child components.
if they would have child components though those child components would also be re-evaluated.

Well, this certainly costs some performance. Of course, we got ongoing function executions. We got a virtual comparison.
It's needless to say that React is highly optimized for those executions and comparisons. So in a lot of apps, 
and especially in simple apps like this one, this will absolutely not matter. Nonetheless, in bigger apps, you might want to optimize that.
And, therefore, you as a developer can tell React that it should only re-execute this DemoOutput component
under certain circumstances. And those circumstances would be that the props, which this component received, 
changed, for example. So that if I bring back show={false} here, React actually checks if the show value changed, 
and only if that's the case, it will re-execute DemoOutput. That might be closer to the behavior we want.

## Solve Problem

How can we tell React that it should behave like this? Well, we have to go to the component for which we wanna opt into that did the prop change check.
And we simply wrap our component, for example, here in the export line with React.memo.
This is for functional components. For class-based components, this does not work. But I'll take a closer look at class-based components
and how to optimize those in the class-based component section later down in the course.
Since we can basically work with only functional components, class-based components are not the focus here.

Now, what does memo do? It tells React that for this component, which it gets as a argument, 
React should look at the props this component gets and check the new value for all those props and compare it to the previous value those props got.
And only if the value of a prop changed, the component should be re-executed and re-evaluated. And if the parent component changed
but the prop values for that component here did not change, component execution will be skipped.

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

const DemoOutput = React.memo((props) => {
  console.log("Demo Component");
  return <p>{props.show ? "Hakuna Matata" : null}</p>;
});

const Button = (props) => {
  console.log("Button Component");
  return <button onClick={props.onClick}>{props.children}</button>;
};

const App = () => {
  const [showParagraph, setShowParagraph] = useState(false);
  console.log("App running");
  return (
    <div className="app">
      <h1>I love The Lion King</h1>
      <DemoOutput show={false} />
      <Button onClick={() => setShowParagraph((prevState) => !prevState)}>
        Click me
      </Button>
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("root"));
```

## Cost

Why aren't we using that on all components if it allows us to optimize them? Because this optimization comes at a cost.
The memo method here tells React that whenever the App component changed, it should go to this component here
and compare the new prop values to the previous prop values, so therefore React needs to do two things.
It needs to store the previous prop values, and it needs to make that comparison. And that, of course, also has its own performance cost.
And it, therefore, greatly depends on the component you're applying this to whether it's worth it or not because you're trading the performance cost
of re-evaluating the component for the performance cost of comparing props. And it's impossible to say which cost is higher
because it depends on the number of props you have and on the complexity of your component and the number of child components your component has.
Of course, React.memo can be a great tool if you have a huge component tree with a lot of child components. And on a high level in the component tree, 
you can avoid unnecessary re-render cycles for the entire branch of the component tree.

## Issue 2

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

const DemoOutput = React.memo((props) => {
  console.log("Demo Component");
  return <p>{props.show ? "Hakuna Matata" : null}</p>;
});

const Button = React.memo((props) => {
  console.log("Button Component");
  return <button onClick={props.onClick}>{props.children}</button>;
});

const App = () => {
  const [showParagraph, setShowParagraph] = useState(false);
  console.log("App running");
  return (
    <div className="app">
      <h1>I love The Lion King</h1>
      <DemoOutput show={false} />
      <Button onClick={() => setShowParagraph((prevState) => !prevState)}>
        Click me
      </Button>
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("root"));
```

For that, let's go to Button and use React.memo down here and wrap our Button component with it. Now, you will see something interesting if you do that.
If you save that and reload the app, of course, initially, we see Button RUNNING. But now if we click Toggle Paragraph, 
we, again, see Button RUNNING. Why is that happening? That makes no sense, right? Well, we see Button RUNNING again and again
because, actually, its prop values did change. That's strange, right? If we have a look at that, it only gets one prop, onClick, 
or, actually, two props, the children here, but both prop values never change. We always have the same text, 
and we always have the same function, right? Well, this is one of the most common gotchas with React. Keep in mind that this App component
is just a function in the end, and it re-executes like a normal JavaScript function because it is a normal JavaScript function
if your state changes. The only magic thing here is that the function's going to be called by React and not by you.
But then, it still executes like a normal function, which means all that code executes again, and that has one important implication.
Of course, this function which you pass to the Button is re-created. This is now a brand new function for every render 
or every execution cycle of the App function because in the end it's just a normal constant which we recreate.

## Primitive vs Object

All that code in here is executed again, so, of course, a new function is created. This is not the same function all the time.
It's a function that does the same thing. But technically to JavaScript, it's a brand new function for every time the App function is being executed.
That's, by the way, also truefor false being passed to DemoOutput. Previously, I said that this never changes, 
even that technically was not correct. This App function is re-executed, therefore a new false value is created.
So even if we had false in the last render cycle too, now we have a new false. But if that's the case, why does React.memo then work
on the DemoOutput but not on the button? What's the difference between false and the function here? If a new false is created and a new function is created, 
shouldn't then both components be re-evaluated? Well, for that, you have to keep in mind that false is a boolean, and booleans like strings and numbers
are primitive values in JavaScript. Now, what React.memo does in the end is it has a look at all the prop values, and in the end it compares props.show
to props.previous.show, you could say. This is not exactly what it does internally, but you can imagine it like that. So in the end it has a look
at the previous value for the show prop and compares it to the current value, and it does so with a regular comparison operator. Now, for primitive values, that will work
because for primitive values, if I compare two booleans, I get true if they are the same. If I compare two strings, I get true if they are the same. 
Now, technically, that is a different boolean than this here, and that's a different string than this. These are two different values. But for primitive values, this comparison works.

Now, it's important to understand that functions are just objects in JavaScript. Again, not React-specific, that's just JavaScript. So here a new function object is created
with every time the App function runs, and this function object is passed to the onClick prop. Now, therefore, Button in the end compares props.onClick
to props.previous.onClick, for example. And in there we have two function objects. Now, two objects, even if they have the same content, 
are never equal in JavaScript when compared like this. And, therefore, React.memo finds out that the value changed just because of how JavaScript works.
