// ================================================
// 大乐透AI V90 CORE FINAL
// 智能学习引擎
// ================================================

"use strict";


window.V90Learning={


key:"V90_AI_LEARNING",





// =================================
// 获取学习记录
// =================================


get(){


return JSON.parse(

localStorage.getItem(this.key)

||

"[]"

);


},







// =================================
// 保存学习
// =================================


save(data){



let list=this.get();



list.push(data);




localStorage.setItem(

this.key,

JSON.stringify(list)

);



},







// =================================
// 学习次数
// =================================


count(){



return this.get().length;



},







// =================================
// 根据开奖结果调整权重
// =================================


train(result){



let weight=



JSON.parse(

localStorage.getItem(
"V90_AI_WEIGHT"
)

||

"{}"

);







if(!weight.frequency){



weight={



frequency:1,

hotCold:1,

missing:1,

bayes:1,

markov:1,

structure:1



};



}









// 前区命中较高

if(
result.frontHit>=3
){



weight.frequency+=0.02;


weight.bayes+=0.02;



}






// 后区失败

if(
result.backHit===0
){



weight.markov+=0.03;



}








// 记录

this.save({



time:

Date.now(),



result,


weight



});








localStorage.setItem(

"V90_AI_WEIGHT",

JSON.stringify(weight)

);







},







// =================================
// 显示成长记录
// =================================


show(){



let box=

document.getElementById(
"learning"
);





if(box){



box.innerHTML=



`

累计学习次数：

${this.count()}

<br><br>

当前AI权重已更新

`;



}



}



};