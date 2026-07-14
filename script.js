/*
================================

大乐透智能分析系统

V70.9 CORE SCRIPT

Review AI学习接入版

================================
*/


let systemReady=false;

let currentPrediction=null;



window.onload=async function(){


try{


document.getElementById(
"dataStatus"
).innerHTML="AI系统启动中...";



await AIEngine.init();



let status=

AIEngine.status();



systemReady=true;



document.getElementById(
"dataStatus"
).innerHTML=

"系统加载成功";



document.getElementById(
"systemStatus"
).innerHTML=

`

版本：

${status.version}

<br>

历史数据：

${status.data}

<br>

AI模型：

${status.agents.join(" / ")}

`;



document.getElementById(
"agentList"
).innerHTML=

status.agents.join("<br>");



}

catch(e){


document.getElementById(
"dataStatus"
).innerHTML=

"加载失败："+e.message;


}



};









async function startPredict(){



if(!systemReady){

alert("系统未启动");

return;

}



let result=

await AIEngine.analyze();





// 保存Master预测


if(

result.decision &&

result.decision.decision.recommend.front

){



currentPrediction={



front:

result.decision.decision.recommend.front,



back:

result.decision.decision.recommend.back



};





ReviewAgent.savePrediction(
currentPrediction
);



}






let html="";





html+=`

<h3>
Monte Carlo AI预测
</h3>

`;





if(currentPrediction){


html+=`

预测号码：

<br>

前区：

${currentPrediction.front.join(" ")}

<br>

后区：

${currentPrediction.back.join(" ")}

<br><br>

`;



}








html+=`

<h3>
Master AI决策
</h3>


<pre>

${JSON.stringify(

result.decision,

null,

2

)}

</pre>


`;








if(result.simulation){



html+=`

<h3>
Monte Carlo TOP20
</h3>

`;



result.simulation.top.forEach(
(item,index)=>{


html+=`

第${index+1}名：

${item.front.join(" ")}

+

${item.back.join(" ")}


<br>

评分：

${item.score}


<br><br>

`;


}

);



}









document.getElementById(
"predictResult"
).innerHTML=

html;







document.getElementById(
"aiReport"
).innerHTML=

`

AI会议完成

<br>

版本：

${result.version}

<br>

参与模型：

${result.agents.join(" / ")}

`;



}









function saveFeedback(){



let value=

document.getElementById(
"realResult"
).value;




if(!currentPrediction){



document.getElementById(
"learningStatus"
).innerHTML=

"请先生成预测";


return;


}






// 输入格式：

// 前区5个 后区2个

// 例如：

// 03 08 17 26 33 05 11


let arr=

value.trim()
.split(/\s+/)
.map(Number);






if(arr.length!==7){



document.getElementById(
"learningStatus"
).innerHTML=

"格式错误，需要7个号码";


return;


}







let real={



front:

arr.slice(0,5),



back:

arr.slice(5,7)



};






let review=

ReviewAgent.compare(

currentPrediction,

real

);





let learn=

ReviewAgent.learn(

review

);






document.getElementById(
"learningStatus"
).innerHTML=

`

<h3>
Review AI复盘结果
</h3>


前区命中：

${review.frontHit}/5


<br>


后区命中：

${review.backHit}/2


<br>


和值偏差：

${review.sumDifference}


<br>


模型调整：

${learn.message}


<br>


权重：

${learn.adjustWeight}

`;





localStorage.setItem(

"dlt_feedback",

JSON.stringify(real)

);



}