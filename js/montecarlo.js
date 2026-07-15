// ================================================
// 大乐透AI V90 FINAL R2
// Monte Carlo 100万模拟
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


run(times,progress){



return new Promise(resolve=>{



let result={};



let current=0;




function batch(){



let batchSize=5000;





for(
let i=0;

i<batchSize && current<times;

i++,current++

){



let front=

V90MonteCarlo.createFront();



let back=

V90MonteCarlo.createBack();






let key=

front.join("-")

+

"|"

+

back.join("-");






if(
!result[key]
){



result[key]={



front,


back,


count:0



};



}






result[key].count++;



}






let p=

Math.floor(
current/times*100
);






if(progress){



progress(p);



}







if(
current<times
){



setTimeout(
batch,
0
);



}else{






let ranking=

Object.values(result)

.sort(

(a,b)=>

b.count-a.count

)

.slice(0,100);






resolve(ranking);



}






}



batch();





});



}







};