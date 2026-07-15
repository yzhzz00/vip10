// ================================================
// V90 AI CORE FINAL R3
// AI学习引擎
// ================================================

"use strict";


window.V90Learning={



recordKey:"V90_LEARNING_RECORD",

weightKey:"V90_AI_WEIGHT",







// =================================
// 获取学习记录
// =================================


getRecords(){



return JSON.parse(

localStorage.getItem(
this.recordKey
)

||

"[]"

);



},







// =================================
// 获取权重
// =================================


getWeight(){



let data=

localStorage.getItem(
this.weightKey
);






if(data){



return JSON.parse(data);



}






return {



frequency:1,


hotCold:1,


missing:1,


bayes:1,


markov:1,


structure:1



};



},







// =================================
// 保存权重
// =================================


saveWeight(weight){



localStorage.setItem(

this.weightKey,

JSON.stringify(weight)

);



},







// =================================
// 学习训练
// =================================


train(result){



let weight=

this.getWeight();







// 前区命中提高频率模型


if(
result.frontHit>=3
){



weight.frequency+=0.02;


weight.bayes+=0.02;



}








// 后区失败增加转移权重


if(
result.backHit===0
){



weight.markov+=0.03;



}








// 总命中较低，加强结构


if(
result.total<=2
){



weight.structure+=0.02;



}







this.saveWeight(weight);







let records=

this.getRecords();







records.push({



time:

Date.now(),



result,


weight



});







localStorage.setItem(

this.recordKey,

JSON.stringify(records)

);



},







// =================================
// 学习次数
// =================================


count(){



return this.getRecords().length;



},







// =================================
// 页面显示
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

AI动态权重：

已更新

`;



}



}



};