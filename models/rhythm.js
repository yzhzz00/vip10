window.MODEL_RHYTHM={



score(history){



let recent=

history.slice(-30);



let sums=recent.map(h=>


h.front.reduce(
(a,b)=>a+b,
0
)


);



let avg=

sums.reduce(
(a,b)=>a+b,
0
)
/sums.length;



let last=

sums[sums.length-1];



return 1-

Math.min(

Math.abs(last-avg)/100,

1

);



}



};