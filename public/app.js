const start =
document.getElementById("start");


const result =
document.getElementById("result");


const progress =
document.getElementById("progress");


const models =
document.getElementById("models");


async function loadStatus(){


try{


const res =
await fetch("/api/status");


const data =
await res.json();


models.innerHTML =
data.models;


}

catch(e){

models.innerHTML =
"服务器未连接";

}


}



async function predict(){


start.disabled=true;


progress.innerHTML=
"正在计算...";


try{


const res =
await fetch(
"/api/predict",
{
method:"POST"
}
);


const data =
await res.json();



result.innerHTML=

"前区："
+
data.prediction.front.join(" ")

+
"<br>"

+

"后区："
+
data.prediction.back.join(" ");



progress.innerHTML=
"完成";


}

catch(e){


result.innerHTML=
"分析失败";


}


start.disabled=false;


}



start.onclick=predict;


loadStatus();