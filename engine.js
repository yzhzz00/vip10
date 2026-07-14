/*
=================================
彩票智能分析系统 V36.3 Mobile

核心引擎
=================================
*/


const DLTEngine={


version:"36.3",


data:[],


history:[],


frontScore:{},


backScore:{},


markov:{},


pool:[],




init(data){


this.data=data||[];


this.history=data||[];


this.frontScore={};


this.backScore={};


this.markov={};


this.pool=[];



for(let i=1;i<=35;i++){


let n=

String(i).padStart(2,"0");


this.frontScore[n]=0;


}



for(let i=1;i<=12;i++){


let n=

String(i).padStart(2,"0");


this.backScore[n]=0;


}





this.frequency();


this.markovModel();


this.createPool();



},







// =================
// 动态频率模型
// =================


frequency(){



let len=this.data.length;



this.data.forEach((item,index)=>{



// 越近期权重越高

let w=

1+
(index/len);





item.front.forEach(n=>{


this.frontScore[n]+=w;


});



item.back.forEach(n=>{


this.backScore[n]+=w;


});




});






// 遗漏补偿+热号衰减



Object.keys(this.frontScore)
.forEach(n=>{



let miss=0;



for(
let i=len-1;
i>=0;
i--
){


if(
this.data[i].front.includes(n)
)
break;


miss++;


}





// 遗漏增加

this.frontScore[n]+=

Math.min(
miss,
30
)*0.4;






// 高频衰减

if(
this.frontScore[n]>80
){

this.frontScore[n]*=0.85;


}



});



},
// =================
// 马尔可夫转移模型
// =================


markovModel(){



for(
let i=1;
i<this.data.length;
i++
){



let before=

this.data[i-1].front;



let now=

this.data[i].front;





before.forEach(a=>{



if(
!this.markov[a]
){

this.markov[a]={};

}



now.forEach(b=>{



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







// =================
// 创建号码池
// =================


createPool(){



this.pool=

Object.keys(this.frontScore)
.sort(

(a,b)=>

this.frontScore[b]-
this.frontScore[a]

);



},







// =================
// 组合评分
// =================


score(combo){



let s=0;



combo.forEach(n=>{


s+=this.frontScore[n];


});







// 奇偶结构


let odd=

combo.filter(n=>

Number(n)%2

).length;



if(
odd===2||
odd===3
){

s+=12;


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
zone[0]&&zone[1]&&zone[2]
){

s+=15;


}






// 和值


let sum=

combo.reduce(

(a,b)=>

a+Number(b),

0

);



if(
sum>=90 &&
sum<=180
){

s+=12;


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

s+=8;


}






return s;



},







// =================
// 生成组合
// =================


createCombo(type){



let result=[];



let pool=[...this.pool];






// 冷门方案打乱权重

if(
type==="cold"
){


pool.reverse();


}




while(
result.length<5
){



let index=

Math.floor(

Math.random()*
pool.length

);



let n=

pool[index];





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







// =================
// 后区生成
// =================


createBack(){



let arr=

Object.keys(this.backScore)
.sort(

(a,b)=>

this.backScore[b]-
this.backScore[a]

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
// =================
// 蒙特卡罗搜索
// =================


search(type,callback){



let best=null;


let bestScore=-999;



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

this.score(combo);






if(
score>bestScore
){



bestScore=score;


best=combo;


}



count++;



}





if(
count>=10000
){



clearInterval(timer);



callback({


front:best,


back:this.createBack(),


raw:bestScore,


type:type



});



}



},20);



},







// =================
// 方案相似度检测
// =================


similar(a,b){



let same=0;



a.forEach(n=>{



if(
b.includes(n)
){

same++;


}



});



return same;



},







// =================
// 三方案生成
// =================


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



// 去重处理


for(
let i=0;
i<result.length;
i++
){



for(
let j=i+1;
j<result.length;
j++
){



if(
this.similar(
result[i].front,
result[j].front
)>=4
){



result[j].raw-=20;



}



if(
this.similar(
result[i].front,
result[j].front
)>=3
){



result[j].raw-=10;



}



}



}





result.sort(

(a,b)=>

b.raw-a.raw

);





let max=

result[0].raw||1;




result.forEach(x=>{



x.score=

Number(

(
80+
x.raw/max*20

)
.toFixed(2)

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



}

);



};






next();



},







// =================
// 修正版历史回测
// =================


backTest(callback){



let periods=[100,300,500];

let reports=[];



let source=[...this.history];



let p=0;





let run=()=>{



if(
p>=periods.length
){



this.init(source);



callback(reports);


return;


}



let period=periods[p];



let start=

Math.max(
1,
source.length-period
);



let i=start;



let hit3=0;

let hit4=0;

let hit5=0;


let total=0;






let timer=setInterval(()=>{



let end=

Math.min(
i+10,
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
i>=source.length
){



clearInterval(timer);



reports.push({


period,


test:total,


hit3,


hit4,


hit5



});



p++;


run();



}



},30);



};



run();



},
// =================
// 开奖反馈学习
// =================


learn(result){



let nums=

result
.replace(/[+]/g," ")
.split(/\s+/)
.filter(x=>x);



nums.forEach(n=>{



if(
this.frontScore[n]!==undefined
){



this.frontScore[n]+=10;



}



if(
this.backScore[n]!==undefined
){



this.backScore[n]+=10;



}



});





localStorage.setItem(

"V363_FEEDBACK",

JSON.stringify(nums)

);



},







// =================
// 获取状态
// =================


status(){


return{


version:this.version,


data:this.data.length,


pool:this.pool.length


};



}





};





window.DLTEngine=

DLTEngine;