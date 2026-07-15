// ================================================
// 大乐透AI V90 CORE FINAL
// Monte Carlo 模拟引擎
// ================================================

"use strict";


window.V90MonteCarlo={







// =================================
// 随机生成前区
// =================================


createFront(){



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





return nums.sort(

(a,b)=>a-b

);



},







// =================================
// 随机生成后区
// =================================


createBack(){



let nums=[];






while(
nums.length<2
){



let n=

Math.floor(
Math.random()*12
)+1;






if(
!nums.includes(n)
){



nums.push(n);



}



}






return nums.sort(

(a,b)=>a-b

);



},







// =================================
// 模拟100万次
// =================================


run(
times=1000000,
callback
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







let progress=

Math.floor(

current/times*100

);







if(callback){



callback(progress);



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