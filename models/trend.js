window.MODEL_TREND={


score(num,history){



let recent=

history.slice(-50);



let count=0;



recent.forEach(h=>{


if(h.front.includes(num))

count++;


});



return count/recent.length;



}


};