/*
==================================
彩票智能分析系统 V37.0 Mobile

页面控制
==================================
*/


let dltData=[];




window.onload=function(){


loadData();


document
.getElementById("predictBtn")
.onclick=predict;



document
.getElementById("backTestBtn")
.onclick=runBackTest;



document
.getElementById("feedbackBtn")
.onclick=saveFeedback;



};







// =======================
// 加载历史数据
// =======================


async function loadData(){



try{


let res=

await fetch(
"data/dlt_raw.txt?v370"
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

"V37.0数据模块运行正常";



}catch(e){



document
.getElementById("systemStatus")
.innerHTML=

"数据加载失败";



}



}









// =======================
// 数据解析
// =======================


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









// =======================
// 预测
// =======================


function predict(){



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

"V37.0启动...<br>"+
"动态模型计算...<br>"+
"100000组候选模拟...";







DLTEngine.init(dltData);






DLTEngine.simulate(

100000,

function(plans){






let html=

"<b>彩票智能分析系统 V37.0 Mobile</b><br><br>";




html+=

"数据期数："+
dltData.length+
"期<br><br>";



html+=

"蒙特卡罗模拟：100000组<br><br>";



html+=

"<b>最终推荐</b><br><br>";





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

"模型指数："+
p.indexScore+
"<br>";



html+=

"类型："+
p.type+
"<br><br>";



});





html+=

"模型状态：V37.0综合模型完成";




box.innerHTML=html;



});



}









// =======================
// 回测
// =======================


function runBackTest(){



let box=

document
.getElementById("backTestResult");




box.innerHTML=

"V37.0滚动回测运行中...";






DLTEngine.init(dltData);





DLTEngine.backTest(

function(result){



let html=

"<b>V37.0历史回测报告</b><br><br>";





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

"次<br><br>";



});





box.innerHTML=html;



}



);



}









// =======================
// 开奖反馈
// =======================


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

"V37.0反馈已保存："+value;



}