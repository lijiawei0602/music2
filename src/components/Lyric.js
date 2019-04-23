import React, { Component } from 'react';

import '../assets/css/Lyric.less';

class Lyric extends Component{
    constructor(props){
        super(props);
        this.state = {
            lyricIndex: 0,
            top: 0,
            flag: false
        }
        this.changeLayout = this.changeLayout.bind(this);
    }

    componentDidMount(){
        const lyric = this.refs.lyric;
        let top = Math.floor(lyric.offsetHeight / 34 / 2);
            this.setState({
                top: top
        })

        window.onresize = (function(){
            let top = Math.floor(lyric.offsetHeight / 34 / 2);
            this.setState({
                top: top
            })
        }).bind(this);

    }

    componentWillReceiveProps(nextProps){
        let lyricIndex = 0;
        if(nextProps.currentSong && nextProps.lyric && nextProps.currentTime){
            let lyric = this.parseLyric(nextProps.lyric);
            let currentTime = this.filterTime(nextProps.currentTime);
            for(let i=0; i<lyric.length; i++){
                if(currentTime >= lyric[i].time){
                    lyricIndex = i;
                }
            }
            this.setState({
                lyricIndex: lyricIndex
            });
        }
    }

    parseLyric(lyric){
        let lyrics = lyric.split("\n");
        let lyrArr = [];
        for(let i=0; i<lyrics.length; i++){
            let item = decodeURIComponent(lyrics[i]);
            let timeReg = /\[\d*:\d*(\.)\d*\]/g;
            let timeRegExp = item.match(timeReg);
            if(!timeRegExp)
                continue;
            let text = item.replace(timeReg, "");
            for(let m=0, n=timeRegExp.length; m<n; m++){
                let t = timeRegExp[m];
                let min = Number(String(t.match(/\[\d*/i)).slice(1));
                let sec = Number(String(t.match(/:\d*/i)).slice(1));
                let time = min * 60 + sec;
                if(text !== ""){
                    lyrArr.push({
                        time,
                        text
                    });
                }        
            }
        }
        return lyrArr;
    }

    filterTime(time){
        let t = time.split(":");
        return Number(Number(t[0]) * 60  + Number(t[1]));
    }

    changeLayout(){
        this.setState({
            flag: !this.state.flag
        });

        this.props.changeLayout(this.state.flag);
    }

    render(){
        const lyrArr = this.parseLyric(this.props.lyric);
        if(!this.props.currentSong){
            return (
                <div className="Lyric" ref="lyric">
                        <div className="Lyric-item noCurrrent">
                            还没有播放音乐哦~
                        </div>
                </div>
            )
        }

        return (
            <div onDoubleClick={this.changeLayout} className="Lyric" ref="lyric">
                    <div className="Lyric-item" ref="lyricItem" style={{transform: `translateY(${-34 * (this.state.lyricIndex - this.state.top)}px)`}}>
                        {
                            lyrArr.map((item,index) => {
                                return <p key={index} className={this.state.lyricIndex === index? "on":""}>{item.text}</p>
                            })
                        }
                    </div>
            </div>
        )
    }
}

export default Lyric;