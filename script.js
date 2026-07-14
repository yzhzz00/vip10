/*
================================

大乐透智能分析系统

V70.2 CORE SCRIPT

页面控制中心

================================
*/



let systemReady=false;





// 页面加载

window.onload=async function(){



try{



document.getElementById(
"dataStatus"
).innerHTML=

"AI系统加载中...";






await AIEngine.init();





let status=

AIEngine.status();






systemReady=true;






document.getElementById(
"dataStatus"
).innerHTML=

"大乐透数据加载成功";






document.getElementById(
"systemStatus"
).innerHTML=

`

版本：
${status.version}

<br>

历史数据：
${status.data} 期

<br>

AI模型：
${status.agents.join(" / ")}

`;





}

catch(e){



document.getElementById(
"dataStatus"
).innerHTML=

"加载失败：" + e.message;



console.log(
e
);



}




};











// 开始分析


async function startPredict(){



if(!systemReady){


alert(
"系统还未准备完成"
);


return;


}






try{



let result=

await AIEngine.analyze();





document.getElementById(
"predictResult"
).innerHTML=

`

<h3>
V70.2 AI分析完成
</h3>


历史数据：

${result.history}期


<br><br>


状态：

${result.message}


<br><br>


参与模型：

${result.agents.join(" / ")}

`;







document.getElementById(
"aiReport"
).innerHTML=

`

AI多维分析报告

<br><br>


当前版本：

${result.version}


<br>

系统状态：

正常


`;





}

catch(e){



document.getElementById(
"predictResult"
).innerHTML=

"分析失败：" + e.message;



}




}









// 保存开奖反馈


function saveFeedback(){



let value=

document.getElementById(
"realResult"
).value;





if(!value){


alert(
"请输入开奖号码"
);


return;


}






localStorage.setItem(

"dlt_feedback",

value

);






document.getElementById(
"learningStatus"
).innerHTML=

"开奖反馈已保存";



}