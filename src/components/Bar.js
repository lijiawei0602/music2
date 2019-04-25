import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
  
import '../assets/css/Bar.less';
import { switchAudio, switchAudioMode } from '../actions/index';

class Bar extends Component{
    static defaultProps = {
        dotWidth: 10
    };
    constructor(props){
        super(props);
        this.state = {
            isPlay: false,
            move: {
                state: false,
                startX: 0,
                left: 0
            },
            vmove:{
                state: false,
                startX: 0,
                left: 0,
            },
            flag: true,
            offset: 110
        }

        this.switchAudio = this.switchAudio.bind(this);
        this.barClick = this.barClick.bind(this);
        this.barDown = this.barDown.bind(this);
        this.barMove = this.barMove.bind(this);
        this.barUp = this.barUp.bind(this);
        this.volumeClick = this.volumeClick.bind(this);
        this.volumeDown = this.volumeDown.bind(this);
        this.volumeMove = this.volumeMove.bind(this);
        this.volumeUp = this.volumeUp.bind(this);
        this.volumeIco = this.volumeIco.bind(this);
        this.switchMode = this.switchMode.bind(this);
    }  

    componentDidMount(){
        document.addEventListener("mousemove",this.barMove,false);
        document.addEventListener("mouseup",this.barUp,false);

        document.addEventListener("mousemove",this.volumeMove,false);
        document.addEventListener("mouseup",this.volumeUp,false);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.currentSong && nextProps.currentTime && nextProps.currentBuffer){
            if(nextProps.currentSong.duration){
                let percent = this.filterTime(nextProps.currentTime) / this.filterTime(nextProps.currentSong.duration);
                let allWidth = this.refs.prog.clientWidth - this.props.dotWidth;
                let progWidth = percent * allWidth;
                let bufferWidth = nextProps.currentBuffer * allWidth;
                this.refs.buffer.style.width = bufferWidth + "px";
                this.moveTo(progWidth);
            }
        }
        if(nextProps.audioMode !== this.props.audioMode){
            let mode = this.refs.mode;
            let title = this.modeTitle(nextProps.audioMode);
            let classname = this.modeClass(nextProps.audioMode);
            mode.setAttribute("title", title);
            mode.className = classname;
        }
    }

    componentWillUnmount(){
        document.removeEventListener("mousemove",this.barMove,false);
        document.removeEventListener("mouseup",this.barUp,false);

        document.removeEventListener("mousemove",this.volumeMove,false);
        document.removeEventListener("mouseup",this.volumeUp,false);
    }

    moveTo(progWidth){
        this.refs.progInner.style.width = progWidth + "px";
        this.refs.progDot.style.left = progWidth + "px";
    }

    //点击bar
    barClick(e){
        let rect = this.refs.prog.getBoundingClientRect();
        let offset = Math.min(this.refs.prog.clientWidth-this.props.dotWidth, Math.max(0, e.clientX-rect.left-5));
        
        this.moveTo(offset);
        this.commitCurrentTime(); 
    }

    //鼠标按下
    barDown(e){
        this.setState({
            move: {
                state: true,
                startX: e.clientX,
                left: this.refs.progInner.clientWidth
            }
        });
    }

    //鼠标移动
    barMove(e){
        if(!this.state.move.state){
            return false;
        }
        let endX = e.clientX;
        let distance = endX - this.state.move.startX;
        let offset = Math.min(this.refs.prog.clientWidth - this.props.dotWidth,Math.max(0,this.state.move.left + distance));
        this.moveTo(offset);
        this.commitCurrentTime();
    }

    //鼠标释放
    barUp(e){
      this.setState({
          move: {
              state: false
          }
      });
    }
    
    commitCurrentTime(){
        let allWidth = this.refs.prog.clientWidth - this.props.dotWidth;
        let percent = this.refs.progInner.clientWidth / allWidth;
        let currentTime = percent * this.filterTime(this.props.currentSong.duration);
        this.props.updateCurrentTime(currentTime);
    }

    volumeIco(e){
        if(this.state.flag){
            this.refs.volumeIco.className = "btn-volume-no";
            this.vmoveTo(0);
            this.setState({
                flag: !this.state.flag
            })
            this.commitVolume();
        }else{
            this.refs.volumeIco.className = "btn-volume";
            this.vmoveTo(this.state.offset);
            this.setState({
                flag: !this.state.flag
            })
            this.commitVolume();
        }
    }
    //点击volume
    volumeClick(e){
        let rect = this.refs.vprog.getBoundingClientRect();
        let offset = Math.min(this.refs.vprog.clientWidth-this.props.dotWidth, Math.max(0, e.clientX-rect.left-5));
        this.setState({
            offset: offset
        })
        this.vmoveTo(offset);
        this.commitVolume();
    }

    volumeDown(e){
        this.setState({
            vmove:{
                state: true,
                startX: e.clientX,
                left: this.refs.vprogInner.clientWidth
            }
        });
    }

    volumeMove(e){
        if(!this.state.vmove.state){
            return false;
        }
        let endX = e.clientX;
        let distance = endX - this.state.vmove.startX;
        let offset = Math.min(this.refs.vprog.clientWidth - this.props.dotWidth,Math.max(0,this.state.vmove.left + distance));
        this.setState({
            offset: offset
        });
        this.vmoveTo(offset);
        this.commitVolume();
    }

    volumeUp(e){
        this.setState({
            vmove: {
                state: false
            }
        });
    }

    vmoveTo(progWidth){
        this.refs.vprogInner.style.width = progWidth + "px";
        this.refs.vprogDot.style.left = progWidth + "px";
    }

    commitVolume(){
        let allWidth = this.refs.vprog.clientWidth - this.props.dotWidth;
        let percent = this.refs.vprogInner.clientWidth / allWidth;
        this.props.updateVolume(percent);
    }

    switchAudio(){
        const { dispatch } = this.props;
        if(this.props.audioState === "pause"){
            dispatch(switchAudio("play"));
        }else{
            dispatch(switchAudio("pause"));
        }
    }

    filterTime(time){
        let t = time.split(":");
        return Number(Number(t[0]) * 60  + Number(t[1]));
    }

    modeTitle(mode){
        switch(mode){
            case "order":
                return "顺序播放";
            case "loop":
                return "单曲循环";
            case "random":
                return "随机播放";
            case "list-loop":
                return "列表循环";
            default:
                break;
        }
    }

    modeClass(mode){
        switch(mode){
            case "order":
                return "Bar-mode mode-order";
            case "loop":
                return "Bar-mode mode-loop";
            case "random":
                return "Bar-mode mode-random";
            case "list-loop":
                return "Bar-mode mode-listLoop";
            default:
                break;
        }
    }

    switchMode(){
        const { dispatch } = this.props;
        let modeArr = ["order", "loop", "random", "list-loop"];
        let mode = this.props.audioMode;
        switch(mode){
            case modeArr[0]:
                dispatch(switchAudioMode(modeArr[1]));
                break;
            case modeArr[1]:
                dispatch(switchAudioMode(modeArr[2]));
                break;
            case modeArr[2]:
                dispatch(switchAudioMode(modeArr[3]));
                break;
            case modeArr[3]:
                dispatch(switchAudioMode(modeArr[0]));
                break;
            default:
                break;
        }
    }

    render(){
        if(!this.props.currentSong){
            return null;
        }
        return (
            <div className="Bar">
                <div className="Bar-btn">
                    <i className="Bar-btn-icon btn-pre" title="上一曲" onClick={this.props.prevClick}></i>
                    <i className={ this.props.audioState === "play"? 'Bar-btn-icon btn-pause': 'Bar-btn-icon btn-play' } title="播放暂停" onClick={this.switchAudio}></i>
                    <i className="Bar-btn-icon btn-next" title="下一曲" onClick={this.props.nextClick}></i>
                </div>
                <div className="Bar-music">
                    <div className="Bar-music-info">{this.props.currentSong.name} - {this.props.currentSong.author}</div>
                    <div className="Bar-music-time">{this.props.currentTime || '00:00'}/{this.props.currentSong.duration}</div>
                    <div className="Bar-music-prog" ref="prog" onClick={this.barClick}>
                        <div className="prog-outer"></div>
                        <div className="prog-buffer" ref="buffer"></div>
                        <div className="prog-inner" ref="progInner">
                            <div className="prog-dot" ref="progDot" onMouseDown={this.barDown}></div>
                        </div>
                    </div>
                </div>
                <div className="Bar-mode mode-order" ref="mode" title="顺序播放" onClick={this.switchMode}></div>
                <div className="Bar-comment" title="评论"><Link to={`/comment/${this.props.items[this.props.currentIndex].id}`}></Link></div>
                <div className="Bar-volume" title="音量">
                    <i className="btn-volume" onClick={this.volumeIco} ref="volumeIco"></i>
                    <div className="Bar-music-prog" ref="vprog" onClick={this.volumeClick}>
                        <div className="Bar-prog-outer"></div>
                        <div className="Bar-prog-inner" ref="vprogInner">
                            <div className="Bar-prog-dot" ref="vprogDot" onMouseDown={this.volumeDown}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(Bar);