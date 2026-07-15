// ================================================
// V90 AI CORE FINAL R6
// 蒙特卡罗预测引擎
// ================================================

"use strict";


window.V90MonteCarlo={



// =================================
// 权重随机选择
// =================================


pickWeighted(list,count){



let result=[];



let pool=[...list];






while(result.length<count && pool.length){



let total=

pool.reduce(

(a,b)=>

a+b.weight,

0

);






let r=

Math.random()*total;






let sum=0;



for(
let i=0;

i<pool.length;

i++

){



sum+=pool[i].weight;






if(sum>=r){



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
// 构建前区概率池
// =================================


frontPool(){



let model=

V90Model.trainFront();



let bayes=

V90Bayes.final(model);





return Object.values(bayes)

.map(item=>({



number:item.number,



weight:

item.bayesScore



}))

;



},







// =================================
// 后区概率池
// =================================


backPool(){



let model=

V90Model.trainBack();



let bayes=

V90Bayes.final(model);






return Object.values(bayes)

.map(item=>({



number:item.number,



weight:

item.bayesScore



}))

;



},







// =================================
// 结构评分
// =================================


structure(front){



let odd=

front.filter(

n=>n%2===1

).length;



let big=

front.filter(

n=>n>=18

).length;



let sum=

front.reduce(

(a,b)=>a+b,

0

);






let score=0;






if(
odd>=2&&odd<=3
)

score+=20;






if(
big>=2&&big<=3
)

score+=20;






if(
sum>=80&&sum<=150
)

score+=20;







return score;



},







// =================================
// 单组评分
// =================================


score(front,back){



let score=

this.structure(front);






// Markov趋势


let last=

V90Database.last();






if(last){



score+=

V90Markov.adjust(

front,

last

)

*0.1;



}







back.forEach(n=>{



score+=n;



});







return score;



},







// =================================
// 百万模拟
// =================================


async run(times=1000000){



return new Promise(resolve=>{





let results={};




let front=

this.frontPool();




let back=

this.backPool();






let current=0;






function loop(){



let batch=5000;







for(
let i=0;

i<batch && current<times;

i++,current++

){



let f=

V90MonteCarlo.pickWeighted(

front,

5

);






let b=

V90MonteCarlo.pickWeighted(

back,

2

);






let key=

f.join("-")

+

"+"

+

b.join("-");






let s=

V90MonteCarlo.score(

f,

b

);






if(!results[key]){



results[key]={



front:f,


back:b,


count:0,


score:0



};



}






results[key].count++;



results[key].score+=s;



}







if(current<times){



setTimeout(
loop,
0
);



}else{






let output=

Object.values(results)

.map(x=>({



front:x.front,


back:x.back,


count:x.count,



score:

Number(

(

x.score/x.count

).toFixed(2)

)



}))

.sort(

(a,b)=>

b.score-a.score

)

.slice(0,50);







resolve(output);



}





}





loop();




});



}






};