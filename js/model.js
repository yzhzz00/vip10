// ================================================
// V90 AI CORE R5
// 数字训练模型
// ================================================

"use strict";


window.V90Model={







// ================================
// 获取历史
// ================================


history(){


return V90Data.get();


},







// ================================
// 初始化数字评分
// ================================


initScore(max){


let obj={};


for(
let i=1;i<=max;i++
){


obj[i]={


frequency:0,


missing:0,


hot:0,


bayes:0,


markov:0,


score:0



};



}



return obj;


},







// ================================
// 前区训练
// ================================


trainFront(){



let data=

this.history();




let score=

this.initScore(35);






// 出现频率


data.forEach((item,index)=>{



item.front.forEach(n=>{



score[n].frequency++;



});



});







// 遗漏


for(
let n=1;n<=35;n++
){



let miss=0;






for(
let i=data.length-1;

i>=0;

i--

){



if(
data[i].front.includes(n)
)

break;





miss++;



}






score[n].missing=

miss;



}









// 综合计算



let total=

data.length*5;






for(
let n=1;n<=35;n++
){



let s=

score[n];






// 频率


s.bayes=

s.frequency/total;







// 热度


s.hot=

s.frequency/data.length;








// 遗漏适中


s.markov=

1/(s.missing+1);








s.score=

(

s.frequency*0.35

+

s.hot*30

+

s.markov*20

+

s.bayes*100

);





}







return score;



},







// ================================
// 后区训练
// ================================


trainBack(){



let data=

this.history();




let score=

this.initScore(12);







data.forEach(item=>{



item.back.forEach(n=>{



score[n].frequency++;



});



});








for(
let n=1;n<=12;n++
){



let miss=0;





for(
let i=data.length-1;

i>=0;

i--

){



if(
data[i].back.includes(n)
)

break;



miss++;



}






score[n].missing=

miss;



}







for(
let n=1;n<=12;n++
){



let s=

score[n];






s.bayes=

s.frequency/(data.length*2);





s.hot=

s.frequency/data.length;






s.markov=

1/(s.missing+1);






s.score=

(

s.frequency*0.4

+

s.hot*40

+

s.markov*20

+

s.bayes*100

);



}






return score;



},







// ================================
// Markov 转移
// ================================


markovFront(){



let data=

this.history();




let map={};






for(
let i=1;

i<data.length;

i++

){



let last=

data[i-1].front;



let now=

data[i].front;







last.forEach(a=>{



if(!map[a])

map[a]={};



now.forEach(b=>{



if(!map[a][b])

map[a][b]=0;



map[a][b]++;



});



});



}






return map;



},







// ================================
// 结构评分
// ================================


structure(nums){



let odd=

nums.filter(

n=>n%2

).length;





let big=

nums.filter(

n=>n>=18

).length;





let sum=

nums.reduce(

(a,b)=>a+b,

0

);






let score=50;






if(
odd>=2&&odd<=3
)

score+=15;






if(
big>=2&&big<=3
)

score+=15;






if(
sum>=90&&sum<=140
)

score+=20;







return score;



}






};