## DOM

In plain English, this means that the DOM represents what you see on your screen when you open a website, expressed through the markup language HTML.

Browsers allow the JavaScript language to modify the DOM through an API: The globally available document represents that state of the HTML DOM and provides us with functions to modify it.

You can modify the DOM with JavaScript through the DOM programming interface that contains functions like document.write, Node.appendChild or Element.setAttribute.

## VDOM

Then we have the Virtual DOM (or VDOM) of React, another abstraction layer on top of that. It consists of your React application's elements.

State changes in your application will be applied to the VDOM first. If the new state of the VDOM requires a UI change, the ReactDOM library will efficiently do this by trying to update only what needs to be updated.

When the VDOM gets updated, React compares it to to a previous snapshot of the VDOM and then only updates what has changed in the real DOM. If nothing changed, the real DOM wouldn't be updated at all. This process of comparing the old VDOM with the new one is called diffing.

## When does React re-render?

Changing the state means that React triggers an update when we call the setState function (in React hooks, you would use useState). This doesn't only mean the component's render function will be called, but also that all its subsequent child components will re-render, regardless of whether their props have changed or not.

If your application is poorly structured, you might be running a lot more JavaScript than you expected because updating the parent node implies running the render function of all children.

