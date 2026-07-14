/*
====================================

大乐透AI智能分析系统 V60.0

核心引擎

功能：
历史学习
概率模型
趋势分析
马尔可夫转移

====================================
*/


const AIEngine60={


version:"V60.0",


history:[],


probability:{},


markov:{},


trainLog:[],


weight:{


frequency:0.30,


recent:0.25,


markov:0.20,


structure:0.15,


sum:0.10


},






// 初始化

init(data){


this.history=data||[];


this.probability={};


this.markov={};


this.buildProbability();


this.buildMarkov();



},







// 特征提取

extractFeature(item){



let front=

item.front.map(Number);



let sum=

front.reduce(

(a,b)=>a+b,

0

);




let span=

Math.max(...front)

-

Math.min(...front);





let odd=

front.filter(

n=>n%2===1

).length;





let zone=[0,0,0];



front.forEach(n=>{


if(n<=12)

zone[0]++;


else if(n<=24)

zone[1]++;


else

zone[2]++;


});





return {


sum,

span,

odd,

even:5-odd,

zone


};



},







// 建立号码概率

buildProbability(){



let data={};



for(let i=1;i<=35;i++){



let n=

String(i).padStart(2,"0");



data[n]={


total:0,

recent:0,

score:0


};


}





this.history.forEach(item=>{


item.front.forEach(n=>{


data[n].total++;


});


});





let recent=

this.history.slice(-100);





recent.forEach(item=>{


item.front.forEach(n=>{


data[n].recent++;


});


});







for(let n in data){



data[n].score=

data[n].total*

this.weight.frequency

+

data[n].recent*

this.weight.recent;



}






this.probability=data;



},
// ==========================
// 马尔可夫转移矩阵
// ==========================

buildMarkov(){


this.markov={};



for(
let i=0;

i<this.history.length-1;

i++

){



let current=

this.history[i].front;



let next=

this.history[i+1].front;





current.forEach(a=>{



if(!this.markov[a]){


this.markov[a]={};


}





next.forEach(b=>{



if(!this.markov[a][b]){


this.markov[a][b]=0;


}



this.markov[a][b]++;



});



});



}



},









// ==========================
// 马尔可夫评分
// ==========================

markovScore(num,last){



let score=0;



if(!last)

return 0;





last.forEach(old=>{



if(

this.markov[old]

&&

this.markov[old][num]

){



let total=0;



Object.values(

this.markov[old]

)

.forEach(v=>{


total+=v;


});





score+=

(

this.markov[old][num]

/

total

)

*

100

*

this.weight.markov;



}



});






return score;



},









// ==========================
// 结构评分
// ==========================

structureScore(num,feature){



let score=0;



let n=

Number(num);





// 奇偶结构

if(

feature.odd===3

&&

n%2===1

){


score+=5;


}





if(

feature.odd===2

&&

n%2===0

){


score+=5;


}





// 和值结构

if(

feature.sum>100

&&

n>=20

){


score+=3;


}




if(

feature.sum<90

&&

n<20

){


score+=3;


}





return score*

this.weight.structure;



},









// ==========================
// 综合号码评分
// ==========================

numberScore(num,feature,last){



let score=0;



if(

this.probability[num]

){



score+=

this.probability[num].score;



}






score+=

this.markovScore(

num,

last

);






score+=

this.structureScore(

num,

feature

);






return score;



},










// ==========================
// 生成号码概率池
// ==========================

predictPool(){



let last=

this.history[

this.history.length-1

];






let feature=

this.extractFeature(last);






let pool=[];



for(let n in this.probability){



pool.push({



number:n,



score:

this.numberScore(

n,

feature,

last.front

)



});



}







pool.sort(

(a,b)=>b.score-a.score

);






return pool;



},










// ==========================
// 前区组合生成
// ==========================

generateFront(pool){



let result=[];



let arr=[...pool];





while(

result.length<5

&&

arr.length

){



let index=

Math.floor(

Math.random()*arr.length

);





let item=

arr.splice(

index,

1

)[0];






result.push(

item.number

);



}






return result.sort(

(a,b)=>Number(a)-Number(b)

);



},
// ==========================
// 后区预测
// ==========================

predictBack(){


let map={};



for(let i=1;i<=12;i++){


let n=

String(i).padStart(2,"0");


map[n]=0;


}






this.history.forEach(item=>{


item.back.forEach(n=>{


map[n]++;


});


});







return Object.entries(map)

.sort(

(a,b)=>b[1]-a[1]

)

.slice(0,8)

.map(x=>x[0]);



},







// ==========================
// AI预测输出
// ==========================

predict(){



let pool=

this.predictPool();






let plans=[];



let last=

this.history[

this.history.length-1

];






let feature=

this.extractFeature(last);







for(let i=0;i<10;i++){



let front=

this.generateFront(

pool.slice(0,20)

);






let score=0;





front.forEach(n=>{



score+=

this.numberScore(

n,

feature,

last.front

);



});








plans.push({



front,


back:

this.predictBack().slice(0,2),


score:

Number(

score.toFixed(2)

)



});



}







plans.sort(

(a,b)=>b.score-a.score

);






return plans.slice(0,3);



},









// ==========================
// 滚动回测训练
// ==========================

rollingTrain(callback){



let index=100;



let result={


rounds:0,


hit3:0,


hit4:0,


hit5:0


};





let oldHistory=

this.history;



let run=()=>{



if(index>=oldHistory.length){



if(callback)

callback({

done:true,

result

});



return;



}







let trainData=

oldHistory.slice(

0,

index

);





let real=

oldHistory[index];







this.history=trainData;



this.buildProbability();

this.buildMarkov();






let plans=

this.predict();





let best=0;





plans.forEach(p=>{



let hit=0;



p.front.forEach(n=>{



if(

real.front.includes(n)

)

hit++;



});





if(hit>best)

best=hit;



});








if(best>=3)

result.hit3++;



if(best>=4)

result.hit4++;



if(best===5)

result.hit5++;







result.rounds++;





index++;






if(callback){



callback({


progress:

Math.floor(

index/

oldHistory.length

*

100

),



result



});



}







setTimeout(

run,

10

);





};






run();



},










// ==========================
// 开奖反馈学习
// ==========================

feedback(value){



this.trainLog.push({



time:

Date.now(),



result:value



});






localStorage.setItem(

"V60_feedback",

JSON.stringify(

this.trainLog

)

);



},









// ==========================
// AI报告
// ==========================

report(){



return {



version:this.version,


data:this.history.length,


top:

this.predictPool()

.slice(0,10),


weight:this.weight



};



}





};





window.AIEngine60=

AIEngine60;