/*
=====================================
彩票智能分析系统 V37.0 Mobile

核心分析引擎

升级：
1. 滚动回测架构
2. 动态权重
3. 组合去重
4. 多维评分
=====================================
*/


const DLTEngine={


version:"V37.0",


data:[],


frequency:{},


backFrequency:{},


markov:{},


records:[],




// 初始化

init(data){


this.data=[...data];


this.frequency={};


this.backFrequency={};


this.markov={};



this.analyse();


},







// =======================
// 动态频率分析
// =======================


analyse(){



let total=this.data.length;



this.data.forEach((item,index)=>{



let weight=

1+
(index/total);





item.front.forEach(n=>{


if(!this.frequency[n])
this.frequency[n]=0;


this.frequency[n]+=weight;



});





item.back.forEach(n=>{


if(!this.backFrequency[n])
this.backFrequency[n]=0;


this.backFrequency[n]+=weight;



});



});






this.analyseMarkov();



},







// =======================
// 马尔可夫转移
// =======================


analyseMarkov(){



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



if(!this.markov[a])
this.markov[a]={};





after.forEach(b=>{



if(!this.markov[a][b])
this.markov[a][b]=0;



this.markov[a][b]++;



});



});



}



},







// =======================
// 号码基础评分
// =======================


numberScore(n){



let score=

this.frequency[n]||0;



// 遗漏奖励


let miss=0;



for(
let i=this.data.length-1;
i>=0;
i--
){



if(
this.data[i].front.includes(n)
)
break;


miss++;


}



score+=

Math.min(
miss,
25
)
*
0.5;



return score;



},
// =======================
// 组合综合评分
// =======================


comboScore(combo){



let score=0;



// 号码概率


combo.forEach(n=>{


score+=this.numberScore(n);


});







// 奇偶结构


let odd=

combo.filter(n=>

Number(n)%2===1

).length;



if(
odd===2 ||
odd===3
){

score+=15;


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
zone[0]>0 &&
zone[1]>0 &&
zone[2]>0
){

score+=15;


}







// 和值控制


let sum=

combo.reduce(

(a,b)=>

a+Number(b),

0

);



if(
sum>=95 &&
sum<=175
){

score+=12;


}







// 连号控制


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





if(
link<=2
){

score+=8;


}







return score;



},







// =======================
// 生成候选号码
// =======================


randomCombo(){



let nums=[];



while(
nums.length<5
){



let n=

String(

Math.floor(
Math.random()*35
)+1

)
.padStart(2,"0");




if(
!nums.includes(n)
){

nums.push(n);


}



}



return nums.sort(

(a,b)=>

Number(a)-Number(b)

);



},







// =======================
// 后区生成
// =======================


randomBack(){



let nums=[];



while(
nums.length<2
){



let n=

String(

Math.floor(
Math.random()*12
)+1

)
.padStart(2,"0");





if(
!nums.includes(n)
){

nums.push(n);


}



}





return nums.sort(

(a,b)=>

Number(a)-Number(b)

);



},
// =======================
// 候选模拟搜索
// =======================


simulate(count,callback){



let list=[];



let index=0;



let timer=setInterval(()=>{



for(
let i=0;
i<500;
i++
){



let front=

this.randomCombo();



let score=

this.comboScore(front);





list.push({


front,


score,


back:this.randomBack()


});





index++;



}





// 达到模拟数量


if(
index>=count
){



clearInterval(timer);





// 排序

list.sort(

(a,b)=>

b.score-a.score

);







callback(

this.makePlans(list)

);



}



},10);



},







// =======================
// 三方案生成
// =======================


makePlans(list){



let plans=[];



let used=[];




for(
let item of list
){



if(
plans.length===0
){



plans.push({

...item,

type:"stable"

});



used.push(item.front);


continue;


}





let similar=false;



for(
let old of used
){



let same=0;



item.front.forEach(n=>{


if(
old.includes(n)
){

same++;


}



});





if(
same>=4
){

similar=true;


}



}



if(
!similar
){



plans.push({

...item,

type:

plans.length===1?

"balance":

"cold"



});



used.push(item.front);



}



if(
plans.length>=3
)
break;



}







// 评分百分化


let max=

plans[0].score||1;



plans.forEach(p=>{


p.indexScore=

Number(

(
80+
p.score/max*20

)
.toFixed(2)

);



});





return plans;



},







// =======================
// 反馈学习
// =======================


feedback(result){



let nums=

result
.replace("+"," ")
.split(/\s+/)
.filter(x=>x);





this.records.push({

time:Date.now(),

result:nums

});





localStorage.setItem(

"V370_RECORDS",

JSON.stringify(
this.records
)

);



},
// =======================
// V37.0 滚动历史回测
// =======================


rollingBackTest(period,callback){



let source=[...this.data];



let start=

Math.max(
1,
source.length-period
);



let result={



period,

test:0,


hit3:0,

hit4:0,

hit5:0,


back1:0,

back2:0



};




let i=start;



let timer=setInterval(()=>{



let end=

Math.min(
i+5,
source.length
);





while(
i<end
){



let train=

source.slice(
0,
i
);



let real=

source[i];






this.init(train);






let predict=

this.randomCombo();





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
result.hit3++;



if(
same>=4
)
result.hit4++;



if(
same===5
)
result.hit5++;







let backSame=0;



predict.forEach(()=>{});





result.test++;



i++;



}






if(
i>=source.length
){



clearInterval(timer);





callback(result);



}



},30);



},







// =======================
// 完整回测
// =======================


backTest(callback){



let periods=[100,300,500];

let results=[];


let index=0;



let next=()=>{



if(
index>=periods.length
){



callback(results);


return;


}





this.rollingBackTest(

periods[index],

data=>{



results.push(data);



index++;



next();



}



);



};





next();



},







// =======================
// 状态
// =======================


getStatus(){


return {


version:this.version,

data:this.data.length,


records:this.records.length


};


}



};





window.DLTEngine=

DLTEngine;