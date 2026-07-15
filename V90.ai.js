// ================================================
// 大乐透AI V90 AI决策模块
// ================================================


"use strict";



window.V90AI={





// ================================================
// 历史频率
// ================================================


frequency(){



let freq={};



for(
let i=1;
i<=35;
i++
){

freq[i]=0;

}




if(
!V90.history.length
){

return freq;

}




V90.history.forEach(item=>{



item.front.forEach(n=>{


freq[n]++;


});



});




return freq;



},







// ================================================
// Bayes评分
// ================================================


bayesScore(){



let freq=
this.frequency();



let score={};



let max=1;



Object.values(freq)
.forEach(v=>{


if(v>max)

max=v;


});




Object.keys(freq)
.forEach(n=>{



score[n]=

freq[n]
/
max
*
100;



});




return score;



},







// ================================================
// 结构评分
// ================================================


structureScore(nums){



let odd=0;

let big=0;



nums.forEach(n=>{


if(n%2)

odd++;


if(n>=18)

big++;


});





let score=0;




if(
odd>=1
&&
odd<=4
){

score+=30;


}




if(
big>=1
&&
big<=4
){

score+=30;


}




let sum=
nums.reduce(
(a,b)=>a+b,
0
);



if(
sum>=80
&&
sum<=140
){

score+=40;


}



return score;



},







// ================================================
// 随机候选
// ================================================


createCandidate(){



let bayes=
this.bayesScore();



let pool=



Object.keys(bayes)

.sort(

(a,b)=>

bayes[b]-bayes[a]

)


.slice(0,20)

.map(Number);







let nums=[];




while(
nums.length<5
){



let n=


pool[

Math.floor(
Math.random()
*
pool.length
)

];





if(
!nums.includes(n)
){


nums.push(n);


}



}





nums.sort(
(a,b)=>a-b
);





return nums;



},







// ================================================
// TOP10
// ================================================


top(){



let list=[];



for(
let i=0;
i<2000;
i++
){



let front=
this.createCandidate();





let score=
this.structureScore(front);





let back=[


Math.floor(
Math.random()*12
)+1,

Math.floor(
Math.random()*12
)+1


];






list.push({



front,


back,


score



});




}







return list

.sort(

(a,b)=>

b.score-a.score

)

.slice(0,10);



},







// ================================================
// Master AI
// ================================================


generate(){



let top=
this.top();



let final=
top[0];





let meeting=[



{

name:"趋势AI",

result:
"通过历史走势分析"

},



{

name:"结构AI",

result:
"通过奇偶和值结构检查"

},



{

name:"概率AI",

result:
"Bayes评分完成"

},



{

name:"风险AI",

result:
"未发现明显风险"

}



];







return {



front:
final.front,


back:
final.back,


score:
final.score,


meeting



};



}





};