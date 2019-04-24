import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import '../assets/css/Mylist.less';
import logo from '../assets/img/default.png';
import { _throttle } from '../constants/util.js';
import { fetchUserPlayList } from '../actions/index.js';
import Loading from '../components/Loading';


class Mylist extends Component{
    constructor(props){
        super(props);
        this.state = {
            isShow: true
        }
        this.lazyload = this.lazyload.bind(this);
    }

    componentWillMount(){
        const { dispatch } = this.props;
        if(this.props.userid !== -1){
            dispatch(fetchUserPlayList(this.props.userid));
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return nextProps.list !== this.props.list || this.props.res !== nextProps.res;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.userid !== this.props.userid ){
            const { dispatch } = this.props;
            dispatch(fetchUserPlayList(nextProps.userid));
        }
        if(nextProps.list !== this.props.list){
            this.setState({
                isShow: false
            })
        }
    }
    
    componentDidUpdate(){
        if(this.props.res && this.props.list){
            this.lazyload();
            this.refs.top.onscroll = _throttle(this.lazyload);
        }
    }

    lazyload(e){
        let arr = this.refs.top.getElementsByTagName("img");
        let clientH = this.refs.top.clientHeight;
        let scrollTop = this.refs.top.scrollTop;
        let topOffsetTop = this.refs.top.offsetTop;
        for(let i=0; i<arr.length; i++){
            if(arr[i].offsetTop - topOffsetTop <= clientH + scrollTop + 150){
                arr[i].src = arr[i].getAttribute("data-src");
            }
        }   
    }

    render(){
        if(!this.props.res){
            return(
                <div className="Mylist-null">
                    暂无登录，请先登录
                </div>
            )
        }
        if(!this.props.list){
            return (
                <div className="Mylist">
                    <Loading show={this.state.isShow}></Loading>
                </div>
            )
        }
        return(
            <div className="Mylist" ref="top">
                <div className="Mylist-content">
                {
                        this.props.list.map((item, index) => {
                            return (
                                <Link to={`mylist/detail/${item.id}`} key={index}>
                                    <div className="Mylist-item">
                                        <img src={logo} data-src={item.coverImgUrl} alt="" className="Mylist-item-img"/>
                                        <div className="Mylist-item-name">{item.name}</div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        userid: state.login.userid,
        list: state.mylist.list,
        res: state.login.res
    }
}

export default connect(mapStateToProps)(Mylist);