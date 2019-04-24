import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

import '../assets/css/Music.less';
// import Playlist from './Playlist';
import Main from './Main';
import Bar from '../components/Bar.js';
import { fetchCurrentSong, updateCurrentIndex, switchAudio,fetchMusicUrl, updateCurrentTime, updateCurrentBuffer } from '../actions/index';
import { addHistoryList } from '../constants/index.js';

class Music extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentBuffer: 0,
            first: true,
        };
        this.changeLayout = this.changeLayout.bind(this);
        this.prevClick = this.prevClick.bind(this);
        this.nextClick = this.nextClick.bind(this);

        this.updateCurrentTime = this.updateCurrentTime.bind(this);
        this.updateVolume = this.updateVolume.bind(this);
        this.changeMode = this.changeMode.bind(this);
    }

    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(updateCurrentIndex(0));
    }

    componentWillReceiveProps(nextProps){
        const { dispatch } = this.props;
        if(nextProps.items.length !== this.props.items.length){
            let id = nextProps.items[0].id;
            dispatch(fetchCurrentSong(id));
            dispatch(updateCurrentBuffer(0));
        }

        if(nextProps.currentIndex !== this.props.currentIndex){
            let currentIndex = nextProps.currentIndex;
            let index = currentIndex % nextProps.items.length;
            let id = nextProps.items[index].id;
            let t = nextProps.items[index];
            dispatch(fetchCurrentSong(id));
            dispatch(updateCurrentBuffer(0));
            addHistoryList(t);
        }

        if(nextProps.currentSong && this.props.currentSong){
            if(nextProps.currentSong.image !== this.props.currentSong.image)
                this.refs.bg.style.backgroundImage = `url(${nextProps.currentSong.image})`;
        }
        
        if(nextProps.currentSong && this.props.currentSong){
            if(nextProps.currentSong.url !== this.props.currentSong.url){
                dispatch(switchAudio("play"));
                let author = nextProps.currentSong.author;
                let name = nextProps.currentSong.name;
                document.title = `${name} - ${author}`;
            }
        }


        // const { dispatch } = this.props;
        if(nextProps.currentSong !== this.props.currentSong){
            if(nextProps.currentSong.id){ 
                const id = nextProps.currentSong.id;
                dispatch(fetchMusicUrl(id));
            }
        }
        if(nextProps.musicUrl !== this.props.musicUrl){
            console.log(this.refs.audio);
            this.refs.audio.src = nextProps.musicUrl;
        }
        if(nextProps.audioState){
            const audio = this.refs.audio;
            let currentTime = 0;
            if (this.state.first) {
                audio.addEventListener("timeupdate", (function(){
                    let bufferIndex = audio.buffered.length;
                    if(bufferIndex > 0 && audio.buffered !== undefined) {
                        let buffer = audio.buffered.end(bufferIndex - 1) / audio.duration;
                        currentTime = audio.currentTime;
                        dispatch(updateCurrentBuffer(buffer));
                    }
                    dispatch(updateCurrentTime(currentTime));
                    //判断是否播放完毕
                    // console.log(audio.currentTime, audio.duration);
                    if(audio.currentTime + 1 >= audio.duration){
                        this.changeMode();
                    }
                }).bind(this),false);
                this.setState({
                    first: false,
                });
            }

            if(nextProps.audioState === "play"){
                audio.play();
            }
            else{
                audio.pause();
            }
        }
    }

    changeLayout(state){
        if(state){
            this.refs.left.style.display = "none";
            this.refs.right.style.width = "100%";
        }else{
            this.refs.left.style.display = "block";
            this.refs.right.style.width = "300px";
        }
    }

    prevClick(){
        const { dispatch } = this.props;
        dispatch(switchAudio("pause"));
        let currentIndex = this.props.currentIndex;
        if(currentIndex === 0){
            dispatch(updateCurrentIndex(this.props.items.length - 1));
        }else{
            dispatch(updateCurrentIndex(currentIndex - 1));
        }
    }

    nextClick(){
        const { dispatch } = this.props;
        dispatch(switchAudio("pause"));
        let currentIndex = this.props.currentIndex;
        if(currentIndex === this.props.items.length - 1){
            dispatch(updateCurrentIndex(0));
        }else{
            dispatch(updateCurrentIndex(currentIndex + 1));
        }
    }

    /*----------*/
    changeMode(){
        const { dispatch } = this.props;
        let index = this.props.currentIndex;
        let modeArr = ["order", "loop", "random", "list-loop"];
        console.log(index, this.props.audioMode);
        switch(this.props.audioMode){
          case modeArr[0]:
            dispatch(updateCurrentIndex(index + 1));
            break;
          case modeArr[1]:
            this.refs.audio.currentTime = 0;
            dispatch(switchAudio("play"));
            break;
          case modeArr[2]:
            let i = Math.random() * (this.props.items.length-1);
            dispatch(updateCurrentIndex(i));
            break;
          default:
            dispatch(updateCurrentIndex(index+1));
            break;
        }
    }

    updateVolume(percent){
        this.refs.audio.volume = percent;
    }

    updateCurrentTime(time){
        const { dispatch } = this.props;
        this.refs.audio.currentTime = time;
        dispatch(updateCurrentTime(time));
    }


    render(){
        return(
            <div className="Music">
                <div className="Music-content">
                    <div className="Music-left" ref="left">
                        <div className="Music-nav" onClick={this.selectBtn}>
                            <NavLink to="/playlist" className="Music-nav-btn" activeClassName="active">正在播放</NavLink>
                            <NavLink to="/top" className="Music-nav-btn" activeClassName="active">排行榜</NavLink>
                            <NavLink to="/search" className="Music-nav-btn" activeClassName="active">搜索</NavLink>
                            <NavLink to="/mylist" className="Music-nav-btn" activeClassName="active">我的歌单</NavLink>
                            <NavLink to="/history" className="Music-nav-btn" activeClassName="active">我听过的</NavLink>
                        </div>
                        <div className="Music-main">
                            {/* <Playlist></Playlist> */}
                            {this.props.children}
                        </div>
                    </div>
                    <div className="Music-right" ref="right">
                        <Main currentSong={this.props.currentSong} changeLayout={this.changeLayout}></Main>
                    </div>
                </div>
                <div className="Music-bar">
                    <Bar items={this.props.items} currentIndex={this.props.currentIndex}  currentBuffer={this.props.currentBuffer} currentSong={this.props.currentSong} currentTime={this.props.currentTime} audioState={this.props.audioState} audioMode={this.props.audioMode} updateCurrentTime={this.updateCurrentTime} updateVolume={this.updateVolume} prevClick={this.prevClick} nextClick={this.nextClick}></Bar>
                </div>
                <div className="Music-bg" ref="bg"></div>
                <div className="Music-mask"></div>
                <audio ref="audio"></audio>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state.playlist.items);
    return {
        currentSong: state.currentSong.currentSong,
        currentTime: state.currentSong.currentTime,
        currentBuffer: state.currentSong.currentBuffer,
        items: state.playlist.items,
        currentIndex: state.currentSong.currentIndex,
        audioState: state.currentSong.audioState,
        audioMode: state.currentSong.audioMode,
        musicUrl: state.currentSong.musicUrl,
    }
}

export default withRouter(connect(mapStateToProps)(Music));