/*
====================================
彩票智能分析系统 V35.9.2 Mobile
engine.js
手机优化版
====================================
*/


const DLTEngine={


version:"V35.9.2 Mobile",


data:[],


seed:3592,


frontScore:{},


backScore:{},




random(){


this.seed =
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


for(
let i=1;i<=35;i++
){


this.frontScore[
String(i).padStart(2,"0")
]=0;


}



for(
let i=1;i<=12;i++
){


this.backScore[
String(i).padStart(2,"0")
]=0;


}



this.train();


},







train(){



this.data.forEach(item=>{


item.front.forEach(n=>{


this.frontScore[n]+=20;


});



item.back.forEach(n=>{


this.backScore[n]+=20;


});


});




let recent =
this.data.slice(-100);



recent.forEach(item=>{


item.front.forEach(n=>{


this.frontScore[n]+=10;


});



item.back.forEach(n=>{


this.backScore[n]+=10;


});



});





this.normalize();



},







normalize(){



let max =
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
max*
100;


});






let max2 =
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
max2*
100;


});



},







pool(){


return Object.keys(
this.frontScore
)
.sort(
(a,b)=>
this.frontScore[b]
-
this.frontScore[a]
)
.slice(0,25);


},







generateFront(){



let p=this.pool();


let arr=[];



while(
arr.length<5
){


let n=
p[
Math.floor(
this.random()*p.length
)
];



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







generateBack(){



let p=
Object.keys(
this.backScore
);



let arr=[];



while(
arr.length<2
){



let n=
p[
Math.floor(
this.random()*p.length
)
];



if(
!arr.includes(n)
){

arr.push(n);

}


}



return arr;



},







score(front){



let s=0;



front.forEach(n=>{


s+=this.frontScore[n];


});





let odd =
front.filter(
n=>Number(n)%2
).length;




if(
odd===2||
odd===3
){

s+=15;

}





let sum =
front.reduce(
(a,b)=>
a+Number(b),
0
);



if(
sum>90 &&
sum<160
){

s+=15;


}



return Math.min(
99.99,
Number(
s.toFixed(2)
)

);



},







monteCarlo(times=20000){



let arr=[];



for(
let i=0;
i<times;
i++
){



let f=
this.generateFront();



arr.push({

front:f,

score:this.score(f)

});


}





arr.sort(
(a,b)=>
b.score-a.score
);



return arr;



},







run(){



this.init(
this.data
);



let result =
this.monteCarlo(20000);



let output=[];


let used=[];



for(
let r of result
){



let same=0;



used.forEach(u=>{


same+=
r.front.filter(
x=>u.includes(x)
).length;


});




if(
same<=3
){


output.push({

front:r.front,

back:this.generateBack(),

score:r.score

});



used.push(r.front);



}



if(
output.length===3
){

break;

}



}




return output;



},







// 手机快速回测

backTest(count=100){



let history=this.data.slice();



let total=0;

let hit3=0;

let hit4=0;

let hit5=0;

let back1=0;

let back2=0;




let start=
history.length-count;





for(
let i=start;
i<history.length;
i++
){



let train=
history.slice(0,i);



let real=
history[i];




this.init(train);





let r=
this.monteCarlo(1000)[0];





let same=0;



r.front.forEach(n=>{


if(
real.front.includes(n)
){

same++;

}



});



if(same>=3)
hit3++;


if(same>=4)
hit4++;


if(same===5)
hit5++;






let bs=0;



r.front.forEach(n=>{});



let back=
this.generateBack();



back.forEach(n=>{


if(
real.back.includes(n)
){

bs++;

}



});



if(bs>=1)
back1++;


if(bs===2)
back2++;




total++;



}



this.init(history);




return{


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



window.DLTEngine=DLTEngine;