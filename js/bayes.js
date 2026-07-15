// ================================================
// V90 AI CORE FINAL R7.0
// Bayes概率融合模块
// ================================================

"use strict";


window.V90Bayes={







// =================================
// 概率归一化
// =================================


normalize(list){



let total=

list.reduce(

(a,b)=>

a+b.value,

0

);






if(total===0)

return list;







return list.map(x=>({



number:x.number,


probability:

Number(

(

x.value/total

)

.toFixed(6)

),



bayesScore:

Number(

x.value.toFixed(3)

)



}));



},







// =================================
// Bayes后验计算
// =================================


calculate(model,type){



let result=[];







let learning=

window.V90Learning

?

V90Learning.get()

:

null;







Object.values(model)

.forEach(item=>{





let prior=



item.frequency+1;









let trend=



item.recent+1;









let missing=



1/(item.missing+1);









let modelScore=



item.score+1;









let learn=1;








if(learning){



if(type==="front"){



learn=

learning.front[item.number]

||1;



}else{



learn=

learning.back[item.number]

||1;



}



}










// Bayes融合


let posterior=



prior*0.30


+

trend*0.20


+

missing*80*0.15


+

modelScore*0.20


+

learn*20*0.15;








result.push({



number:item.number,



value:posterior



});






});








return this.normalize(result);



},







// =================================
// 对外接口
// =================================


final(model,type="front"){



return this.calculate(

model,

type

);



}






};