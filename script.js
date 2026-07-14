/*
================================

大乐透智能分析系统 V60.2

页面控制

================================
*/


let systemReady=false;



// ======================
// 启动
// ======================


window.onload=async()=>{


await initSystem();


};





// ======================
// 初始化
// ======================


async function initSystem(){



try{



document.getElementById(

"dataStatus"

).innerHTML=

"正在加载模型...";





await AIEngine.init();





systemReady=true;





document.getElementById(

"dataStatus"

).innerHTML=

"数据加载成功";





document.getElementById(

"dataCount"

).innerHTML=

AIEngine.dlt.length;





showReport();



}

catch(e){



console.log(e);



document.getElementById(

"dataStatus"

).innerHTML=

"加载失败";



}



}








// ======================
// 开始预测
// ======================


async function startPredict(){



if(!systemReady)

return;





let box=

document.getElementById(

"predictResult"

);



let progress=

document.getElementById(

"progress"

);





box.innerHTML=

"AI模型启动...";






let result=

await AIEngine.predict(

(p)=>{



progress.innerHTML=

`

<div class="progress-bar">


<div style="width:${p}%">

${p}%

</div>


</div>

`;



}

);






progress.innerHTML=

`

<div class="progress-bar">


<div style="width:100%">


100% 完成


</div>


</div>

`;






showResult(result);



}









// ======================
// 显示预测
// ======================


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

AI评分：

${x.score}

</p>



</div>


`;



});





box.innerHTML=html;



}









// ======================
// AI报告
// ======================


function showReport(){



let box=

document.getElementById(

"aiReport"

);



let r=

AIEngine.report();





let html=

`

版本：

${r.version}

<br>

历史数据：

${r.history}期

<br><br>

号码评分TOP10:

<br>

`;






r.top10.forEach(x=>{



html+=

`

${x.num}

：

${x.score.toFixed(2)}

<br>

`;



});





box.innerHTML=html;



}









// ======================
// 回测
// ======================


async function startTrain(){



let box=

document.getElementById(

"trainResult"

);



let progress=

document.getElementById(

"progress"

);






box.innerHTML=

"开始历史滚动回测...";





let r=

await AIEngine.backtest(

(p)=>{



box.innerHTML=

`

回测进度：

${p}%

<br>

正在分析历史数据...

`;



}

);





box.innerHTML=

`

回测完成

<br><br>

3中：

${r.three}

<br>

4中：

${r.four}

<br>

5中：

${r.five}

`;



}









// ======================
// 开奖反馈
// ======================


function saveFeedback(){



let value=

document.getElementById(

"realResult"

).value;



if(!value)

return;




let arr=

value.trim()

.split(/\s+/);





AIEngine.feedback(

arr.slice(0,5),

arr.slice(5,7)

);






document.getElementById(

"learningStatus"

).innerHTML=

`

反馈完成

<br>

模型已更新

`;



}