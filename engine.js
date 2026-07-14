/*
====================================

彩票智能分析系统 V60.0

核心AI引擎

模块：

大乐透数据
排列五数据
频率模型
遗漏模型
和值模型
结构模型
马尔可夫模型

====================================
*/


const LotteryEngine = {


version:"V60.0",


dlt:[],


pl5:[],


markov:{},


weights:{


frequency:0.30,


omit:0.20,


markov:0.20,


structure:0.15,


sum:0.15


},







// ==============================
// 加载大乐透数据
// ==============================


async loadDLT(){



let res = await fetch(

"data/dlt.txt"

);



let text = await res.text();



this.dlt = this.parseDLT(text);



console.log(

"大乐透数据",

this.dlt.length

);



return this.dlt;



},








// ==============================
// 大乐透格式解析
// ==============================


parseDLT(text){



let lines = text.trim()

.split(/\n+/);




let result=[];




lines.forEach(line=>{



let arr=line

.trim()

.split(/\s+/);





if(arr.length>=9){



result.push({



issue:arr[0],



date:arr[1],




front:[

arr[2],
arr[3],
arr[4],
arr[5],
arr[6]

],




back:[

arr[7],
arr[8]

]



});



}



});





return result;



},









// ==============================
// 加载排列五
// ==============================


async loadPL5(){



let res=

await fetch(

"data/pl5.txt"

);



let text=

await res.text();





this.pl5=

this.parsePL5(text);





console.log(

"排列五数据",

this.pl5.length

);



return this.pl5;



},









// ==============================
// 排列五解析
// ==============================


parsePL5(text){



let lines=

text.trim()

.split(/\n+/);



let result=[];




lines.forEach(line=>{



let arr=

line.trim()

.split(/\s+/);





if(arr.length>=5){



result.push({


num:[

arr[0],
arr[1],
arr[2],
arr[3],
arr[4]

]


});



}



});





return result;



},









// ==============================
// 前区号码频率
// ==============================


frequency(){



let map={};



for(let i=1;i<=35;i++){


let n=

String(i).padStart(2,"0");


map[n]=0;


}





this.dlt.forEach(item=>{



item.front.forEach(n=>{



map[n]++;



});


});





return map;



},
// ==============================
// 遗漏计算
// ==============================


omit(){



let result={};



for(let i=1;i<=35;i++){



let n=

String(i).padStart(2,"0");



result[n]=999;



}







for(let i=this.dlt.length-1;i>=0;i--){



this.dlt[i].front.forEach(n=>{



if(result[n]===999){


result[n]=

this.dlt.length-1-i;


}



});



}





return result;



},









// ==============================
// 和值分析
// ==============================


sumAnalysis(){



let list=[];



this.dlt.forEach(item=>{



let sum=

item.front.reduce(

(a,b)=>a+Number(b),

0

);



list.push(sum);



});






let avg=

list.reduce(

(a,b)=>a+b,

0

)

/

list.length;







return {



average:

Number(avg.toFixed(2)),


last:

list[list.length-1],


list



};



},









// ==============================
// 奇偶结构
// ==============================


oddEven(front){



let odd=0;



front.forEach(n=>{



if(Number(n)%2===1)

odd++;



});





return {



odd,


even:5-odd



};



},










// ==============================
// 三区结构
// ==============================


zone(front){



let zone={


one:0,


two:0,


three:0



};






front.forEach(n=>{



let num=

Number(n);





if(num<=12)

zone.one++;


else if(num<=24)

zone.two++;


else

zone.three++;



});






return zone;



},










// ==============================
// 马尔可夫矩阵
// ==============================


buildMarkov(){



let matrix={};






for(

let i=0;

i<this.dlt.length-1;

i++

){



let now=

this.dlt[i].front;



let next=

this.dlt[i+1].front;






now.forEach(a=>{



if(!matrix[a])

matrix[a]={};





next.forEach(b=>{



if(!matrix[a][b])

matrix[a][b]=0;




matrix[a][b]++;



});



});



}





this.markov=matrix;



return matrix;



},










// ==============================
// 马尔可夫评分
// ==============================


markovScore(num){



let score=0;



let last=

this.dlt[this.dlt.length-1];





if(!last)

return 0;






last.front.forEach(old=>{



if(

this.markov[old]

&&

this.markov[old][num]

){



let total=0;




Object.values(

this.markov[old]

)

.forEach(v=>{


total+=v;


});






score+=

this.markov[old][num]

/

total;



}



});







return score*100;



},
// ==============================
// 综合号码评分
// ==============================


numberScore(num){



let score=0;



let freq=

this.frequency();



let omit=

this.omit();





// 频率评分

score +=

freq[num]

*

this.weights.frequency;







// 遗漏补偿

score +=

omit[num]

*

this.weights.omit;







// 马尔可夫

score +=

this.markovScore(num)

*

this.weights.markov;







return Number(

score.toFixed(3)

);



},










// ==============================
// 候选号码池
// ==============================


candidatePool(){



let pool=[];




for(let i=1;i<=35;i++){



let n=

String(i).padStart(2,"0");





pool.push({



number:n,


score:

this.numberScore(n)



});



}






pool.sort(

(a,b)=>

b.score-a.score

);





return pool;



},










// ==============================
// 后区评分
// ==============================


backPool(){



let map={};



for(let i=1;i<=12;i++){



let n=

String(i).padStart(2,"0");



map[n]=0;



}







this.dlt.forEach(item=>{



item.back.forEach(n=>{



map[n]++;



});



});







return Object.keys(map)

.sort(

(a,b)=>

map[b]-map[a]

)

.slice(0,8);



},









// ==============================
// 生成前区组合
// ==============================


generateFront(){



let pool=

this.candidatePool()

.slice(0,20);





let result=[];






while(result.length<5){



let index=

Math.floor(

Math.random()*pool.length

);






let num=

pool[index].number;





if(

!result.includes(num)

){



result.push(num);



}



}





return result.sort(

(a,b)=>

Number(a)-Number(b)

);



},










// ==============================
// 生成预测方案
// ==============================


predict(){



this.buildMarkov();





let plans=[];




for(let i=0;i<20;i++){



let front=

this.generateFront();






let back=

this.backPool()

.slice(0,2);






let score=0;





front.forEach(n=>{



score+=

this.numberScore(n);



});







plans.push({



front,


back,


score:

Number(score.toFixed(2))



});



}






plans.sort(

(a,b)=>

b.score-a.score

);





return plans.slice(0,3);



},










// ==============================
// AI报告
// ==============================


report(){



return {



version:this.version,


history:this.dlt.length,



sum:this.sumAnalysis(),



top:

this.candidatePool()

.slice(0,10)



};



}



};







// 暴露接口

window.LotteryEngine=

LotteryEngine;