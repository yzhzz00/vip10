// ======================================
// 彩票智能分析系统 V35.5 修正版
// ======================================

let dltData = [];

let frontScore = {};

let backScore = {};

let finalPlans = [];

let loaded = false;



window.onload = function(){

    initSystem();

};



// 初始化

async function initSystem(){

    await loadDLT();

    await loadPL5();


    loaded = true;


    document.getElementById("systemStatus").innerHTML =
    "V35.5 修正版运行正常";


}



// 读取大乐透

async function loadDLT(){


try{


let res = await fetch(
"data/dlt_raw.txt?v=3551"
);


let text = await res.text();


dltData = parseDLT(text);



document.getElementById("dltStatus").innerHTML =
"已加载";


document.getElementById("dataCount").innerHTML =
dltData.length;



}catch(e){


document.getElementById("dltStatus").innerHTML =
"读取失败";


}


}



// 读取排列五

async function loadPL5(){


try{


let res = await fetch(
"data/pl5_raw.txt?v=3551"
);


await res.text();



document.getElementById("pl5Status").innerHTML =
"已加载";


}catch(e){


document.getElementById("pl5Status").innerHTML =
"读取失败";


}


}




// 大乐透解析

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




// 按钮

document.addEventListener(
"DOMContentLoaded",
function(){


document.getElementById(
"predictBtn"
).onclick=function(){

runPrediction();

};



document.getElementById(
"feedbackBtn"
).onclick=function(){

saveFeedback();

};



});





// 开始预测

function runPrediction(){


if(!loaded){


alert("数据未加载");


return;


}



buildScore();


generatePlans();


showResult();


}






// 建立评分

function buildScore(){


frontScore={};

backScore={};



for(let i=1;i<=35;i++){


frontScore[
String(i).padStart(2,"0")
]=0;


}



for(let i=1;i<=12;i++){


backScore[
String(i).padStart(2,"0")
]=0;


}






// 历史频率

dltData.forEach(item=>{


item.front.forEach(n=>{


frontScore[n]+=1;


});


item.back.forEach(n=>{


backScore[n]+=1;


});


});





// 最近趋势

dltData.slice(-300)
.forEach(item=>{


item.front.forEach(n=>{


frontScore[n]+=2;


});


item.back.forEach(n=>{


backScore[n]+=2;


});


});



normalize(frontScore);

normalize(backScore);



}






// 标准化

function normalize(obj){


let arr=Object.values(obj);


let max=Math.max(...arr);

let min=Math.min(...arr);



for(let key in obj){


if(max===min){


obj[key]=50;


}else{


obj[key]=
((obj[key]-min)/(max-min))*100;


}


}


}
// ======================================
// V35.5 修正版 Part 2
// 组合生成 + 输出
// ======================================



// 生成方案

function generatePlans(){


let pool = Object.keys(frontScore)
.sort(function(a,b){


return frontScore[b]-frontScore[a];


});



let candidates=[];




// 组合搜索

for(let a=0;a<pool.length;a++){


for(let b=a+1;b<pool.length;b++){


for(let c=b+1;c<pool.length;c++){


for(let d=c+1;d<pool.length;d++){


for(let e=d+1;e<pool.length;e++){



let arr=[

pool[a],
pool[b],
pool[c],
pool[d],
pool[e]

];



arr.sort(function(x,y){

return Number(x)-Number(y);

});



if(checkStructure(arr)){


candidates.push({

nums:arr,

score:calculateCombinationScore(arr)

});


}



}

}

}

}

}




// 排序

candidates.sort(function(a,b){


return b.score-a.score;


});





finalPlans=[];


let used=[];



for(let item of candidates){


let same=false;



for(let old of used){


let count=0;


item.nums.forEach(function(n){


if(old.includes(n)){


count++;


}


});



if(count>=4){


same=true;


}


}




if(!same){


finalPlans.push(item);


used.push(item.nums);


}




if(finalPlans.length>=3){


break;


}



}



}









// 结构过滤

function checkStructure(arr){



let nums=arr.map(Number);



// 奇偶


let odd=nums.filter(function(n){


return n%2===1;


}).length;



if(odd<2 || odd>3){


return false;


}





// 三区


let zone1=0;

let zone2=0;

let zone3=0;



nums.forEach(function(n){


if(n<=12){


zone1++;


}else if(n<=24){


zone2++;


}else{


zone3++;


}


});




if(zone1===0 || zone2===0 || zone3===0){


return false;


}





// 和值


let sum=nums.reduce(function(a,b){


return a+b;


},0);



if(sum<80 || sum>170){


return false;


}





// 连号


let link=0;



for(let i=1;i<nums.length;i++){


if(nums[i]-nums[i-1]===1){


link++;


}


}



if(link>2){


return false;


}



return true;


}








// 组合评分（修复NaN）

function calculateCombinationScore(arr){



let score=0;



arr.forEach(function(n){


let value=Number(frontScore[n]);



if(isNaN(value)){


value=0;


}



score+=value;



});





score=score/arr.length;





if(checkStructure(arr)){


score+=15;


}




if(score>100){


score=100;


}



if(score<0){


score=0;


}




return score;


}








// 后区

function getBackNumbers(){


let arr=Object.keys(backScore)
.sort(function(a,b){


return backScore[b]-backScore[a];


});



return [

arr[0],
arr[1]

];


}







// 显示结果

function showResult(){



let html="";



html+="<b>彩票智能分析系统 V35.5</b><br><br>";



html+="数据期数："+
dltData.length+
"期<br><br>";



html+="最终推荐<br><br>";




if(finalPlans.length===0){


html+="暂无符合条件组合";


}else{



finalPlans.forEach(function(plan,index){



html+="方案"+
(index+1)+
"：";



html+=plan.nums.join(" ");



html+=" + ";



html+=getBackNumbers().join(" ");



html+="<br>";



html+="综合评分："+
plan.score.toFixed(2)+
"分<br><br>";



});



}



html+="模型状态：V35.5修正版完成";



document.getElementById("result").innerHTML=html;



document.getElementById("learningStatus").innerHTML=

"等待开奖反馈学习";


document.getElementById("systemStatus").innerHTML=

"V35.5评分模型运行成功";



}







// 反馈

function saveFeedback(){



let value=document.getElementById(
"realResult"
).value;



if(!value){


alert("请输入开奖结果");


return;


}




document.getElementById(
"learningStatus"
).innerHTML=

"已记录开奖结果："+value;



}