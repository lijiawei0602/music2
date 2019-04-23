import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updatePlayList, updateCurrentIndex, switchAudio, receiveHistoryList } from '..//actions/index.js';
import List from '../components/List.js';
import '../assets/css/History.less'
import { deleteHistoryList } from "../constants/index.js";

class History extends Component{
    constructor(props){
        super(props);
        this.state = {
            perIndex: -1
        }
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.updatePlayList = this.updatePlayList.bind(this);
    }

    componentWillMount(){
        const { dispatch } = this.props;
        dispatch(receiveHistoryList());
    }

    getCurrentSong(id,index,item){
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
    //删除一条历史歌单
    updatePlayList(i){
        let history = this.props.list;
        let t = history[i];
        deleteHistoryList(t);
        const { dispatch } = this.props;
        dispatch(receiveHistoryList());
    }

    render(){
        console.log(this.props.list)
        return(
            <div className="History">
                <div className="History-head list-item">
                    <span className="History-name">歌曲</span>
                    <span className="History-author">歌手</span>
                    <span className="History-time">时长</span>
                </div>
                <div className="History-content">
                    <List type={1} items={this.props.list} currentIndex={this.props.currentIndex} audioState={this.props.audioState} getCurrentSong={this.getCurrentSong} updatePlayList={this.updatePlayList}></List>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        list: state.history.list,
        playlist: state.playlist.items,
        currentIndex: state.currentSong.currentIndex,
        audioState: state.currentSong.audioState,
        currentSong: state.currentSong.currentSong
    }
}

export default connect(mapStateToProps)(History);