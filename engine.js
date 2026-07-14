/*
====================================
彩票智能分析系统 V50.6.1 Mobile

回测优化版

升级：
1. 预测100000组
2. 回测轻量化
3. 手机异步运行
4. 测试数量修复
====================================
*/


const DLTEngine={


version:"V50.6.1",


data:[],


frequency:{},


miss:{},


backScore:{},


backMiss:{},


records:[],




// ======================
// 初始化
// ======================

init(data){


this.data=[...data];


this.frequency={};

this.miss={};

this.backScore={};

this.backMiss={};


this.analyse();


},







// ======================
// 历史分析
// ======================

analyse(){


let length=this.data.length;



for(
let n=1;
n<=35;
n++
){


let num=

String(n).padStart(2,"0");


this.frequency[num]=0;

this.miss[num]=0;


}





for(
let n=1;
n<=12;
n++
){


let num=

String(n).padStart(2,"0");


this.backScore[num]=0;

this.backMiss[num]=0;


}







this.data.forEach((item,index)=>{


let weight=

0.5+

(index/length);





item.front.forEach(n=>{


this.frequency[n]+=weight;


});





item.back.forEach(n=>{


this.backScore[n]+=weight;


});



});








// 前区遗漏


for(
let n=1;
n<=35;
n++
){


let num=

String(n).padStart(2,"0");


let miss=0;



for(
let i=this.data.length-1;
i>=0;
i--
){


if(
this.data[i].front.includes(num)
)

break;


miss++;


}



this.miss[num]=miss;


}









// 后区遗漏


for(
let n=1;
n<=12;
n++
){


let num=

String(n).padStart(2,"0");


let miss=0;



for(
let i=this.data.length-1;
i>=0;
i--
){


if(
this.data[i].back.includes(num)
)

break;


miss++;


}



this.backMiss[num]=miss;


}



},







// ======================
// 前区评分
// ======================

numberScore(num){


let score=0;



score+=this.frequency[num];



score+=

Math.min(

this.miss[num],

25

)

*

0.8;





if(
this.frequency[num]>80
){


score-=

(
this.frequency[num]-80
)

*

0.5;


}



return score;


},







// ======================
// 后区评分
// ======================

backNumberScore(num){


let score=0;



score+=this.backScore[num];



score+=

Math.min(

this.backMiss[num],

15

)

*

0.6;





if(
this.backScore[num]>50
){


score-=

(
this.backScore[num]-50
)

*

0.4;


}



return score;


},
// ======================
// 前区组合评分
// ======================

comboScore(combo){


let score=0;



combo.forEach(n=>{


score+=this.numberScore(n);


});





// 奇偶结构

let odd=

combo.filter(

n=>Number(n)%2===1

).length;



if(
odd===2 ||
odd===3
){

score+=10;


}else{


score-=8;


}






// 三区结构

let zone=[0,0,0];



combo.forEach(n=>{


let x=Number(n);



if(x<=12)

zone[0]++;


else if(x<=24)

zone[1]++;


else

zone[2]++;


});





if(
zone.filter(
x=>x>0
).length===3
){

score+=15;


}else{


score-=8;


}







// 和值

let sum=

combo.reduce(

(a,b)=>a+Number(b),

0

);



if(
sum>=80 &&
sum<=160
){

score+=10;


}else{


score-=5;


}





return score;


},







// ======================
// 后区评分
// ======================

backComboScore(back){


let score=0;



back.forEach(n=>{


score+=this.backNumberScore(n);


});






let odd=

back.filter(

n=>Number(n)%2===1

).length;



if(
odd===1
){

score+=8;


}



return score;


},







// ======================
// 总评分
// ======================

fullScore(front,back){


return (

this.comboScore(front)*0.8

+

this.backComboScore(back)*0.2

);


},







// ======================
// 候选过滤
// ======================

filterCandidate(front){


let nums=

front.map(Number);



if(
nums.length!==5
)

return false;




if(
new Set(nums).size!==5
)

return false;




nums.sort(

(a,b)=>a-b

);





let sum=

nums.reduce(

(a,b)=>a+b,

0

);



if(
sum<70 ||
sum>160
)

return false;





let odd=

nums.filter(

n=>n%2!==0

).length;



if(
odd<2 ||
odd>3
)

return false;





return true;


},







// ======================
// 随机前区
// ======================

randomFront(){


let arr=[];



while(
arr.length<5
){


let n=

String(

Math.floor(
Math.random()*35
)+1

)
.padStart(2,"0");




if(
!arr.includes(n)
)

arr.push(n);



}




return arr.sort(

(a,b)=>Number(a)-Number(b)

);


},







// ======================
// 随机后区
// ======================

randomBack(){


let arr=[];



while(
arr.length<2
){


let n=

String(

Math.floor(
Math.random()*12
)+1

)
.padStart(2,"0");




if(
!arr.includes(n)
)

arr.push(n);



}




return arr.sort(

(a,b)=>Number(a)-Number(b)

);


},







// ======================
// 相似度
// ======================

similar(a,b){


let count=0;



a.forEach(n=>{


if(
b.includes(n)
)

count++;



});



return count;


},







// ======================
// 蒙特卡罗模拟
// ======================

simulate(total,callback){


let pool=[];

let count=0;



let timer=setInterval(()=>{



for(
let i=0;
i<200;
i++
){



let front;



do{


front=this.randomFront();



}

while(
!this.filterCandidate(front)
);





let back=

this.randomBack();






let score=

this.fullScore(

front,

back

);






pool.push({

front,

back,

score

});



count++;



}






if(
count>=total
){



clearInterval(timer);



pool.sort(

(a,b)=>b.score-a.score

);



callback(

this.generatePlans(pool)

);



}



},5);



},
// ======================
// 方案生成
// ======================

generatePlans(pool){


let plans=[];



let stable=

pool[0];





plans.push({

...stable,

type:"stable"

});






for(
let item of pool
){



if(
this.similar(

stable.front,

item.front

)<=2
){



plans.push({

...item,

type:"balance"

});


break;


}



}







let cold=

pool[pool.length-1];



plans.push({

...cold,

type:"cold"

});







while(
plans.length<3
){


plans.push(

pool[plans.length]

);


}







let max=

plans[0].score||1;



plans.forEach(p=>{


p.indexScore=

Number(

(
70+

p.score/max*30

)
.toFixed(2)

);



});





return plans;


},







// ======================
// V50.6.1 回测优化
// ======================

rollingBackTest(period,callback){



let history=[...this.data];



let start=

Math.max(

1,

history.length-period

);



let report={


period,


test:0,


hit3:0,


hit4:0,


hit5:0,


best:0


};





let index=start;



let runTest=()=>{


if(
index>=history.length
){



callback(report);


return;


}





let train=

history.slice(

0,

index

);



let real=

history[index];






this.init(train);






// 回测减少计算量

this.simulate(

200,

plans=>{



let best=0;



plans.forEach(p=>{


let same=0;



p.front.forEach(n=>{


if(
real.front.includes(n)
)

same++;



});




if(
same>best
)

best=same;



});







if(
best>=3
)

report.hit3++;



if(
best>=4
)

report.hit4++;



if(
best===5
)

report.hit5++;






if(
best>report.best
)

report.best=best;






report.test++;



index++;






// 延迟释放手机CPU

setTimeout(

runTest,

20

);



}



);



};





runTest();



},









// ======================
// 多周期回测
// ======================

backTest(callback){



let periods=[100,300,500];


let result=[];


let i=0;



let next=()=>{


if(
i>=periods.length
){



callback(result);


return;


}





this.rollingBackTest(

periods[i],

r=>{


result.push(r);


i++;


next();


}

);



};




next();


},







// ======================
// 开奖反馈
// ======================

feedback(value){



let nums=

value

.replace("+"," ")

.split(/\s+/)

.filter(Boolean);





this.records.push({


time:

new Date()

.toLocaleString(),


result:nums


});





localStorage.setItem(

"V5061_FEEDBACK",

JSON.stringify(

this.records

)

);



},







// ======================
// 状态
// ======================

status(){



return{


version:this.version,


data:this.data.length,


feedback:this.records.length


};


}



};





window.DLTEngine=

DLTEngine;