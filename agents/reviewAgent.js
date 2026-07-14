/*
================================

大乐透智能分析系统

V71.1

Review AI

开奖复盘学习模块

================================
*/


class ReviewAgent {



constructor(){


this.name="Review AI";


this.history=[];


}









savePrediction(data){



this.history.push({



type:"prediction",



data:data,



time:new Date()

.toLocaleString()



});



return true;



}









saveResult(result){



this.history.push({



type:"result",



data:result,



time:new Date()

.toLocaleString()



});



return true;



}









compare(prediction,actual){



if(

!prediction ||

!actual

){



return {



error:"数据不足"



};



}








let frontHit=0;


let backHit=0;







prediction.front.forEach(num=>{



if(

actual.front.includes(num)

){



frontHit++;



}



});







prediction.back.forEach(num=>{



if(

actual.back.includes(num)

){



backHit++;



}



});









return {



agent:this.name,



frontHit:frontHit,



backHit:backHit,



totalHit:



frontHit+backHit,



level:



this.getLevel(

frontHit,

backHit

)



};






}









getLevel(front,back){



if(

front===5 && back===2

){



return "一等奖命中";



}



if(

front===5 && back>=1

){



return "二等奖级别";



}



if(

front>=4

){



return "高等奖级别";



}



if(

front>=3

){



return "小奖级别";



}





return "未命中";



}









analyze(history){



return {



agent:this.name,



sampleCount:

this.history.length,



last:



this.history.slice(-10),



strategy:



"预测结果与开奖反馈对比学习"



};



}






}






window.ReviewAgent=

new ReviewAgent();