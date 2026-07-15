// ================================================
// V90 AI CORE FINAL R6.1
// Bayes概率评分中心
// ================================================

"use strict";


window.V90Bayes={







// =================================
// 归一化
// =================================


normalize(list){



let total=

list.reduce(

(a,b)=>

a+b.value,

0

);






return list.map(x=>({



number:x.number,



value:

Number(

(

x.value/total

)

.toFixed(6)

)



}));



},







// =================================
// Bayes计算
// =================================


calculate(model,type){



let result=[];








Object.values(model)

.forEach(item=>{





let prior=

item.frequency+1;







let trend=

item.recent+1;







let miss=

1/(item.missing+1);








let coldHot=

item.hot

+

(1-item.cold);








let learning=1;






if(
window.V90Learning
){



let w=

V90Learning.getWeight();





if(type==="front"){



learning=

w.front[item.number]

||1;



}else{



learning=

w.back[item.number]

||1;



}



}








// Bayes后验近似


let posterior=


prior

*

0.35


+

trend

*

0.25


+

miss

*

0.15


+

coldHot

*

20

*

0.15


+

learning

*

10

*

0.10;









result.push({



number:item.number,



value:posterior,



bayesScore:

Number(

posterior.toFixed(3)

)



});







});







return this.normalize(result);



},







// =================================
// 最终接口
// =================================


final(model,type="front"){



return this.calculate(

model,

type

);



}






};