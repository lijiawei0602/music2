import React, { Component } from 'react';

import '../assets/css/List.less';

class List extends Component{
    // constructor(props){
    //     super(props);
    // }


    render(){
        if(this.props.type === 1){
            if(!this.props.items.length){
                return null;
           }
           return (
                <div className="List">
                    {
                        this.props.items.map((item,index) => {
                            return (
                                <div key={index} className={this.props.currentIndex === index && this.props.audioState === "play"? "List-main on" : "List-main"}>
                                    <span className="List-index">{ index+1 }</span>
                                    <div className="List-name">
                                        { item.name }
                                        <div className="List-menu">
                                            <span className="List-menu-play" className={this.props.currentIndex === index && this.props.audioState === "play"? 'List-menu-play':'List-menu-pause'} onClick={() => {this.props.getCurrentSong(item.id,index,item)}}></span>
                                        </div>
                                    </div>
                                    <span className="List-author">{ item.author }</span>
                                    {
                                        this.props.type === 1
                                        ?
                                        <span className="List-time">
                                            <span>{ item.duration }</span>
                                            <i className="List-menu-del" onClick={() => {this.props.updatePlayList(index)}}></i>
                                        </span>
                                        :
                                        <span className="List-album">
                                            {item.album}
                                        </span>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
        return (
            <div className="List">
                {
                    this.props.items.map((item,index) => {
                        return (
                            <div key={index} className={this.props.perIndex === index && this.props.audioState === "play"? "List-main on" : "List-main"}>
                                <span className="List-index">{ index+1 }</span>
                                <div className="List-name">
                                    { item.name }
                                    <div className="List-menu">
                                        <span className="List-menu-play" className={this.props.perIndex === index && this.props.audioState === "play"? 'List-menu-play':'List-menu-pause'} onClick={() => {this.props.getCurrentSong(item,index)}}></span>
                                    </div>
                                </div>
                                <span className="List-author">{ item.author }</span>
                                {
                                    this.props.type === 1
                                    ?
                                    <span className="List-time">
                                        <span>{ item.duration }</span>
                                        <i className="List-menu-del" onClick={() => {this.props.updatePlayList(index)}}></i>
                                    </span>
                                    :
                                    <span className="List-album">
                                        {item.album}
                                    </span>
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default List;