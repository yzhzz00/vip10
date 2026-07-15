// ================================================
// V90 AI CORE FINAL R7.0
// 蒙特卡罗模拟中心
// ================================================

"use strict";


window.V90MonteCarlo={







// =================================
// 加权随机选择
// =================================


randomPick(list,count){



let result=[];







let pool=[...list];







while(
result.length<count
&&
pool.length>0
){



let total=

pool.reduce(

(a,b)=>

a+b.value,

0

);







let random=

Math.random()

*

total;







let sum=0;







for(
let i=0;

i<pool.length;

i++

){



sum+=pool[i].value;






if(sum>=random){



result.push(

pool[i].number

);



pool.splice(i,1);



break;



}



}



}







return result.sort(

(a,b)=>

a-b

);



},







// =================================
// 生成单组号码
// =================================


generate(frontPool,backPool){



return {



front:

this.randomPick(

frontPool,

5

),



back:

this.randomPick(

backPool,

2

)



};



},







// =================================
// 模拟入口
// =================================


async run(times=100000){



let data=

V90Database.get();







let train=data.slice(

Math.max(

0,

data.length-500

)

);








let frontModel=

V90Model.front(

train

);






let backModel=

V90Model.back(

train

);







let frontBayes=

V90Bayes.final(

frontModel,

"front"

);







let backBayes=

V90Bayes.final(

backModel,

"back"

);







// 转换权重


let frontPool=

frontBayes.map(x=>({



number:x.number,


value:x.probability*1000



}));







let backPool=

backBayes.map(x=>({



number:x.number,


value:x.probability*1000



}));







let result=[];







for(
let i=0;

i<times;

i++

){



let item=

this.generate(

frontPool,

backPool

);







// Markov修正


let markovScore=

V90Markov.score(

item.front,

train,

"front"

)

+

V90Markov.score(

item.back,

train,

"back"

);







item.score=

Number(

(

Math.random()*100

+

markovScore

)

.toFixed(3)

);







result.push(item);








// 更新进度


if(

i%1000===0

){



let percent=

Math.floor(

i/times*100

);






if(
window.V90Progress

){



V90Progress(

percent,

i,

times

);



}



await new Promise(

r=>

setTimeout(r,0)

);



}



}








// 排序


result.sort(

(a,b)=>

b.score-a.score

);







return result.slice(

0,

50

);



}






};