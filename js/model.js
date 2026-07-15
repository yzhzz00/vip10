// ================================================
// V90 AI CORE FINAL R3
// 数学模型中心
// ================================================

"use strict";


window.V90Model={



history(){


return V90Data.get();


},







// =================================
// 频率模型
// =================================

frequency(){



let freq={};




for(
let i=1;i<=35;i++
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
// 冷热分析
// =================================

hotCold(){



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
// 遗漏周期
// =================================

missing(){



let data=this.history();



let result={};






for(
let i=1;i<=35;i++
){


result[i]=data.length;


}






for(
let i=data.length-1;
i>=0;
i--
){



data[i].front.forEach(n=>{



if(
result[n]===data.length
){



result[n]=data.length-i-1;



}



});



}






return result;



},







// =================================
// 结构分析
// =================================

structure(nums){



let odd=0;

let big=0;

let sum=0;





nums.forEach(n=>{



sum+=n;



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


even:5-odd,


big,


small:5-big,


sum



};



},







// =================================
// Bayes评分
// =================================

bayes(){



let freq=this.frequency();




let total=0;



Object.values(freq)

.forEach(v=>{


total+=v;


});





let score={};






for(
let i=1;i<=35;i++
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
// =================================

markov(){



let data=this.history();



let matrix={};






for(
let i=1;i<data.length;i++
){



let before=data[i-1].front;


let after=data[i].front;






before.forEach(a=>{



if(!matrix[a])

matrix[a]={};



after.forEach(b=>{



if(!matrix[a][b])

matrix[a][b]=0;



matrix[a][b]++;



});



});



}





return matrix;



},







// =================================
// 基础结构评分
// =================================

structureScore(nums){



let s=this.structure(nums);



let score=50;





if(
s.odd>=1 &&
s.odd<=4
){


score+=10;


}





if(
s.big>=1 &&
s.big<=4
){


score+=10;


}





if(
s.sum>=80 &&
s.sum<=140
){


score+=20;


}






return score;



}





};