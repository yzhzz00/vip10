window.MODEL_FREQUENCY={


score(num,history){


let count=0;


history.forEach(h=>{


if(h.front.includes(num))

count++;


});



return count/history.length;



}


};