/*
======================================
彩票智能分析系统 V35.9
engine.js
历史回测模块版
======================================
*/


const DLTEngine={


version:"V35.9",


seed:3590,


cacheKey:"DLT_V359_RESULT",


data:[],


frontScore:{},


backScore:{},


markov:{},






random(){


this.seed =
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


this.markov={};


this.seed=3590;



this.initNumber();


this.frequencyModel();


this.omissionModel();


this.hotColdModel();


this.markovModel();


this.backModel();


this.normalize();



},







initNumber(){



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



},







// ==============================
// 历史频率
// ==============================


frequencyModel(){



this.data.forEach(item=>{


item.front.forEach(n=>{


this.frontScore[n]+=25;


});



item.back.forEach(n=>{


this.backScore[n]+=25;


});



});



},







// ==============================
// 遗漏周期
// ==============================


omissionModel(){



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
this.data[i]
.front
.includes(n)
){


break;


}



miss++;



}





if(
miss>=20
){


this.frontScore[n]+=15;


}
else if(
miss>=10
){


this.frontScore[n]+=8;


}



});



},
// ==============================
// 冷热模型
// ==============================


hotColdModel(){


let recent50 =
this.data.slice(-50);



recent50.forEach(item=>{


item.front.forEach(n=>{


if(
this.frontScore[n]!==undefined
){

this.frontScore[n]+=12;

}


});



item.back.forEach(n=>{


if(
this.backScore[n]!==undefined
){

this.backScore[n]+=10;

}


});



});



},







// ==============================
// 马尔可夫
// ==============================


markovModel(){



for(
let i=1;
i<this.data.length;
i++
){



let before =
this.data[i-1].front;



let after =
this.data[i].front;





before.forEach(a=>{



if(
!this.markov[a]
){

this.markov[a]={};

}




after.forEach(b=>{


if(
!this.markov[a][b]
){

this.markov[a][b]=0;

}



this.markov[a][b]++;



});



});



}



},







// ==============================
// 后区模型
// ==============================


backModel(){



this.data.forEach(item=>{



item.back.forEach(n=>{


if(
this.backScore[n]!==undefined
){

this.backScore[n]+=30;

}


});



});





},







// ==============================
// 标准化
// ==============================


normalize(){



let max =
Math.max(
...Object.values(
this.frontScore
)
);





for(
let n in this.frontScore
){



this.frontScore[n]=

Number(

(
this.frontScore[n]
/
max
*
100

)
.toFixed(2)

);



}







let max2 =

Math.max(

...Object.values(
this.backScore
)

);





for(
let n in this.backScore
){



this.backScore[n]=

Number(

(
this.backScore[n]
/
max2
*
100

)
.toFixed(2)

);



}



},







// ==============================
// 前区池
// ==============================


getPool(){



return Object.keys(
this.frontScore
)

.sort(

(a,b)=>

this.frontScore[b]-
this.frontScore[a]

)

.slice(0,20);



},







// ==============================
// 生成组合
// ==============================


generateFront(){



let pool =
this.getPool();



let result=[];



while(
result.length<5
){



let n =

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

Number(a)-Number(b)

);



},







// ==============================
// 后区生成
// ==============================


generateBack(){



let pool =
Object.keys(
this.backScore
);



let result=[];



while(
result.length<2
){



let n =

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

Number(a)-Number(b)

);



},
// ==============================
// 组合评分
// ==============================


score(nums){


let score=70;



nums.forEach(n=>{


score +=
(this.frontScore[n]||0)
/20;


});




// 奇偶

let odd =
nums.filter(
n=>Number(n)%2===1
)
.length;



if(
odd===2||
odd===3
){

score+=8;


}




// 三区


let z1=0;
let z2=0;
let z3=0;



nums.forEach(n=>{


n=Number(n);



if(n<=12){

z1++;

}
else if(n<=24){

z2++;

}
else{

z3++;

}



});



if(
z1>0&&
z2>0&&
z3>0
){

score+=8;


}





// 和值

let sum =
nums.reduce(
(a,b)=>
a+Number(b),
0
);



if(
sum>=80&&
sum<=170
){

score+=6;


}



if(score>100){

score=100;


}



return Number(
score.toFixed(2)
);



},







// ==============================
// 蒙特卡罗
// ==============================


monteCarlo(times=20000){



let list=[];



for(
let i=0;
i<times;
i++
){



let front =
this.generateFront();



list.push({


front:front,


score:
this.score(front)



});



}





list.sort(
(a,b)=>
b.score-a.score
);





return list.slice(0,3);



},







// ==============================
// 历史回测
// ==============================


backTest(testCount=500){



let total=0;


let hit3=0;


let hit4=0;


let hit5=0;


let back1=0;


let back2=0;






let start =
this.data.length-testCount;



if(start<50){

start=50;

}





for(
let i=start;
i<this.data.length;
i++
){



let train =
this.data.slice(
0,
i
);




let real =
this.data[i];




this.init(train);




let predict =
this.generateFront();





let same=0;



predict.forEach(n=>{


if(
real.front.includes(n)
){

same++;


}



});





if(same>=3){

hit3++;

}



if(same>=4){

hit4++;

}



if(same===5){

hit5++;

}





let backSame=0;



predictBack:
{

let b =
this.generateBack();



b.forEach(n=>{


if(
real.back.includes(n)
){

backSame++;


}



});



}





if(backSame>=1){

back1++;

}



if(backSame===2){

back2++;

}



total++;



}





return{


testCount:total,


front3:hit3,


front4:hit4,


front5:hit5,


back1:back1,


back2:back2,


rate:
Number(
(
hit3/total*100

)
.toFixed(2)
)


};



},







// ==============================
// 主运行
// ==============================


run(){



let cache =
localStorage.getItem(
this.cacheKey
);



if(cache){

return JSON.parse(cache);

}





this.init(
this.data
);



let result =
this.monteCarlo(20000);





let output=[];



result.forEach(item=>{



output.push({


front:item.front,


back:this.generateBack(),


score:item.score



});



});





localStorage.setItem(

this.cacheKey,

JSON.stringify(output)

);






return output;



},




};







window.DLTEngine =
DLTEngine;