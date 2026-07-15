// ================================================
// V90 AI CORE FINAL R3
// Monte Carlo 模拟引擎
// ================================================

"use strict";


window.V90MonteCarlo={



// 生成前区

createFront(){


let arr=[];



while(
arr.length<5
){


let n=

Math.floor(
Math.random()*35
)+1;



if(
!arr.includes(n)
){


arr.push(n);


}



}



return arr.sort(
(a,b)=>a-b
);



},







// 生成后区


createBack(){


let arr=[];



while(
arr.length<2
){



let n=

Math.floor(
Math.random()*12
)+1;



if(
!arr.includes(n)
){


arr.push(n);


}



}



return arr.sort(
(a,b)=>a-b
);



},







// =================================
// 分批模拟
// =================================


run(
times=1000000,
progress
){



return new Promise(resolve=>{



let pool={};



let current=0;





function batch(){



let size=5000;






for(
let i=0;

i<size && current<times;

i++,current++

){



let front=

V90MonteCarlo.createFront();



let back=

V90MonteCarlo.createBack();






let key=

front.join("-")

+

"+"

+

back.join("-");








if(
!pool[key]
){



pool[key]={



front,


back,


count:0



};



}







pool[key].count++;




}







let percent=

Math.floor(

current/times*100

);








if(progress){



progress(percent);



}






if(
current<times
){



setTimeout(
batch,
0
);



}

else{



let result=

Object.values(pool)

.sort(

(a,b)=>

b.count-a.count

)

.slice(0,100);







resolve(result);



}




}






batch();



});



}



};