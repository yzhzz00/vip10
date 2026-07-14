/*
======================================
彩票智能分析系统 V35.9.2
engine.js
评分优化 + 差异化方案版
======================================
*/


const DLTEngine={


version:"V35.9.2",


seed:3592,


cacheKey:"DLT_V3592_RESULT",


data:[],


frontScore:{},


backScore:{},





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


this.seed=3592;


this.initNumber();


this.frequencyModel();


this.omissionModel();


this.hotColdModel();


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







frequencyModel(){


this.data.forEach(item=>{


item.front.forEach(n=>{


this.frontScore[n]+=20;


});



item.back.forEach(n=>{


this.backScore[n]+=20;


});


});



},
// ==============================
// 遗漏模型
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
this.data[i].front.includes(n)
){

break;

}


miss++;


}




if(
miss>=15
){

this.frontScore[n]+=10;


}


if(
miss>=25
){

this.frontScore[n]+=8;


}



});



},







// ==============================
// 热冷模型
// ==============================


hotColdModel(){



let recent =
this.data.slice(-80);



recent.forEach(item=>{


item.front.forEach(n=>{


this.frontScore[n]+=8;


});



item.back.forEach(n=>{


this.backScore[n]+=8;


});



});



},







// ==============================
// 后区评分
// ==============================


backModel(){



this.data.forEach(item=>{


item.back.forEach(n=>{


this.backScore[n]+=15;


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






let max2 =
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







// ==============================
// 候选池
// ==============================


getPool(){



return Object.keys(
this.frontScore
)

.sort(

(a,b)=>

this.frontScore[b]
-
this.frontScore[a]

)

.slice(0,25);



},







// ==============================
// 差异化前区生成
// ==============================


generateFront(exclude=[]){



let pool =
this.getPool();



let result=[];



let guard=0;



while(
result.length<5 &&
guard<100
){



guard++;



let index =

Math.floor(

this.random()
*
pool.length

);



let n =
pool[index];




if(
!result.includes(n)
&&
!exclude.includes(n)
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
)
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







// ==============================
// 单组评分
// ==============================


score(front){



let score=0;



front.forEach(n=>{


score+=
this.frontScore[n];


});




// 奇偶

let odd =
front.filter(
n=>Number(n)%2
)
.length;



if(
odd===2||
odd===3
){

score+=20;


}





// 三区


let z1=0;

let z2=0;

let z3=0;



front.forEach(n=>{


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
z1&&z2&&z3
){

score+=20;


}






// 和值

let sum =
front.reduce(

(a,b)=>

a+Number(b),

0

);



if(
sum>=90&&
sum<=160
){

score+=15;


}



return score;



},







// ==============================
// 蒙特卡罗生成
// ==============================


monteCarlo(times=20000){



let pool=[];



for(
let i=0;
i<times;
i++
){



let front =
this.generateFront();



let score =
this.score(front);





pool.push({

front,

score

});



}





pool.sort(

(a,b)=>

b.score-a.score

);





return pool;



},







// ==============================
// 三方案差异化
// ==============================


run(){



this.init(
this.data
);



let result =
this.monteCarlo(20000);




let output=[];



let used=[];



for(
let item of result
){



let diff=0;



if(
used.length>0
){



let same =
item.front.filter(

x=>

used[0].includes(x)

)
.length;



diff=same;



}





if(
diff<=3
){



output.push({


front:item.front,


back:this.generateBack(),


score:Number(
(
item.score/
5
)
.toFixed(2)
)


});



used.push(
item.front
);


}




if(
output.length===3
){

break;


}



}





return output;



},







// ==============================
// 历史回测
// ==============================


backTest(testCount=500){



let history =
this.data.slice();



let total=0;


let hit3=0;


let hit4=0;


let hit5=0;


let back1=0;


let back2=0;






let start =
Math.max(
50,
history.length-testCount
);






for(
let i=start;
i<history.length;
i++
){



let train =
history.slice(
0,
i
);



let real =
history[i];




this.init(train);




let result =
this.run();





let front =
result[0].front;




let same=0;



front.forEach(n=>{


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






let back =
result[0].back;



let bs=0;



back.forEach(n=>{


if(
real.back.includes(n)
){

bs++;

}



});



if(bs>=1)
back1++;


if(bs===2)
back2++;



total++;



}




this.init(history);






return{


testCount:total,


front3:hit3,


front4:hit4,


front5:hit5,


back1,


back2,


rate:Number(

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