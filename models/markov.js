window.MODEL_MARKOV={



score(num,history){



if(history.length<2)

return 0;



let last=

history[history.length-1];



let before=

history[history.length-2];



let score=0;



if(last.front.includes(num))

score+=0.6;



if(before.front.includes(num))

score+=0.4;



return score;



}



};