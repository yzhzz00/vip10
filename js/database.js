window.DLT_DATABASE = {



keys:{


weights:"DLT_V11_WEIGHTS",


train:"DLT_V11_TRAIN",


feedback:"DLT_V11_FEEDBACK",


report:"DLT_V11_REPORT",


matrix:"DLT_V11_MATRIX",


checkpoint:"DLT_V11_CHECKPOINT"


},







/*
========================
通用保存
========================
*/


save(key,data){



localStorage.setItem(

key,

JSON.stringify(data)

);


},







/*
========================
通用读取
========================
*/


load(key,defaultValue=null){



let data=

localStorage.getItem(key);



if(data){


return JSON.parse(data);


}



return defaultValue;



},







/*
========================
权重
========================
*/


saveWeights(data){



this.save(

this.keys.weights,

data

);



},



getWeights(){



return this.load(

this.keys.weights,

DLT_CONFIG.modelWeights

);



},







/*
========================
训练记录
========================
*/


addTrain(record){



let list=

this.getTrain();



list.push(record);



this.save(

this.keys.train,

list

);



},




getTrain(){



return this.load(

this.keys.train,

[]

);



},







clearTrain(){



localStorage.removeItem(

this.keys.train

);



},







/*
========================
开奖反馈
========================
*/


addFeedback(data){



let list=

this.getFeedback();



list.push(data);



this.save(

this.keys.feedback,

list

);



},





getFeedback(){



return this.load(

this.keys.feedback,

[]

);



},







/*
========================
矩阵缓存
========================
*/


saveMatrix(data){



this.save(

this.keys.matrix,

data

);



},





getMatrix(){



return this.load(

this.keys.matrix,

null

);



},







/*
========================
训练断点
========================
*/


saveCheckpoint(data){



this.save(

this.keys.checkpoint,

data

);



},






getCheckpoint(){



return this.load(

this.keys.checkpoint,

{

index:0

}

);



},







clearCheckpoint(){



localStorage.removeItem(

this.keys.checkpoint

);



},







/*
========================
报告
========================
*/


saveReport(data){



this.save(

this.keys.report,

data

);



},






getReport(){



return this.load(

this.keys.report,

null

);



}






};