/*
====================================
彩票智能分析系统 V50.8 Mobile

页面控制

升级：
1. 双进度系统
2. 预测进度独立
3. 回测进度独立
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
"data/dlt_raw.txt?v508"
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

"V50.8数据模块运行正常";



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

document.getElementById("result");



let progress=

document.getElementById("progressBox");





result.innerHTML=

"V50.8模型启动...<br>"+
"历史数据分析...<br>"+
"蒙特卡罗计算...";




progress.innerHTML=

"准备模拟...";






DLTEngine.init(dltData);





// 预测进度

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

"<br>"+

"<progress value='"+

percent+

"' max='100'></progress>";



};








DLTEngine.simulate(

100000,

plans=>{



let html=

"<b>彩票智能分析系统 V50.8 Mobile</b><br><br>";





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

"模型状态：V50.8综合模型完成";





result.innerHTML=html;



progress.innerHTML=

"模拟完成 100%";



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

"V50.8滚动历史回测启动...";





progress.innerHTML=

"准备回测...";







DLTEngine.init(dltData);





// 关闭预测进度

DLTEngine.progress=null;






// 回测专用进度

DLTEngine.backProgress=function(done,total){



let percent=

Math.floor(

done/total*100

);





progress.innerHTML=

"当前测试："+

total+

"期<br>"+

"完成："+

percent+

"%<br>"+

"<progress value='"+

percent+

"' max='100'></progress>";



};








DLTEngine.backTest(

result=>{



let html=

"<b>V50.8历史回测报告</b><br><br>";







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



progress.innerHTML=

"全部回测完成";



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

"V50.8反馈保存成功："+value;



}