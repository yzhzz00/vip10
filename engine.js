/*
====================================
彩票智能分析系统 V35.9.3
engine.js
评分重构版
====================================
*/


const DLTEngine={


version:"V35.9.3",

data:[],

seed:3593,

frontScore:{},

backScore:{},

candidatePool:{},


random(){

this.seed=
(
this.seed*9301+
49297
)%233280;


return this.seed/233280;

},



init(data){

this.data=data||[];

this.frontScore={};

this.backScore={};

this.candidatePool=[];



for(
let i=1;
i<=35;
i++
){

let n=
String(i).padStart(2,"0");

this.frontScore[n]=0;

}



for(
let i=1;
i<=12;
i++
){

let n=
String(i).padStart(2,"0");

this.backScore[n]=0;

}



this.train();


},




train(){



// 历史频率

this.data.forEach(item=>{


item.front.forEach(n=>{

this.frontScore[n]+=1;

});


item.back.forEach(n=>{

this.backScore[n]+=1;

});


});




// 最近100期趋势

let recent=
this.data.slice(-100);



recent.forEach(item=>{


item.front.forEach(n=>{

this.frontScore[n]+=3;

});



item.back.forEach(n=>{

this.backScore[n]+=3;

});


});





// 遗漏周期

Object.keys(
this.frontScore
)
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



if(
miss>15
){

this.frontScore[n]+=5;

}


});




this.normalize();


this.createPool();



},





normalize(){



let max=

Math.max(
...Object.values(
this.frontScore
)

);



Object.keys(
this.frontScore
)
.forEach(n=>{


this.frontScore[n]=

this.frontScore[n]
/
max
*
100;


});





let max2=

Math.max(
...Object.values(
this.backScore
)

);



Object.keys(
this.backScore
)
.forEach(n=>{


this.backScore[n]=

this.backScore[n]
/
max2
*
100;


});



},





createPool(){


this.candidatePool=

Object.keys(
this.frontScore
)
.sort(

(a,b)=>

this.frontScore[b]
-
this.frontScore[a]

);



},
// ================================
// 前区组合生成
// ================================


generateFront(){



let result=[];



let guard=0;



while(
result.length<5 &&
guard<200
){



guard++;



let index=

Math.floor(
this.random()*
this.candidatePool.length
);



let n=

this.candidatePool[index];





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







// ================================
// 后区生成
// ================================


generateBack(){



let pool=

Object.keys(
this.backScore
)
.sort(

(a,b)=>

this.backScore[b]
-
this.backScore[a]

);




let result=[];



while(
result.length<2
){



let n=

pool[
Math.floor(
this.random()*pool.length
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







// ================================
// 结构评分
// ================================


structureScore(front){



let score=0;



// 奇偶


let odd=

front.filter(
n=>
Number(n)%2===1
)
.length;



if(
odd===2 ||
odd===3
){

score+=15;

}





// 三区


let zone=[0,0,0];



front.forEach(n=>{


let x=
Number(n);



if(x<=12){

zone[0]++;

}
else if(x<=24){

zone[1]++;

}
else{

zone[2]++;

}


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

front.reduce(

(a,b)=>

a+Number(b),

0

);



if(
sum>=100 &&
sum<=170
){

score+=15;


}





// 连号控制


let same=0;



for(
let i=1;
i<front.length;
i++
){


if(
Number(front[i])-
Number(front[i-1])
===1
){

same++;

}


}



if(
same<=2
){

score+=10;


}



return score;



},







// ================================
// 原始评分
// ================================


rawScore(front){



let score=0;



front.forEach(n=>{


score+=
this.frontScore[n];


});



score+=

this.structureScore(front);



return score;



},







// ================================
// 蒙特卡罗
// ================================


monteCarlo(times=20000){



let list=[];



for(
let i=0;
i<times;
i++
){



let front=

this.generateFront();



let score=

this.rawScore(front);





list.push({

front,

score

});



}





list.sort(

(a,b)=>

b.score-a.score

);



return list;



},
// ================================
// 分数归一化
// ================================


normalizeResult(list){



let max=
list[0].score;



let min=
list[list.length-1].score;



return list.map(item=>{


let s=


(
(item.score-min)/
(max-min||1)
)
*100;




return {


front:item.front,

score:
Number(
s.toFixed(2)
)


};



});



},







// ================================
// 三方案生成
// ================================


run(){



this.init(
this.data
);



let result=

this.monteCarlo(20000);





result=

this.normalizeResult(result);





let output=[];


let used=[];



for(
let item of result
){



let conflict=false;



for(
let u of used
){



let same=

item.front.filter(

x=>

u.includes(x)

).length;



if(
same>=4
){

conflict=true;

}


}




if(
!conflict
){



output.push({


front:item.front,


back:this.generateBack(),


score:item.score



});




used.push(
item.front
);



}



if(
output.length===3
){

break;

}



}




return output;



},







// ================================
// 快速历史回测
// ================================


backTest(count=100){



let history=this.data;



let total=0;


let hit3=0;


let hit4=0;


let hit5=0;


let back1=0;


let back2=0;




let start=

Math.max(

50,

history.length-count

);






for(
let i=start;
i<history.length;
i++
){



let train=

history.slice(
0,
i
);



let real=

history[i];




this.init(train);





let result=

this.monteCarlo(1000)[0];






let same=0;



result.front.forEach(n=>{


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






let back=

this.generateBack();



let bs=0;



back.forEach(n=>{


if(
real.back.includes(n)
){

bs++;

}


});





if(
bs>=1
)
back1++;



if(
bs===2
)
back2++;





total++;



}





this.init(history);






return {


testCount:total,


front3:hit3,


front4:hit4,


front5:hit5,


back1,


back2,


rate:

Number(

(
hit3/total*100

)
.toFixed(2)

)


};



}



};




window.DLTEngine=
DLTEngine;