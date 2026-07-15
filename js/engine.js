window.DLT_ENGINE = {



history:[],



/*
==========================
初始化系统
==========================
*/


init(text){



this.history =

DLT_PARSER.parse(text);



let check =

DLT_PARSER.check(

this.history

);



return {



dataCount:

this.history.length,



check:check



};



},







/*
==========================
开始AI分析
==========================
*/


analyze(deep=false){



if(

this.history.length===0

){



return {

error:"没有历史数据"

};



}





let first =

DLT_PREDICTOR.predict(

this.history

);



let result =

DLT_MONTECARLO.run(

first,

this.history,

deep

);



return result;



},







/*
==========================
开始滚动训练
==========================
*/


train(){



return DLT_TRAINING.start(

this.history

);



},







/*
==========================
保存开奖
==========================
*/


feedback(data){



return DLT_FEEDBACK.save(

data

);



},







/*
==========================
获取报告
==========================
*/


report(){



return DLT_REPORT.generate();



}






};