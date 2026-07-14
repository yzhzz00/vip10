/*
================================================

彩票智能分析系统 V60 CORE

AI ENGINE

模块：

1. 数据加载
2. 趋势模型
3. 频率模型
4. 遗漏模型
5. 结构模型
6. 蒙特卡罗模拟
7. 回测
8. 反馈学习

================================================
*/


const AIEngine = {



version:"V60 CORE",



dlt:[],


pl5:[],


predictHistory:{


records:[]

},



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



markov:{},



progress:0,









// ==============================
// 初始化
// ==============================


async init(){



await this.loadDLT();



await this.loadPL5();



await this.loadHistory();



await this.loadLearning();



this.buildMarkov();



return true;



},










// ==============================
// 加载大乐透
// ==============================


async loadDLT(){



let res=

await fetch(

"data/dlt.txt"

);



let text=

await res.text();





this.dlt=

this.parseDLT(text);



return this.dlt;



},










// ==============================
// 大乐透解析
// ==============================


parseDLT(text){



let result=[];



let lines=

text.trim()

.split(/\n+/);






lines.forEach(line=>{



let a=

line.trim()

.split(/\s+/);






if(a.length>=9){



result.push({



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





return result;



},










// ==============================
// 加载排列五
// ==============================


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


let a=

x.trim()

.split(/\s+/);



return {


num:a.slice(0,5)


};


});





return this.pl5;



},
// ==============================
// 加载预测历史
// ==============================


async loadHistory(){


try{


let res=

await fetch(

"data/predict_history.json"

);


this.predictHistory=

await res.json();



}catch(e){


this.predictHistory={

records:[]

};


}



},







// ==============================
// 加载学习参数
// ==============================


async loadLearning(){



try{


let res=

await fetch(

"data/learning.json"

);


this.learning=

await res.json();



}catch(e){



}



},







// ==============================
// 保存预测记录
// ==============================


async savePredict(record){



this.predictHistory.records.push(record);



localStorage.setItem(

"predict_history",

JSON.stringify(

this.predictHistory

)

);



},







// ==============================
// 频率模型
// ==============================


frequencyScore(num){



let total=0;



this.dlt.forEach(item=>{



item.front.forEach(n=>{



if(n===num)

total++;



});



});





return total;



},







// ==============================
// 趋势模型
// ==============================


trendScore(num){



let score=0;



let periods=[

10,

30,

100

];






periods.forEach((p,index)=>{



let start=

Math.max(

0,

this.dlt.length-p

);




let count=0;




for(

let i=start;

i<this.dlt.length;

i++

){



if(

this.dlt[i].front.includes(num)

)

count++;



}





score +=

count*(index+1);



});






return score;



},







// ==============================
// 遗漏模型
// ==============================


omitScore(num){



let omit=0;




for(

let i=this.dlt.length-1;

i>=0;

i--

){



if(

this.dlt[i].front.includes(num)

){



break;



}



omit++;



}





return omit;



},







// ==============================
// 和值模型
// ==============================


sumScore(front){



let sum=

front.reduce(

(a,b)=>a+Number(b),

0

);





let avg=91;



return 100-

Math.abs(

sum-avg

);



},







// ==============================
// 奇偶结构评分
// ==============================


structureScore(front){



let odd=0;



front.forEach(n=>{



if(Number(n)%2)

odd++;



});






let score=0;



if(

odd===2||

odd===3

)

score=100;


else

score=70;





return score;



},
// ==============================
// 马尔可夫转移矩阵
// ==============================


buildMarkov(){


let matrix={};




for(

let i=0;

i<this.dlt.length-1;

i++

){



let current=

this.dlt[i].front;



let next=

this.dlt[i+1].front;





current.forEach(a=>{



if(!matrix[a])

matrix[a]={};



next.forEach(b=>{



if(!matrix[a][b])

matrix[a][b]=0;



matrix[a][b]++;



});



});



}



this.markov=matrix;



},







// ==============================
// 马尔可夫评分
// ==============================


markovScore(num){



let score=0;



let last=

this.dlt[

this.dlt.length-1

];





if(!last)

return 0;






last.front.forEach(old=>{



if(

this.markov[old]

&&

this.markov[old][num]

){



let total=

Object.values(

this.markov[old]

)

.reduce(

(a,b)=>a+b,

0

);





score +=

this.markov[old][num]

/

total;



}



});





return score*100;



},







// ==============================
// 综合号码评分
// ==============================


numberScore(num){



let w=

this.learning.weights;





let score=0;





score +=

this.frequencyScore(num)

*

w.frequency;





score +=

this.trendScore(num)

*

w.trend;





score +=

this.omitScore(num)

*

w.omit;





score +=

this.markovScore(num)

*

w.markov;





return score;



},







// ==============================
// 候选池
// ==============================


candidatePool(){



let pool=[];




for(

let i=1;

i<=35;

i++

){



let n=

String(i).padStart(2,"0");





pool.push({



num:n,



score:

this.numberScore(n)



});



}





pool.sort(

(a,b)=>

b.score-a.score

);






return pool;



},







// ==============================
// 随机组合生成
// ==============================


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







// ==============================
// 后区模型
// ==============================


backPool(){



let map={};



for(

let i=1;

i<=12;

i++

){



map[

String(i).padStart(2,"0")

]=0;



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
// ==============================
// 组合评分
// ==============================


combinationScore(front,back){



let score=0;




front.forEach(n=>{


score+=this.numberScore(n);


});





// 和值评分

let sum=

front.reduce(

(a,b)=>a+Number(b),

0

);





score-=

Math.abs(sum-91)

*0.5;





// 奇偶结构

score+=

this.structureScore(front);






return Number(

score.toFixed(2)

);



},







// ==============================
// 蒙特卡罗模拟
// ==============================


monteCarlo(times=1000000,callback){



let pool=

this.candidatePool();





let backs=

this.backPool();






let results=[];



for(

let i=0;

i<times;

i++

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





if(back[0]===back[1])

continue;






let score=

this.combinationScore(

front,

back

);





results.push({


front,

back,


score



});






// 进度反馈

if(

callback &&

i%10000===0

){



callback(

Math.floor(

i/times*100

)

);



}



}





results.sort(

(a,b)=>

b.score-a.score

);





return results.slice(0,3);



},







// ==============================
// 预测入口
// ==============================


predict(){



let result=

this.monteCarlo(

100000

);






let record={



time:

new Date()

.toISOString(),



result



};





this.savePredict(record);






return result;



},







// ==============================
// 滚动回测
// ==============================


backtest(period=100){



let data=

this.dlt.slice(

-this.dlt.length

-period

);



let hit3=0;

let hit4=0;

let hit5=0;





return {



period,


hit3,


hit4,


hit5



};



},







// ==============================
// 开奖反馈学习
// ==============================


feedback(realFront,realBack){



let records=

this.predictHistory.records;





let last=

records[

records.length-1

];





if(!last)

return;






last.real={



front:realFront,


back:realBack



};





let best=

last.result[0];





let hit=0;





best.front.forEach(n=>{



if(realFront.includes(n))

hit++;



});






// 简单权重调整


if(hit>=3){



this.learning.weights.trend+=0.01;



}

else{



this.learning.weights.omit+=0.01;



}






// 限制范围


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









// ==============================
// 报告
// ==============================


report(){



return {



version:this.version,



data:

this.dlt.length,



weights:

this.learning.weights



};



}



};








window.AIEngine=

AIEngine;