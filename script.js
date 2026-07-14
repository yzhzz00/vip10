/*
====================================

大乐透智能分析系统

V70.2 CORE SCRIPT

页面控制中心

====================================
*/


let systemReady=false;

let analyzing=false;





// 页面加载

window.onload=async()=>{


await initSystem();


};







// ============================
// 系统初始化
// ============================


async function initSystem(){



try{



setStatus(

"AI核心初始化..."

);





await AIEngine.init();





let status=

AIEngine.status();






systemReady=true;





setStatus(

"系统运行正常"

);






updateSystemInfo(status);





}

catch(e){



console.log(e);



setStatus(

"系统初始化失败"

);



}



}









// ============================
// 显示系统状态
// ============================


function updateSystemInfo(status){



let box=

document.getElementById(

"systemStatus"

);





if(box){



box.innerHTML=

`

版本：

${status.version}

<br>

数据：

${status.data}期

<br>

模型：

${status.agents.join(" , ")}

`;



}



}









// ============================
// 开始AI分析
// ============================


async function startPredict(){



if(!systemReady){



alert(

"系统还没有准备完成"

);



return;



}







if(analyzing){



return;



}




analyzing=true;





showLoading();





try{



let result=

await AIEngine.analyze();






showResult(result);





}

catch(e){



console.log(e);



showError();



}

finally{



analyzing=false;



}



}









// ============================
// 加载显示
// ============================


function showLoading(){



let box=

document.getElementById(

"predictResult"

);



if(box){



box.innerHTML=

`

<div>

AI专家团队分析中...

</div>

<br>

Trend AI

↓

Structure AI

↓

Markov AI

↓

Master AI

`;



}



}









// ============================
// 输出结果
// ============================


function showResult(result){



let box=

document.getElementById(

"predictResult"

);



if(!box)return;





let trendText="";



if(result.models && result.models.trend){



trendText=

result.models.trend.reason.join(

"<br>"

);



}






let structureText="";



if(result.models && result.models.structure){



structureText=

result.models.structure.reason.join(

"<br>"

);



}







box.innerHTML=

`

<h3>

V70.2 AI决策完成

</h3>


历史数据：

${result.history}期


<br><br>


<b>Trend AI</b>

<br>

${trendText}


<br><br>


<b>Structure AI</b>

<br>

${structureText}


<br><br>


<b>Master AI</b>

<br>

${

JSON.stringify(

result.decision

)

}


`;





showReport(result);



}









// ============================
// AI报告
// ============================


function showReport(result){



let box=

document.getElementById(

"aiReport"

);



if(!box)return;





box.innerHTML=

`

<h3>

V70.2 AI多维分析报告

</h3>


参与模型：

<br>

${

Object.keys(

AIEngine.agents

)

.join(" / ")

}


<br><br>


状态：

正常运行


<br><br>


分析时间：

${result.time}

`;



}









// ============================
// 状态提示
// ============================


function setStatus(text){



let box=

document.getElementById(

"dataStatus"

);



if(box){



box.innerHTML=text;



}



}









// ============================
// 开奖反馈
// ============================


function saveFeedback(){



let input=

document.getElementById(

"realResult"

);



if(!input)return;





localStorage.setItem(

"last_result",

input.value

);






let box=

document.getElementById(

"learningStatus"

);



if(box){



box.innerHTML=

"开奖反馈已保存";



}



}