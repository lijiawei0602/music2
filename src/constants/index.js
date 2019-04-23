export function addHistoryList(t){
    let history = JSON.parse(localStorage.getItem("history")) || [];
    const index = history.findIndex(item => {
        return item.id === t.id
    });
    console.log(index);
    if(index === -1){
        let newList = [t, ...history];
        localStorage.setItem("history", JSON.stringify(newList));
    }
}

export function deleteHistoryList(t){
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let newList = history.filter((item,index)=>{
        return item.id !== t.id;
    });
    localStorage.setItem("history", JSON.stringify(newList));
}