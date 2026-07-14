/*
================================

大乐透智能分析系统

V70 CORE SCRIPT

页面控制

================================
*/


let ready=false;




window.onload=async()=>{


await startSystem();


};







async function startSystem(){



try{


document.getElementById(

"dataStatus"

).innerHTML=

"正在加载";





await AIEngine.init();





let status=

AIEngine.status();





document.getElementById(

"dataStatus"

).innerHTML=

"加载成功";




document.getElementById(

"dataCount"

).innerHTML=

status.data;





ready=true;



}



catch(e){



console.log(e);



document.getElementById(

"dataStatus"

).innerHTML=

"加载失败";



}



}









// =====================
// V70 AI分析
// =====================


async function startPredict(){



if(!ready){



alert(

"系统未准备完成"

);


return;


}




let box=

document.getElementById(

"predictResult"

);





box.innerHTML=

"Master AI正在分析...";






let result=

await AIEngine.analyze();







box.innerHTML=

`

<h3>

V70 AI决策

</h3>


<p>

版本：

${result.version}

</p>


<p>

历史数据：

${result.data}期

</p>


<p>

当前策略：

${

result.decision.strategy ||

"等待模型"

}

</p>


<p>

分析依据：

<br>

${

(result.decision.reason||[])

.join("<br>")

}

</p>

`;






showReport(result);



}









function showReport(data){



let box=

document.getElementById(

"aiReport"

);





box.innerHTML=

`

AI多维分析报告

<br><br>

Master AI状态：

运行中

<br>

时间：

${data.time}

<br><br>

当前参与模型：

${

Object.keys(

AIEngine.agents

)

.join(",")

}



`;



}










// =====================
// 简单回测接口占位
// =====================


async function startTrain(){



document.getElementById(

"trainResult"

).innerHTML=

"V70回测模块准备中";



}










// =====================
// 反馈接口
// =====================


function saveFeedback(){



let value=

document.getElementById(

"realResult"

).value;



if(!value)return;




localStorage.setItem(

"last_feedback",

value

);



document.getElementById(

"learningStatus"

).innerHTML=

"反馈已保存";



}