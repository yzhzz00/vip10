// ================================================
// 大乐透AI V90 Worker
// Monte Carlo计算线程
// ================================================


"use strict";





self.onmessage=function(e){



let msg=e.data;




if(
msg.type!=="MONTE_CARLO"
){

return;

}





let times =
msg.times || 1000000;



let result={};







for(
let i=0;
i<times;
i++
){



let nums=[];





while(
nums.length<5
){



let n=

Math.floor(
Math.random()*35
)+1;




if(
!nums.includes(n)
){



nums.push(n);



}



}






nums.sort(
(a,b)=>a-b
);






let key=
nums.join("-");





if(
!result[key]
){

result[key]=0;


}



result[key]++;








// 每50000次反馈一次

if(
i%50000===0
){



self.postMessage({



type:"PROGRESS",



value:

Math.floor(
i/times*100
),



current:i,



total:times



});



}



}








let ranking =

Object.keys(result)

.sort(

(a,b)=>

result[b]-result[a]

)

.slice(0,20)

.map(x=>({



number:x,


count:
result[x]



}));








self.postMessage({



type:"RESULT",



data:ranking



});



};