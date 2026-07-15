// ================================================
// 大乐透AI V90 FINAL R2
// 核心统计模型
// ================================================

"use strict";


window.V90Model={



history(){


return V90Data.get();


},







// =================================
// 前区频率
// =================================


frequency(){



let freq={};



for(
let i=1;
i<=35;
i++
){


freq[i]=0;


}




this.history()
.forEach(item=>{


item.front.forEach(n=>{


freq[n]++;


});


});





return freq;



},







// =================================
// 热门排序
// =================================


hot(){



let freq=this.frequency();




return Object.keys(freq)

.map(n=>({



number:Number(n),


count:freq[n]


}))

.sort(
(a,b)=>
b.count-a.count
);



},







// =================================
// 遗漏
// =================================


missing(){



let data=this.history();



let miss={};





for(
let i=1;
i<=35;
i++
){



miss[i]=data.length;


}






for(
let i=data.length-1;
i>=0;
i--
){



data[i].front
.forEach(n=>{



if(
miss[n]===data.length
){



miss[n]=

data.length-i-1;



}



});



}





return miss;



},







// =================================
// 结构分析
// =================================


structure(nums){



let odd=0;

let big=0;



nums.forEach(n=>{



if(
n%2===1
)

odd++;



if(
n>=18
)

big++;



});





return {



odd,


even:
5-odd,


big,


small:
5-big,


sum:

nums.reduce(
(a,b)=>a+b,
0
)



};



},







// =================================
// Bayes评分
// =================================


bayes(){



let freq=

this.frequency();




let total=0;



Object.values(freq)

.forEach(v=>{


total+=v;


});





let score={};





for(
let i=1;
i<=35;
i++
){



score[i]=



total===0

?

0

:

freq[i]/total;



}





return score;



},







// =================================
// Markov 一阶转移
// 上一期 -> 下一期
// =================================


markov(){



let data=this.history();



let map={};





for(
let i=1;
i<data.length;
i++
){



let before=

data[i-1].front;



let after=

data[i].front;





before.forEach(a=>{



if(!map[a])

map[a]={};






after.forEach(b=>{



if(!map[a][b])

map[a][b]=0;



map[a][b]++;



});



});



}




return map;



},







// =================================
// 基础评分
// =================================


score(nums){



let s=

this.structure(nums);



let score=50;






// 奇偶平衡

if(
s.odd>=1 &&
s.odd<=4
){



score+=10;


}





// 大小平衡


if(
s.big>=1 &&
s.big<=4
){



score+=10;


}





// 和值范围


if(
s.sum>=80 &&
s.sum<=140
){



score+=15;


}






// 连号控制


let link=0;



for(
let i=1;
i<nums.length;
i++
){



if(
nums[i]-nums[i-1]===1
)

link++;



}





if(
link<=2
){



score+=10;



}else{


score-=10;


}







return Math.max(
0,
Math.min(
100,
score
)
);



}






};