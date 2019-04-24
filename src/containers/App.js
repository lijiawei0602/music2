import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import '../assets/css/App.css';
// import Music from './Music.js';
import { fetchLogin, fetchUserInfo, exit } from '../actions/index.js';

class App extends Component {
  constructor(props){
    super(props);
    this.showBox = this.showBox.bind(this);
    this.close = this.close.bind(this);
    this.login = this.login.bind(this);
    this.exit = this.exit.bind(this);
  }

  componentWillMount(){
    const { dispatch } = this.props;
    let userId = localStorage.getItem("userId");
    if(userId){
      dispatch(fetchUserInfo(userId));
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.res){
      if(nextProps.res.code === 200){
        this.close();
      }
    }
  }
  
  showBox(){
    this.refs.loginBox.style.display = "block";
  }

  login(){
    let mobile = this.refs.mobile.value.trim();
    let pass = this.refs.pass.value.trim();
    const { dispatch } = this.props;
    dispatch(fetchLogin(mobile,pass));
  }

  close(){
    this.refs.loginBox.style.display = "none";
    this.refs.mobile.value = "";
    this.refs.pass.value = "";
  }

  exit(){
    const { dispatch } = this.props;
    dispatch(exit());
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">在线音乐播放器</h1>
          {
            this.props.res === undefined || this.props.res.code !== 200
            ?
            <div className="App-login" onClick={this.showBox} ref="loginBtn">登录</div>
            :
              <div className="login-succ">
                <div className="user">
                  <img src={this.props.res.profile.avatarUrl} alt="" className="user-img" />
                  <span className="user-name">{this.props.res.profile.nickname}</span>
                </div>
                <span className="user-exit" onClick={this.exit}>退出</span>
              </div>
          }
          <div className="login-bg" ref="loginBox">
            <div className="login-box" >
              <div className="login-box-title">手机号登录</div>
              <input type="number" ref="mobile" autoFocus="autofocus" className="login-box-mobile" placeholder="请输入手机号" />
              <input type="password" ref="pass" className="login-box-pass" placeholder="请输入相应的密码" />
              {
                this.props.res && this.props.res.code !== 200 ?
                <span style={{color: 'red', fontSize: '12px', position: 'relative', top: '-10px' }}>账号密码错误</span>
                :
                null
              }
              <button className="login-box-btn" onClick={this.close}>关闭</button>
              <button className="login-box-btn" onClick={this.login}>登录</button>
            </div>
            </div>
        </header>
        {this.props.children}
        {/* <Music></Music> */}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    res: state.login.res,
  }
}

export default withRouter(connect(mapStateToProps)(App));
