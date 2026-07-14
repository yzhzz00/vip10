/*
====================================

大乐透智能分析系统

V70.2 DEBUG SCRIPT

初始化检测版

====================================
*/


let systemReady = false;





window.onload = async function(){


await initSystem();


};









async function initSystem(){



try{



showDataStatus(
"正在启动 V70.2..."
);



await AIEngine.init();




let status =

AIEngine.status();





systemReady=true;





showDataStatus(
"系统加载成功"
);





showSystemStatus(status);





}

catch(error){



systemReady=false;




showDataStatus(

"初始化失败：" +

error.message

);




showSystemStatus({

version:"ERROR",

data:0,

agents:[]

});





console.log(
"初始化错误",
error
);



}



}









function showDataStatus(text){



let box =

document.getElementById(
"dataStatus"
);



if(box){


box.innerHTML=text;


}



}









function showSystemStatus(status){



let box =

document.getElementById(
"systemStatus"
);



if(box){



box.innerHTML=


`

版本：

${status.version}


<br>


历史数据：

${status.data} 期


<br>


模型：

${

status.agents.length

?

status.agents.join(",")

:

"未加载"

}


`;



}



}









// ======================
// AI分析按钮
// ======================


async function startPredict(){



if(!systemReady){



alert(
"系统未准备完成"
);



return;



}





let box =

document.getElementById(
"predictResult"
);





if(box){


box.innerHTML=

"AI分析启动中...";


}





try{



let result =

await AIEngine.analyze();





if(box){



box.innerHTML=

`

<h3>
V70.2分析完成
</h3>


历史数据：

${result.history}


<br><br>


${

JSON.stringify(

result

)

}


`;



}





}

catch(e){



if(box){



box.innerHTML=

"分析失败："+e.message;


}



}



}









// ======================
// 开奖反馈
// ======================


function saveFeedback(){



let input =

document.getElementById(
"realResult"
);




if(!input)return;





localStorage.setItem(

"last_feedback",

input.value

);





let box =

document.getElementById(
"learningStatus"
);



if(box){



box.innerHTML=

"反馈保存成功";


}



}