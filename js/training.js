"use strict";


window.V90Training={


recordKey:"V90_R7_TRAIN_RECORD",



// =================================
// 获取训练记录
// =================================


records(){


return JSON.parse(

localStorage.getItem(
this.recordKey
)

||

"[]"

);



},







// =================================
// 保存训练记录
// =================================


saveRecord(data){



let list=

this.records();



list.push(data);






localStorage.setItem(

this.recordKey,

JSON.stringify(list)

);



},







// =================================
// 开始历史训练
// =================================


async run(windowSize=500){



let data=

V90Database.get();







if(data.length<=windowSize){

return null;

}








let result={



total:0,


front3:0,


front4:0,


front5:0,


back1:0,


back2:0,


score:0



};









for(
let i=windowSize;

i<data.length;

i++

){





// 当前训练数据


let trainData=

data.slice(

i-windowSize,

i

);







// 下一期真实结果


let real=

data[i];







// 让模型根据500期预测


let prediction=

V90Trainer.predict(

trainData

);








// 比较


let frontHit=

prediction.front.filter(

n=>

real.front.includes(n)

).length;








let backHit=

prediction.back.filter(

n=>

real.back.includes(n)

).length;








result.total++;





if(frontHit>=3)

result.front3++;




if(frontHit>=4)

result.front4++;




if(frontHit===5)

result.front5++;





if(backHit>=1)

result.back1++;




if(backHit===2)

result.back2++;







result.score+=

frontHit+

backHit;








// 保存每次考试


this.saveRecord({



period:i+1,


window:

`${i-windowSize+1}-${i}`,



predict:prediction,


real,


frontHit,


backHit



});







// 防止浏览器卡死


if(i%20===0){



await new Promise(

r=>setTimeout(r,10)

);



}



}








return result;



}







};