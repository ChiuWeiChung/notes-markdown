# React筆記-Components

## Components的概念

Components 可以說是建立 React App 的基礎，而 React 基本上可以理解方便建立 components 的 Library 。

一個React App基本上是由不同的 "Component" 所組成的一個 Component Tree ，而這棵 Components Tree 都是由名為 App (根, root) 的 component 所發展出許多子 components (child components) 所構成，每一個 component 會回傳類似 HTML 語法的程式碼，稱為 JSX ，接著 React 會將 JSX 轉為 HTML ，最後渲染到 DOM

## JSX

JSX 的語法看似與 HTML 類似，但需要注意的是他們是不同的!，尤其是在部分的細節上可以看出來，如下方的範例，兩者最後在 DOM 上渲染的 class 雖然都是 "div-1" ，但是在語法上還是有所不同

```html
<!-- HTML Syntax -->
<div class="div-1"></div>
<!-- JSX Syntax -->
<div className="div-1"></div>
```

## Components 的種類

在React中，可以透過 `function` 或是ES6中的 `class` 這兩種方法來建立 components

*   **Function components** : 又稱為 "presentational" , "dumb" 或是 "stateless" components 。

```js
// function component
const newComponent = () => {
    return (
        // JSX CODE
    )
}
```

* **Class components** : 又稱為 "container" , "smart" 或是 "stateful"components。

```js
// Class components
const newComponent extends React.Component {
    render() {
        return (
            // JSX Code
        )
    }
}
```

> Class component 提供比 function component更多的功能，也因此需要透過"extends"來繼承React. Component內的method。

## Classed-based 與 function Component的比較

兩者共通點在於都必須 render JSX code，但是由於 Class component 繼承了 React. Component 內的 method，因此功能上較為強大，因此大多用於控制參數 (透過經由 This 操作 State 以及 Props ) ，而對於 Function component 而言，用途就比較單純，基本上就是回傳 JSX Code ，而在其內部的 event handler 以及 state properties ，都是透過它的 Parent component 傳入所謂的 Props。

## State 以及 Props

在 React 中，參數的控制主要透過 State 或是 Props， State/Props 的改變會觸發 React 進行 re-redner components 的動作，進而改變DOM的內容。

## Props

props 的功能在於透過 parent component 將資料傳入 child component當中，如下方程式碼，在 Post component當中，透過名為 `title` 的 props 將字串 `"My Post"` 傳入內部

```js
const AllPost = () => {
    return ( <
        div >
        <
        Post title = "My post" / >
        <
        /div>
    )
}
```

Post 為一個 Function component ，接受 props 的參數 (argument)，並且透過 props.title 則可將外部傳入的 props 輸出在 h1 內部

```js
const post = (props) => {
    return ( <
        div >
        <
        h1 > {
            props.title
        } < /h1> <
        /div>
    )
}
```

## State 

State 只能透過  Class component來定義或是修改，且state的改變會觸發component進行 re-render，進而改變DOM，上述提到的props也允許將 state傳遞到 Function component，但是無法直接在 Function component 內部改變 state (在沒有使用 React hook 的情況下) ，要改變 state 的內容只能在 Class component 內透過 `this.setState({...})` 來改變

```js
class NewPost extends React.Component {
    state = {
        counter: 1
    }
    render() {
        return ( <
            div > {
                this.state.counter
            } < /div>
        )
    }

}
```
