//解析歌词字符串
export function parseLyric(lyric){
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

//函数节流
export function _throttle(fn,delay=200){
    // let first = true,
    //     self = fn,
    //     timer;
    // return function(){
    //     let args = arguments,
    //         that = this;
    //     if(first){
    //         self.apply(that, args);
    //         return first = false;
    //     }
    //     if(timer){
    //         return false;
    //     }
    //     timer = setTimeout(function(){
    //         self.apply(that, args);
    //     }, interval)
    // }
    let timer;
    let first = true;
    return function(){
        var args = arguments;
        if(first){
            fn.apply(this, arguments);
            return first = false;
        }
        if(timer){
            return false;
        }
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer  = null;
            fn.apply(this, args);
        }, delay || 300)
    }
}