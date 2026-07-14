/*
====================================
彩票智能分析系统 V51.2 Mobile

前端控制

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
"data/dlt_raw.txt?v512"
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
"V51.2数据模块运行正常";



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



text
.split(/\r?\n/)
.forEach(line=>{


let p=

line.trim()
.split(/\s+/);



if(p.length<9)
return;





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
// AI预测
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
"V51.2 AI计算启动...";





DLTEngine.init(dltData);






DLTEngine.progress=function(done,total){



let p=

Math.floor(

done/total*100

);





progress.innerHTML=

"AI模拟进度："+p+"%<br>"+

"<progress value='"+

p+

"' max='100'></progress>";



};








DLTEngine.simulate(

100000,

plans=>{



let html="";



html+=
"<b>彩票智能分析系统 V51.2</b><br><br>";



html+=
"历史数据："+
dltData.length+
"期<br>";



html+=
"模拟次数：100000组<br><br>";






plans.forEach((p,i)=>{





html+=
"<div class='plan-card'>";




html+=
"<div class='plan-title'>方案"+
(i+1)+
"</div>";




html+=
p.front.join(" ")
+
" + "
+
p.back.join(" ")
+
"<br><br>";





html+=
"<span class='score'>AI评分："+
p.indexScore+
"</span><br>";






html+=
"类型："+
p.type+
"<br>";







let r=

DLTEngine.analysisReport(

p.front

);







html+=
"和值："+
r.sum+
"<br>";



html+=
"历史平均和值："+
r.averageSum+
"<br>";



html+=
"奇偶："+
r.odd+
"奇 "+
r.even+
"偶<br>";



html+=
"三区："+
r.zone.join("-")
+
"<br>";




html+="</div>";





});







result.innerHTML=html;



progress.innerHTML=
"模拟完成 100%";








// AI报告显示

let best=plans[0];



let report=

DLTEngine.analysisReport(

best.front

);





reportBox.innerHTML=

"<div class='report-item'>"+
"<b>和值分析</b><br>"+
"当前和值："+
report.sum+
"<br>"+
"历史平均："+
report.averageSum+
"</div>"+


"<div class='report-item'>"+
"<b>结构分析</b><br>"+
"奇偶："+
report.odd+
"奇 "+
report.even+
"偶<br>"+
"三区："+
report.zone.join("-")+
"</div>"+


"<div class='report-item'>"+
"<b>趋势分析</b><br>"+
report.trend+
"</div>"+


"<div class='report-item'>"+
"<b>马尔可夫分析</b><br>"+
report.markov+
"</div>";



}



);



}









// ======================
// 回测
// ======================

function startBackTest(){



let box=

document
.getElementById("backTestResult");



let progress=

document
.getElementById("backProgressBox");





DLTEngine.init(dltData);





box.innerHTML=
"V51.2 AI真实回测启动...";






DLTEngine.backProgress=function(done,total){



let p=

Math.floor(

done/total*100

);





progress.innerHTML=

"回测进度："+p+"%<br>"+

"<progress value='"+

p+

"' max='100'></progress>";



};







DLTEngine.backTest(

data=>{



let html=

"<b>V51.2历史回测报告</b><br><br>";






data.forEach(r=>{



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

"反馈已保存："+value;



}