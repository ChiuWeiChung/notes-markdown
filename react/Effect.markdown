# What is an "Effect" (or "Side Effect")?

Our component in our React App has one main jon, to render the UI, to react to our use input, to re-render the UI when it's needed. with state and event, the main job was to bring something onto the screen, and make sure the user may interact with something and that what's show on the screen may changed based on certain events (button click, text being entered).

* Main Job: Render UI & React to User Input:  
    1. Evaluate & Render JSX
    2. Manage State & Props
    3. React to Events & Input
    4. Re-evaluate Component upon State & Prop Changes

Side Effects are everything else that might be happening in our application

* Store Data in Browser Storage
* Send Http Requests to Backedn Servers
* Set & Manage Timers

Sending the request itself and handling potential erros and so on, that's not something you need React for. That's not something React cares about. These tasks must happen outside of the normal component evaluation and render cycle - especially since they might block/delay rendering (e.q. Htpp requests ) 

**When the state change, the entire component re-run** and React then basically checks what the new result of this function execution. So the new JSX code looks like, and if compared to the previous result, it should goto the real DOM and make some changes there.

Side effect shouldn't go directly into the component, because that would most likely create bugs, infinite loops or simply send too many Http request.

For handling side effect, we have a better tool for handling side effect. The useEffect hook is simply another built in Hook that we can run inside out funcitonal component.

```js
useEffect(() => {}, []);
```

* The first argument is a function that should be executed AFTER every component evaluation IF the specified dependencies changed. We can put any side effect code in this function. 

* The second argument is dependencies, that's an array full of dependencies, whenever such a dependency changes, that function in the first argument will re-run.

The function inside the useEffect is executed by react, and it is excuted **AFTER** every component re-evaluation if the dependencies changed. 

With no dependencies in the second argument, of course they didn't changed compared to the first execution cycle. So the anonymous function would indeed only run once when the app starts.

## Cleanup Function in useEffect

At the end of the anonymous function, we can return something, it need to be a function itself. That's so called cleanup function. This will run as a cleanup process **BEFORE** useEffect executes this function the next time.

In addition, the cleanup function will run whenever the component you're specifying the effect in **UNMOUNTS** from the DOM. So the cleanup function runs before every new side effect function execution and before the component is removed And it doesn't run before the first side effect function execution.

## Summary
