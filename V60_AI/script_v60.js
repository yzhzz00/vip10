/*
======================================

大乐透AI智能分析系统 V60.0

script_v60.js

读取 dlt.txt 原始数据格式

======================================
*/


let historyData=[];



// 页面启动

window.onload=function(){


loadData();



let train=document.getElementById(
"trainBtn"
);


let predict=document.getElementById(
"predictBtn"
);



if(train){

train.onclick=startTrain;

}



if(predict){

predict.onclick=startPredict;

}



};









// ================================
// 解析大乐透TXT
// ================================

function parseDLT(text){



let lines=

text.trim().split(/\n+/);



let data=[];



lines.forEach(line=>{



let arr=

line.trim().split(/\s+/);





if(arr.length>=9){



data.push({



front:[

arr[2],
arr[3],
arr[4],
arr[5],
arr[6]

],



back:[

arr[7],
arr[8]

]



});



}



});





return data;



}









// ================================
// 加载数据
// ================================

async function loadData(){


try{



let response=

await fetch(

"data/dlt.txt"

);





let text=

await response.text();






historyData=

parseDLT(text);






AIEngine60.init(

historyData

);







let status=

document.getElementById(

"dataStatus"

);


let count=

document.getElementById(

"dataCount"

);






if(status)

status.innerHTML=

"数据已加载";





if(count)

count.innerHTML=

historyData.length;







console.log(

"大乐透期数:",

historyData.length

);





}

catch(e){



console.error(e);



let status=

document.getElementById(

"dataStatus"

);



if(status)

status.innerHTML=

"数据读取失败";



}



}









// ================================
// 开始训练
// ================================

function startTrain(){



let box=

document.getElementById(

"trainResult"

);






box.innerHTML=

"AI训练开始...";







AIEngine60.init(

historyData

);







AIEngine60.rollingTrain(

function(res){





if(res.progress){



box.innerHTML=

`

训练进度：

${res.progress}%

<br><br>

3中：

${res.result.hit3}

<br>

4中：

${res.result.hit4}

<br>

5中：

${res.result.hit5}

`;



}






if(res.done){



let r=

res.result;





box.innerHTML=

`

<b>训练完成</b>

<br><br>

训练次数：

${r.rounds}

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




}



);



}









// ================================
// AI预测
// ================================

function startPredict(){



let result=

document.getElementById(

"predictResult"

);



let report=

document.getElementById(

"aiReport"

);






AIEngine60.init(

historyData

);






let plans=

AIEngine60.predict();






let html="";






plans.forEach((p,i)=>{



html+=`

<div class="plan-card">


<h3>

方案${i+1}

</h3>



<p>

${p.front.join(" ")}

+

${p.back.join(" ")}

</p>



<p>

AI评分：

${p.score}

</p>



</div>

`;



});






result.innerHTML=

html;









// AI报告



let data=

AIEngine60.report();





let reportHTML=

`

模型：

${data.version}

<br>

历史：

${data.data}期

<br><br>

<b>号码概率排名</b>

<br>

`;





data.top.forEach(n=>{



reportHTML+=


`

${n.number}

&nbsp;

${n.score.toFixed(3)}

<br>

`;



});






report.innerHTML=

reportHTML;



}









// ================================
// 开奖反馈
// ================================

function saveFeedback(){



let input=

document.getElementById(

"realResult"

);



if(!input)

return;





let value=

input.value.trim();





if(value){



AIEngine60.feedback(

value

);






let status=

document.getElementById(

"learningStatus"

);



if(status)

status.innerHTML=

"反馈保存成功";



}



}