### 路由与Reudx
同时使用`React-Redux`和`Redux`时，大多数情况是正常的，但是也可能出现路由变更但组件未随之更新的状况，如：
1. 我们使用`redux`的`connect`方法将组件连接至redux：`connect(App)`;
2. 组件不是一个路由渲染组建，即不是使用<Route>组件形式：`<Route path="/" component={Home}>`声明渲染的；
这是为什么呢？因为`Reudx`会实现组件的`shouldComponentUpdate`生命周期函数，当路由变化时，该组件并没有接收到`新的props`表明发生了变更，即不会出现组件的更新。
那么如何解决呢，要解决这个问题只需简单的使用`react-router-dom`提供的`withRouter`方法包裹组件：
```javascript
    import { withRouter } from 'react-router-dom';
    /*...*/
    export default withRouter(connect(mapStateToProps)(Home));
```