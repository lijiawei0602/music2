import React, { Component } from 'react';

import '../assets/css/Info.less';
import infoImg from '../assets/img/info.png';

class Info extends Component{
    // constructor(props){
    //     super(props);
    // }

    shouldComponentUpdate(nextProps){
        return nextProps.currentSong !== this.props.currentSong;
    }

    render(){
        if(!this.props.currentSong){
            return (
                <div className="Info">
                    <div className="Info-img">
                        <img src={infoImg} alt="默认图片" />
                    </div>
                    <div>欢迎收听音乐~</div>
                </div>
            )
        }

        return (
            <div className="Info">
                <div className="Info-img">
                    <img src={this.props.currentSong.image} alt="专辑图片"/>
                </div>
                <div className="Info-name">歌曲名：{this.props.currentSong.name}</div>
                <div className="Info-author">歌手名：{this.props.currentSong.author}</div>
                <div className="Info-album">专辑名：{this.props.currentSong.album}</div>
            </div>
        )
    }
}

export default Info;