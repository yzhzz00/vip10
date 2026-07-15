// ================================================
// 大乐透AI V90 CORE FINAL
// 核心数学模型
// ================================================

"use strict";


window.V90Model={







history(){



return V90Data.get();



},







// =================================
// 号码频率
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



item.front

.forEach(n=>{



freq[n]++;



});



});






return freq;



},







// =================================
// 冷热评分
// =================================


hotCold(){



let freq=

this.frequency();




let arr=[];



for(
let i=1;
i<=35;
i++
){



arr.push({



number:i,


score:freq[i]



});



}






return arr.sort(

(a,b)=>

b.score-a.score

);



},







// =================================
// 遗漏周期
// =================================


missing(){



let data=

this.history();





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
// 奇偶 大小 和值
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


even:
5-odd,


big,


small:
5-big,


sum



};



},







// =================================
// Bayes概率评分
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
// 上一期 → 下一期
// =================================


markov(){



let data=

this.history();



let matrix={};






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



if(
!matrix[a]
)

matrix[a]={};



after.forEach(b=>{



if(
!matrix[a][b]
)

matrix[a][b]=0;



matrix[a][b]++;



});



});



}






return matrix;



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



score+=20;



}






return score;



}






};