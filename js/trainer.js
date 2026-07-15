// ================================================
// V90 AI CORE FINAL R7.0
// 历史训练预测引擎
// ================================================

"use strict";


window.V90Trainer={



// =================================
// 临时数据库
// =================================


history:[],







// =================================
// 设置训练数据
// =================================


setHistory(data){


this.history=data;


},







// =================================
// 前区评分
// =================================


frontScore(data){



let score={};





for(
let i=1;

i<=35;

i++

){



score[i]={



number:i,


value:0



};



}








data.forEach(draw=>{



draw.front.forEach(n=>{



score[n].value+=1;



});



});








// 遗漏加权


for(
let i=1;

i<=35;

i++

){



let miss=0;






for(
let j=data.length-1;

j>=0;

j--

){



if(
data[j].front.includes(i)

)

break;



miss++;



}






score[i].value+=

50/(miss+1);



}






return Object.values(score)

.sort(

(a,b)=>

b.value-a.value

);



},







// =================================
// 后区评分
// =================================


backScore(data){



let score={};






for(
let i=1;

i<=12;

i++

){



score[i]={



number:i,


value:0



};



}







data.forEach(draw=>{



draw.back.forEach(n=>{



score[n].value+=1;



});



});







for(
let i=1;

i<=12;

i++

){



let miss=0;






for(
let j=data.length-1;

j>=0;

j--

){



if(
data[j].back.includes(i)

)

break;



miss++;



}






score[i].value+=

40/(miss+1);



}








return Object.values(score)

.sort(

(a,b)=>

b.value-a.value

);



},







// =================================
// 结构过滤
// =================================


structure(front){



let result=[];







front.forEach(a=>{



let sum=

a.reduce(

(x,y)=>x+y,

0

);






let odd=

a.filter(

n=>n%2

).length;






if(

sum>=80

&&

sum<=160

&&

odd>=1

&&

odd<=4

){



result.push(a);



}



});






return result;



},







// =================================
// 生成预测
// =================================


predict(data){



this.setHistory(data);







let frontRank=

this.frontScore(data);






let backRank=

this.backScore(data);






let best=[];



let bestBack=[];






// 前区候选


let frontPool=

frontRank

.slice(
0,
12
)

.map(x=>x.number);







while(best.length<5){



let n=

frontPool[

Math.floor(

Math.random()

*

frontPool.length

)

];





if(

!best.includes(n)

)

best.push(n);



}








best.sort(

(a,b)=>

a-b

);







// 后区


let backPool=

backRank

.slice(
0,
6
)

.map(x=>x.number);






while(bestBack.length<2){



let n=

backPool[

Math.floor(

Math.random()

*

backPool.length

)

];





if(

!bestBack.includes(n)

)

bestBack.push(n);



}







bestBack.sort(

(a,b)=>

a-b

);






return {



front:best,


back:bestBack



};



}






};