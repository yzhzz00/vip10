window.DLT_REPORT = {



/*
==========================
生成成长报告
==========================
*/


generate(){



let train=

DLT_TRAINING.summary();



let weights=

DLT_DATABASE.getWeights();



let feedback=

DLT_DATABASE.getFeedback();





let report={



version:

DLT_CONFIG.version,



createTime:

new Date().toLocaleString(),



training:{



total:

train.total,



hit3:

train.hit3,



hit4:

train.hit4,



hit5:

train.hit5,



hitRate:

train.rate+"%"



},





feedback:{



total:

feedback.length



},





weights:weights,







status:

this.status(train)



};





DLT_DATABASE.saveReport(

report

);



return report;



},







/*
==========================
模型状态判断
==========================
*/


status(train){



if(!train.total){


return "等待训练";


}



if(train.rate>=20){


return "优秀";


}



if(train.rate>=10){


return "稳定";


}



return "需要优化";



},







/*
==========================
获取报告
==========================
*/


get(){



return DLT_DATABASE.getReport();



}







};