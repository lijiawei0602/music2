import React, { Component } from 'react';
import { connect } from 'react-redux';

import HotComment from '../components/HotComment.js';
import NewComment from '../components/NewComment.js';
import '../assets/css/Comment.less';
import { _throttle } from '../constants/util.js';

import { fetchComment, reFetchComment } from '../actions/index';
import Loading from '../components/Loading.js';

class Comment extends Component{
    constructor(props){
        super(props);
        this.state = {
            reqCount: 1,
            isShow: true
        }
        this.scroll = this.scroll.bind(this);
    }

    componentDidMount(){
        const { dispatch } = this.props;
        let id = this.props.match.params.id;
        dispatch(fetchComment(id));
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.hotComment && nextProps.newComment){
            this.setState({
                isShow: false
            })
        }
    }

    componentDidUpdate(){
        //滑倒底部获取新数据
        if(this.props.hotComment && this.props.newComment){
            this.refs.comment.onscroll = _throttle(this.scroll);
        }
    }

    scroll(e){
        let target = e.target || e.srcElement;
        if(target.scrollTop + target.clientHeight >= target.scrollHeight){
            const { dispatch } = this.props;
            let id = this.props.match.params.id;
            let limit = 20;
            let offset = this.state.reqCount * limit;
            let lastNewComment = this.props.newComment;
            let hotComment = this.props.hotComment;
            this.setState({
                isShow: true,
                reqCount: this.state.reqCount+1
            });
            dispatch(reFetchComment(id,limit,offset,hotComment,lastNewComment));
        }
    }

    render(){
        if(!this.props.hotComment || !this.props.newComment){
            return (
                <div className="Comment">
                    <Loading show={this.state.isShow}></Loading>
                </div>
            );
        }else{
            return (
                <div className="Comment" ref="comment">
                    <HotComment hotComment={this.props.hotComment}></HotComment>
                    <NewComment newComment={this.props.newComment}></NewComment>
                </div>
            )
        }
    }

}
 const mapStateToProps = (state, ownProps) => {
    //  console.log(state);
    return {
        ietms: state.currentSong.currentSong,
        currentIndex: state.currentSong.currentIndex,
        hotComment: state.currentSong.hotComment,
        newComment: state.currentSong.newComment
    }
}

export default connect(mapStateToProps)(Comment);