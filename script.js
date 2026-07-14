/*
V70.2 CORE SCRIPT
*/


let systemReady=false;




window.onload=async function(){



try{


document.getElementById(
"dataStatus"
).innerHTML=

"AI系统启动中...";





console.log(
"当前AIEngine",
window.AIEngine
);






await window.AIEngine.init();






let status=

window.AIEngine.status();






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


状态：

${status.ready}

`;







document.getElementById(
"agentList"
).innerHTML=

status.agents.join(
"<br>"
);





}

catch(e){



console.error(e);



document.getElementById(
"dataStatus"
).innerHTML=

"加载失败："+e.message;



}




};









async function startPredict(){



if(!systemReady){


alert(
"系统未启动"
);


return;


}





let result=

await window.AIEngine.analyze();






document.getElementById(
"predictResult"
).innerHTML=

`

分析完成

<br>

版本：

${result.version}


<br>

历史：

${result.history}


<br>

${result.message}

`;




document.getElementById(
"aiReport"
).innerHTML=

"AI多模型分析完成";



}









function saveFeedback(){



let value=

document.getElementById(
"realResult"
).value;





localStorage.setItem(

"dlt_feedback",

value

);





document.getElementById(
"learningStatus"
).innerHTML=

"反馈保存成功";



}