import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import * as types from '../constants/actionTypes.js';


function playlist(state={items:[]}, action){
    switch(action.type){
        case types.RECEIVE_PLAYLIST:
            return Object.assign({}, state, {items: action.items});
        case types.UPDATE_PLAYLIST:
            return Object.assign({}, state, {items: action.items});
        default:
            return state;
    }
}

function Main(state={ lyric: '' }, action){
    switch(action.type){
        case types.RECEIVE_LYRIC:
            return Object.assign({}, state, { lyric: action.lyric });
        default:
            return state;
    }
}

function currentSong(state={currentIndex: 0, audioState: "pause", audioMode: "order", newComment:[],currentBuffer:0}, action){
    switch(action.type){
        case types.RECEIVE_CURRENTSONG:
            return Object.assign({}, state, {currentSong: action.currentSong});
        case types.RECEIVE_MUSICURL:
            return Object.assign({}, state, {musicUrl: action.musicUrl});
        case types.SWITCH_AUDIO:
            return Object.assign({}, state, {audioState: action.audioState});
        case types.UPDATE_CURRENTTIME:
            return Object.assign({}, state, {currentTime: action.currentTime});
        case types.UPDATE_CURRENTINDEX:
            return Object.assign({}, state, {currentIndex: action.currentIndex});
        case types.SWITCH_AUDIOMODE:
            return Object.assign({}, state, {audioMode: action.mode});
        case types.RECEIVE_HOTCOMMENT:
            return Object.assign({}, state, {hotComment: action.comment});
        case types.RECEIVE_NEWCOMMENT:
            return Object.assign({}, state, {newComment: action.comment});
        case types.RECEIVE_BUFFER:
            return Object.assign({}, state, {currentBuffer: action.buffer});
        default:
            return state;
    }
}

function top(state={}, action){
    switch(action.type){
        case types.RECEIV_TOP:
            return Object.assign({}, state, {toplist: action.top});
        case types.RECEIVE_PERSONALIZED:
            return Object.assign({}, state, {personal: action.personal});
        case types.RECEIVE_DETAIL:
            return Object.assign({}, state, {detail: action.detail});
        default:
            return state;
    }
}

function search(state={searchList:[]}, action){
    switch(action.type){
        case types.RECEIVE_HOTSINGER:
            return Object.assign({}, state, {singer: action.singer});
        case types.RECEIVE_SEARCH:
            return Object.assign({}, state, {searchList: action.searchList});
        default:
            return state;
    }
}

function login(state={userid: localStorage.getItem("userId") || -1}, action){
    switch(action.type){
        case types.RECEIVE_USERID:
            return Object.assign({}, state, {userid: action.id});
        case types.RECEIVE_LOGIN:
            return Object.assign({}, state, {res: action.res});
        
        default:
            return state;
    }
}

function mylist(state={}, action){
    switch(action.type){
        case types.RECEIVE_USERPLAYLIST:
            return Object.assign({}, state, { list: action.mylist });
        default:
            return state;
    }
}

function history(state={list: []}, action){
    switch(action.type){
        case types.RECEIVE_HISTORY:
            return Object.assign({}, state, {list: action.list});
        default:
            return state;
    }
}

export default combineReducers({
    playlist,
    Main,
    currentSong,
    top,
    search,
    login,
    mylist,
    history,
	routing:routerReducer
});