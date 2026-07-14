/*
====================================
彩票智能分析系统 V35.9.4
engine.js
动态权重 + 三方案差异化
====================================
*/


const DLTEngine={


version:"V35.9.4",


data:[],


seed:3594,


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




this.trainFrequency();


this.trainTransition();


this.normalize();


this.createPool();



},







// ============================
// 动态频率模型
// ============================


trainFrequency(){



this.data.forEach((item,index)=>{


let weight=1;



// 越近期权重越高


if(
index>
this.data.length-100
){

weight=3;


}



item.front.forEach(n=>{


this.frontScore[n]+=weight;


});



item.back.forEach(n=>{


this.backScore[n]+=weight;


});



});





// 遗漏动态奖励


Object.keys(
this.frontScore
)
.forEach(n=>{


let miss=0;



for(
let i=this.data.length-1;
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




if(
miss>=20
){

this.frontScore[n]+=8;


}
else if(
miss>=12
){

this.frontScore[n]+=4;


}



});



},







// ============================
// 马尔可夫转移
// ============================


trainTransition(){



for(
let i=1;
i<this.data.length;
i++
){



let last=
this.data[i-1].front;



let now=
this.data[i].front;




last.forEach(a=>{



if(
!this.transition[a]
){

this.transition[a]={};

}



now.forEach(b=>{



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
// ============================
// 标准化评分
// ============================


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
max
*
100;



});






let max2=

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
max2
*
100;



});



},







// ============================
// 候选池
// ============================


createPool(){



this.pool=

Object.keys(
this.frontScore
)
.sort(

(a,b)=>

this.frontScore[b]
-
this.frontScore[a]

);



},







// ============================
// 转移关联评分
// ============================


transitionScore(numbers){



let score=0;



numbers.forEach(a=>{


if(
this.transition[a]
){



numbers.forEach(b=>{


if(
a!==b &&
this.transition[a][b]
){



score+=

this.transition[a][b]
*
0.5;



}



});



}



});




return score;



},







// ============================
// 组合评分
// ============================


comboScore(front){



let score=0;



front.forEach(n=>{


score+=

this.frontScore[n];


});




score+=

this.transitionScore(front);





// 奇偶结构


let odd=

front.filter(

n=>

Number(n)%2===1

).length;




if(
odd===2 ||
odd===3
){

score+=15;

}






// 三区


let z1=0;

let z2=0;

let z3=0;



front.forEach(n=>{


let x=

Number(n);



if(x<=12){

z1++;

}
else if(x<=24){

z2++;

}
else{

z3++;

}



});





if(
z1>0 &&
z2>0 &&
z3>0
){

score+=15;

}





// 和值


let sum=

front.reduce(

(a,b)=>

a+Number(b),

0

);




if(
sum>=100 &&
sum<=170
){

score+=10;

}



return score;



},







// ============================
// 三种生成模式
// ============================



generate(type){



let result=[];



let guard=0;



while(
result.length<5 &&
guard<200
){


guard++;



let index;



if(type==="stable"){


// 稳定型
index=

Math.floor(

this.random()*15

);


}



else if(type==="balance"){


// 均衡型

index=

Math.floor(

this.random()*25

);


}



else{


// 博冷型

index=

15+
Math.floor(

this.random()*20

);


}






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







// ============================
// 后区生成
// ============================


generateBack(){



let p=

Object.keys(
this.backScore
)
.sort(

(a,b)=>

this.backScore[b]-
this.backScore[a]

);



let r=[];



while(
r.length<2
){



let n=

p[
Math.floor(
this.random()*p.length
)
];



if(
!r.includes(n)
){

r.push(n);

}



}



return r.sort(

(a,b)=>

Number(a)-Number(b)

);



},
// ============================
// 生成三方案
// ============================


run(){



this.init(
this.data
);





let modes=[

"stable",

"balance",

"cold"

];





let output=[];



modes.forEach(mode=>{



let front=

this.generate(mode);



let score=

this.comboScore(front);





output.push({


front,

back:this.generateBack(),

rawScore:score,

score:0



});



});






// 分数排序归一化


let max=

Math.max(
...output.map(
x=>x.rawScore
)

);



let min=

Math.min(
...output.map(
x=>x.rawScore
)

);





output.forEach(x=>{


x.score=

Number(

(

(
x.rawScore-min
)/
(
max-min||1
)
*
100

)
.toFixed(2)

);



});





// 保证最高方案100

output.sort(

(a,b)=>

b.score-a.score

);



return output;



},







// ============================
// 快速回测
// ============================


backTest(count=100){



let history=this.data;



let total=0;


let hit3=0;


let hit4=0;


let hit5=0;


let back1=0;


let back2=0;




let start=

Math.max(
50,
history.length-count
);





for(
let i=start;
i<history.length;
i++
){



let train=

history.slice(
0,
i
);



let real=

history[i];





this.init(train);





let result=

this.run();






let front=

result[0].front;



let same=0;



front.forEach(n=>{


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






let back=

result[0].back;



let bs=0;



back.forEach(n=>{


if(
real.back.includes(n)
){

bs++;

}


});





if(
bs>=1
)
back1++;



if(
bs===2
)
back2++;




total++;



}





this.init(history);





return {


testCount:total,


front3:hit3,


front4:hit4,


front5:hit5,


back1,


back2,


rate:

Number(

(
hit3/total*100

)
.toFixed(2)

)



};



}



};





window.DLTEngine=

DLTEngine;