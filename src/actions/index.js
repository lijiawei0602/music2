import * as types from '../constants/actionTypes.js';
import * as api from '../api/index.js';

//接受Playlist
function receivePlaylist(json){
    return {
        type: types.RECEIVE_PLAYLIST,
        items: json
    }
}

//获取Playlist
export function requestPlaylist(items){
    return dispatch => {
        api.topList(1).then(res => {
            let arr = res.data.playlist.tracks;
            return filterPlaylist(arr);
        }).then(json => {
            if(!items.length){
                dispatch(receivePlaylist(json));
            }else{
                dispatch(receivePlaylist(items));
            }
            
        }).catch(e => {
            console.log(e);
        })
    }
}

//接收歌词
function receiveLyric(lyric){
    return{
        type: types.RECEIVE_LYRIC,
        lyric
    }
}

//请求歌词
export function fetchLyric(id){
    return dispatch => {
        api.lyric(id).then(res => {
            const lyric = res.data.lrc.lyric;
            return lyric;
        }).then(lyric => {
            dispatch(receiveLyric(lyric));
        }).catch(e => {
            console.log(e);
        });
    };
}

//接收当前歌曲
function receiveCurrentSong(currentSong){
    return {
        type: types.RECEIVE_CURRENTSONG,
        currentSong
    }
}

//根据歌曲id获取当前歌曲
export function fetchCurrentSong(id=347230){
    return dispatch => {
        api.getSongById(id).then(res => {
            const currentSong = res.data.songs[0];
            return filterCurrentSong(currentSong);
        }).then(json => {
            return dispatch(receiveCurrentSong(json));
        }).catch(e => {
            console.log(e);
        });
    }
}

function receiveMusicUrl(musicUrl){
    return {
        type: types.RECEIVE_MUSICURL,
        musicUrl
    }
}

//获取music Url
export function fetchMusicUrl(id){
    return dispatch => {
        /*     目前该接口出现问题     */
        // api.getMusicUrl(id).then(res => {
        //     return res.data.data[0].url;
        // }).then(json => {
        //     dispatch(receiveMusicUrl(json));
        // }).catch(e => {
        //     console.log(e);
        // });
        const url = `http://music.163.com/song/media/outer/url?id=${id}.mp3`
        dispatch(receiveMusicUrl(url));
    }
}

//切换audio状态
export function switchAudio(state){
    return {
        type: types.SWITCH_AUDIO,
        audioState: state
    }
}

//更新currentTime
export function updateCurrentTime(time){
    return {
        type: types.UPDATE_CURRENTTIME,
        currentTime: filterCurrentTime(time)
    }
}

//更新currentIndex
export function updateCurrentIndex(index){
    return {
        type: types.UPDATE_CURRENTINDEX,
        currentIndex: index
    }
}

//更新playList
export function updatePlayList(items){
    return {
        type: types.UPDATE_PLAYLIST,
        items
    }
}

//切换audioMode
export function switchAudioMode(mode){
    return {
        type: types.SWITCH_AUDIOMODE,
        mode
    }
}

function receiveHotComment(comment){
    return {
        type: types.RECEIVE_HOTCOMMENT,
        comment
    }
}

function receiveNewComment(comment){
    return {
        type: types.RECEIVE_NEWCOMMENT,
        comment
    }
}

export function fetchComment(id, limit=20,offset=0){
    return dispatch => {
        api.getMusicComment(id,limit,offset).then(res => {
            return res.data;
        }).then(json => {
            dispatch(receiveHotComment(json.hotComments));
            dispatch(receiveNewComment(json.comments));
        }).catch(e => {
            console.log(e);
        });
    };
}

//继续拉取歌曲最新评论
export function reFetchComment(id,limit=20,offset=0,hotComment,lastNewComment){
    return dispatch => {
        api.getMusicComment(id,limit,offset).then(res => {
            return res.data;
        }).then(json => {
            dispatch(receiveHotComment(hotComment));
            dispatch(receiveNewComment(lastNewComment.concat(json.comments)));
        }).catch(e => {
            console.log(e);
        });
    }
}

//接收榜单
function receiveTop(top){
    return{
        type: types.RECEIV_TOP,
        top
    }
}

//获取榜单
export function fetchTop(){
    return dispatch => {
        api.getTop().then(res => {
            return res.data;
        }).then(json => {
            let list = json.list.filter(item => {
                return item.ToplistType !== undefined;
            });
            dispatch(receiveTop(list));
        }).catch(e => {
            console.log(e);
        });
    };
}

//接收热门歌单
function receivePersonalized(personal){
    return {
        type: types.RECEIVE_PERSONALIZED,
        personal
    }
}

//获取热门歌单
export function fetchPersonalized(){
    return dispatch => {
        api.getPersonalized().then(res => {
            return res.data;
        }).then(json => {
            dispatch(receivePersonalized(json.result));
        }).catch(e=> {
            console.log(e);
        });
    };
}

