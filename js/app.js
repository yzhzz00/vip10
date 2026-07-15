// ================================================
// V90 AI CORE FINAL R7.0
// 系统启动入口
// ================================================

"use strict";





window.V90Progress=function(percent,current,total){



let bar=

document.getElementById(

"progressBar"

);



let text=

document.getElementById(

"progressText"

);



let num=

document.getElementById(

"progressNumber"

);






if(bar){



bar.style.width=

percent+"%";



}






if(num){



num.innerHTML=

percent+"%";



}







if(text){



text.innerHTML=

`

模拟计算：

${current || 0}

/

${total || 0}

`

;



}



};









async function startSystem(){



console.log(

"V90 R7.0启动"

);







await V90Database.init();







console.log(

"历史数据:",

V90Database.count()

);








}









async function startAI(){



let btn=

document.getElementById(

"startBtn"

);







if(btn){



btn.disabled=true;


btn.innerHTML=

"AI计算中...";



}







let result=

await V90Core.analyze();







showResult(result);








if(btn){



btn.disabled=false;


btn.innerHTML=

"开始 V90 AI分析";



}





}









function showResult(data){



if(!data)

return;







let resultBox=

document.getElementById(

"finalResult"

);








if(resultBox){



resultBox.innerHTML=

`

最终预测结果


<br><br>


前区：

${data.final.front.join(" ")}


<br>


后区：

${data.final.back.join(" ")}


<br><br>


综合评分：

${data.final.score}

`;



}








let top=

document.getElementById(

"topList"

);







if(top){



let html="TOP10预测池<br><br>";






data.top10.forEach(

(item,index)=>{



html+=


`

第${index+1}组：

${item.front.join("-")}

+

${item.back.join("-")}


<br>


评分：

${item.score}


<br><br>


`;



});







top.innerHTML=html;



}








let meeting=

document.getElementById(

"meeting"

);






if(meeting){



meeting.innerHTML=

data.meeting.join(

"<br>"

);



}



}










document.addEventListener(

"DOMContentLoaded",

()=>{



startSystem();






let btn=

document.getElementById(

"startBtn"

);






if(btn){



btn.onclick=

startAI;



}



});