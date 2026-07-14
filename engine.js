/*
====================================
彩票智能分析系统 V36.0 Mobile
engine.js

核心：
动态权重
冷热平衡
遗漏周期
关联模型
====================================
*/


const DLTEngine={


version:"V36.0",


data:[],


seed:3600,


frontScore:{},

backScore:{},

transition:{},

pool:[],


random(){


this.seed=
(
this.seed*9301+
49297
)%233280;


return this.seed/233280;


},





init(data){


this.data=data||[];


this.frontScore={};

this.backScore={};

this.transition={};

this.pool=[];



for(let i=1;i<=35;i++){


let n=
String(i).padStart(2,"0");


this.frontScore[n]=0;


}



for(let i=1;i<=12;i++){


let n=
String(i).padStart(2,"0");


this.backScore[n]=0;


}



this.frequencyModel();


this.markovModel();


this.normalize();


this.createPool();



},







// =============================
// 动态历史权重
// =============================


frequencyModel(){



let len=this.data.length;



this.data.forEach((item,index)=>{


// 越近权重越高


let weight=1;



let gap=len-index;



if(gap<=50){

weight=5;

}

else if(gap<=100){

weight=3;

}

else if(gap<=300){

weight=2;

}




item.front.forEach(n=>{


this.frontScore[n]+=weight;


});



item.back.forEach(n=>{


this.backScore[n]+=weight;


});



});








// 遗漏奖励


Object.keys(this.frontScore)
.forEach(n=>{


let miss=0;



for(
let i=len-1;
i>=0;
i--
){


if(
this.data[i].front.includes(n)
){

break;

}


miss++;


}




if(miss>=30){

this.frontScore[n]+=10;


}

else if(miss>=20){

this.frontScore[n]+=6;


}

else if(miss>=10){

this.frontScore[n]+=3;


}



});



},







// =============================
// 马尔可夫转移
// =============================


markovModel(){



for(
let i=1;
i<this.data.length;
i++
){



let prev=
this.data[i-1].front;



let next=
this.data[i].front;




prev.forEach(a=>{



if(!this.transition[a]){

this.transition[a]={};

}



next.forEach(b=>{


if(!this.transition[a][b]){

this.transition[a][b]=0;

}



this.transition[a][b]++;



});



});



}



},
// =============================
// 数据归一化
// =============================


normalize(){



let max=Math.max(
...Object.values(this.frontScore)
);



Object.keys(this.frontScore)
.forEach(n=>{


this.frontScore[n]=

this.frontScore[n]
/
max
*
100;



});





let max2=Math.max(
...Object.values(this.backScore)
);



Object.keys(this.backScore)
.forEach(n=>{


this.backScore[n]=

this.backScore[n]
/
max2
*
100;



});



},







// =============================
// 候选号码池
// =============================


createPool(){



this.pool=

Object.keys(this.frontScore)
.sort(

(a,b)=>

this.frontScore[b]
-
this.frontScore[a]

);



},







// =============================
// 马尔可夫关联评分
// =============================


markovScore(front){



let score=0;



front.forEach(a=>{



if(
this.transition[a]
){



front.forEach(b=>{


if(
a!==b &&
this.transition[a][b]
){



score+=

this.transition[a][b]
*
0.2;



}



});



}



});



return score;



},







// =============================
// 贝叶斯综合评分
// =============================


bayesScore(front){



let score=0;



front.forEach(n=>{



let p=

this.frontScore[n]/100;



score+=

p*40;



});



return score;



},







// =============================
// 结构评分
// =============================


structureScore(front){



let score=0;



// 奇偶


let odd=

front.filter(

n=>

Number(n)%2===1

).length;



if(
odd===2 ||
odd===3
){

score+=10;

}






// 三区


let zone=[0,0,0];



front.forEach(n=>{


let x=Number(n);



if(x<=12){

zone[0]++;

}

else if(x<=24){

zone[1]++;

}

else{

zone[2]++;

}



});





if(
zone[0]>0 &&
zone[1]>0 &&
zone[2]>0
){

score+=10;


}






// 和值


let sum=

front.reduce(

(a,b)=>

a+Number(b),

0

);



if(
sum>=95 &&
sum<=175
){

score+=10;

}






// 连号控制


let link=0;



for(
let i=1;
i<front.length;
i++
){



if(
Number(front[i])-
Number(front[i-1])
===1
){

link++;

}


}




if(
link<=2
){

score+=5;

}





return score;



},







// =============================
// 最终评分
// =============================


totalScore(front){



let score=0;



score+=

this.bayesScore(front);



score+=

this.markovScore(front);



score+=

this.structureScore(front);




return score;



},







// =============================
// 三种模式选号
// =============================


generate(mode){



let result=[];


let limit;



if(mode==="stable"){


limit=15;


}


else if(mode==="balance"){


limit=25;


}


else{


limit=35;


}





let guard=0;



while(
result.length<5 &&
guard<500
){


guard++;



let index=


Math.floor(
this.random()*limit
);



let n=

this.pool[index];





if(
n &&
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
// =============================
// 后区生成
// =============================


generateBack(){



let pool=

Object.keys(this.backScore)
.sort(

(a,b)=>

this.backScore[b]
-
this.backScore[a]

);



let result=[];



while(
result.length<2
){



let n=

pool[
Math.floor(
this.random()*pool.length
)
];



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







// =============================
// 蒙特卡罗模拟
// =============================


monteCarlo(times=100000){



let list=[];



for(
let i=0;
i<times;
i++
){



let front=

this.generate("balance");



let score=

this.totalScore(front);





list.push({


front,

score


});



}





list.sort(

(a,b)=>

b.score-a.score

);



return list;



},







// =============================
// 三方案生成
// =============================


run(){



this.init(this.data);





let configs=[


"stable",


"balance",


"cold"


];





let result=[];






configs.forEach(mode=>{



let best=null;



let bestScore=-1;





for(
let i=0;
i<3000;
i++
){



let front=

this.generate(mode);



let score=

this.totalScore(front);





if(
score>bestScore
){


bestScore=score;


best=front;



}



}





result.push({


type:mode,


front:best,


back:this.generateBack(),


raw:bestScore,


score:0



});



});







let max=

Math.max(
...result.map(x=>x.raw)
);



let min=

Math.min(
...result.map(x=>x.raw)
);






result.forEach(x=>{


x.score=

Number(

(
(
x.raw-min
)
/
(
max-min||1
)
*
100

)
.toFixed(2)

);



});





result.sort(

(a,b)=>

b.score-a.score

);



return result;



},







// =============================
// 多周期回测
// =============================


backTest(){



let periods=[

100,

300,

500

];



let reports=[];



periods.forEach(count=>{



let total=0;


let hit3=0;


let hit4=0;


let hit5=0;



let start=

Math.max(

50,

this.data.length-count

);





for(
let i=start;
i<this.data.length;
i++
){



let train=

this.data.slice(0,i);



let real=

this.data[i];





this.init(train);




let result=

this.run()[0];





let same=0;



result.front.forEach(n=>{


if(
real.front.includes(n)
){

same++;

}



});






if(same>=3)

hit3++;



if(same>=4)

hit4++;



if(same===5)

hit5++;





total++;



}






reports.push({


period:count,


test:total,


hit3,


hit4,


hit5



});




});





this.init(this.data);



return reports;



}



};





window.DLTEngine=

DLTEngine;