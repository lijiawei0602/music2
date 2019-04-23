import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../assets/css/search.less';
import List from '../components/List.js';
import { _throttle } from '../constants/util.js';
import { fetchHotSinger, fetchSearch,switchAudio, updateCurrentIndex, updatePlayList } from '../actions/index.js';
import Loading from '../components/Loading';

class Search extends Component{
    constructor(props){
        super(props);
        this.state = {
            perIndex: -1,
            searchContent: '',
            page: 1,
            isShow: false
        }
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.keyEnter = this.keyEnter.bind(this);
        this.scroll = this.scroll.bind(this);
        this.selectHot = this.selectHot.bind(this);
    }

    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(fetchHotSinger());
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.searchList !== this.props.searchList){
            this.setState({
                isShow: false
            })
        }
    }

    componentDidUpdate(){
        if(this.props.searchList.length){
            const search = this.refs.search;
            search.onscroll =  _throttle(this.scroll);;
        }
    }

    scroll(e){
        let target = e.target || e.srcElement;
        if(target.scrollTop + target.clientHeight >= target.scrollHeight){
            this.setState({
                isShow: true
            });
            const { dispatch } = this.props;
            let limit = 30;
            let offset = (this.state.page -1 ) * limit;
            let lastSearchList = this.props.searchList;
            dispatch(fetchSearch(this.state.searchContent,limit,offset,lastSearchList));
            this.setState({
                page: this.state.page + 1
            });
        }
    }

    keyEnter(e){
        const { dispatch } = this.props;
        //按下Enter键
        if(e.keyCode === 13){
            let val = e.target.value.trim();
            if(val === ''){
                alert("输入内容不能为空");
            }else{
                this.setState({
                    isShow: true,
                    searchContent: val
                });
                dispatch(fetchSearch(val));
            }
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

    selectHot(e){
        this.setState({
            isShow: true
        })
        const { dispatch } = this.props;
        let target = e.target || e.srcElement;
        let text = target.innerText;
        this.refs.searchInput.value = text;
        dispatch(fetchSearch(text));
    }

    render(){
        if(!this.props.singer){
            return null;
        }
        return(
            <div className="Search">
                <Loading show={this.state.isShow}></Loading>
                <div className="Search-header">
                {
                    this.props.singer.slice(0,5).map((item, index) => {
                        return (
                            <span key={index} className="Search-header-singer" onClick={this.selectHot}>{item.first}</span>
                        )
                    })
                }
                    <input type="text" className="Search-header-input" placeholder="探索音乐之路 ~" onKeyUp={this.keyEnter} ref="searchInput" />
                </div>
                {
                    this.props.searchList.length
                    ?
                    <div className="Search-content">
                        <div className="Search-content-head list-item">
                            <span className="Search-content-name">歌曲</span>
                            <span className="Search-content-author">歌手</span>
                            <span className="Search-content-time">专辑</span>
                        </div>
                        <div className="Search-content-main" ref="search">
                            <List type={2} perIndex={this.state.perIndex} items={this.props.searchList} currentIndex={this.props.currentIndex} audioState={this.props.audioState} getCurrentSong={this.getCurrentSong}></List>
                        </div>
                    </div>
                    :
                    <div className="Search-content">
                        <div className="Search-content-null">开启属于自己的音乐之旅 ~</div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        singer: state.search.singer,
        searchList: state.search.searchList,
        currentIndex: state.currentSong.currentIndex,
        audioState: state.currentSong.audioState,
        playlist: state.playlist.items,
        currentSong: state.currentSong.currentSong
    }
}

export default connect(mapStateToProps)(Search);