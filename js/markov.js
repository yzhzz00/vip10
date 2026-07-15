// ================================================
// V90 AI CORE FINAL R7.0
// Markov一阶转移模型
// ================================================

"use strict";


window.V90Markov={







// =================================
// 创建矩阵
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
// 构建转移矩阵
// =================================


build(data,type="front"){



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



let before=

type==="front"

?

data[i-1].front

:

data[i-1].back;






let after=

type==="front"

?

data[i].front

:

data[i].back;









before.forEach(a=>{



after.forEach(b=>{



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

(x,y)=>

x+y,

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
// 当前趋势评分
// =================================


score(numbers,data,type="front"){



if(
data.length===0
)

return 0;







let last=

type==="front"

?

data[data.length-1].front

:

data[data.length-1].back;








let matrix=

this.build(

data,

type

);







let value=0;








last.forEach(old=>{



numbers.forEach(next=>{



if(
matrix[old]
&&
matrix[old][next]
){



value+=

matrix[old][next];



}



});



});







return Number(

(value*100)

.toFixed(3)

);



},







// =================================
// 推荐转移数字
// =================================


recommend(data,type="front"){



let matrix=

this.build(

data,

type

);






let last=

type==="front"

?

data[data.length-1].front

:

data[data.length-1].back;







let result={};







last.forEach(n=>{



Object.keys(

matrix[n]

)

.forEach(x=>{



result[x]=

(result[x]||0)

+

matrix[n][x];



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