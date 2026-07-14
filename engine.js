/*
=====================================
彩票智能分析系统 V36.1 Mobile

核心引擎
修复：
1. 回测数量错误
2. 评分0分问题
3. 方案重复问题
4. 动态权重
=====================================
*/


const DLTEngine={


version:"V36.1",


data:[],


frontScore:{},


backScore:{},


transition:{},


pool:[],


seed:3610,





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




for(
let i=1;
i<=35;
i++
){


let n=

String(i)
.padStart(2,"0");


this.frontScore[n]=0;


}





for(
let i=1;
i<=12;
i++
){


let n=

String(i)
.padStart(2,"0");


this.backScore[n]=0;


}





this.frequencyModel();


this.markovModel();


this.normalize();


this.createPool();



},









// =========================
// 动态频率模型
// =========================


frequencyModel(){



let len=

this.data.length;





this.data.forEach(
(item,index)=>{



let weight=1;



let gap=

len-index;



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







// 遗漏补偿


Object.keys(
this.frontScore
)
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









// =========================
// 马尔可夫转移
// =========================


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



if(
!this.transition[a]
){


this.transition[a]={};


}




next.forEach(b=>{



if(
!this.transition[a][b]
){


this.transition[a][b]=0;


}




this.transition[a][b]++;



});




});




}



},
// =========================
// 权重归一化
// =========================


normalize(){



let max=

Math.max(
...Object.values(
this.frontScore
)
);



Object.keys(
this.frontScore
)
.forEach(n=>{


this.frontScore[n]=

this.frontScore[n]
/
(max||1)
*
100;



});





let maxBack=

Math.max(
...Object.values(
this.backScore
)
);



Object.keys(
this.backScore
)
.forEach(n=>{


this.backScore[n]=

this.backScore[n]
/
(maxBack||1)
*
100;



});



},







// =========================
// 候选池
// =========================


createPool(){



this.pool=

Object.keys(
this.frontScore
)
.sort(

(a,b)=>

this.frontScore[b]-
this.frontScore[a]

);



},







// =========================
// 贝叶斯评分
// =========================


bayesScore(front){



let score=0;



front.forEach(n=>{


score+=

this.frontScore[n]
*
0.4;



});



return score;



},







// =========================
// 马尔可夫评分
// =========================


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
0.05;



}



});



}



});



return score;



},







// =========================
// 结构评分
// =========================


structureScore(front){



let score=0;





// 奇偶


let odd=

front.filter(

x=>

Number(x)%2

===1

)
.length;



if(
odd===2 ||
odd===3
){


score+=10;


}







// 三区



let zone=[0,0,0];



front.forEach(n=>{



let x=

Number(n);



if(
x<=12
){


zone[0]++;


}

else if(
x<=24
){


zone[1]++;


}

else{


zone[2]++;


}



});





if(
zone[0] &&
zone[1] &&
zone[2]
){


score+=10;


}







// 和值


let sum=

front.reduce(

(a,b)=>

a+
Number(b),

0

);





if(
sum>=95 &&
sum<=175
){


score+=10;


}








// 跨度


let span=

Number(front[4])-

Number(front[0]);





if(
span>=15 &&
span<=32
){


score+=5;


}








return score;



},







// =========================
// 综合评分
// =========================


totalScore(front){



return (

this.bayesScore(front)
+
this.markovScore(front)
+
this.structureScore(front)

);



},







// =========================
// 三种选号模式
// =========================


generate(mode){



let result=[];


let limit=15;



if(
mode==="balance"
){


limit=25;


}



if(
mode==="cold"
){


limit=35;


}






let count=0;



while(
result.length<5 &&
count<500
){


count++;




let index=

Math.floor(

this.random()
*
limit

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

Number(a)-
Number(b)

);



},
// =========================
// 后区生成
// =========================


generateBack(){



let pool=

Object.keys(
this.backScore
)
.sort(

(a,b)=>

this.backScore[b]-
this.backScore[a]

);



let result=[];



while(
result.length<2
){



let n=

pool[

Math.floor(
this.random()*
pool.length
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

Number(a)-
Number(b)

);



},







// =========================
// 三方案生成
// =========================


run(){



let modes=[

"stable",

"balance",

"cold"

];



let result=[];



modes.forEach(mode=>{



let best=null;


let bestScore=-999;





for(
let i=0;
i<5000;
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


raw:bestScore



});



});







// 方案重复惩罚


for(
let i=0;
i<result.length;
i++
){



for(
let j=i+1;
j<result.length;
j++
){



let same=0;



result[i].front.forEach(n=>{


if(
result[j].front.includes(n)
){


same++;


}



});






if(
same>=3
){


result[j].raw-=15;


}





if(
same>=4
){


result[j].raw-=25;


}





}



}







// 百分制


let max=Math.max(

...result.map(
x=>x.raw
)

);



let min=Math.min(

...result.map(
x=>x.raw
)

);





result.forEach(x=>{



x.score=

Number(

(

80+

(
(x.raw-min)/
(max-min||1)
*
20

)

.toFixed(2)

);



});





return result.sort(

(a,b)=>

b.score-a.score

);



},







// =========================
// V36.1 多周期回测
// =========================


backTest(){



let periods=[

100,

300,

500

];



let reports=[];



periods.forEach(period=>{



let hit3=0;

let hit4=0;

let hit5=0;

let total=0;





let start=

Math.max(

50,

this.data.length-period

);





for(
let i=start;
i<this.data.length;
i++
){



let train=

this.data.slice(
0,
i
);



let real=

this.data[i];





this.init(train);





let predict=

this.generate("stable");





let same=0;



predict.forEach(n=>{



if(
real.front.includes(n)
){


same++;


}



});





if(
same>=3
)
hit3++;



if(
same>=4
)
hit4++;



if(
same===5
)
hit5++;




total++;




}







reports.push({


period,


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