/*
====================================
彩票智能分析系统 V51.2 Mobile

AI评分优化版

升级：
1.评分重新标定
2.和值动态模型
3.真实回测接口
====================================
*/


const DLTEngine={


version:"V51.2",


data:[],


frequency:{},


miss:{},


sumModel:{},


trendModel:{},


markov:{},


records:[],


progress:null,


backProgress:null,





// ======================
// 初始化
// ======================

init(data){


this.data=[...data];


this.frequency={};

this.miss={};

this.sumModel={};

this.trendModel={};

this.markov={};



this.analyse();



},









// ======================
// 总分析
// ======================

analyse(){


this.buildFrequency();


this.buildMiss();


this.buildSumModel();


this.buildTrendModel();


this.buildMarkov();


},










// ======================
// 动态频率模型
// ======================

buildFrequency(){



for(
let i=1;
i<=35;
i++
){



let n=

String(i)

.padStart(2,"0");



this.frequency[n]=0;



}







let total=

this.data.length;





this.data.forEach((item,index)=>{



let weight=

0.5+

index/total;






item.front.forEach(n=>{


this.frequency[n]+=weight;


});



});



},









// ======================
// 遗漏模型
// ======================

buildMiss(){



for(
let i=1;
i<=35;
i++
){



let n=

String(i)

.padStart(2,"0");



let miss=0;




for(
let j=this.data.length-1;

j>=0;

j--

){



if(
this.data[j].front.includes(n)

){


break;


}



miss++;



}





this.miss[n]=miss;



}



},










// ======================
// 和值模型
// ======================

buildSumModel(){



let arr=[];



this.data.forEach(item=>{



let sum=

item.front.reduce(

(a,b)=>a+Number(b),

0

);



arr.push(sum);



});







this.sumModel={



average:

Number(

(

arr.reduce(

(a,b)=>a+b,

0

)

/

arr.length

)

.toFixed(2)

),



min:

Math.min(...arr),



max:

Math.max(...arr),



history:arr



};



},
// ======================
// 趋势模型
// ======================

buildTrendModel(){


for(
let i=1;
i<=35;
i++
){



let n=

String(i)

.padStart(2,"0");



let len=

this.data.length;





this.trendModel[n]={



short:

this.data.slice(

Math.max(0,len-10)

)

.filter(

x=>x.front.includes(n)

)

.length,




middle:

this.data.slice(

Math.max(0,len-30)

)

.filter(

x=>x.front.includes(n)

)

.length,




long:

this.data.slice(

Math.max(0,len-100)

)

.filter(

x=>x.front.includes(n)

)

.length



};



}



},









// ======================
// 马尔可夫转移模型
// ======================

buildMarkov(){



this.markov={};





for(
let i=0;

i<this.data.length-1;

i++

){



let now=

this.data[i].front;



let next=

this.data[i+1].front;






now.forEach(a=>{



if(!this.markov[a])

this.markov[a]={};





next.forEach(b=>{



if(!this.markov[a][b])

this.markov[a][b]=0;



this.markov[a][b]++;



});



});



}



},










// ======================
// AI号码评分
// ======================

numberScore(num){



let score=0;




let freq=

this.frequency[num]||0;



let miss=

this.miss[num]||0;



let trend=

this.trendModel[num]||{

short:0,

middle:0,

long:0

};








// 频率

score +=

freq*0.18;







// 遗漏

score +=

Math.min(

miss,

25

)*0.12;







// 趋势

score +=

trend.short*0.25;



score +=

trend.middle*0.15;



score +=

trend.long*0.05;








// 马尔可夫

if(this.markov[num]){



let total=0;



Object.values(

this.markov[num]

)

.forEach(v=>{


total+=v;


});



score +=

total*0.10;



}






return score;



},










// ======================
// 冷热评分
// ======================

coldScore(num){



let miss=

this.miss[num]||0;



let freq=

this.frequency[num]||0;






return (

miss*0.2

-

freq*0.05

);



},









// ======================
// 号码最终AI分
// ======================

finalNumberScore(num){



let value=



this.numberScore(num)

+

this.coldScore(num);







return Number(

value.toFixed(3)

);



},
// ======================
// 组合AI评分
// ======================

comboScore(front){



let score=0;





// 号码累计评分

front.forEach(n=>{


score +=

this.finalNumberScore(n);



});







// ==================
// 和值模型
// ==================

let sum=

front.reduce(

(a,b)=>a+Number(b),

0

);



let avg=

this.sumModel.average||90;




let diff=

Math.abs(

sum-avg

);






if(diff<=10){


score+=30;


}

else if(diff<=20){


score+=20;


}

else if(diff<=35){


score+=5;


}

else{


score-=20;


}









// ==================
// 奇偶结构
// ==================

let odd=

front.filter(

n=>Number(n)%2===1

)

.length;






if(
odd===2||
odd===3
){


score+=20;


}

else{


score-=15;


}









// ==================
// 三区结构
// ==================

let zone=[0,0,0];



front.forEach(n=>{



let x=

Number(n);



if(x<=12)

zone[0]++;



else if(x<=24)

zone[1]++;



else

zone[2]++;




});







if(

zone.every(

x=>x>0

)

){


score+=25;


}

else{


score-=10;


}








// ==================
// 高低区控制
// ==================

let high=

front.filter(

n=>Number(n)>=25

)

.length;



if(

high>=1&&high<=3

){


score+=10;


}

else{


score-=8;


}









// ==================
// 连号控制
// ==================

let nums=

front.map(Number)

.sort(

(a,b)=>a-b

);



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





if(link<=2){


score+=8;


}

else{


score-=12;


}








// 防止无限封顶

let result=

70+

score/8;






if(result>99)

result=99;





if(result<60)

result=60;






return Number(

result.toFixed(2)

);



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

){


arr.push(n);


}



}





