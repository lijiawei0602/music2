import React, { Component } from 'react';

import '../assets/css/HotComment.less';

class HotComment extends Component{
    // constructor(props){
    //     super(props);
    // }

    parseTime(time){
        let formatTime;
        const date = new Date(time);
        const dateObj = {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes()
        };
        const newDate = new Date();
        const sub = newDate.getTime() - time;
        if(newDate.getDate() === dateObj.date && sub < 60000){  //相差小于1分钟
            formatTime = "刚刚";
        }else if(newDate.getDate() === dateObj.date && sub > 60000 && sub < 3600000){   //相差小于1小时
            formatTime = `${Math.floor(sub / 60000)}分钟前`;
        }else if(newDate.getDate() === dateObj.date && sub > 3600000 && sub < 86400000){    //相差小于1天
            formatTime = `${this.addZero(dateObj.hour)}:${this.addZero(dateObj.minute)}`;
        }else if(newDate.getDate() !== dateObj.date && sub < 86400000){ //昨天
            formatTime = `昨天${this.addZero(dateObj.hour)}:${this.addZero(dateObj.minute)}`;
        }else{
            formatTime = `${dateObj.year}年${dateObj.month}月${dateObj.date}日`;
        }
        return formatTime;
    }

    addZero(t){
        return t<10? '0'+t:t;
    }

    render(){
        return(
            <div className="HotComment">
                <div className="Comment-header">精彩评论</div>
                {
                    this.props.hotComment.map((item,index) => {
                        return (
                            <div className="Comment-item" key={index}>
                                <img src={item.user.avatarUrl} alt="" className="Comment-item-pic" />
                                <p className="Comment-item-name">
                                    <a target="_blank" href={`http://music.163.com/#/user/home?id=${item.user.userId}`}>{item.user.nickname}</a>
                                </p>
                                <p className="Comment-item-content">{item.content}</p>
                                <div className="Comment-item-bottom">
                                    <span className="Comment-item-time">{this.parseTime(item.time)}</span>
                                    <span className="Comment-item-like">{item.likedCount}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default HotComment;