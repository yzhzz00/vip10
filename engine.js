/*
====================================
彩票智能分析系统 V51.0 Mobile

核心智能引擎

升级：
1. 和值模型
2. 趋势周期模型
3. 马尔可夫转移矩阵
4. 动态权重评分
====================================
*/


const DLTEngine={


version:"V51.0",


data:[],


// 基础频率

frequency:{},


// 遗漏

miss:{},


// 后区评分

backScore:{},


// 和值模型

sumModel:{},


// 趋势模型

trendModel:{},


// 马尔可夫矩阵

markov:{},


// 反馈记录

records:{},



// 进度

progress:null,


backProgress:null,




// ======================
// 初始化
// ======================

init(data){



this.data=[...data];



this.frequency={};


this.miss={};


this.backScore={};


this.sumModel={};


this.trendModel={};


this.markov={};




this.analyse();


},







// ======================
// 历史分析总入口
// ======================

analyse(){



this.buildFrequency();



this.buildMiss();



this.buildSumModel();



this.buildTrendModel();



this.buildMarkov();



},







// ======================
// 频率模型
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





let len=this.data.length;



this.data.forEach((item,index)=>{


let weight=

0.5+

index/len;



item.front.forEach(n=>{


this.frequency[n]+=weight;



});



});



},
// ======================
// 遗漏周期模型
// ======================

buildMiss(){


for(
let i=1;
i<=35;
i++
){


let num=

String(i)
.padStart(2,"0");



let miss=0;




for(
let j=this.data.length-1;
j>=0;
j--
){



if(

this.data[j].front.includes(num)

){


break;


}



miss++;



}



this.miss[num]=miss;



}



},









// ======================
// 和值模型
// ======================

buildSumModel(){



let sums=[];



this.data.forEach(item=>{



let sum=

item.front.reduce(

(a,b)=>a+Number(b),

0

);



sums.push(sum);



});






let total=

sums.reduce(

(a,b)=>a+b,

0

);





let avg=

total/sums.length;





this.sumModel={



average:

Number(avg.toFixed(2)),



min:

Math.min(...sums),



max:

Math.max(...sums),



recent:

sums.slice(-30)



};



},









// ======================
// 趋势周期模型
// ======================

buildTrendModel(){



for(
let i=1;
i<=35;
i++
){



let num=

String(i)
.padStart(2,"0");



let recent10=0;

let recent30=0;

let recent100=0;




let len=this.data.length;





this.data.slice(

Math.max(0,len-10)

)

.forEach(item=>{


if(

item.front.includes(num)

)

recent10++;



});






this.data.slice(

Math.max(0,len-30)

)

.forEach(item=>{


if(

item.front.includes(num)

)

recent30++;



});






this.data.slice(

Math.max(0,len-100)

)

.forEach(item=>{


if(

item.front.includes(num)

)

recent100++;



});







this.trendModel[num]={



short:recent10,


middle:recent30,


long:recent100



};





}



},
// ======================
// 马尔可夫转移模型
// 上一期号码 -> 下一期号码
// ======================

