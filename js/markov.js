// ================================================
// V90 AI CORE FINAL R6
// Markov一阶转移模型
// ================================================

"use strict";


window.V90Markov={




// =================================
// 建立前区转移矩阵
// =================================


trainFront(){


let data=

V90Database.get();



let matrix={};




for(
let i=1;i<=35;i++
){


matrix[i]={};


}







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



now.forEach(b=>{



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
// 建立后区转移
// =================================


trainBack(){



let data=

V90Database.get();



let matrix={};



for(
let i=1;i<=12;i++
){



matrix[i]={};



}







for(
let i=1;

i<data.length;

i++

){



let last=

data[i-1].back;



let now=

data[i].back;







last.forEach(a=>{



now.forEach(b=>{



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
// 根据上一期预测下一期趋势
// =================================


predict(lastNumbers,matrix){



let result={};






lastNumbers.forEach(n=>{



let next=

matrix[n];







Object.keys(next)

.forEach(k=>{



if(!result[k])

result[k]=0;





result[k]+=next[k];



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



},







// =================================
// Markov融合评分
// =================================


adjust(numbers,history){



let frontMatrix=

this.trainFront();





let prediction=

this.predict(

history.front,

frontMatrix

);






let bonus=0;






numbers.forEach(n=>{



let item=

prediction.find(

x=>x.number===n

);






if(item){



bonus+=item.score;



}



});






return bonus;



}






};