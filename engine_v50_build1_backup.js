/*
====================================
彩票智能分析系统 V50 Ultimate

Build 1

候选池重构版

核心升级：
1. 动态权重评分
2. 热号衰减
3. 遗漏补偿
4. 候选过滤
5. 分层模拟准备
====================================
*/


const DLTEngine={


version:"V50.0 Build1",


data:[],


frequency:{},


miss:{},


backScore:{},


records:[],



// ======================
// 初始化
// ======================

init(data){


this.data=[...data];


this.frequency={};

this.miss={};

this.backScore={};


this.analyse();


},





// ======================
// 历史统计
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





this.data.forEach((item,index)=>{


let weight=

0.5+

(index/length);




item.front.forEach(n=>{


this.frequency[n]+=weight;


});




item.back.forEach(n=>{


this.backScore[n]=

(this.backScore[n]||0)+weight;


});



});





// 遗漏计算


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
){

break;

}


miss++;


}



this.miss[num]=miss;


}



},







// ======================
// 单号评分
// ======================


numberScore(num){


let score=0;



// 频率

score+=this.frequency[num];



// 遗漏补偿

score+=

Math.min(
this.miss[num],
25
)
*
0.8;





// 热号惩罚

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
// 组合评分
// ======================


comboScore(combo){


let score=0;



combo.forEach(n=>{


score+=this.numberScore(n);


});





// 奇偶


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






// 三区


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




let zoneCount=

zone.filter(
x=>x>0
).length;



if(
zoneCount===3
){

score+=15;


}else{


score-=10;


}





// 和值


let sum=

combo.reduce(

(a,b)=>a+Number(b),

0

);



if(
sum>=90 &&
sum<=180
){

score+=10;


}else{


score-=5;


}





// 连号


let link=0;



for(
let i=1;
i<combo.length;
i++
){


if(
Number(combo[i])-
Number(combo[i-1])
===1
){

link++;

}


}




if(link<=2){

score+=8;


}else{


score-=8;


}



return score;


},
// ======================
// V50 Build1 候选过滤
// ======================

filterCandidate(front){


let nums=front.map(Number);



// 数量检查

if(nums.length!==5){

return false;

}



// 去重

if(
new Set(nums).size!==5
){

return false;

}



// 排序

nums.sort(
(a,b)=>a-b
);



// 和值过滤

let sum=

nums.reduce(
(a,b)=>a+b,
0
);



if(
sum<70 ||
sum>160
){

return false;

}





// 奇偶过滤

let odd=

nums.filter(
n=>n%2!==0
).length;



if(
odd<2 ||
odd>3
){

return false;

}







// 三区结构


let zone=[0,0,0];



nums.forEach(n=>{


if(n<=12)

zone[0]++;


else if(n<=24)

zone[1]++;


else

zone[2]++;


});



let active=

zone.filter(
x=>x>0
).length;



if(
active<2
){

return false;

}





// 连号过滤


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
link>2
){

return false;

}



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
){

arr.push(n);


}


}



return arr.sort(

(a,b)=>

Number(a)-Number(b)

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
){

arr.push(n);


}


}




return arr.sort(

(a,b)=>

Number(a)-Number(b)

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
){

count++;

}


});



return count;


},







// ======================
// V50 Build1 蒙特卡罗
// ======================


simulate(total,callback){



let pool=[];


let count=0;



let timer=setInterval(()=>{



for(
let i=0;
i<500;
i++
){



let front;



// 候选过滤

do{


front=this.randomFront();



}
while(
!this.filterCandidate(front)
);






let score=

this.comboScore(front);





pool.push({

front,


back:this.randomBack(),


score


});



count++;



}






if(
count>=total
){


clearInterval(timer);





pool.sort(

(a,b)=>

b.score-a.score

);





callback(

this.generatePlans(pool)

);



}



},10);



},








// ======================
// 三方案生成
// ======================


generatePlans(pool){



let plans=[];




// 稳定

let stable=

pool[0];



plans.push({

...stable,

type:"stable"

});






// 均衡

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







// 冷门

let coldList=

[...pool].reverse();



for(
let item of coldList
){



if(
this.similar(

stable.front,

item.front

)<=2

){



plans.push({

...item,

type:"cold"

});


break;


}



}





while(
plans.length<3
){


plans.push(

pool[
plans.length
]

);


}




// 指数

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
// V50 Build1 滚动回测
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




let i=start;



let run=setInterval(()=>{



let end=

Math.min(
i+5,
history.length
);




while(
i<end
){



let train=

history.slice(
0,
i
);



let real=

history[i];





this.init(train);






this.simulate(

1000,

plans=>{



let best=0;



plans.forEach(p=>{



let same=0;



p.front.forEach(n=>{



if(
real.front.includes(n)
){

same++;

}


});




if(
same>best
){

best=same;

}



});







if(best>=3)

report.hit3++;



if(best>=4)

report.hit4++;



if(best===5)

report.hit5++;






if(best>report.best)

report.best=best;



}

);



report.test++;



i++;



}





if(
i>=history.length
){



clearInterval(run);



callback(report);


}



},100);



},







// ======================
// 多周期回测
// ======================


backTest(callback){



let periods=[100,300,500];

let result=[];


let index=0;



let next=()=>{


if(
index>=periods.length
){



callback(result);

return;


}





this.rollingBackTest(

periods[index],

r=>{


result.push(r);


index++;


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

"V500_FEEDBACK",

JSON.stringify(
this.records
)

);



},







// ======================
// 系统状态
// ======================


status(){



return {


version:this.version,


data:this.data.length,


feedback:

this.records.length


};



}





};






window.DLTEngine=

DLTEngine;