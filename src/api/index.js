// import fetch from 'isomorphic-fetch';
import axios from 'axios';

const URL = `http://localhost:3300`;
// const URL = `http://lijiawei.com.cn:3300`;

//排行榜歌曲
export function topList(idx){  
    const url = `${URL}/top/list?idx=${idx}`;
    return axios(url);
}
//歌词
export function lyric(id){
    const url = `${URL}/lyric?id=${id}`;
    return axios(url);
}
//歌曲详情
export function getSongById(id){
    const url = `${URL}/song/detail?ids=${id}`;
    return axios(url);
}
//获取音乐url
export function getMusicUrl(id){
    const url = `${URL}/music/url?id=${id}`;
    return axios(url);
}
//获取音乐评论
export function getMusicComment(id,limit=20,offset=0){
    const url= `${URL}/comment/music?id=${id}&limit=${limit}&offset=${offset}`;
    return axios(url);
}

//获取榜单
export function getTop(){
    const url = `${URL}/toplist/detail`;
    return axios(url);
}

//获取推荐歌单
export function getPersonalized(){
    const url = `${URL}/personalized`;
    return axios(url);
}

//获取歌单详情
export function getDetail(id){
    const url = `${URL}/playlist/detail?id=${id}`;
    return axios(url);
}

//获取热门歌手
export function getHotSinger(){
    const url = `${URL}/search/hot`;
    return axios(url);
}

//搜索
export function search(keywords,limit=30,offset=0){
    const url = `${URL}/search?keywords=${keywords}&limit=${limit}&offset=${offset}`;
    return axios(url);
}

//登录
export function login(mobile, pass){
    const url = `${URL}/login/cellphone?phone=${mobile}&password=${pass}`;
    return axios(url);
}

//获取用户信息
export function getUserInfo(id){
    const url = `${URL}/user/detail?uid=${id}`;
    return axios(url);
}

//获取用户歌单
export function getUserPlayList(id){
    const url = `${URL}/user/playlist?uid=${id}`;
    return axios(url);
}