buildMarkov(){



this.markov={};



for(
let i=0;
i<this.data.length-1;
i++
){



let current=

this.data[i].front;



let next=

this.data[i+1].front;






current.forEach(a=>{



if(
!this.markov[a]
){

this.markov[a]={};

}



next.forEach(b=>{



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









// ======================
// AI号码综合评分
// ======================

numberScore(num){



let score=0;



let f=

this.frequency[num]||0;



let miss=

this.miss[num]||0;



let trend=

this.trendModel[num]||{

short:0,

middle:0,

long:0

};






// 频率权重

score +=

f*0.20;







// 遗漏补偿

score +=

Math.min(miss,25)

*0.15;







// 趋势

score +=

trend.short*0.20;



score +=

trend.middle*0.10;



score +=

trend.long*0.05;







// 马尔可夫趋势

let mark=

this.markov[num];



if(mark){



let count=0;



Object.values(mark)

.forEach(v=>{


count+=v;


});



score +=

count*0.10;



}







return Number(

score.toFixed(3)

);



},









// ======================
// 组合AI评分
// ======================

comboScore(front){



let score=0;



front.forEach(n=>{


score+=this.numberScore(n);



});







// 和值匹配

let sum=

front.reduce(

(a,b)=>a+Number(b),

0

);





let avg=

this.sumModel.average||105;





score +=

Math.max(

0,

20-

Math.abs(sum-avg)/3

);









// 奇偶结构


let odd=

front.filter(

n=>Number(n)%2===1

).length;



if(

odd===2 ||

odd===3

){


score+=15;


}






// 三区结构

let zone=[0,0,0];



front.forEach(n=>{


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


}







return Number(

score.toFixed(2)

);



},
// ======================
// 生成随机前区
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
// 生成随机后区
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



if(

new Set(nums).size!==5

){

return false;

}





// 和值范围


let sum=

nums.reduce(

(a,b)=>a+b,

0

);





let avg=

this.sumModel.average||105;






if(

Math.abs(sum-avg)>55

){

return false;

}







// 奇偶

let odd=

nums.filter(

n=>n%2

).length;





if(

odd<2 ||

odd>3

){

return false;

}








// 三区

let zone=[0,0,0];



nums.forEach(n=>{


if(n<=12)

zone[0]++;


else if(n<=24)

zone[1]++;


else

zone[2]++;



});





if(

zone.filter(

x=>x>0

).length<2

){

return false;

}







return true;



},









// ======================
// V51蒙特卡罗模拟
// ======================

simulate(total,callback){



let result=[];



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







let score=

this.comboScore(front);






result.push({


front,


back:this.randomBack(),


score


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






result.sort(

(a,b)=>b.score-a.score

);






callback(

this.createPlans(result)

);



}






},10);






},










// ======================
// 生成推荐方案
// ======================

createPlans(list){



let plans=[];





let first=list[0];






plans.push({

front:first.front,


back:first.back,


indexScore:100,


type:"stable"


});






let used=

first.front;






for(
let item of list
){



if(

this.similarity(

used,

item.front

)<=2

){



plans.push({

front:item.front,

back:item.back,

indexScore:99.5,

type:"balance"


});



break;


}


}








for(
let item of list.reverse()

){



if(

this.similarity(

used,

item.front

)<=1

){



plans.push({

front:item.front,

back:item.back,

indexScore:94,

type:"cold"


});



break;


}



}






return plans.slice(0,3);



},









// ======================
// 号码相似度
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
// 回测
// ======================

backTest(callback){



let periods=[100,300,500];



let result=[];



let index=0;






let runNext=()=>{



if(
index>=periods.length
){


callback(result);


return;


}







let period=

periods[index];






this.runBackTest(

period,

r=>{


result.push(r);



index++;



runNext();



}


);





};






runNext();



},










// ======================
// 单周期回测
// ======================

runBackTest(period,callback){



let report={



period,


test:0,


hit3:0,


hit4:0,


hit5:0,


best:0



};






let start=

Math.max(

100,

this.data.length-period

);





let index=start;







let timer=setInterval(()=>{



if(
index>=this.data.length
){



clearInterval(timer);



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







this.init(train);






this.simulate(

500,

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






});







report.test++;







if(this.backProgress){



this.backProgress(

report.test,

period

);



}






index++;







},50);




},










// ======================
// 开奖反馈学习
// ======================

feedback(value){



let nums=

value

.replace("+"," ")

.trim()

.split(/\s+/);






this.records.push({


date:

new Date()

.toLocaleString(),


result:nums



});







localStorage.setItem(

"V51_feedback",

JSON.stringify(

this.records

)

);






},









// ======================
// 获取状态
// ======================

getStatus(){



return {



version:this.version,


history:this.data.length,


feedback:

this.records.length



};



}





};





window.DLTEngine=

DLTEngine;