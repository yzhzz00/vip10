window.DLT_TRAINING = {



running:false,







/*
==========================
开始滚动训练
==========================
*/


async start(history){



if(this.running){

return;

}



this.running=true;



let records=[];



let windowSize=

DLT_CONFIG.training.middleWindow;



let total=

history.length-windowSize;





for(
let i=0;
i<total;
i++
){



if(!this.running){

break;

}



let trainData=

history.slice(

i,

i+windowSize

);




let target=

history[i+windowSize];





// AI预测

let prediction=

DLT_PREDICTOR.predict(

trainData

);




let best=

prediction[0];





// 命中分析

let hit=


this.checkHit(

best.front,

target.front

);





let record={



period:

target.period,



predict:

best.front,



real:

target.front,



hit:hit,



time:

Date.now()



};





records.push(record);



DLT_DATABASE.saveTrainRecord(

record

);





// 每30期释放一次手机资源

if(
i%DLT_CONFIG.training.batchSize===0

){



await this.sleep(

DLT_CONFIG.training.pauseTime

);



}



}





this.running=false;



return records;



},







/*
==========================
计算命中
==========================
*/


checkHit(predict,real){



let count=0;



predict.forEach(n=>{



if(real.includes(n)){


count++;


}



});



return count;



},







/*
==========================
停止训练
==========================
*/


stop(){



this.running=false;



},







/*
==========================
训练报告统计
==========================
*/


summary(){



let records=

DLT_DATABASE.getTrainRecord();



let total=

records.length;



let hit3=0;

let hit4=0;

let hit5=0;



records.forEach(r=>{



if(r.hit>=3){

hit3++;

}



if(r.hit>=4){

hit4++;

}



if(r.hit===5){

hit5++;

}



});





return {



total:total,



hit3:hit3,



hit4:hit4,



hit5:hit5,



rate:

total?

(
hit3/total*100

).toFixed(2)

:

0



};



},







sleep(ms){



return new Promise(

resolve=>

setTimeout(resolve,ms)

);



}






};