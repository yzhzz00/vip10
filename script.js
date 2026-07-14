/*
====================================
彩票智能分析系统 V50.7 Mobile

页面控制
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
"data/dlt_raw.txt?v507"
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

"V50.7数据模块运行正常";



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



let p=line.trim()
.split(/\s+/);



if(
p.length<9
)

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
// 开始预测
// ======================

function startPredict(){



if(
dltData.length===0
){

alert(
"数据未加载"
);

return;

}







let result=

document
.getElementById("result");



let progress=

document
.getElementById("progressBox");





result.innerHTML=

"V50.7模型启动...<br>"+
"历史数据分析...<br>"+
"蒙特卡罗搜索中...";



progress.innerHTML=

"准备计算...";





DLTEngine.init(dltData);







// 进度回调

DLTEngine.progress=function(count,total){



let percent=

Math.floor(

count/total*100

);





progress.innerHTML=

"模拟进度："+

percent+

"%<br>"+

count+

"/"+

total+

"<br><progress value='"+

percent+

"' max='100'></progress>";



};








DLTEngine.simulate(

100000,

plans=>{



let html=

"<b>彩票智能分析系统 V50.7 Mobile</b><br><br>";





html+=

"数据期数："+

dltData.length+

"期<br><br>";





html+=

"蒙特卡罗模拟：100000组<br><br>";






html+="<b>最终推荐</b><br><br>";







plans.forEach((p,i)=>{



html+=

"方案"+

(i+1)+

"："+

p.front.join(" ")

+

" + "

+

p.back.join(" ")

+

"<br>";





html+=

"综合指数："+

p.indexScore+

"<br>";





html+=

"类型："+

p.type+

"<br><br>";



});





html+=

"模型状态：V50.7综合模型完成";





result.innerHTML=html;





progress.innerHTML=

"计算完成 100%";



}



);



}









// ======================
// 历史回测
// ======================

function startBackTest(){



let box=

document
.getElementById("backTestResult");





box.innerHTML=

"V50.7滚动回测中...";





DLTEngine.init(dltData);





DLTEngine.backTest(

result=>{



let html=

"<b>V50.7历史回测报告</b><br><br>";






result.forEach(r=>{



html+=

"测试周期："+

r.period+

"期<br>";



html+=

"测试数量："+

r.test+

"<br>";



html+=

"前区3中："+

r.hit3+

"次<br>";



html+=

"前区4中："+

r.hit4+

"次<br>";



html+=

"前区5中："+

r.hit5+

"次<br>";



html+=

"最佳表现："+

r.best+

"个<br><br>";



});





box.innerHTML=html;



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

"V50.7反馈保存成功："+value;



}