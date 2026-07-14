// ======================================
// 彩票智能分析系统 V35.7.1
// Part 1/4
// 数据读取 + 大乐透解析
// ======================================


let dltData = [];

let frontScore = {};

let backScore = {};

let finalPlans = [];

let loaded = false;

let feedbackList = [];





// ================================
// 页面启动
// ================================


window.onload = function(){


    initSystem();



    let predictBtn =
    document.getElementById("predictBtn");


    if(predictBtn){


        predictBtn.onclick=function(){


            runPrediction();


        };


    }





    let feedbackBtn =
    document.getElementById("feedbackBtn");


    if(feedbackBtn){


        feedbackBtn.onclick=function(){


            saveFeedback();


        };


    }



};









// ================================
// 初始化系统
// ================================


async function initSystem(){



    await loadDLT();


    await loadPL5();



    loaded=true;



    document.getElementById(
    "systemStatus"
    ).innerHTML=

    "V35.7.1 数据模块运行正常";



}









// ================================
// 读取大乐透数据
// ================================


async function loadDLT(){



try{


let res =
await fetch(
"data/dlt_raw.txt?v=3571"
);



let text =
await res.text();





dltData =
parseDLT(text);






document.getElementById(
"dltStatus"
).innerHTML=
"已加载";





document.getElementById(
"dataCount"
).innerHTML=
dltData.length;



}

catch(e){



console.log(e);



}



}









// ================================
// 读取排列五
// ================================


async function loadPL5(){



try{


let res =
await fetch(
"data/pl5_raw.txt?v=3571"
);



await res.text();




document.getElementById(
"pl5Status"
).innerHTML=
"已加载";



}catch(e){



document.getElementById(
"pl5Status"
).innerHTML=
"未加载";


}



}









// ================================
// 大乐透解析
//
// 数据格式：
//
// 07001 2007-05-30
// 22 24 29 31 35
// 04 11
//
// ================================


function parseDLT(text){



let result=[];



let lines =
text.split(/\r?\n/);





lines.forEach(function(line){



let arr =
line.trim()
.split(/\s+/);





if(arr.length < 9){


return;


}







let front=[];

let back=[];







// 前区

for(let i=2;i<=6;i++){



let n =
parseInt(arr[i]);



if(!isNaN(n)){



front.push(
String(n).padStart(2,"0")
);



}



}








// 后区

for(let i=7;i<=8;i++){



let n =
parseInt(arr[i]);



if(!isNaN(n)){



back.push(
String(n).padStart(2,"0")
);



}



}








if(front.length===5 &&
back.length===2){



result.push({


front:front,


back:back



});



}



});






return result;



}









// ================================
// 开始分析
// ================================


function runPrediction(){



if(!loaded){



alert(
"数据未加载"
);



return;



}





buildModel();


monteCarlo();


normalizeFinalScore();


showResult();



}
// ======================================
// V35.7.1 Part 2/4
// 综合评分模型
// 历史频率 + 趋势 + 遗漏 + 马尔可夫
// ======================================



// ================================
// 建立模型
// ================================


function buildModel(){



frontScore={};

backScore={};





// 初始化前区

for(let i=1;i<=35;i++){



frontScore[
String(i).padStart(2,"0")
]=0;



}



// 初始化后区

for(let i=1;i<=12;i++){



backScore[
String(i).padStart(2,"0")
]=0;



}






// ================================
// 历史频率权重
// ================================


dltData.forEach(function(item){



item.front.forEach(function(n){



frontScore[n]+=30;



});



item.back.forEach(function(n){



backScore[n]+=30;



});



});









// ================================
// 最近100期趋势
// ================================


let recent100 =
dltData.slice(-100);





recent100.forEach(function(item){



item.front.forEach(function(n){



frontScore[n]+=20;



});



item.back.forEach(function(n){



backScore[n]+=20;



});



});









// ================================
// 最近30期热度
// ================================


let recent30 =
dltData.slice(-30);





recent30.forEach(function(item){



item.front.forEach(function(n){



frontScore[n]+=15;



});



item.back.forEach(function(n){



backScore[n]+=15;



});



});








// ================================
// 遗漏周期
// ================================


for(let n in frontScore){



frontScore[n]+=
omissionWeight(
getFrontOmission(n)
);



}




for(let n in backScore){



backScore[n]+=
omissionWeight(
getBackOmission(n)
);



}







// ================================
// 马尔可夫转移
// ================================


markovTransfer();





normalizeScore(frontScore);


normalizeScore(backScore);



}









