/*
======================================
彩票智能分析系统 V35.8.3
engine.js
模型优化版
======================================
*/


const DLTEngine={


version:"V35.8.3",


seed:3583,


cacheKey:"DLT_V3583_RESULT",


data:[],


frontScore:{},


backScore:{},


markov:{},





random(){


this.seed =
(
this.seed * 9301 +
49297
)
%233280;


return this.seed/233280;


},






init(data){


this.data=data||[];


this.frontScore={};


this.backScore={};


this.markov={};


this.seed=3583;



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
// 马尔可夫转移
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






let recent30 =
this.data.slice(-30);




recent30.forEach(item=>{


item.back.forEach(n=>{


if(
this.backScore[n]!==undefined
){


this.backScore[n]+=15;


}



});



});



},







// ==============================
// 权重标准化
// ==============================


normalize(){



let max=
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





let max2=
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
// 前区候选
// ==============================


getTopNumbers(limit=20){



return Object.keys(
this.frontScore
)

.sort(
(a,b)=>
this.frontScore[b]
-
this.frontScore[a]
)

.slice(0,limit);



},







// ==============================
// 前区生成
// ==============================


generateCombination(){



let pool =
this.getTopNumbers(20);



let result=[];



let count=0;



while(
result.length<5 &&
count<200
){


count++;



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
// 前区评分
// ==============================


combinationScore(nums){


let score=70;



nums.forEach(n=>{


score +=
(this.frontScore[n]||0)
/20;


});



// 奇偶

let arr =
nums.map(Number);


let odd =
arr.filter(
n=>n%2===1
)
.length;



if(
odd===2||
odd===3
){

score+=8;


}



// 三区

let a=0;

let b=0;

let c=0;


arr.forEach(n=>{


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
a>0&&b>0&&c>0
){

score+=8;


}



// 和值

let sum =
arr.reduce(
(x,y)=>x+y,
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
// 后区组合评分
// ==============================


backScoreCalc(nums){



let score=70;



nums.forEach(n=>{


score +=
(this.backScore[n]||0)
/20;


});



let a=
Number(nums[0]);

let b=
Number(nums[1]);



let span =
b-a;



if(
span>=3 &&
span<=10
){

score+=8;


}



let sum =
a+b;



if(
sum>=8 &&
sum<=18
){

score+=8;


}



if(score>100){

score=100;


}



return Number(
score.toFixed(2)
);



},







// ==============================
// 生成后区候选
// ==============================


generateBackCandidates(){



let pool =
Object.keys(
this.backScore
);



let list=[];




for(
let i=0;
i<100;
i++
){



let arr=[];



while(
arr.length<2
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
!arr.includes(n)
){

arr.push(n);


}



}



arr.sort(
(a,b)=>
Number(a)-Number(b)
);




list.push({

nums:arr,

score:this.backScoreCalc(arr)

});



}




list.sort(
(a,b)=>
b.score-a.score
);





return list;



},







// ==============================
// 相似过滤
// ==============================


sameCount(a,b){



let c=0;



a.forEach(n=>{


if(
b.includes(n)
){

c++;


}



});



return c;



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



let nums =
this.generateCombination();



list.push({

nums:nums,

score:
this.combinationScore(nums)

});



}




list.sort(
(a,b)=>
b.score-a.score
);



let result=[];



for(
let item of list
){



let same=false;



for(
let old of result
){


if(
this.sameCount(
item.nums,
old.nums
)>=3
){

same=true;


}



}




if(!same){


result.push(item);


}



if(
result.length>=3
){

break;


}


}



return result;



},







// ==============================
// 主入口
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





let front =
this.monteCarlo(20000);





let backs =
this.generateBackCandidates();






let output=[];




for(
let i=0;
i<3;
i++
){



output.push({


front:
front[i].nums,


back:
backs[i].nums,


score:
front[i].score



});



}







localStorage.setItem(

this.cacheKey,

JSON.stringify(output)

);






return output;



},




status(){


return{

version:this.version,

periods:this.data.length

};


}



};






window.DLTEngine =
DLTEngine;