import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchDetail, updateCurrentIndex, switchAudio, updatePlayList } from '../actions/index';
import '../assets/css/Detail.less';
import List from '../components//List.js';
import Loading from './Loading';

class Detail extends Component{
    constructor(props){
        super(props);
        this.state = {
            perIndex: -1,
            isShow: true
        }
        this.getCurrentSong = this.getCurrentSong.bind(this);
    }
    componentDidMount(){
        const { dispatch } = this.props;
        const id = this.props.match.params.id;
        dispatch(fetchDetail(id));
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.items){
            this.setState({
                isShow: false
            })
        }
    }

    getCurrentSong(item,index){
        const { dispatch } = this.props;
        if(this.state.perIndex === index && this.props.currentSong.id === item.id){
            if(this.props.audioState === "play"){
                dispatch(switchAudio("pause"));
            }else{
                dispatch(switchAudio("play"));
            }
        }else{
            let newPlaylist =[item, ...this.props.playlist];
            dispatch(updatePlayList(newPlaylist));
            dispatch(updateCurrentIndex(0));
        }
        this.setState({
            perIndex: index
        });
    }

    render(){
        if(!this.props.items){
            return null;    
        }
        return(
            <div className="Detail">
                <div className="Detail-head list-item">
                    <span className="Detail-name">歌曲</span>
                    <span className="Detail-author">歌手</span>
                    <span className="Detail-time">专辑</span>
                </div>
                <div className="Detail-content">
                    <Loading show={this.state.isShow}></Loading>
                    <List type={2} perIndex={this.state.perIndex} items={this.props.items} currentIndex={this.props.currentIndex} audioState={this.props.audioState} getCurrentSong={this.getCurrentSong}></List>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        items: state.top.detail,
        playlist: state.playlist.items,
        currentIndex: state.currentSong.currentIndex,
        audioState: state.currentSong.audioState,
        currentSong: state.currentSong.currentSong
    }
}

export default connect(mapStateToProps)(Detail);