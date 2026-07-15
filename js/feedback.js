window.DLT_FEEDBACK = {



/*
==========================
保存开奖反馈
==========================
*/


save(data){



let feedback={



period:data.period,



front:data.front,



back:data.back,



time:Date.now()



};



DLT_DATABASE.saveFeedback(

feedback

);



return feedback;



},







/*
==========================
预测对比开奖
==========================
*/


compare(prediction,real){



let frontHit=0;

let backHit=0;



prediction.front.forEach(n=>{



if(real.front.includes(n)){



frontHit++;



}



});




prediction.back.forEach(n=>{



if(real.back.includes(n)){



backHit++;



}



});





return {



frontHit:frontHit,


backHit:backHit,


total:

frontHit+backHit



};



},







/*
==========================
生成学习记录
==========================
*/


createLearning(prediction,real){



let result=

this.compare(

prediction,

real

);



return {



prediction:prediction,



real:real,



result:result,



time:Date.now()



};



}







};