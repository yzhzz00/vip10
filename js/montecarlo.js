// ================================================
// V90 AI CORE FINAL R6.1
// 异步蒙特卡罗引擎
// 防卡死 + 实时进度
// ================================================


"use strict";


window.V90MonteCarlo={




// ================================
// 加权随机
// ================================


pickWeighted(list,count){


let result=[];


let pool=[...list];



while(
result.length<count &&
pool.length>0
){


let total=

pool.reduce(

(a,b)=>a+b.weight,

0

);



let random=

Math.random()*total;



let sum=0;



for(
let i=0;

i<pool.length;

i++

){


sum+=pool[i].weight;



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
(a,b)=>a-b
);



},







// ================================
// 前区池
// ================================


frontPool(){



let model=

V90Model.trainFront();



let bayes=

V90Bayes.final(model);






return Object.values(bayes)

.map(x=>({


number:x.number,


weight:

x.bayesScore+1


}));



},







// ================================
// 后区池
// ================================


backPool(){


let model=

V90Model.trainBack();



let bayes=

V90Bayes.final(model);




return Object.values(bayes)

.map(x=>({


number:x.number,


weight:

x.bayesScore+1


}));



},







// ================================
// 结构评分
// ================================


structure(front){


let score=0;



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





if(
odd>=2 &&
odd<=3
)

score+=20;




if(
big>=2 &&
big<=4
)

score+=20;




if(
sum>=90 &&
sum<=140
)

score+=20;



return score;



},







// ================================
// 单组评分
// ================================


score(front,back){



let score=

this.structure(front);





let last=

V90Database.last();





if(last){


score+=

V90Markov.adjust(

front,

last

)

*0.05;



}




return Number(
score.toFixed(2)
);



},







// ================================
// 异步百万模拟
// ================================


run(total=1000000){



return new Promise(resolve=>{





let results={};



let current=0;



let batch=5000;



let front=

this.frontPool();



let back=

this.backPool();







function loop(){



for(
let i=0;

i<batch;

i++

){



if(
current>=total
)

break;




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






let score=

V90MonteCarlo.score(

f,

b

);






if(
!results[key]
){


results[key]={



front:f,


back:b,


count:0,


score:0



};



}





results[key].count++;



results[key].score+=score;




current++;



}





// 更新进度


let percent=

Math.floor(

current/total*100

);






if(
window.V90Progress
){


window.V90Progress(

percent,

current,

total

);



}







if(
current<total
){



setTimeout(
loop,
10
);



}else{





let list=

Object.values(results)

.map(x=>({



front:x.front,


back:x.back,



count:x.count,



score:

Number(

(

x.score/x.count

+

x.count*0.01

)

.toFixed(2)

)



}))





.sort(

(a,b)=>

b.score-a.score

)

.slice(0,50);







resolve(list);



}





}





loop();



});



}






};