// =================================================
// 大乐透AI V90 CORE FINAL
// 总控制连接版
// =================================================


"use strict";



window.V90={


version:"V90 FINAL",


history:[],


prediction:null,


records:[]


};









// ================================================
// 数据读取
// ================================================


const DataCenter={


load(text){



let arr=[];



let lines=
text.split(/\r?\n/);




lines.forEach(line=>{



let p=
line.trim()
.split(/\s+/);



if(p.length>=9){



arr.push({



period:p[0],



front:
p.slice(2,7)
.map(Number),



back:
p.slice(7,9)
.map(Number)



});



}



});





V90.history=arr;



return arr;



}



};





window.DataCenter=
DataCenter;











// ================================================
// 保存预测
// ================================================


function savePrediction(data){



let old=

JSON.parse(

localStorage.getItem(
"V90_RECORDS"
)

||

"[]"

);





old.push(data);



localStorage.setItem(

"V90_RECORDS",

JSON.stringify(old)

);



}









// ================================================
// Worker计算
// ================================================


function runMonteCarlo(){



return new Promise(resolve=>{





let worker=

new Worker(
"V90.worker.js"
);





worker.postMessage({



type:
"MONTE_CARLO",



times:
1000000



});






worker.onmessage=function(e){





let msg=e.data;






if(
msg.type==="PROGRESS"
){



let bar=

document.getElementById(
"progressBar"
);



let text=

document.getElementById(
"progressText"
);




if(bar){



bar.style.width=

msg.value+"%";



}





if(text){



text.innerHTML=


"蒙特卡罗计算 "

+

msg.value

+

"%";


}





}








if(
msg.type==="RESULT"
){



worker.terminate();




resolve(
msg.data
);



}



};






});



}









// ================================================
// AI总分析
// ================================================


async function startV90(){





let mc=

await runMonteCarlo();






let ai;



if(
window.V90AI
){



ai=

V90AI.generate();



}

else{


ai={



front:
[8,16,21,27,33],



back:
[5,11],



score:0



};



}






// 合并结果



let final={



front:
ai.front,



back:
ai.back,



score:
ai.score || 0,



monteCarlo:
mc,



time:
Date.now()



};






V90.prediction=
final;





savePrediction(final);







// 显示预测


let box=

document.getElementById(
"prediction"
);





if(box){



box.innerHTML=


"前区："

+

final.front.join(" ")

+

"<br><br>后区："

+

final.back.join(" ")

+

"<br><br>综合评分："

+

final.score;



}









// 显示TOP



let rank=

document.getElementById(
"ranking"
);





if(rank){



rank.innerHTML=



mc.slice(0,10)

.map(

(x,i)=>

"第"+

(i+1)

+

"组："

+

x.number

+

" 次数："

+

x.count

)

.join("<br>");



}









// AI会议



if(
ai.meeting
){



let meet=

document.createElement(
"div"
);



meet.innerHTML=


"<br><br>AI会议:<br>"

+

ai.meeting
.map(
x=>
x.name+
": "+
x.result
)
.join("<br>");




box.appendChild(meet);



}







document.getElementById(
"progressText"
).innerHTML=

"分析完成";





}











// ================================================
// 页面启动
// ================================================


document.addEventListener(
"DOMContentLoaded",
()=>{





let status=

document.getElementById(
"status"
);



if(status){



status.innerHTML=

"V90 AI CORE启动完成";



}








// 数据加载



let file=

document.getElementById(
"dataFile"
);



if(file){



file.onchange=function(e){



let reader=

new FileReader();





reader.onload=function(){



let data=

DataCenter.load(
reader.result
);




document.getElementById(
"dataInfo"
).innerHTML=


"历史数据："

+

data.length

+

"期";



};





reader.readAsText(
e.target.files[0]
);



};



}










// 分析按钮



let btn=

document.getElementById(
"startBtn"
);



if(btn){



btn.onclick=

startV90;



}





});