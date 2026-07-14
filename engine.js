/*
======================================
彩票智能分析系统 V35.9.1
engine.js
历史回测修正版
======================================
*/


const DLTEngine={


version:"V35.9.1",


seed:3591,


cacheKey:"DLT_V3591_RESULT",


data:[],


history:[],


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


this.seed=3591;



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


this.frontScore[n]+=25;


});



item.back.forEach(n=>{


this.backScore[n]+=25;


});



});



},







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
.front.includes(n)
){


break;


}


miss++;


}





if(miss>=20){

this.frontScore[n]+=15;

}
else if(miss>=10){

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
// 权重标准化
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



});



},







// ==============================
// 前区候选池
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

.slice(0,20);



},







// ==============================
// 前区生成
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

this.random()
*
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

this.random()
*
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
// 组合评分（修正版）
// ==============================


score(nums){


let score=60;



nums.forEach(n=>{


score +=
(this.frontScore[n]||0)
/25;


});




// 奇偶结构

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




// 三区结构


let a=0;

let b=0;

let c=0;



nums.forEach(n=>{


n=Number(n);



if(n<=12){

a++;

}
else if(n<=24){

b++;

}
else{

c++;

}



});




if(
a>0&&
b>0&&
c>0
){

score+=8;


}





// 和值


let sum =
nums.reduce(
(x,y)=>
x+Number(y),
0
);



if(
sum>=80&&
sum<=170
){

score+=6;


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


score:this.score(front)



});



}




list.sort(
(a,b)=>
b.score-a.score
);





return list.slice(0,20);



},







// ==============================
// 正确历史回测
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




// 临时训练，不覆盖主数据


this.init(train);





let front =
this.generateFront();





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
){

hit3++;

}



if(
same>=4
){

hit4++;

}



if(
same===5
){

hit5++;

}






let back =
this.generateBack();



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
){

back1++;

}



if(
bs===2
){

back2++;

}




total++;



}





// 恢复完整数据


this.init(history);






return{


testCount:total,


front3:hit3,


front4:hit4,


front5:hit5,


back1:back1,


back2:back2,


rate:Number(
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



result.slice(0,3)
.forEach(item=>{



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



}



};





window.DLTEngine =
DLTEngine;