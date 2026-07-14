// ======================================
// 彩票智能分析系统 V35.1
// 固定预测核心
// ======================================


let dltData = [];
let pl5Data = [];

let frontScore = {};
let backScore = {};

let predictionReady = false;





window.onload = function(){

    loadData();

};






// ================================
// 数据读取
// ================================


async function loadData(){


try{


let dlt = await fetch(
"data/dlt_raw.txt?v=3510"
);


let dltText = await dlt.text();


dltData=parseDLT(dltText);





document.getElementById("dltStatus").innerHTML="已加载";

document.getElementById("dataCount").innerHTML=dltData.length;





let pl5 = await fetch(
"data/pl5_raw.txt?v=3510"
);


let pl5Text = await pl5.text();


pl5Data=parseDLT(pl5Text);



document.getElementById("pl5Status").innerHTML="已加载";




document.getElementById("modelStatus").innerHTML=

"V35.1 数据加载完成";



}

catch(e){


document.getElementById("modelStatus").innerHTML=

"数据读取失败";


}



}






// ================================
// 数据解析
// ================================


function parseDLT(text){


let arr=[];


text.split("\n").forEach(line=>{


let nums=line.match(/\d+/g);



if(nums && nums.length>=7){


arr.push({

front:
nums.slice(0,5)
.map(n=>n.padStart(2,"0")),


back:
nums.slice(5,7)
.map(n=>n.padStart(2,"0"))

});


}



});


return arr;


}









// ================================
// 开始预测
// ================================


function startPrediction(){



if(dltData.length===0){


alert("数据未加载");


return;


}




// 只计算一次

if(!predictionReady){


calculateModel();


predictionReady=true;


}




showResult();



}








// ================================
// 模型计算
// ================================


function calculateModel(){



// 前区初始化


for(let i=1;i<=35;i++){


let n=i.toString().padStart(2,"0");


frontScore[n]=0;


}




// 后区初始化


for(let i=1;i<=12;i++){


let n=i.toString().padStart(2,"0");


backScore[n]=0;


}





// 历史频率


dltData.forEach(item=>{


item.front.forEach(n=>{


frontScore[n]+=40;


});


item.back.forEach(n=>{


backScore[n]+=40;


});


});







// 最近300期趋势


let recent=dltData.slice(-300);



recent.forEach(item=>{


item.front.forEach(n=>{


frontScore[n]+=30;


});


item.back.forEach(n=>{


backScore[n]+=30;


});


});







// 遗漏修正


let last=dltData[dltData.length-1];



for(let n in frontScore){



if(!last.front.includes(n)){


frontScore[n]+=5;


}


}







// 排序


}








// ================================
// 生成方案
// ================================


function createFront(offset){



let nums=Object.keys(frontScore)

.sort((a,b)=>{


if(frontScore[b]===frontScore[a]){


return parseInt(a)-parseInt(b);


}


return frontScore[b]-frontScore[a];


});





let result=[];



for(let i=offset;i<nums.length;i++){


if(result.length<5){


result.push(nums[i]);


}



}



return result.sort(

(a,b)=>parseInt(a)-parseInt(b)

);


}









function createBack(offset){



let nums=Object.keys(backScore)

.sort((a,b)=>{


if(backScore[b]===backScore[a]){


return parseInt(a)-parseInt(b);

}


return backScore[b]-backScore[a];


});



return [

nums[offset],

nums[offset+1]

];


}









// ================================
// 输出结果
// ================================


function showResult(){


let html="";



html+="<b>彩票智能分析系统 V35.1</b><br><br>";



html+="数据期数："+dltData.length+"期<br><br>";



html+="最终推荐<br><br>";





for(let i=0;i<3;i++){



let front=createFront(i*3);

let back=createBack(i*2);



let score=0;



front.forEach(n=>{

score+=frontScore[n];

});



html+="方案"+(i+1)+"：";

html+=front.join(" ");

html+=" + ";

html+=back.join(" ");


html+="<br>";

html+="评分："+score.toFixed(2);

html+="<br><br>";



}






html+="模型状态：V35.1 固定预测完成";



document.getElementById("result").innerHTML=html;



document.getElementById("modelStatus").innerHTML=

"V35.1 运行成功<br>固定模式开启";



document.getElementById("learningStatus").innerHTML=

"等待开奖反馈学习";



}







// ================================
// 反馈预留
// ================================


function feedbackTraining(){



let value=document.getElementById(
"realResult"
).value;



if(!value){


alert("请输入开奖号码");


return;


}



document.getElementById(
"learningStatus"
).innerHTML=

"收到开奖："+value;



}