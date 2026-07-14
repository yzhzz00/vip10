/*
====================================
彩票智能分析系统 V36.2 Mobile

页面控制
====================================
*/


let dltData=[];



window.onload=function(){


loadData();



document
.getElementById("predictBtn")
.onclick=predict;



document
.getElementById("backTestBtn")
.onclick=backTest;



document
.getElementById("feedbackBtn")
.onclick=feedback;



};







// ======================
// 加载数据
// ======================


async function loadData(){



try{



let res=

await fetch(
"data/dlt_raw.txt?v362"
);



let text=

await res.text();



dltData=parseData(text);



document
.getElementById("dltStatus")
.innerHTML=
"已加载";



document
.getElementById("dataCount")
.innerHTML=
dltData.length;



document
.getElementById("systemStatus")
.innerHTML=

"V36.2数据模块运行正常";



}catch(e){



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









// ======================
// 预测
// ======================


function predict(){



if(
!dltData.length
){


alert(
"数据未加载"
);


return;


}






let result=

document
.getElementById("result");





result.innerHTML=

"V36.2计算启动...<br>"+
"动态权重分析...<br>"+
"蒙特卡罗搜索中...";







DLTEngine.init(dltData);





DLTEngine.run(function(data){





let html=

"<b>彩票智能分析系统 V36.2 Mobile</b><br><br>";



html+=

"数据期数："+
dltData.length+
"期<br><br>";



html+=

"蒙特卡罗模拟：15000组<br><br>";



html+=

"<b>最终推荐</b><br><br>";





data.forEach((x,i)=>{



html+=

"方案"+
(i+1)+
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

"模型状态：V36.2综合模型完成";





result.innerHTML=html;





});



}









// ======================
// 回测
// ======================


function backTest(){



let box=

document
.getElementById("backTestResult");





box.innerHTML=

"V36.2历史回测运行中...<br>"+
"正在测试100/300/500期";






DLTEngine.init(dltData);






DLTEngine.backTest(function(data){





let html=

"<b>V36.2历史回测报告</b><br><br>";






data.forEach(r=>{



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









// ======================
// 开奖反馈
// ======================


function feedback(){



let value=

document
.getElementById("realResult")
.value
.trim();





if(!value){



alert(
"请输入开奖号码"
);



return;



}






DLTEngine.learn(value);






document
.getElementById("learningStatus")
.innerHTML=

"V36.2反馈学习完成："+value;



}