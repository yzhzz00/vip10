/*
================================================

彩票智能分析系统 V60 CORE

页面控制程序

================================================
*/


let systemReady=false;



// ==============================
// 页面启动
// ==============================


window.onload=async()=>{


await initSystem();


};






// ==============================
// 初始化
// ==============================


async function initSystem(){



let status=

document.getElementById(

"dataStatus"

);



try{



status.innerHTML=

"正在加载大乐透数据...";





await AIEngine.init();





systemReady=true;





status.innerHTML=

"数据加载成功";






document.getElementById(

"dataCount"

).innerHTML=

AIEngine.dlt.length;



}



catch(e){



console.log(e);



status.innerHTML=

"数据加载失败";



}



}









// ==============================
// 开始AI分析
// ==============================


async function startPredict(){



if(!systemReady){



alert(

"系统未加载完成"

);



return;



}






let progress=

document.getElementById(

"progress"

);



let resultBox=

document.getElementById(

"predictResult"

);






resultBox.innerHTML=

"正在启动AI模型...";





let timer=0;



let interval=

setInterval(()=>{



timer+=2;



if(timer>90)

timer=90;



if(progress)

progress.innerHTML=

`

<div class="progress-bar">

<div style="width:${timer}%">

${timer}%

</div>

</div>

`;



},300);








setTimeout(async()=>{



clearInterval(interval);





resultBox.innerHTML=

"正在执行100万组蒙特卡罗模拟...";






let result=

AIEngine.monteCarlo(

1000000,

(p)=>{


if(progress){


progress.innerHTML=

`

<div class="progress-bar">

<div style="width:${p}%">

${p}%

</div>

</div>


`;



}



}

);






clearInterval(interval);






showResult(result);






if(progress){



progress.innerHTML=

`

<div class="progress-bar">

<div style="width:100%">

100% 完成

</div>

</div>

`;



}





},1000);



}









// ==============================
// 显示预测结果
// ==============================


function showResult(data){



let box=

document.getElementById(

"predictResult"

);





let html="";





data.forEach((x,i)=>{



html+=`

<div class="plan-card">


<h3>

方案${i+1}

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

AI综合评分：

${x.score}

</p>


</div>

`;



});





box.innerHTML=

html;



}









// ==============================
// 历史回测
// ==============================


function startTrain(){



let box=

document.getElementById(

"trainResult"

);



let r=

AIEngine.backtest(100);





box.innerHTML=

`

回测周期：

${r.period}期

<br>

前区3中：

${r.hit3}

<br>

前区4中：

${r.hit4}

<br>

前区5中：

${r.hit5}

`;



}









// ==============================
// 开奖反馈
// ==============================


function saveFeedback(){



let input=

document.getElementById(

"realResult"

).value;




if(!input)

return;




let arr=

input.split(/\s+/);






let front=

arr.slice(0,5);



let back=

arr.slice(5,7);





AIEngine.feedback(

front,

back

);






document.getElementById(

"learningStatus"

).innerHTML=

"开奖反馈完成，模型参数已更新";



}