/*
====================================
彩票智能分析系统 V36.0 Mobile
script.js
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









// =============================
// 加载历史数据
// =============================


async function loadData(){



try{



let res=

await fetch(
"data/dlt_raw.txt"
);



let text=

await res.text();




dltData=

parseData(text);





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

"V36.0数据模块运行正常";



}
catch(e){



document
.getElementById("systemStatus")
.innerHTML=

"数据加载失败";



console.log(e);



}



}









// =============================
// 数据解析
// =============================


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









// =============================
// 开始预测
// =============================


function startPredict(){



if(
dltData.length===0
){


alert(
"数据未加载"
);


return;


}





let box=

document
.getElementById("result");





box.innerHTML=

"V36.0智能模型启动...<br>"+
"动态权重计算...<br>"+
"蒙特卡罗100000组模拟...";







setTimeout(()=>{



DLTEngine.data=

dltData;




let result=

DLTEngine.run();






showResult(result);




},200);



}









// =============================
// 显示预测
// =============================


function showResult(result){



let html="";





html+=

"<b>彩票智能分析系统 V36.0 Mobile</b><br><br>";



html+=

"数据期数："+

dltData.length+

"期<br><br>";



html+=

"蒙特卡罗模拟：100000组<br><br>";



html+=

"<b>最终推荐</b><br><br>";






result.forEach((r,i)=>{



html+=

"方案"+

(i+1)+

"："+

r.front.join(" ")+

" + "+

r.back.join(" ")+

"<br>";





html+=

"综合评分："+

r.score+

"分<br>";



html+=

"类型："+

(
r.type||"综合型"
)

+

"<br><br>";





});






html+=

"模型状态：V36.0综合模型完成";





document
.getElementById("result")
.innerHTML=

html;



}









// =============================
// 历史回测
// =============================


function startBackTest(){



let box=

document
.getElementById("backTestResult");



box.innerHTML=

"V36.0回测运行中...";





setTimeout(()=>{



DLTEngine.data=

dltData;




let reports=

DLTEngine.backTest();






let html=

"<b>V36.0历史回测报告</b><br><br>";





reports.forEach(r=>{



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





box.innerHTML=

html;




},300);



}









// =============================
// 开奖反馈
// =============================


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





localStorage.setItem(

"V36_FEEDBACK",

value

);





document
.getElementById("learningStatus")
.innerHTML=

"V36.0开奖反馈已保存："+value;



}