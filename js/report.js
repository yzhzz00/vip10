window.DLT_REPORT={



generate(){



let train=

DLT_DATABASE.getTrain();



let total=train.length;



let hit3=0;

let hit4=0;

let hit5=0;



train.forEach(r=>{



if(r.hit>=3)hit3++;

if(r.hit>=4)hit4++;

if(r.hit===5)hit5++;



});





let report={



version:

DLT_CONFIG.version,



time:

new Date().toLocaleString(),



training:{



total:total,


hit3:hit3,


hit4:hit4,


hit5:hit5



},



status:

total>0

?

"学习中"

:

"等待训练"



};





DLT_DATABASE.saveReport(report);



return report;



},







get(){



return DLT_DATABASE.getReport();



}





};