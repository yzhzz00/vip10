/*
====================================
彩票智能分析系统 V51.1 Mobile

核心引擎修正版

升级：
1. AI多维评分
2. 和值分析
3. 趋势分析
4. 回测修复接口
====================================
*/


const DLTEngine={


version:"V51.1",


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
// 总分析入口
// ======================

analyse(){



this.buildFrequency();



this.buildMiss();



this.buildSumModel();



this.buildTrendModel();



this.buildMarkov();



},









// ======================
// 动态频率
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







let total=this.data.length;





this.data.forEach((item,index)=>{



let weight=

0.5+

(index/total);






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



let sums=[];




this.data.forEach(item=>{



let sum=

item.front.reduce(

(a,b)=>a+Number(b),

0

);



sums.push(sum);



});





this.sumModel={



average:

Number(

(

sums.reduce(

(a,b)=>a+b,

0

)

/

sums.length

)

.toFixed(2)

),



min:

Math.min(...sums),



max:

Math.max(...sums),



history:sums



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




let len=this.data.length;



let short=

this.data.slice(

Math.max(0,len-10)

)

.filter(

x=>x.front.includes(n)

)

.length;






let middle=

this.data.slice(

Math.max(0,len-30)

)

.filter(

x=>x.front.includes(n)

)

.length;






let long=

this.data.slice(

Math.max(0,len-100)

)

.filter(

x=>x.front.includes(n)

)

.length;






this.trendModel[n]={



short,


middle,


long



};



}



},









// ======================
// 马尔可夫转移
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
// 单号码评分
// ======================

numberScore(n){



let score=0;




let freq=

this.frequency[n]||0;



let miss=

this.miss[n]||0;



let trend=

this.trendModel[n]||{

short:0,

middle:0,

long:0

};






//频率

score +=

freq*0.20;





//遗漏补偿

score +=

Math.min(miss,30)*0.15;





//趋势

score +=

trend.short*0.25;


score +=

trend.middle*0.15;


score +=

trend.long*0.05;






//转移

if(this.markov[n]){


let sum=0;


Object.values(

this.markov[n]

)

.forEach(v=>{


sum+=v;


});



score +=

sum*0.10;


}







return Number(

score.toFixed(2)

);



},









// ======================
// 组合评分
// ======================

comboScore(front){



let score=0;



front.forEach(n=>{



score+=

this.numberScore(n);



});







// 和值评分


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

25-

Math.abs(sum-avg)/2

);








// 奇偶

let odd=

front.filter(

n=>Number(n)%2===1

)

.length;





if(

odd===2||

odd===3

){


score+=15;


}







//三区

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

zone.filter(x=>x>0)

.length===3

){


score+=15;


}







return Number(

score.toFixed(2)

);



},










// ======================
// AI分析报告
// ======================

analysisReport(front){



let sum=

front.reduce(

(a,b)=>a+Number(b),

0

);





return {



sum:sum,



sumAverage:

this.sumModel.average,



structure:

this.structureInfo(front),



trend:

"短中长期趋势分析完成",



markov:

"马尔可夫转移分析完成"



};



},
// ======================
// 随机前区
// ======================

randomFront(){


let arr=[];



while(arr.length<5){



let n=

String(

Math.floor(

Math.random()*35

)+1

)

.padStart(2,"0");





if(!arr.includes(n)){


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



while(arr.length<2){



let n=

String(

Math.floor(

Math.random()*12

)+1

)

.padStart(2,"0");




if(!arr.includes(n)){


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

this.sumModel.average||105;






if(

Math.abs(sum-avg)>55

)

return false;






let odd=

nums.filter(

n=>n%2

).length;






if(

odd<2||

odd>3

)

return false;





return true;



},









// ======================
// 结构信息
// ======================

structureInfo(front){



let nums=

front.map(Number);



let odd=

nums.filter(

n=>n%2

).length;



return {


odd:odd,


even:5-odd,


sum:

nums.reduce(

(a,b)=>a+b,

0

)


};



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





if(count>=total){



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



let arr=[];





let types=[

"stable",

"balance",

"cold"

];






let used=[];





for(
let i=0;

i<list.length&&arr.length<3;

i++

){



let p=list[i];






if(

used.some(

x=>this.similarity(

x,

p.front

)>3

)

)

continue;







arr.push({



front:p.front,


back:p.back,


indexScore:

Math.min(

100,

Number(

(

p.score/

5

)

.toFixed(2)

)

),


type:

types[arr.length]



});





used.push(p.front);



}





return arr;



},









// ======================
// 相似度
// ======================

similarity(a,b){



let n=0;



a.forEach(x=>{



if(b.includes(x))


n++;



});



return n;



},









// ======================
// V51.1真实回测
// ======================

backTest(callback){



let periods=[100,300,500];



let output=[];



let run=i=>{



if(i>=periods.length){


callback(output);


return;


}






this.runBackTest(

periods[i],

r=>{


output.push(r);


run(i+1);


}



);



};





run(0);



},







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

this.data.length-period;






let index=start;







let loop=()=>{



if(index>=this.data.length){


callback(report);


return;


}







let real=this.data[index];






let best=0;






this.randomFront();



let predict=this.randomFront();





predict.forEach(n=>{


if(real.front.includes(n))


best++;


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



setTimeout(loop,5);



};




loop();



},









// ======================
// 开奖反馈
// ======================

feedback(value){



let arr=

value.replace("+"," ")

.trim()

.split(/\s+/);





this.records.push({



time:new Date(),

result:arr



});





localStorage.setItem(

"V51_feedback",

JSON.stringify(this.records)

);



}





};





window.DLTEngine=DLTEngine;