// ================================================
// V90 AI CORE FINAL R7.0
// AI训练报告中心
// ================================================

"use strict";


window.V90Report={



// =================================
// 获取训练记录
// =================================


getRecords(){


return JSON.parse(

localStorage.getItem(
"V90_R7_TRAIN_RECORD"
)

||

"[]"

);


},







// =================================
// 生成报告
// =================================


create(){



let records=

this.getRecords();







if(records.length===0){



return {



total:0,


message:"暂无训练数据"



};



}








let result={



total:records.length,


front3:0,


front4:0,


front5:0,


back1:0,


back2:0,


average:0,


bestPeriod:null,


bestScore:0



};







records.forEach(item=>{



let fh=

item.frontHit;



let bh=

item.backHit;







if(fh>=3)

result.front3++;




if(fh>=4)

result.front4++;




if(fh===5)

result.front5++;





if(bh>=1)

result.back1++;




if(bh===2)

result.back2++;







let score=

fh+bh;






result.average+=score;







if(score>result.bestScore){



result.bestScore=score;



result.bestPeriod=item.period;



}



});







result.average=

Number(

(

result.average/

records.length

)

.toFixed(3)

);








return result;



},







// =================================
// 页面显示
// =================================


show(){



let data=

this.create();







let box=

document.getElementById(
"growth"
);






if(!box)

return;







if(data.total===0){



box.innerHTML=

"暂无训练记录";



return;



}








box.innerHTML=

`

AI历史训练报告

<br><br>


训练次数：

${data.total}

次


<br><br>


前区≥3：

${data.front3}

次


<br>


前区≥4：

${data.front4}

次


<br>


前区5中：

${data.front5}

次


<br><br>


后区≥1：

${data.back1}

次


<br>


后区2中：

${data.back2}

次


<br><br>


平均命中：

${data.average}


<br><br>


最佳历史预测：

第${data.bestPeriod}期


<br>

最高命中：

${data.bestScore}

个号码

`;



}






};







document.addEventListener(

"DOMContentLoaded",

()=>{


V90Report.show();


});