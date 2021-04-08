# React筆記-Components

## Components的概念

#### Components可以說是建立React App的基礎，而React基本上可以理解方便建立components的Library。

#### 一個React App基本上是由不同的"components"所組成的一個Component Tree，而這棵Components Tree都是由名為App(根, root)的component所發展出許多子components(child components)所構成，每一個component會回傳類HTML語法的Code，稱為JSX，接著React會將JSX code轉為HTML，最後redner到DOM

## JSX

#### JSX的語法看似與HTML類似，但需要注意的是他們是不同的!，尤其是在部分的細節上可以看出來，如下方的範例，兩者最後在DOM上redner的class雖然都是"div-1"，但是在語法上還是有所不同

`

``` html
<!-- HTML Syntax -->
<div class="div-1"></div>
<!-- JSX Syntax -->
<div className="div-1"></div>
`
```

## Components的種類

#### 在React中，可以透過function declaration 或是ES6 class這兩種方法來建立components

*   Functional components: 又稱為"presentational", "dumb"或是"stateless" components。

``` js
// functional component
const newComponent = () => {
    return (
        // JSX CODE
    )
}
```

* class - based components: 又稱為 "container", "smart"或是 "stateful"components。

``` js
// class0-based components
const newComponent extends React.Component {
    render() {
        return (
            // JSX Code
        )
    }
}
```

#### class based component提供比functional component更多的功能，也因此需要透過"extends"來繼承React. Component內的method。

## Classed-based 與Functional Component的比較

#### 兩者共通點在於都必須render JSX code，但是由於class component 繼承了React. Component內的method，因此功能上較為強大，因此大多用於控制參數(透過經由This操作State以及Props)，而對於functional component而言，用途就比較單純，基本上就是回傳JSX Code，而在其內部的event handler以及state properties，都是透過它的parent component傳入所謂的props。

## State以及Props

#### 在React中，參數的控制主要透過State或是Props，State/Props的改變會觸發React進行re-redner components的動作，進而改變DOM的內容。

## Props

#### props的功能在於透過parent component將資料傳入child component當中，如下方code，在Post component當中，透過名為title的property將字串"My Post"傳入內部

``` js
const AllPost = () => {
    return ( 
        <div >
            <Post title = "My post" />
        </div>
    )
}
```

#### Post為一個functional component，接受props的參數(argument)，並且透過props.title則可將外部傳入的props輸出在h1內部

```js
const post = (props)=>{
    return(
        <div>
            <h1>{props.title}</h1>
        </div>
    )
}
```

## State 
#### State只能透過class-based component來定義或是修改，且state的改變會觸發component進行re-render，進而改變DOM，上述提到的props也允許將state傳遞到functional component，但是無法直接在functional component內部改變state(暫不討論React hook的UseState)，要改變state的內容只能在class-based component內透過`this.setState({...})`來改變
```js
class NewPost extends React.Component{
    state={
        counter:1
    }
    render(){
        return(
            <div>{this.state.counter}</div>
        )
    }

}
```

