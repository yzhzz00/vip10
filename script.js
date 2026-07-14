/*
======================================
彩票智能分析系统 V35.9
script.js
历史回测接口版
======================================
*/


let dltData=[];



// ==============================
// 页面启动
// ==============================


window.onload=function(){


loadDLTData();




document
.getElementById("predictBtn")
.onclick=function(){

startAnalysis();

};





document
.getElementById("backTestBtn")
.onclick=function(){

startBackTest();

};





document
.getElementById("feedbackBtn")
.onclick=function(){

saveFeedback();

};



};









// ==============================
// 加载数据
// ==============================


async function loadDLTData(){


try{


let res =
await fetch(
"data/dlt_raw.txt?v=359"
);



let text =
await res.text();



dltData =
parseDLT(text);





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

"V35.9数据模块运行正常";



}
catch(e){



document
.getElementById("systemStatus")
.innerHTML=
"数据加载失败";



console.log(e);



}



}









// ==============================
// 数据解析
// ==============================


function parseDLT(text){



let arr=[];



let lines =
text.split(/\r?\n/);





lines.forEach(line=>{



let p =
line.trim()
.split(/\s+/);





if(p.length<9){

return;

}




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

front:front,

back:back


});



});





return arr;



}









// ==============================
// 开始预测
// ==============================


function startAnalysis(){



if(
dltData.length===0
){

alert(
"数据未加载"
);


return;


}




let box =
document.getElementById("result");




box.innerHTML=

"V35.9模型运行中...<br>"+
"蒙特卡罗模拟20000组...";






setTimeout(()=>{



DLTEngine.data =
dltData;




let result =
DLTEngine.run();





showResult(result);



},100);



}









// ==============================
// 显示预测
// ==============================


function showResult(result){



let html="";



html+=

"<b>彩票智能分析系统 V35.9</b><br><br>";



html+=

"数据期数："+
dltData.length+
"期<br><br>";



html+=

"蒙特卡罗模拟：20000组<br><br>";



html+=

"<b>最终推荐</b><br><br>";






result.forEach((item,index)=>{



html+=

"方案"+
(index+1)+
"：";



html+=

item.front.join(" ");



html+=

" + ";



html+=

item.back.join(" ");



html+=

"<br>";



html+=

"综合评分："+
item.score+
"分<br><br>";



});





html+=

"模型状态：V35.9综合模型完成";





document
.getElementById("result")
.innerHTML=
html;



}









// ==============================
// 历史回测
// ==============================


function startBackTest(){



if(
dltData.length===0
){

alert(
"数据未加载"
);


return;


}




let box =
document
.getElementById("backTestResult");




box.innerHTML=

"正在执行历史回测...<br>"+
"测试500期数据...";





setTimeout(()=>{



DLTEngine.data =
dltData;




let report =
DLTEngine.backTest(500);






let html="";



html+=

"<b>V35.9历史回测报告</b><br><br>";



html+=

"测试期数："+

report.testCount+

"<br>";



html+=

"前区3中："+

report.front3+

"次<br>";



html+=

"前区4中："+

report.front4+

"次<br>";



html+=

"前区5中："+

report.front5+

"次<br><br>";



html+=

"后区中1："+

report.back1+

"次<br>";



html+=

"后区中2："+

report.back2+

"次<br><br>";



html+=

"模型表现率："+

report.rate+

"%";






box.innerHTML=
html;



},100);



}









// ==============================
// 开奖反馈
// ==============================


function saveFeedback(){



let value =
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

"DLT_FEEDBACK",

value

);





document
.getElementById("learningStatus")
.innerHTML=

"已保存开奖反馈："+value;



}