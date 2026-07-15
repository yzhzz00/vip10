window.MODEL_MISSING={



score(num,history){



let miss=0;



for(
let i=history.length-1;
i>=0;
i--
){


if(history[i].front.includes(num))

break;


miss++;


}



return 1/(miss+1);



}


};