/*
================================

大乐透智能分析系统

V71.1

Confidence AI

信心指数模块

================================
*/


class ConfidenceAgent {



constructor(){


this.name="Confidence AI";


}









analyze(models){



if(!models){



return {



agent:this.name,


confidence:0,


level:"无数据"



};



}






let score=50;



let count=0;









// 趋势模型参与


if(models.trend){



score+=5;



count++;



}








// 结构模型


if(models.structure){



score+=5;



count++;



}








// Markov


if(models.markov){



score+=5;



count++;



}








// 风险模型


if(models.risk){



score+=5;



count++;



}








// 理论模型


if(models.theory){



score+=5;



count++;



}








// Monte Carlo


if(models.montecarlo){



score+=8;



count++;



}








// 防止超过100


if(score>100){



score=100;



}









let level="低信心";






if(score>=70){



level="高信心";



}

else if(score>=55){



level="中等信心";



}








return {



agent:this.name,



confidence:

Number(

score.toFixed(2)

),




level:level,



models:

count,



strategy:



"多模型一致性评分"



};



}






}







window.ConfidenceAgent=

new ConfidenceAgent();