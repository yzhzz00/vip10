// ================================================
// 大乐透AI V90 FINAL
// 核心模型层
// ================================================

"use strict";


window.V90Model={



// 历史数据

getHistory(){


return window.V90Data
?
V90Data.get()
:
[];


},







// ================================================
// 前区频率
// ================================================


frequency(){


let history=this.getHistory();



let freq={};



for(
let i=1;
i<=35;
i++
){

freq[i]=0;


}




history.forEach(item=>{


item.front.forEach(n=>{


freq[n]++;


});


});




return freq;



},







// ================================================
// 冷热排序
// ================================================


hotCold(){



let freq=this.frequency();




return Object.keys(freq)

.map(n=>({



number:Number(n),


count:freq[n]



}))


.sort(

(a,b)=>

b.count-a.count

);



},







// ================================================
// 遗漏分析
// ================================================


missing(){



let history=this.getHistory();



let miss={};



for(
let i=1;
i<=35;
i++
){

miss[i]=
history.length;


}




for(
let i=history.length-1;
i>=0;
i--
){



history[i]
.front
.forEach(n=>{



if(
miss[n]===history.length
){


miss[n]=
history.length-i-1;


}



});



}



return miss;



},







// ================================================
// 奇偶大小和值
// ================================================


structure(nums){



let odd=0;

let big=0;



nums.forEach(n=>{



if(n%2===1)

odd++;



if(n>=18)

big++;



});




return {



odd,


even:
5-odd,


big,


small:
5-big,


sum:

nums.reduce(
(a,b)=>a+b,
0
)



};



},







// ================================================
// Bayes评分
// ================================================


bayes(){



let freq=this.frequency();



let total=0;



Object.values(freq)
.forEach(v=>{


total+=v;


});




let score={};



Object.keys(freq)
.forEach(n=>{


score[n]=

total===0

?

0

:

freq[n]/total;



});




return score;



},







// ================================================
// Markov 一阶转移
// ================================================


markov(){



let history=this.getHistory();



let map={};





for(
let i=1;
i<history.length;
i++
){



let before=

history[i-1]
.front;



let after=

history[i]
.front;






before.forEach(a=>{



if(!map[a]){

map[a]={};


}




after.forEach(b=>{



if(!map[a][b]){


map[a][b]=0;


}



map[a][b]++;



});




});



}




return map;



},







// ================================================
// 候选评分
// ================================================


score(nums){



let s=

this.structure(nums);



let score=50;



// 奇偶


if(
s.odd>=1
&&
s.odd<=4
){

score+=10;


}



// 大小


if(
s.big>=1
&&
s.big<=4
){

score+=10;


}



// 和值


if(
s.sum>=80
&&
s.sum<=140
){

score+=15;


}




// 连号控制


let link=0;



for(
let i=1;
i<nums.length;
i++
){



if(
nums[i]-nums[i-1]===1
){


link++;


}



}




if(
link<=2
){

score+=10;


}else{


score-=10;


}




return Math.max(
0,
Math.min(
100,
score
)
);



}







};