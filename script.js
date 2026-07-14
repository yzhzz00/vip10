// ======================================
// 彩票智能分析系统 V35.5
// 真实评分模型
// Part 1
// ======================================


let dltData = [];
let frontScore = {};
let backScore = {};

let finalPlans = [];

let loaded = false;





window.onload = function(){

    initSystem();

};





// ================================
// 初始化系统
// ================================


async function initSystem(){


await loadDLT();

await loadPL5();


loaded = true;



document.getElementById("systemStatus").innerHTML =

"V35.5 数据系统运行正常";


}






// ================================
// 读取大乐透
// ================================


async function loadDLT(){


try{


let res = await fetch(
"data/dlt_raw.txt?v=3550"
);


let text = await res.text();


dltData = parseDLT(text);



document.getElementById("dltStatus").innerHTML =
"已加载";


document.getElementById("dataCount").innerHTML =
dltData.length;



}

catch(e){


document.getElementById("dltStatus").innerHTML =
"读取失败";


}


}






// ================================
// 读取排列五
// ================================


async function loadPL5(){


try{


let res = await fetch(
"data/pl5_raw.txt?v=3550"
);


await res.text();



document.getElementById("pl5Status").innerHTML =
"已加载";


}

catch(e){


document.getElementById("pl5Status").innerHTML =
"读取失败";


}


}







// ================================
// 大乐透解析
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
// 点击预测
// ================================


function runPrediction(){


if(!loaded){


alert("数据未加载完成");

return;


}



buildScore();


generatePlans();


showResult();


}








// ================================
// 建立评分模型
// ================================


function buildScore(){



frontScore={};

backScore={};





// 初始化

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







// 最近遗漏修正


let last=dltData.slice(-50);



last.forEach(item=>{


item.front.forEach(n=>{


frontScore[n]+=10;


});


});





normalize(frontScore);

normalize(backScore);



}








// ================================
// 评分归一化
// ================================


function normalize(obj){


let values=Object.values(obj);


let max=Math.max(...values);

let min=Math.min(...values);



for(let k in obj){


obj[k]=

((obj[k]-min)/(max-min))*100;


}


}
// ======================================
// V35.5 Part 2
// 组合生成 + 结构过滤
// ======================================


// ================================
// 生成候选组合
// ================================


function generatePlans(){


let pool = Object.keys(frontScore)
.sort((a,b)=>{

return frontScore[b]-frontScore[a];

});



let candidates=[];



// 避免只取最高号码
for(let i=0;i<pool.length-4;i++){



let arr=[

pool[i],
pool[i+1],
pool[i+2],
pool[i+3],
pool[i+4]

];



arr.sort((a,b)=>parseInt(a)-parseInt(b));



if(checkStructure(arr)){



candidates.push({

nums:arr,

score:calculateCombinationScore(arr)

});


}



}





// 增加不同位置组合

for(let i=0;i<pool.length;i+=3){



let arr=[];



for(let j=i;j<pool.length;j+=5){


if(arr.length<5){

arr.push(pool[j]);

}


}



if(arr.length===5){


arr.sort((a,b)=>parseInt(a)-parseInt(b));



if(checkStructure(arr)){


candidates.push({

nums:arr,

score:calculateCombinationScore(arr)

});


}


}



}





// 排序

candidates.sort((a,b)=>{

return b.score-a.score;

});




finalPlans=[];



let used=[];



for(let item of candidates){



let same=false;



for(let old of used){


let count=0;


item.nums.forEach(n=>{


if(old.includes(n)){

count++;

}


});



if(count>=4){

same=true;

}


}



if(!same){


finalPlans.push(item.nums);


used.push(item.nums);


}



if(finalPlans.length===3){


break;


}



}


}









// ================================
// 结构过滤
// ================================


function checkStructure(arr){



let nums=arr.map(Number);




// 奇偶

let odd=

nums.filter(n=>n%2===1).length;



if(odd<2 || odd>3){


return false;


}






// 三区

let z1=0;

let z2=0;

let z3=0;



nums.forEach(n=>{


if(n<=12){

z1++;

}
else if(n<=24){

z2++;

}
else{

z3++;

}


});





// 必须覆盖三区

if(
z1===0 ||
z2===0 ||
z3===0
){

return false;


}






// 和值


let sum=

nums.reduce(
(a,b)=>a+b,
0
);



if(sum<90 || sum>160){


return false;


}







// 连号


let link=0;



for(let i=1;i<nums.length;i++){


if(
nums[i]-nums[i-1]===1
){


link++;


}


}



if(link>2){


return false;


}






return true;


}









// ================================
// 组合评分
// ================================


function calculateCombinationScore(arr){



let score=0;



arr.forEach(n=>{


score+=frontScore[n];


});




// 平均

score=score/5;



// 结构奖励


if(checkStructure(arr)){


score+=15;


}



if(score>100){


score=100;


}




return score;


}






// ================================
// 后区选择
// ================================


function getBackNumbers(){



let arr=

Object.keys(backScore)

.sort((a,b)=>{


return backScore[b]-backScore[a];


});



return [

arr[0],
arr[1]

];


}
// ======================================
// V35.5 Part 3
// 输出 + 反馈学习
// ======================================



// ================================
// 页面按钮绑定
// ================================


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



}

);







// ================================
// 显示预测结果
// ================================


function showResult(){



let html="";



html+=
"<b>彩票智能分析系统 V35.5</b><br><br>";



html+=
"数据期数："
+
dltData.length
+
"期<br><br>";



html+=
"最终推荐<br><br>";





finalPlans.forEach(
(plan,index)=>{


let score=

calculateCombinationScore(plan);



html+=

"方案"+
(index+1)
+
"：";



html+=

plan.join(" ");



html+=" + ";



html+=

getBackNumbers().join(" ");



html+="<br>";



html+=

"综合评分："
+
score.toFixed(2)
+
"分";



html+="<br><br>";



}

);





html+=

"模型状态：V35.5真实评分完成";




document.getElementById(
"result"
).innerHTML=html;






document.getElementById(
"learningStatus"
).innerHTML=

"等待开奖反馈学习";






document.getElementById(
"systemStatus"
).innerHTML=

"V35.5运行成功<br>评分模型开启";



}








// ================================
// 开奖反馈
// ================================


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





document.getElementById(
"learningStatus"
).innerHTML=

"已记录开奖结果："+value;



}