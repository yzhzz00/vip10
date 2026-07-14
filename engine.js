/*
================================================

大乐透智能分析系统 V60.1 CORE

优化版 AI ENGINE

特点:
- 数据缓存
- 趋势模型
- 遗漏模型
- 马尔可夫
- 异步模拟接口

================================================
*/


const AIEngine={


version:"V60.1",


dlt:[],


pl5:[],


cache:{},


markov:{},


learning:{


weights:{


frequency:0.2,


trend:0.2,


omit:0.2,


markov:0.15,


sum:0.1,


structure:0.15


}


},


predictHistory:{


records:[]

},






// ======================
// 初始化
// ======================


async init(){


await this.loadDLT();


await this.loadPL5();


await this.loadLearning();


this.buildCache();


this.buildMarkov();



return true;


},







// ======================
// 大乐透读取
// ======================


async loadDLT(){


let res=

await fetch(

"data/dlt.txt"

);



let text=

await res.text();



this.dlt=

this.parseDLT(text);



},






// ======================
// 大乐透解析
// ======================


parseDLT(text){



let arr=[];



text.trim()

.split(/\n+/)

.forEach(line=>{



let a=

line.trim()

.split(/\s+/);



if(a.length>=9){



arr.push({


issue:a[0],


date:a[1],


front:[

a[2],
a[3],
a[4],
a[5],
a[6]

],


back:[

a[7],
a[8]

]


});



}



});



return arr;


},







// ======================
// 排列五
// ======================


async loadPL5(){


let res=

await fetch(

"data/pl5.txt"

);



let text=

await res.text();



this.pl5=

text.trim()

.split(/\n+/)

.map(x=>{


return {

num:x.trim()

.split(/\s+/)

};


});


},







// ======================
// 加载学习参数
// ======================


async loadLearning(){


try{


let res=

await fetch(

"data/learning.json"

);



this.learning=

await res.json();



}

catch(e){


console.log(

"learning初始化"

);


}



},







// ======================
// 建立缓存
// ======================


buildCache(){



this.cache.frequency={};


this.cache.omit={};


this.cache.trend={};





for(let i=1;i<=35;i++){



let n=

String(i)

.padStart(2,"0");



this.cache.frequency[n]=0;


this.cache.omit[n]=0;


this.cache.trend[n]=0;



}






// 频率


this.dlt.forEach(item=>{


item.front.forEach(n=>{


this.cache.frequency[n]++;


});


});







// 趋势


let periods=[10,30,100];



periods.forEach((p,index)=>{



let start=

Math.max(

0,

this.dlt.length-p

);




for(let i=start;i<this.dlt.length;i++){



this.dlt[i].front.forEach(n=>{


this.cache.trend[n]+=

(index+1);


});


}


});







// 遗漏


for(let n in this.cache.omit){


for(

let i=this.dlt.length-1;

i>=0;

i--

){


if(

this.dlt[i].front.includes(n)

)

break;



this.cache.omit[n]++;


}


}



},
// ======================
// 马尔可夫模型
// ======================


buildMarkov(){


let map={};



for(

let i=0;

i<this.dlt.length-1;

i++

){



let a=

this.dlt[i].front;



let b=

this.dlt[i+1].front;





a.forEach(x=>{



if(!map[x])

map[x]={};





b.forEach(y=>{



if(!map[x][y])

map[x][y]=0;



map[x][y]++;



});



});



}



this.markov=map;



},









// ======================
// 单号码评分
// ======================


numberScore(n){



let w=

this.learning.weights;



let score=0;





score+=

this.cache.frequency[n]

*w.frequency;



score+=

this.cache.trend[n]

*w.trend;



score+=

this.cache.omit[n]

*w.omit;





return score;



},







// ======================
// 候选池
// ======================


candidatePool(){



let arr=[];



for(

let i=1;

i<=35;

i++

){



let n=

String(i)

.padStart(2,"0");





arr.push({


num:n,


score:

this.numberScore(n)



});



}





arr.sort(

(a,b)=>

b.score-a.score

);




return arr;



},









// ======================
// 随机生成前区
// ======================


randomFront(pool){



let result=[];



while(

result.length<5

){



let index=

Math.floor(

Math.random()*pool.length

);



let n=

pool[index].num;





if(

!result.includes(n)

){


result.push(n);


}



}





return result.sort(

(a,b)=>

Number(a)-Number(b)

);



},







// ======================
// 后区池
// ======================


backPool(){



let map={};



for(let i=1;i<=12;i++){


let n=

String(i)

.padStart(2,"0");



map[n]=0;



}







this.dlt.forEach(item=>{



item.back.forEach(n=>{


map[n]++;


});


});






return Object.keys(map)

.sort(

(a,b)=>

map[b]-map[a]

);



},







// ======================
// 组合评分
// ======================


comboScore(front,back){



let score=0;





front.forEach(n=>{



score+=

this.numberScore(n);



});





let sum=

front.reduce(

(a,b)=>

a+Number(b),

0

);





score-=

Math.abs(sum-92);



return Number(

score.toFixed(2)

);



},







// ======================
// 分批蒙特卡罗
// ======================


async monteCarloAsync(

times=1000000,

callback

){



let pool=

this.candidatePool();



let backs=

this.backPool();



let result=[];



let batch=5000;





for(

let i=0;

i<times;

i+=batch

){



for(

let j=0;

j<batch && i+j<times;

j++

){



let front=

this.randomFront(pool);





let back=[



backs[

Math.floor(

Math.random()*backs.length

)

],



backs[

Math.floor(

Math.random()*backs.length

)

]

];





if(

back[0]===back[1]

)

continue;






result.push({



front,


back,


score:

this.comboScore(

front,

back

)



});





}






if(callback){



callback(

Math.floor(

(i/times)*100

)

);



}






await new Promise(

r=>

setTimeout(r,5)

);



}







result.sort(

(a,b)=>

b.score-a.score

);






return result.slice(0,3);



},
// ======================
// 预测入口
// ======================


async predict(callback){



let result=

await this.monteCarloAsync(

1000000,

callback

);





let record={



time:

new Date()

.toISOString(),



result:result



};






this.predictHistory.records.push(

record

);






localStorage.setItem(

"predict_history",

JSON.stringify(

this.predictHistory

)

);





return result;



},







// ======================
// 回测模块
// ======================


backtest(period=100){



let start=

Math.max(

0,

this.dlt.length-period

);



let hit={



three:0,


four:0,


five:0



};






for(

let i=start;

i<this.dlt.length;

i++

){



let real=

this.dlt[i].front;



let pool=

this.candidatePool();



let predict=

pool

.slice(0,5)

.map(x=>x.num);






let count=0;



predict.forEach(n=>{



if(real.includes(n))

count++;



});






if(count>=3)

hit.three++;



if(count>=4)

hit.four++;



if(count>=5)

hit.five++;



}






return {



period,


hit



};



},







// ======================
// 开奖反馈学习
// ======================


feedback(front,back){



let history=

JSON.parse(

localStorage.getItem(

"predict_history"

)

||

'{"records":[]}'

);





if(

history.records.length===0

)

return;



let last=

history.records[

history.records.length-1

];





let best=

last.result[0];





let hit=0;



best.front.forEach(n=>{



if(front.includes(n))

hit++;



});






this.learning.training=

this.learning.training||{};



this.learning.training.times++;



if(hit>=3){



this.learning.weights.trend+=0.01;



this.learning.training.correct3++;



}

else{



this.learning.weights.omit+=0.005;



}






// 权重限制


Object.keys(

this.learning.weights

)

.forEach(k=>{



if(

this.learning.weights[k]>0.4

)

this.learning.weights[k]=0.4;



if(

this.learning.weights[k]<0.05

)

this.learning.weights[k]=0.05;



});







localStorage.setItem(

"learning",

JSON.stringify(

this.learning

)

);





},







// ======================
// 系统报告
// ======================


report(){



return {



version:this.version,


history:this.dlt.length,


weights:this.learning.weights



};



}





};






window.AIEngine=

AIEngine;