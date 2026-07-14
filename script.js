/*
================================

大乐透智能分析系统

V70 TEST SCRIPT

初始化测试版

================================
*/


let systemReady=false;



window.onload=async function(){


try{


document.getElementById("dataStatus").innerHTML=

"正在加载AI核心...";




await AIEngine.init();





let status=

AIEngine.status();





systemReady=true;





document.getElementById("dataStatus").innerHTML=

"加载成功";





document.getElementById("systemStatus").innerHTML=

`

版本：

${status.version}

<br>

数据：

${status.data}期

<br>

状态：

正常

`;





}

catch(e){



document.getElementById("dataStatus").innerHTML=

"加载失败：" + e.message;



console.log(e);



}



};







function startPredict(){



if(!systemReady){


alert("系统未准备完成");


return;


}



document.getElementById("predictResult").innerHTML=

"测试成功，AI分析入口正常";



}






function saveFeedback(){



let input=

document.getElementById("realResult");



if(!input)return;



localStorage.setItem(

"last_feedback",

input.value

);



document.getElementById("learningStatus").innerHTML=

"反馈保存成功";


}