//接收歌单详情
function receiveDetail(detail){
    return {
        type: types.RECEIVE_DETAIL,
        detail
    }
}

export function fetchDetail(id){
    return dispatch => {
        api.getDetail(id).then(res => {
            let arr = res.data.result.tracks;
            return parseTopDetail(arr);     
        }).then(json => {
            dispatch(receiveDetail(json));
        }).catch(e => {
            console.log(e);
        });
    };
}

//接收热门歌手
function receiveHotSinger(singer){
    return{
        type: types.RECEIVE_HOTSINGER,
        singer
    }
}

export function fetchHotSinger(){
    return dispatch => {
        api.getHotSinger().then(res => {
            return res.data.result.hots;
        }).then(json => {
            dispatch(receiveHotSinger(json));
        }).catch(e => {
            console.log(e);
        });
    };
}

function receiveSearch(searchList){
    return {
        type: types.RECEIVE_SEARCH,
        searchList
    }
}

export function fetchSearch(keywords,limit,offset,lastSearchList=[]){
    return dispatch => {
        api.search(keywords,limit,offset).then(res => {
            return res.data.result.songs;
        }).then(json => {
            json = parseTopDetail(json);
            dispatch(receiveSearch(lastSearchList.concat(json)));
        }).catch(e => {
            console.log(e);
        });
    };
}

//获取用户Id
function receiveUserId(id){
    return {
        type: types.RECEIVE_USERID,
        id
    }
}

//登录
function receiveLogin(res){
    return {
        type: types.RECEIVE_LOGIN,
        res
    }
}

export function fetchLogin(mobile, pass){
    return dispatch => {
        api.login(mobile, pass).then(res => {
            return res.data;
        }).then(json => {
            dispatch(receiveLogin(json));
            if(json.code === 200){
                dispatch(receiveUserId(json.account.id));
                localStorage.setItem("userId", json.account.id);
            }
        }).catch(e => {
            console.log(e);
        });
    }
}

export function fetchUserInfo(id){
    return dispatch => {
        api.getUserInfo(id).then(res => {
            return res.data;
        }).then(json => {
            dispatch(receiveLogin(json));
        })
    }
}

export function exit(){
    localStorage.removeItem("userId");
    return {
        type: types.RECEIVE_LOGIN,
        res: undefined
    }
}

function receiveUserPlayList(json){
    return {
        type: types.RECEIVE_USERPLAYLIST,
        mylist: json
    }
}

export function fetchUserPlayList(id){
    return dispatch => {
        api.getUserPlayList(id).then(res => {
            return res.data;
        }).then(json => {
            dispatch(receiveUserPlayList(json.playlist));
        })
    }
}

export function receiveHistoryList(){
    return {
        type: types.RECEIVE_HISTORY,
        list: JSON.parse(localStorage.getItem("history")) || []
    }
}

export function updateCurrentBuffer(buffer){
    return {
        type: types.RECEIVE_BUFFER,
        buffer
    }
}



function filterPlaylist(json){
    let arr = [];
    json.forEach(item => {
        if(item.id){
            var foo = {
                id: item.id,
                name: item.name,
                author: item.ar.length>0 && filterSinger(item.ar),
                duration: filterDuration(item.dt),
                image: item.al.picUrl,
                url: `http://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
                album: item.al.name
            }
            arr.push(foo);
        }
    });
    return arr;
}

function filterSinger(singers){
    let arr = [];
    singers.forEach(item => {
        arr.push(item.name);
    });
    return arr.join("/");
}

function filterDuration(time){
    let dt = time / 1000;
    let m = Math.floor(dt / 60);
    let s = Math.floor(dt % 60);
    return `${addZero(m)}:${addZero(s)}`;
}

function addZero(s){
    return s < 10 ? '0'+s : s;
}

function filterCurrentSong(item){
    var foo = {
        id: item.id,
        name: item.name,
        author: item.ar.length>0 && filterSinger(item.ar),
        duration: filterDuration(item.dt),
        image: item.al.picUrl,
        url: `http://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
        album: item.al.name
    }
    return foo;
}

function filterCurrentTime(value){
    let minute = Math.floor(value / 60);
    let second = Math.floor(value % 60);
    return `${addZero(minute)}:${addZero(second)}`
}

function parseTopDetail(json){
    let arr = [];
    json.forEach(item => {
        if(item.id){
            var foo = {
                id: item.id,
                name: item.name,
                author: item.artists.length>0 && filterSinger(item.artists),
                duration: filterDuration(item.duration) || 1000,
                image: item.album.picUrl || null,
                url: `http://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
                album: item.album.name
            }
            arr.push(foo);
        }
    });
    return arr;
}