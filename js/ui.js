window.DLT_UI = {



/*
==========================
显示数据状态
==========================
*/


showData(count){



let el=

document.getElementById(

"dataStatus"

);



if(el){



el.innerHTML=

"历史数据：" + count + "期";



}



},







/*
==========================
显示预测结果
==========================
*/


showPrediction(results){



let box=

document.getElementById(

"prediction"

);



if(!box){

return;

}



box.innerHTML="";




results.forEach((item,index)=>{



let div=

document.createElement(

"div"

);



div.className=

"result-card";



div.innerHTML=



`

<h3>

TOP ${index+1}

</h3>


<p>

前区：

${item.front.join(" ")}

</p>


<p>

评分：

${item.score.toFixed(2)}

</p>

`;



box.appendChild(div);



});



},







/*
==========================
训练状态
==========================
*/


trainingStatus(text){



let el=

document.getElementById(

"trainStatus"

);



if(el){



el.innerHTML=text;



}



},







/*
==========================
显示报告
==========================
*/


showReport(report){



let el=

document.getElementById(

"report"

);



if(!el){

return;

}



el.innerHTML=



`

<p>

版本：

${report.version}

</p>


<p>

训练次数：

${report.training.total}

</p>


<p>

命中3个：

${report.training.hit3}

</p>


<p>

模型状态：

${report.status}

</p>

`;



}






};