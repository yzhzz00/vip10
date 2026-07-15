window.MODEL_THEORY={



score(front){



let score=1;



let odd=

front.filter(
n=>n%2
).length;



if(
odd>=2 &&
odd<=3
)

score+=0.1;



let sum=

front.reduce(
(a,b)=>a+b,
0
);



if(
sum>=80 &&
sum<=140
)

score+=0.1;



return score;



}



};