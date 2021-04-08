# React-Component的生命週期

## Component的生命週期 (Lifecycle) 
#### Component的生命週期只會在class-based components中發生，其中包括了許多的階段。
*   constructor()
*   getDerivedStateFromProps()
*   getSnapshotBeforeUpdate()
*   shouldComponentUpdate()
*   componentDidUpdate()
*   componentDidCatch()
*   componentDidMount()
*   componentWillUnmount()
*   render()

## Lifecycle-Creation階段
#### 順序為:
* 1.constructor : State的初始設定
* 2.getDerivedSetateFromProps 
* 3.render() : 
* 4.componentDidMount() 


## Lifecycle-Update階段
#### 順序為:
* 1.getDerivedSetateFromProps(props,state)
* 2.shouldComponentUpdate(nextProps,nextState): 優化performance
* 3.render() : 
* 4.getSnapshotBeforeUpdate(prevProps,prevState)
* 5.componentDidUpdate() 