// ================================================
// V90 AI CORE FINAL R6
// Bayes概率分析模块
// ================================================

"use strict";


window.V90Bayes={







// =================================
// 计算概率
// =================================


calculate(model){



let total=0;






Object.values(model)

.forEach(item=>{



total+=item.score;



});







let result={};







Object.values(model)

.forEach(item=>{



result[item.number]={



number:item.number,



probability:

Number(

(

item.score/(total||1)

).toFixed(6)

),



score:item.score



};



});






return result;



},







// =================================
// 近期修正
// =================================


recentAdjust(model){



let result={};



Object.values(model)

.forEach(item=>{



let adjust=1;






if(
item.recent>5
){



adjust+=0.15;



}







if(
item.missing>50
){



adjust+=0.05;



}







result[item.number]=



item.score*

adjust;



});






return result;



},







// =================================
// Bayes最终权重
// =================================


final(model){



let probability=

this.calculate(model);





let adjust=

this.recentAdjust(model);






let result={};






Object.keys(probability)

.forEach(n=>{



result[n]={



number:Number(n),



probability:

probability[n].probability,



bayesScore:

adjust[n]



};



});







return result;



}






};