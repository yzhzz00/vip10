// ================================================
// V90 AI CORE FINAL R6.1
// 一阶Markov转移模型
// ================================================

"use strict";


window.V90Markov={







// =================================
// 初始化矩阵
// =================================


create(size){



let matrix={};







for(
let i=1;

i<=size;

i++

){



matrix[i]={};



for(
let j=1;

j<=size;

j++

){



matrix[i][j]=0;



}



}



return matrix;



},







// =================================
// 生成转移矩阵
// =================================


build(type="front"){



let data=

V90Database.get();







let size=

type==="front"

?

35

:

12;







let matrix=

this.create(size);








for(
let i=1;

i<data.length;

i++

){



let prev=

type==="front"

?

data[i-1].front

:

data[i-1].back;







let next=

type==="front"

?

data[i].front

:

data[i].back;







prev.forEach(a=>{



next.forEach(b=>{



if(
matrix[a]
&&
matrix[a][b]!==undefined
){



matrix[a][b]++;



}



});



});







}







// 转概率


Object.keys(matrix)

.forEach(a=>{



let total=

Object.values(

matrix[a]

)

.reduce(

(x,y)=>x+y,

0

);






if(total>0){



Object.keys(matrix[a])

.forEach(b=>{



matrix[a][b]=

matrix[a][b]/total;



});



}



});








return matrix;



},







// =================================
// 当前期预测影响
// =================================


adjust(numbers,last,type="front"){



if(!last)

return 0;







let matrix=

this.build(type);







let score=0;








numbers.forEach(n=>{



last.forEach(p=>{



if(
matrix[p]
&&
matrix[p][n]
){



score+=

matrix[p][n];



}



});



});







return Number(

(score*100)

.toFixed(3)

);



},







// =================================
// 获取转移热门数字
// =================================


nextNumbers(type="front"){



let data=

V90Database.get();







if(
data.length===0
)

return [];








let last=



type==="front"

?

data[data.length-1].front

:

data[data.length-1].back;








let matrix=

this.build(type);








let result={};








last.forEach(n=>{



Object.keys(

matrix[n]

)

.forEach(next=>{



result[next]=

(result[next]||0)

+

matrix[n][next];



});



});







return Object.keys(result)

.map(n=>({



number:Number(n),


score:result[n]

}))


.sort(

(a,b)=>

b.score-a.score

);



}







};