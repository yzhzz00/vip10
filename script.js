/*
====================================
彩票智能分析系统 V35.9.2 Mobile
script.js
手机优化版
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
"V35.9.2 Mobile数据模块正常";



}catch(e){



document
.getElementById("systemStatus")
.innerHTML=
"数据加载失败";



}



}









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









function startPredict(){



let box=
document
.getElementById("result");



box.innerHTML=

"V35.9.2 Mobile模型运行中...<br>"+
"蒙特卡罗模拟20000组...";





setTimeout(()=>{



DLTEngine.data=
dltData;



let result=
DLTEngine.run();



showResult(result);



},100);



}









function showResult(result){



let html="";



html+=
"<b>彩票智能分析系统 V35.9.2 Mobile</b><br><br>";



html+=
"数据期数："+
dltData.length+
"期<br><br>";



html+=
"蒙特卡罗模拟：20000组<br><br>";



html+="<b>最终推荐</b><br><br>";





result.forEach((r,i)=>{


html+=

"方案"+
(i+1)+
"：";



html+=

r.front.join(" ");




html+=" + ";



html+=

r.back.join(" ");




html+="<br>";



html+=

"综合评分："+
r.score+
"分<br><br>";



});





html+=

"模型状态：V35.9.2 Mobile完成";





document
.getElementById("result")
.innerHTML=
html;



}









function startBackTest(){



let box=
document
.getElementById("backTestResult");



box.innerHTML=

"正在回测...<br>"+
"测试100期，请稍候";






setTimeout(()=>{



DLTEngine.data=
dltData;



let r=
DLTEngine.backTest(100);






box.innerHTML=

"<b>V35.9.2 Mobile历史回测报告</b><br><br>"+

"测试期数："+r.testCount+
"<br>"+

"前区3中："+r.front3+
"次<br>"+

"前区4中："+r.front4+
"次<br>"+

"前区5中："+r.front5+
"次<br><br>"+

"后区中1："+r.back1+
"次<br>"+

"后区中2："+r.back2+
"次<br><br>"+

"模型表现率："+r.rate+"%";



},100);



}









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
"DLT_FEEDBACK",
value
);



document
.getElementById("learningStatus")
.innerHTML=

"已保存："+value;



}