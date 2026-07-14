/*
====================================

大乐透智能分析系统 V60.1

页面控制

====================================
*/


let systemReady=false;





// ======================
// 页面启动
// ======================


window.onload=async function(){


await initSystem();


};







// ======================
// 初始化
// ======================


async function initSystem(){



let status=

document.getElementById(

"dataStatus"

);



try{



status.innerHTML=

"正在加载AI模型...";





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

"加载失败";


}



}








// ======================
// 开始预测
// ======================


async function startPredict(){



if(!systemReady){



alert(

"系统未准备"

);



return;



}






let resultBox=

document.getElementById(

"predictResult"

);




let progress=

document.getElementById(

"progress"

);






resultBox.innerHTML=

"正在初始化模型...";







let result=

await AIEngine.predict(

function(p){



if(progress){



progress.innerHTML=`

<div class="progress-bar">


<div style="width:${p}%">

${p}%


</div>


</div>

`;



}



}

);







if(progress){



progress.innerHTML=`

<div class="progress-bar">


<div style="width:100%">


100% 完成


</div>


</div>

`;



}






showResult(result);





}








// ======================
// 显示结果
// ======================


function showResult(data){



let box=

document.getElementById(

"predictResult"

);



let html="";





data.forEach((item,index)=>{



html+=`


<div class="plan-card">


<h3>

方案 ${index+1}

</h3>


<p>

前区：

${item.front.join(" ")}

</p>


<p>

后区：

${item.back.join(" ")}

</p>


<p>

AI评分：

${item.score}

</p>


</div>


`;



});





box.innerHTML=html;



}








// ======================
// 回测
// ======================


function startTrain(){



let box=

document.getElementById(

"trainResult"

);





let r=

AIEngine.backtest(100);






box.innerHTML=`

回测周期：

${r.period}期

<br><br>

3个命中：

${r.hit.three}

<br>

4个命中：

${r.hit.four}

<br>

5个命中：

${r.hit.five}

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






let nums=

value.trim()

.split(/\s+/);





let front=

nums.slice(0,5);



let back=

nums.slice(5,7);






AIEngine.feedback(

front,

back

);






document.getElementById(

"learningStatus"

).innerHTML=

"反馈完成，模型已调整";





}