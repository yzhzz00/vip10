/*
=====================================

大乐透智能分析系统 V70

前端控制层

=====================================
*/



// ==========================
// 页面初始化
// ==========================


window.onload=async()=>{


try{


await AIEngine.init();



document.getElementById(

"dataStatus"

).innerHTML=

"数据加载成功";





document.getElementById(

"dataCount"

).innerHTML=

AIEngine.dlt.length;



}

catch(e){



console.error(e);



document.getElementById(

"dataStatus"

).innerHTML=

"加载失败";



}



};







// ==========================
// AI预测
// ==========================


async function startPredict(){



let box=

document.getElementById(

"predictResult"

);



let progress=

document.getElementById(

"progress"

);




box.innerHTML=

"AI多智能体分析启动...";




progress.innerHTML=`

<div class="progress-bar">

<div id="bar">

0%

</div>

</div>

`;





let bar=

document.getElementById(

"bar"

);







let result=

await AIEngine.predict(

p=>{


bar.style.width=p+"%";


bar.innerHTML=p+"%";



}

);





let html="";





result.forEach((x,i)=>{



html+=`


<div class="plan-card">


<h3>

方案 ${i+1}

</h3>


<p>

前区：

${x.front.join(" ")}

</p>


<p>

后区：

${x.back.join(" ")}

</p>


<p>

AI评分：

${x.score}

</p>


</div>



`;



});







box.innerHTML=html;







showReport();



}







// ==========================
// AI报告
// ==========================


function showReport(){



let report=

AIEngine.report();




let html=`

<p>

版本：

${report.version}

</p>


<p>

历史数据：

${report.history}

期

</p>


<h3>

号码评分TOP10

</h3>

`;





report.top10.forEach(x=>{



html+=`

<p>

${x.num}

：

${x.score}

</p>

`;



});





document.getElementById(

"aiReport"

).innerHTML=

html;



}







// ==========================
// 历史回测
// ==========================


async function startTrain(){



let box=

document.getElementById(

"trainResult"

);





box.innerHTML=

"回测启动...";





let result=

await AIEngine.backtest(

p=>{


box.innerHTML=

`

回测进度：

${p}%

`;



}

);





box.innerHTML=`

<p>

回测完成

</p>


<p>

3个命中：

${result.three}

</p>


<p>

4个命中：

${result.four}

</p>


<p>

5个命中：

${result.five}

</p>

`;



}







// ==========================
// 保存开奖反馈
// ==========================


function saveFeedback(){



let value=

document.getElementById(

"realResult"

).value;



let arr=

value.trim()

.split(/\s+/);





if(arr.length<7){



alert(

"请输入完整开奖号码"

);



return;



}





let front=

arr.slice(0,5);



let back=

arr.slice(5,7);







let result=

AIEngine.feedback(

front,

back

);






document.getElementById(

"learningStatus"

).innerHTML=

"反馈学习完成";



console.log(

result

);



}