import React, { Component } from 'react';
import { connect } from 'react-redux';

import { requestPlaylist, switchAudio, updateCurrentIndex, updatePlayList } from '../actions/index.js';
import '../assets/css/Playlist.less';
import List from '../components/List.js';
import Loading from '../components/Loading.js';

class Playlist extends Component{
    constructor(props){
        super(props);
        this.state = {
            isShow: true
        }
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.updatePlayList = this.updatePlayList.bind(this);
    }
    
    componentWillMount(){
        const { dispatch } = this.props;
        let items = this.props.items;
        dispatch(requestPlaylist(items));
        if(this.props.items.length !== 0){
            this.setState({
                isShow: false
            })
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.items.length !== 0){
            this.setState({
                isShow: false
            })
        }
    }

    getCurrentSong(id,index){
        const { dispatch } = this.props;
        if(this.props.currentIndex === index){
            if(this.props.audioState === "play"){
                dispatch(switchAudio("pause"));
            }else{
                dispatch(switchAudio("play"));
            }
        }else{
            dispatch(updateCurrentIndex(index));
        }
    }

    updatePlayList(index){
        const { dispatch } = this.props;
        let newPlayList = this.props.items.filter((item,jndex) => {
            return jndex !== index;
        });
        dispatch(updatePlayList(newPlayList));
    }

    render(){
        return(
            <div className="Playlist">
                <div className="Playlist-head list-item">
                    <span className="Playlist-name">歌曲</span>
                    <span className="Playlist-author">歌手</span>
                    <span className="Playlist-time">时长</span>
                </div>
                <div className="Playlist-content">
                    <Loading show={this.state.isShow}></Loading>
                    <List type={1} items={this.props.items} currentIndex={this.props.currentIndex} audioState={this.props.audioState} getCurrentSong={this.getCurrentSong} updatePlayList={this.updatePlayList}></List>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    // console.log(state.playlist.items);
    return {
        items: state.playlist.items,
        currentIndex: state.currentSong.currentIndex,
        audioState: state.currentSong.audioState
    }
}

export default connect(mapStateToProps)(Playlist);