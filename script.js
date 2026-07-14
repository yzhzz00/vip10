/*
V70 TEST SCRIPT
*/


window.onload=function(){


if(typeof AIEngine==="undefined"){


document.getElementById(
"dataStatus"
).innerHTML=

"AIEngine不存在";


return;


}





document.getElementById(
"dataStatus"
).innerHTML=

"AIEngine加载成功";





AIEngine.init()

.then(()=>{


let s=AIEngine.status();



document.getElementById(
"systemStatus"
).innerHTML=

`

版本：
${s.version}

<br>

数据：
${s.data}

`;



})

.catch(e=>{


document.getElementById(
"systemStatus"
).innerHTML=

"错误："+e.message;



});



};