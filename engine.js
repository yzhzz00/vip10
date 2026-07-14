/*
====================================
彩票智能分析系统 V36.2 Mobile

核心计算引擎

优化：
1. 分批计算
2. 手机不卡死
3. 预测/回测分离
4. 方案差异化
====================================
*/


const DLTEngine={


version:"V36.2",


data:[],


front:{},


back:{},


markov:{},


pool:[],






init(data){


this.data=data||[];


this.front={};


this.back={};


this.markov={};



for(
let i=1;
i<=35;
i++
){


let n=

String(i)
.padStart(2,"0");


this.front[n]=0;


}



for(
let i=1;
i<=12;
i++
){


let n=

String(i)
.padStart(2,"0");


this.back[n]=0;


}





this.analyseFrequency();


this.analyseMarkov();


this.createPool();



},







// ======================
// 历史频率分析
// ======================


analyseFrequency(){



let total=

this.data.length;



this.data.forEach((item,index)=>{



let weight=1+index/total;



item.front.forEach(n=>{


this.front[n]+=weight;


});




item.back.forEach(n=>{


this.back[n]+=weight;


});



});






// 遗漏补偿



Object.keys(this.front)
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





this.front[n]+=

Math.min(
miss,
30
)
*
0.3;



});





},







// ======================
// 马尔可夫模型
// ======================


analyseMarkov(){



for(
let i=1;
i<this.data.length;
i++
){



let a=

this.data[i-1].front;


let b=

this.data[i].front;





a.forEach(x=>{



if(
!this.markov[x]
){


this.markov[x]={};


}



b.forEach(y=>{



if(
!this.markov[x][y]
){


this.markov[x][y]=0;


}



this.markov[x][y]++;



});



});



}



},







// ======================
// 创建号码池
// ======================


createPool(){



let arr=

Object.keys(this.front)
.sort(

(a,b)=>

this.front[b]-
this.front[a]

);



this.pool=arr;



},
// ======================
// 号码评分
// ======================


scoreNumber(n){


return this.front[n]||0;


},







// ======================
// 组合评分
// ======================


scoreCombo(arr){



let score=0;



arr.forEach(n=>{


score+=this.scoreNumber(n);


});





// 奇偶


let odd=

arr.filter(n=>

Number(n)%2===1

).length;



if(
odd===2||
odd===3
){

score+=15;

}





// 三区


let zone=[0,0,0];



arr.forEach(n=>{


let x=Number(n);



if(x<=12)
zone[0]++;

else if(x<=24)
zone[1]++;

else
zone[2]++;



});





if(
zone[0]>0 &&
zone[1]>0 &&
zone[2]>0
){

score+=15;

}






// 和值


let sum=

arr.reduce(

(a,b)=>

a+Number(b),

0

);



if(
sum>=90 &&
sum<=180
){

score+=15;

}





return score;



},







// ======================
// 随机组合
// ======================


createCombo(type){



let result=[];



let start=0;



let range=this.pool.length;





if(type==="stable"){


range=15;


}



if(type==="cold"){


start=15;


range=20;


}





while(
result.length<5
){



let index=

start+
Math.floor(
Math.random()*range
);



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







// ======================
// 后区生成
// ======================


createBack(){



let arr=

Object.keys(this.back)
.sort(

(a,b)=>

this.back[b]-
this.back[a]

);



let result=[];



while(
result.length<2
){



let n=

arr[
Math.floor(
Math.random()*arr.length
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







// ======================
// 单方案搜索
// ======================


search(type,callback){



let best=null;


let bestScore=0;


let count=0;




let timer=setInterval(()=>{



for(
let i=0;
i<200;
i++
){



let combo=

this.createCombo(type);



let score=

this.scoreCombo(combo);





if(
score>bestScore
){

bestScore=score;

best=combo;


}



count++;





}




if(
count>=5000
){



clearInterval(timer);



callback({


front:best,


back:this.createBack(),


raw:bestScore,


type



});



}



},20);





},







// ======================
// 三方案异步生成
// ======================


run(callback){



let modes=[

"stable",

"balance",

"cold"

];



let result=[];



let index=0;






let next=()=>{



if(
index>=modes.length
){



result.sort(

(a,b)=>

b.raw-a.raw

);





let max=

result[0].raw;




result.forEach(x=>{



x.score=

Number(

(
85+
(
x.raw/max
*
15
)

).toFixed(2)

);



});





callback(result);



return;


}





this.search(

modes[index],

data=>{


result.push(data);


index++;


next();



});



};





next();



},
// ======================
// V36.2 历史回测
// ======================


backTest(callback){



let periods=[100,300,500];


let reports=[];


let pIndex=0;





let runPeriod=()=>{



if(
pIndex>=periods.length
){



callback(reports);


return;


}





let period=

periods[pIndex];



let start=

Math.max(

50,

this.data.length-period

);





let hit3=0;

let hit4=0;

let hit5=0;


let total=0;


let i=start;






let timer=setInterval(()=>{



let end=

Math.min(
i+5,
this.data.length
);





while(
i<end
){



let train=

this.data.slice(
0,
i
);



let real=

this.data[i];






this.init(train);





let predict=

this.createCombo("stable");





let same=0;



predict.forEach(n=>{



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





total++;


i++;



}





if(
i>=this.data.length
){



clearInterval(timer);





reports.push({



period,


test:total,


hit3,


hit4,


hit5



});





pIndex++;



this.init(this.data);



runPeriod();



}



},30);



};





runPeriod();



},







// ======================
// 反馈学习
// ======================


learn(result){



let nums=

result
.split(/\s+/)
.filter(x=>x);



nums.forEach(n=>{



if(
this.front[n]
!==undefined
){


this.front[n]+=5;


}



});





localStorage.setItem(

"V362_LEARN",

JSON.stringify(nums)

);



},





};







window.DLTEngine=

DLTEngine;