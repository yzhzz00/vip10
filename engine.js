// ======================================
// 彩票智能分析系统 V35.8.1 Mobile
// engine.js
// 手机稳定优化版
// ======================================


const DLTEngine={


version:"V35.8.1 Mobile",


seed:2895,


cacheKey:"DLT_V3581_MOBILE",


data:[],


frontScore:{},


backScore:{},


markov:{},




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


this.markov={};


this.seed=2895;


this.initNumber();


this.frequencyModel();


this.omissionModel();


this.hotColdModel();


this.markovModel();


this.normalize();


},






initNumber(){


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


Object.keys(this.frontScore)
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



if(miss>=20){


this.frontScore[n]+=15;


}
else if(miss>=10){


this.frontScore[n]+=8;


}



});



},
// ==============================
// 冷热号码模型
// ==============================


hotColdModel(){


let recent=
this.data.slice(-50);



recent.forEach(item=>{


item.front.forEach(n=>{


if(this.frontScore[n]!==undefined){

this.frontScore[n]+=12;

}


});



item.back.forEach(n=>{


if(this.backScore[n]!==undefined){

this.backScore[n]+=12;

}


});



});



},







// ==============================
// 马尔可夫模型
// ==============================


markovModel(){



for(
let i=1;
i<this.data.length;
i++
){



let before=
this.data[i-1].front;



let after=
this.data[i].front;




before.forEach(a=>{


if(!this.markov[a]){


this.markov[a]={};


}




after.forEach(b=>{


if(!this.markov[a][b]){


this.markov[a][b]=0;


}



this.markov[a][b]++;



});



});



}



},







// ==============================
// 归一化
// ==============================


normalize(){


let max=
Math.max(
...Object.values(
this.frontScore
)
);



for(let n in this.frontScore){


this.frontScore[n]
=
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



for(let n in this.backScore){


this.backScore[n]
=
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
// TOP候选池
// ==============================


getTopNumbers(limit=18){



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
// 生成前区
// ==============================


generateCombination(){



let pool=
this.getTopNumbers(18);



let result=[];


let safe=0;




while(
result.length<5 &&
safe<200
){



safe++;



let index=
Math.floor(
this.random()
*
pool.length
);



let n=
pool[index];




if(
!result.includes(n)
){


result.push(n);


}



}





// 防止死循环


if(result.length<5){


result=
pool.slice(0,5);


}




return result.sort(
(a,b)=>
Number(a)-Number(b)
);



},







// ==============================
// 后区
// ==============================


generateBack(){



let pool=
Object.keys(
this.backScore
);



let result=[];



let safe=0;



while(
result.length<2 &&
safe<100
){


safe++;


let n=
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
// 组合评分
// ==============================


combinationScore(nums){


let score=0;



nums.forEach(n=>{


score+=
this.frontScore[n]||0;


});



score=
score/5;



let arr=
nums.map(Number);



// 奇偶


let odd=
arr.filter(
n=>n%2===1
).length;



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
a>0 &&
b>0 &&
c>0
){

score+=10;


}




// 和值


let sum=
arr.reduce(
(x,y)=>x+y,
0
);



if(
sum>=80 &&
sum<=170
){

score+=8;


}



return Number(
score.toFixed(2)
);


},







// ==============================
// 去重检查
// ==============================


sameCount(a,b){


let count=0;



a.forEach(n=>{


if(
b.includes(n)
){

count++;

}


});



return count;


},







// ==============================
// 模拟计算
// ==============================


monteCarlo(times=20000){



let result=[];



for(
let i=0;
i<times;
i++
){



let nums=
this.generateCombination();



let score=
this.combinationScore(nums);



result.push({


nums:nums,


score:score


});



}






result.sort(
(a,b)=>
b.score-a.score
);




let final=[];




for(
let item of result
){



let same=false;



for(
let old of final
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


final.push(item);


}



if(
final.length>=3
){


break;


}



}





return final;


},







// ==============================
// 主入口
// ==============================


run(){



let cache=
localStorage.getItem(
this.cacheKey
);



if(cache){


return JSON.parse(cache);


}




this.init(
this.data
);






let result=
this.monteCarlo(20000);






let output=
result.map(item=>{


return {


front:item.nums,


back:
this.generateBack(),


score:item.score



};



});






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







window.DLTEngine=
DLTEngine;