/*
====================================
彩票智能分析系统 V51.1 Mobile

页面控制修正版

功能：
AI报告显示
预测控制
回测控制
反馈学习
====================================
*/


let dltData=[];



window.onload=function(){



loadData();



document
.getElementById("predictBtn")
.onclick=startPredict;



document
.getElementById("backTestBtn")
.onclick=startBackTest;



document
.getElementById("feedbackBtn")
.onclick=saveFeedback;



};





// ======================
// 加载数据
// ======================

async function loadData(){



try{


let res=

await fetch(

"data/dlt_raw.txt?v511"

);



let text=

await res.text();



dltData=parseData(text);





document
.getElementById("dltStatus")
.innerHTML="已加载";



document
.getElementById("dataCount")
.innerHTML=dltData.length;



document
.getElementById("systemStatus")
.innerHTML=

"V51.1数据模块运行正常";



}

catch(e){



document
.getElementById("systemStatus")
.innerHTML=

"数据加载失败";



}



}








// ======================
// 数据解析
// ======================

function parseData(text){



let arr=[];



text.split(/\r?\n/)
.forEach(line=>{



let p=

line.trim()
.split(/\s+/);



if(p.length<9)return;




let front=[];

let back=[];




for(
let i=2;
i<=6;
i++
){


front.push(

String(Number(p[i]))
.padStart(2,"0")

);


}



for(
let i=7;
i<=8;
i++
){


back.push(

String(Number(p[i]))
.padStart(2,"0")

);


}



arr.push({

front,

back

});



});



return arr;



}








// ======================
// 开始预测
// ======================

function startPredict(){



if(dltData.length===0){


alert(
"数据未加载"
);


return;


}




let result=

document.getElementById("result");



let progress=

document.getElementById("progressBox");



let reportBox=

document.getElementById("aiReport");





result.innerHTML=

"V51.1 AI模型启动...<br>"+
"多维评分计算...<br>"+
"100000组模拟搜索...";





DLTEngine.init(dltData);






DLTEngine.progress=function(done,total){



let p=

Math.floor(

done/total*100

);





progress.innerHTML=

"AI模拟进度："+p+"%<br>"+

"<progress value='"+p+"' max='100'></progress>";



};






DLTEngine.simulate(

100000,

plans=>{



let html=

"<b>彩票智能分析系统 V51.1</b><br><br>";



html+=

"历史数据："+

dltData.length+

"期<br>";



html+=

"模拟次数：100000组<br><br>";





plans.forEach((p,i)=>{



html+=

"<div class='ai-box'>";





html+=

"<b>方案"+

(i+1)+

"</b><br>";





html+=

p.front.join(" ")

+

" + "

+

p.back.join(" ")

+

"<br><br>";





html+=

"AI评分："

+

p.indexScore

+

"<br>";





html+=

"类型："

+

p.type

+

"<br>";






let report=

DLTEngine.analysisReport(

p.front

);





html+=

"和值："+

report.sum

+

"<br>";



html+=

"历史平均和值："+

report.sumAverage

+

"<br>";



html+=

"结构："

+

JSON.stringify(

report.structure

)

+

"<br>";



html+="</div>";



});





result.innerHTML=html;





progress.innerHTML=

"模拟完成 100%";






// AI报告

let best=

plans[0];



let ai=

DLTEngine.analysisReport(

best.front

);





reportBox.innerHTML=



"和值分析：<br>"+

"当前和值："+ai.sum+

"<br>"+

"历史平均："+ai.sumAverage+

"<br><br>"+


"结构分析：<br>"+

"奇偶："+ai.structure.odd+

"奇 "+

ai.structure.even+

"偶<br><br>"+


"趋势分析：<br>"+

ai.trend+

"<br><br>"+


"马尔可夫：<br>"+

ai.markov;



}



);



}









// ======================
// 回测
// ======================

function startBackTest(){



let box=

document.getElementById("backTestResult");



let progress=

document.getElementById("backProgressBox");





box.innerHTML=

"V51.1回测启动...";





DLTEngine.init(dltData);






DLTEngine.backProgress=function(done,total){



let p=

Math.floor(

done/total*100

);





progress.innerHTML=

"回测进度："+p+"%<br>"+

"<progress value='"+p+"' max='100'></progress>";



};







DLTEngine.backTest(

result=>{



let html=

"<b>V51.1历史回测报告</b><br><br>";






result.forEach(r=>{



html+=

"周期："+r.period+"期<br>";



html+=

"测试："+r.test+"次<br>";



html+=

"前区3中："+r.hit3+"次<br>";



html+=

"前区4中："+r.hit4+"次<br>";



html+=

"前区5中："+r.hit5+"次<br>";



html+=

"最佳："+r.best+"个<br><br>";



});





box.innerHTML=html;



progress.innerHTML=

"回测完成";



}

);



}









// ======================
// 开奖反馈
// ======================

function saveFeedback(){



let value=

document

.getElementById("realResult")

.value

.trim();






if(!value){


alert(
"请输入开奖结果"
);


return;


}







DLTEngine.feedback(value);





document

.getElementById("learningStatus")

.innerHTML=

"V51.1反馈保存成功："

+

value;



}