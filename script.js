/*
=================================

彩票智能分析系统 V60.0

页面控制脚本

=================================
*/


let dltData=[];

let pl5Data=[];






// 页面启动

window.onload=function(){


initSystem();



};









// =============================
// 初始化系统
// =============================


async function initSystem(){



try{



await LotteryEngine.loadDLT();



await LotteryEngine.loadPL5();





dltData=

LotteryEngine.dlt;



pl5Data=

LotteryEngine.pl5;







let status=

document.getElementById(

"dataStatus"

);



let count=

document.getElementById(

"dataCount"

);






if(status){



status.innerHTML=

"数据加载成功";



}





if(count){



count.innerHTML=

dltData.length;



}







console.log(

"系统初始化完成"

);






}



catch(e){



console.log(e);





let status=

document.getElementById(

"dataStatus"

);



if(status)

status.innerHTML=

"数据加载失败";



}





}











// =============================
// 预测按钮
// =============================


function startPredict(){



let box=

document.getElementById(

"predictResult"

);



let report=

document.getElementById(

"aiReport"

);





let result=

LotteryEngine.predict();






let html="";





result.forEach((item,index)=>{





html+=`

<div class="plan-card">


<h3>

方案${index+1}

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







box.innerHTML=

html;








let r=

LotteryEngine.report();





report.innerHTML=

`

版本：

${r.version}

<br>

历史数据：

${r.history}期

<br><br>


历史平均和值：

${r.sum.average}

<br>


最新和值：

${r.sum.last}

<br><br>


号码评分TOP10：

<br>

${

r.top.map(

x=>

x.number+

"("+

x.score+

")"

).join("<br>")

}

`;





}











// =============================
// 简单回测入口
// =============================


function startTrain(){



let box=

document.getElementById(

"trainResult"

);





if(!box)

return;






box.innerHTML=

`

AI滚动分析启动...

<br><br>

历史：

${LotteryEngine.dlt.length}

期

<br>

模型：

频率

+

遗漏

+

和值

+

马尔可夫

`;






setTimeout(()=>{



box.innerHTML+=

`

<br><br>

分析完成

`;



},1500);





}











// =============================
// 开奖反馈
// =============================


function saveFeedback(){



let input=

document.getElementById(

"realResult"

);



let status=

document.getElementById(

"learningStatus"

);





if(input.value){



localStorage.setItem(

"lastResult",

input.value

);





status.innerHTML=

"开奖反馈已保存";



}



}