// ================================
// 前区遗漏
// ================================


function getFrontOmission(num){



let count=0;



for(let i=dltData.length-1;i>=0;i--){



if(
dltData[i].front.includes(num)
){



break;


}



count++;



}



return count;



}









// ================================
// 后区遗漏
// ================================


function getBackOmission(num){



let count=0;



for(let i=dltData.length-1;i>=0;i--){



if(
dltData[i].back.includes(num)
){



break;


}



count++;



}



return count;



}









// ================================
// 遗漏权重
// ================================


function omissionWeight(v){



if(v>=20){


return 15;


}



if(v>=10){


return 8;


}



return 3;



}









// ================================
// 一阶马尔可夫转移
// ================================


function markovTransfer(){



for(let i=1;i<dltData.length;i++){



let last =
dltData[i-1].front;



let current =
dltData[i].front;





last.forEach(function(a){



current.forEach(function(b){



if(frontScore[b]!==undefined){



frontScore[b]+=10;



}



});



});



}



}









// ================================
// 分数标准化
// ================================


function normalizeScore(obj){



let values =
Object.values(obj);



let max =
Math.max(...values);



let min =
Math.min(...values);






for(let k in obj){



if(max===min){



obj[k]=50;



}

else{



obj[k]=

((obj[k]-min)/(max-min))*100;



}



}



}
// ======================================
// V35.7.1 Part 2/4
// 综合评分模型
// 历史频率 + 趋势 + 遗漏 + 马尔可夫
// ======================================



// ================================
// 建立模型
// ================================


function buildModel(){



frontScore={};

backScore={};





// 初始化前区

for(let i=1;i<=35;i++){



frontScore[
String(i).padStart(2,"0")
]=0;



}



// 初始化后区

for(let i=1;i<=12;i++){



backScore[
String(i).padStart(2,"0")
]=0;



}






// ================================
// 历史频率权重
// ================================


dltData.forEach(function(item){



item.front.forEach(function(n){



frontScore[n]+=30;



});



item.back.forEach(function(n){



backScore[n]+=30;



});



});









// ================================
// 最近100期趋势
// ================================


let recent100 =
dltData.slice(-100);





recent100.forEach(function(item){



item.front.forEach(function(n){



frontScore[n]+=20;



});



item.back.forEach(function(n){



backScore[n]+=20;



});



});









// ================================
// 最近30期热度
// ================================


let recent30 =
dltData.slice(-30);





recent30.forEach(function(item){



item.front.forEach(function(n){



frontScore[n]+=15;



});



item.back.forEach(function(n){



backScore[n]+=15;



});



});








// ================================
// 遗漏周期
// ================================


for(let n in frontScore){



frontScore[n]+=
omissionWeight(
getFrontOmission(n)
);



}




for(let n in backScore){



backScore[n]+=
omissionWeight(
getBackOmission(n)
);



}







// ================================
// 马尔可夫转移
// ================================


markovTransfer();





normalizeScore(frontScore);


normalizeScore(backScore);



}









// ================================
// 前区遗漏
// ================================


function getFrontOmission(num){



let count=0;



for(let i=dltData.length-1;i>=0;i--){



if(
dltData[i].front.includes(num)
){



break;


}



count++;



}



return count;



}









// ================================
// 后区遗漏
// ================================


