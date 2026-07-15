// ================================================
// V90 AI CORE R5
// 加权蒙特卡罗引擎
// ================================================

"use strict";


window.V90MonteCarlo={



// =================================
// 按权重选择数字
// =================================


weightedPick(pool,count){



let result=[];



let arr=Object.keys(pool).map(n=>({


num:Number(n),


weight:

pool[n].score+1



}));







while(result.length<count){



let total=

arr.reduce(

(a,b)=>a+b.weight,

0

);






let r=

Math.random()*total;






let sum=0;






for(let item of arr){



sum+=item.weight;






if(sum>=r){



if(
!result.includes(item.num)
){



result.push(item.num);



}



break;



}



}



}






return result.sort(

(a,b)=>a-b

);



},







// =================================
// 生成前区
// =================================


createFront(frontModel){



return this.weightedPick(

frontModel,

5

);



},







// =================================
// 生成后区
// =================================


createBack(backModel){



return this.weightedPick(

backModel,

2

);



},







// =================================
// 单组评分
// =================================


evaluate(front,back){



let score=

V90Model.structure(
front
);





// 后区奖励


let backScore=0;






back.forEach(n=>{



backScore+=

n;



});







score+=

backScore*0.5;







return score;



},







// =================================
// 主模拟
// =================================


run(times=1000000,progress){



return new Promise(resolve=>{






let frontModel=

V90Model.trainFront();





let backModel=

V90Model.trainBack();






let pool={};



let current=0;








function batch(){



let size=5000;







for(
let i=0;

i<size&&current<times;

i++,current++

){





let front=

V90MonteCarlo.createFront(

frontModel

);





let back=

V90MonteCarlo.createBack(

backModel

);






let score=

V90MonteCarlo.evaluate(

front,

back

);







let key=

front.join("-")

+

"+"

+

back.join("-");








if(!pool[key]){


pool[key]={



front,


back,


count:0,


score:0



};



}







pool[key].count++;





pool[key].score+=score;






}









let p=

Math.floor(

current/times*100

);







if(progress)

progress(p);








if(current<times){



setTimeout(

batch,

0

);



}else{



let result=

Object.values(pool)

.map(item=>({



front:item.front,


back:item.back,


count:item.count,



score:

Number(

(

item.score/item.count

).toFixed(2)

)



}))

.sort(

(a,b)=>

b.score-a.score

)

.slice(0,50);






resolve(result);



}






}







batch();







});





}





};