window.MODEL_ANTIHUMAN={



score(front){



let score=1;



let birthday=

front.filter(
n=>n<=31
).length;



if(birthday===5)

score-=0.1;



let consecutive=0;



for(
let i=1;
i<front.length;
i++
){


if(
front[i]-front[i-1]===1
)

consecutive++;


}



if(consecutive>=2)

score-=0.1;



return score;



}



};