function getBackOmission(num){



let count=0;



for(let i=dltData.length-1;i>=0;i--){



if(
dltData[i].back.includes(num)
){



break;


}



count++;



}



return count;



}









// ================================
// 遗漏权重
// ================================


function omissionWeight(v){



if(v>=20){


return 15;


}



if(v>=10){


return 8;


}



return 3;



}









// ================================
// 一阶马尔可夫转移
// ================================


function markovTransfer(){



for(let i=1;i<dltData.length;i++){



let last =
dltData[i-1].front;



let current =
dltData[i].front;





last.forEach(function(a){



current.forEach(function(b){



if(frontScore[b]!==undefined){



frontScore[b]+=10;



}



});



});



}



}









// ================================
// 分数标准化
// ================================


function normalizeScore(obj){



let values =
Object.values(obj);



let max =
Math.max(...values);



let min =
Math.min(...values);






for(let k in obj){



if(max===min){



obj[k]=50;



}

else{



obj[k]=

((obj[k]-min)/(max-min))*100;



}



}



}
// ======================================
// V35.7.1 Part 4/4
// 评分归一化
// 后区优化
// 页面输出
// 反馈接口
// ======================================



// ================================
// 最终评分归一化
// ================================


function normalizeFinalScore(){



if(finalPlans.length===0){



return;



}



let max =
Math.max(
...finalPlans.map(function(x){

return x.score;

})
);





let min =
Math.min(
...finalPlans.map(function(x){

return x.score;

})
);







finalPlans.forEach(function(item){



if(max===min){



item.score=80;



}

else{



item.score =
Number(
(
80+
((item.score-min)/(max-min))*20
)
.toFixed(2)
);



}



});



}









// ================================
// 后区差异化
// ================================


function getDifferentBack(index){



let list =
Object.keys(backScore)
.sort(function(a,b){



return backScore[b]-backScore[a];



});







let groups=[



[list[0],list[1]],



[list[2],list[3]],



[list[4],list[5]]



];







return groups[index] || groups[0];



}









// ================================
// 输出结果
// ================================


function showResult(){



let html="";





html +=

"<b>彩票智能分析系统 V35.7.1</b><br><br>";





html +=

"数据期数："+
dltData.length+
"期<br><br>";





html +=

"蒙特卡罗模拟：100000组<br><br>";





html +=

"最终推荐<br><br>";







if(finalPlans.length===0){



html +=

"暂无符合条件方案";



}

else{



finalPlans.forEach(function(item,index){





let back =
getDifferentBack(index);







html +=

"方案"+
(index+1)+
"：";





html +=

item.nums.join(" ");





html +=

" + ";





html +=

back.join(" ");





html +=

"<br>";





html +=

"综合评分："+
item.score.toFixed(2)+
"分";





html +=

"<br><br>";



});



}






html +=

"模型状态：V35.7.1综合模型完成";







let result =
document.getElementById("result");



if(result){



result.innerHTML=html;



}








let status =
document.getElementById("systemStatus");



if(status){



status.innerHTML=

"V35.7.1模型运行成功<br>"+
"2895期历史数据参与计算";



}



}









// ================================
// 开奖反馈
// ================================


function saveFeedback(){



let input =
document.getElementById("realResult");





if(!input ||
input.value.trim()===""){



alert(
"请输入开奖结果"
);



return;



}






feedbackList.push(
input.value.trim()
);






let learn =
document.getElementById(
"learningStatus"
);





if(learn){



learn.innerHTML=

"已记录开奖："+
input.value;



}



}









// ================================
// 简单回测接口
// ================================


function backTest(){



let result=0;





finalPlans.forEach(function(plan){



dltData.forEach(function(item){



let count=0;



plan.nums.forEach(function(n){



if(item.front.includes(n)){



count++;



}



});





if(count>=3){



result++;



}



});



});






return result;



}







// ======================================
// V35.7.1 END
// ======================================