return arr.sort(

(a,b)=>Number(a)-Number(b)

);



},









// ======================
// 结构过滤
// ======================

structureFilter(front){



let nums=

front.map(Number);



let sum=

nums.reduce(

(a,b)=>a+b,

0

);





let avg=

this.sumModel.average||90;





if(

Math.abs(sum-avg)>45

)

return false;






let odd=

nums.filter(

n=>n%2

)

.length;





if(

odd<2||

odd>3

)

return false;






return true;



},









// ======================
// 蒙特卡罗模拟
// ======================

simulate(total,callback){



let list=[];



let count=0;






let timer=setInterval(()=>{



for(
let i=0;

i<500;

i++

){



let front;




do{


front=this.randomFront();



}

while(

!this.structureFilter(front)

);







list.push({



front,


back:this.randomBack(),


score:this.comboScore(front)



});





count++;







if(this.progress){



this.progress(

count,

total

);



}





}







if(

count>=total

){



clearInterval(timer);






list.sort(

(a,b)=>b.score-a.score

);







callback(

this.createPlans(list)

);



}






},10);




},









// ======================
// 生成方案
// ======================

createPlans(list){



let result=[];



let types=[

"stable",

"balance",

"cold"

];





let used=[];






for(

let item of list

){



if(

result.length>=3

)

break;







let same=false;



used.forEach(x=>{



if(

this.similarity(

x,

item.front

)>3

){


same=true;


}



});





if(same)

continue;








result.push({



front:item.front,


back:item.back,


indexScore:item.score,


type:types[result.length]



});







used.push(item.front);



}





return result;



},
// ======================
// 相似度
// ======================

similarity(a,b){


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
// AI多维分析报告
// ======================

analysisReport(front){



let sum=

front.reduce(

(a,b)=>a+Number(b),

0

);




let odd=

front.filter(

n=>Number(n)%2===1

)

.length;





let zone=[0,0,0];



front.forEach(n=>{


let x=

Number(n);



if(x<=12)

zone[0]++;



else if(x<=24)

zone[1]++;



else

zone[2]++;



});







return {



sum:sum,



averageSum:

this.sumModel.average,



odd:odd,


even:5-odd,



zone:zone,



trend:

"短中长期趋势分析完成",



markov:

"马尔可夫转移分析完成",



score:

this.comboScore(front)



};




},










// ======================
// V51.2真实AI回测
// ======================

backTest(callback){



let periods=[100,300,500];



let result=[];



let run=(index)=>{



if(

index>=periods.length

){



callback(result);


return;


}







this.realBackTest(

periods[index],

data=>{


result.push(data);


run(index+1);



}



);



};





run(0);



},









// ======================
// 单周期真实回测
// ======================

realBackTest(period,callback){



let report={



period:period,


test:0,


hit3:0,


hit4:0,


hit5:0,


best:0



};






let start=

this.data.length-period;





let index=start;







let loop=()=>{



if(

index>=this.data.length

){



callback(report);


return;


}







let train=

this.data.slice(

0,

index

);






let real=

this.data[index];







// 使用历史训练


this.init(train);








this.simulate(

5000,

plans=>{





let best=0;






plans.forEach(p=>{



let hit=0;





p.front.forEach(n=>{



if(

real.front.includes(n)

){


hit++;


}



});






if(hit>best)

best=hit;



});







if(best>=3)

report.hit3++;





if(best>=4)

report.hit4++;





if(best===5)

report.hit5++;





if(best>report.best)

report.best=best;






report.test++;






if(this.backProgress){



this.backProgress(

report.test,

period

);



}






index++;






setTimeout(

loop,

20

);






}



);




};





loop();



},










// ======================
// 开奖反馈
// ======================

feedback(value){



let nums=

value

.replace("+"," ")

.trim()

.split(/\s+/);







this.records.push({



time:

new Date()

.toLocaleString(),



result:nums



});






localStorage.setItem(

"V512_feedback",

JSON.stringify(

this.records

)

);



},










// ======================
// 状态
// ======================

status(){



return {



version:this.version,


data:

this.data.length,


learning:

this.records.length



};



}



};







window.DLTEngine=

DLTEngine;
