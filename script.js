/*
=================================
彩票智能分析系统 V36.3 Mobile

页面控制
=================================
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








// =================
// 加载数据
// =================


async function loadData(){



try{


let res=

await fetch(
"data/dlt_raw.txt?v363"
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

"V36.3数据模块运行正常";



}catch(e){


document
.getElementById("systemStatus")
.innerHTML=

"数据加载失败";


}



}









// =================
// 数据解析
// =================


function parseData(text){



let arr=[];



text
.split(/\r?\n/)
.forEach(line=>{



let p=

line.trim()
.split(/\s+/);



if(
p.length<9
)return;




let front=[];

let back=[];





for(
let i=2;
i<=6;
i++
){



front.push(

String(
Number(p[i])
)
.padStart(2,"0")

);



}





for(
let i=7;
i<=8;
i++
){



back.push(

String(
Number(p[i])
)
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









// =================
// 开始预测
// =================


function startPredict(){



if(
dltData.length===0
){


alert(
"历史数据未加载"
);


return;


}






let box=

document
.getElementById("result");



box.innerHTML=

"V36.3模型启动...<br>"+
"动态权重分析...<br>"+
"蒙特卡罗搜索中...";





DLTEngine.init(dltData);





DLTEngine.run(function(result){





let html=

"<b>彩票智能分析系统 V36.3 Mobile</b><br><br>";



html+=

"数据期数："+
dltData.length+
"期<br><br>";



html+=

"蒙特卡罗模拟：30000组<br><br>";



html+=

"<b>最终推荐</b><br><br>";





result.forEach((x,i)=>{



html+=

"方案"+
(i+1)
+
"："+
x.front.join(" ")
+
" + "
+
x.back.join(" ")
+
"<br>";



html+=

"综合评分："+
x.score+
"分<br>";



html+=

"类型："+

x.type+

"<br><br>";



});






html+=

"模型状态：V36.3综合模型完成";





box.innerHTML=html;





});



}









// =================
// 历史回测
// =================


function startBackTest(){



let box=

document
.getElementById("backTestResult");





box.innerHTML=

"V36.3历史回测运行中...<br>"+
"正在测试100/300/500期";





DLTEngine.init(dltData);





DLTEngine.backTest(function(report){





let html=

"<b>V36.3历史回测报告</b><br><br>";





report.forEach(r=>{



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

"次<br><br>";



});





box.innerHTML=html;



});



}









// =================
// 开奖反馈
// =================


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






DLTEngine.learn(value);





document
.getElementById("learningStatus")
.innerHTML=

"V36.3反馈学习完成："+value;



}