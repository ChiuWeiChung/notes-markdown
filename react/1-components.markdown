# React筆記- Components

## Components的概念

Components 可以說是建立 React App 的基礎，而 React 基本上可以理解方便建立 Components 的工具庫 。

一個 React App 是由不同的 "Component" 所組成的一個 Component Tree ，而這棵 Components Tree 都是由名為 App (根, root) 的 Component 所發展出許多 Child Components 所構成，每一個 Component 會回傳類似 HTML 語法的程式碼，稱為 JSX ，接著 React 會將 JSX 轉為 HTML ，最後渲染到 DOM 上面

## JSX

JSX 的語法看似與 HTML 類似，但需要注意的是他們是不同的!，尤其是在部分的細節上可以看出來，如下方的範例，兩者最後在 DOM 上渲染的 class 雖然都是 "div-1" ，但是在語法上還是有所不同

```html
<!-- HTML Syntax -->
<div class="div-1"></div>
<!-- JSX Syntax -->
<div className="div-1"></div>
```

## Components 的種類

在React中，可以透過 `Function` 或是ES6中的 `class` 這兩種方法來建立 Components

*   **Function Components** : 又稱為 "presentational" , "dumb" 或是 "stateless" Components 。  

    ```jsx
    // Function Component
    const newComponent = () => {
        return (
            // JSX 
        )
    }
    ```

* **Class Components** : 又稱為 "container" , "smart" 或是 "stateful"Components。

    ```jsx
    // Class Components
    Class newComponent extends React.Component {
        render() {
            return (
                // JSX 
            )
        }
    }
    ```

> Class Component 提供比 Function Component 更多的功能 (在沒有 React Hooks 的情況下)，也因此需要透過 `extends` 來繼承 `React.Component` 內的許多函式們。

## Class Component 與 Function Component的比較

兩者共通點在於都必須回傳 JSX ，但是由於 Class Component 繼承了 React. Component 內許多 "Methods"，因此功能上較為強大，因此大多用於控制參數 (透過經由 This 操作 State 以及 Props ) ，而對於 Function Component 而言，用途就比較單純，基本上就是回傳 JSX ，而在其內部的 Event Handler 以及 State ，都是透過它的 Parent Component 傳入所謂的 Props。

## State 以及 Props

在 React 中，參數的控制主要透過 State 或是 Props， State/Props 的改變會觸發 React 進行重新渲染 (re-render) 的動作，進而改變DOM的內容。

### **Props**

props 的功能在於透過 parent Component 將資料傳入 Child Component當中，如下方程式碼，透過名為 `title` 的 Props將字串 `"My Post"` 傳入 `Post` 內。

```jsx
const AllPost = () => {
    return (
        <div >
            <Post title = "My post" />
        </div>
    )
}
```

`Post` 為一個 Function Component ，接受 `props` 的參數，並且透過 `props.title` 則可將外部傳入的 `props` 輸出在 `<h1>` 內部

```jsx
const Post = (props) => {
    return ( 
        <div>
            <h1>{props.title}</h1> 
        </div>
    )
}
```

### **State** 

State 只能透過  Class Component 來定義或是修改，且 State 的改變會觸發Component進行 re-render，進而改變DOM，上述提到的 `props` 也允許將  State 傳遞到 Function Component，但是無法直接在 Function Component 內部改變 State (在沒有使用 React hook 的情況下) ，要改變 State 的內容只能在 Class Component 內透過 `this.setState({...})` 來改變。

```jsx
class NewPost extends React.Component {
    state = {
        counter: 1
    }
    render() {
        return ( 
            <div> {this.state.counter} </div>
        )
    }
}
```


# 參考資料
* [React 手冊](https://zh-hant.reactjs.org/docs/react-component.html)
* [React - The Complete Guide (incl Hooks, React Router, Redux)](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)
