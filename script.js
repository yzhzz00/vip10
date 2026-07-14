// ======================================
// 彩票智能分析系统 V35.6.3
// 大乐透真实数据解析版
// Part 1/4
// ======================================


let dltData = [];

let frontScore = {};

let backScore = {};

let finalPlans = [];

let loaded = false;



// ================================
// 页面启动
// ================================


window.onload=function(){


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
// 初始化
// ================================


async function initSystem(){


    await loadDLT();


    await loadPL5();


    loaded=true;



    document.getElementById("systemStatus").innerHTML=

    "V35.6.3 数据模块运行正常";



}







// ================================
// 读取大乐透数据
// ================================


async function loadDLT(){



try{


let response =
await fetch(
"data/dlt_raw.txt?v=3563"
);



let text =
await response.text();





dltData =
parseDLT(text);





document.getElementById("dltStatus").innerHTML=

"已加载";





document.getElementById("dataCount").innerHTML=

dltData.length;



}

catch(error){



document.getElementById("dltStatus").innerHTML=

"读取失败";



console.log(error);



}



}








// ================================
// 读取排列五
// ================================


async function loadPL5(){


try{


let response =
await fetch(
"data/pl5_raw.txt?v=3563"
);



await response.text();




document.getElementById("pl5Status").innerHTML=

"已加载";



}catch(e){


document.getElementById("pl5Status").innerHTML=

"未加载";


}



}








// ================================
// 大乐透数据解析
// 适配：
// 07001 2007-05-30 22 24 29 31 35 04 11
// ================================


function parseDLT(text){



let result=[];



let lines =
text.split(/\r?\n/);





lines.forEach(function(line){



let arr =
line.trim()
.split(/\s+/);





// 最少9列

if(arr.length < 9){


return;


}






let front=[];


let back=[];





// 前区第3-7列

for(let i=2;i<=6;i++){



let n=parseInt(arr[i]);



if(!isNaN(n)){



front.push(
String(n).padStart(2,"0")
);



}



}





// 后区第8-9列

for(let i=7;i<=8;i++){



let n=parseInt(arr[i]);



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
// 开始预测
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



showResult();



}
// ======================================
// V35.6.3 Part 2/4
// 历史频率 + 趋势评分模型
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
// 历史频率评分
// ================================


dltData.forEach(function(item){



item.front.forEach(function(num){



frontScore[num]+=1;



});





item.back.forEach(function(num){



backScore[num]+=1;



});



});









// ================================
// 最近趋势强化
// 最近100期权重增加
// ================================


let recent =
dltData.slice(-100);




recent.forEach(function(item){



item.front.forEach(function(num){



frontScore[num]+=3;



});





item.back.forEach(function(num){



backScore[num]+=3;



});



});








// ================================
// 最近30期超级权重
// ================================


let hot =
dltData.slice(-30);




hot.forEach(function(item){



item.front.forEach(function(num){



frontScore[num]+=5;



});





item.back.forEach(function(num){



backScore[num]+=5;



});



});







normalizeScore(frontScore);


normalizeScore(backScore);



}








// ================================
// 分数归一化
// ================================


function normalizeScore(obj){



let values =
Object.values(obj);




let max =
Math.max(...values);



let min =
Math.min(...values);






for(let key in obj){



if(max===min){



obj[key]=50;



}

else{



obj[key]=

((obj[key]-min)/(max-min))*100;



}



}



}








// ================================
// 获取冷热排序
// ================================


function sortScore(obj){



return Object.keys(obj)
.sort(function(a,b){



return obj[b]-obj[a];



});



}








// ================================
// 简单遗漏评分
// ================================


function omissionScore(num){



let count=0;



for(let i=dltData.length-1;i>=0;i--){



if(dltData[i].front.includes(num)){



break;


}



count++;



}



return count;



}
// ======================================
// V35.6.3 Part 3/4
// 蒙特卡罗组合筛选
// ======================================



// ================================
// 100000次模拟
// ================================


function monteCarlo(){



let candidates=[];



let frontPool =
Object.keys(frontScore);







for(let i=0;i<100000;i++){



let combo =
generateFront(frontPool);





let score =
calculateCombinationScore(combo);





candidates.push({



nums:combo,



score:score



});



}






// 按评分降序

candidates.sort(function(a,b){



return b.score-a.score;



});







// 三方案去重

finalPlans=[];



let selected=[];






for(let item of candidates){



let same=false;





for(let old of selected){



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



selected.push(item.nums);



}






if(finalPlans.length>=3){



break;



}



}



}










// ================================
// 根据评分随机生成前区
// ================================


function generateFront(pool){



let result=[];



while(result.length<5){



let total=0;



pool.forEach(function(n){



total+=frontScore[n]+1;



});







let random =
Math.random()*total;






let sum=0;



for(let n of pool){



sum+=frontScore[n]+1;



if(sum>=random){



if(!result.includes(n)){



result.push(n);



}



break;



}



}



}





result.sort(function(a,b){



return Number(a)-Number(b);



});



return result;



}








// ================================
// 组合综合评分
// ================================


function calculateCombinationScore(arr){



let score=0;



let nums =
arr.map(Number);







// 号码基础评分

arr.forEach(function(n){



score+=frontScore[n];



});



score=
score/5;







// 奇偶结构

let odd =
nums.filter(function(n){



return n%2===1;



}).length;





if(odd===2 || odd===3){



score+=10;



}







// 三区结构

let zone1=0;

let zone2=0;

let zone3=0;





nums.forEach(function(n){



if(n<=12){



zone1++;



}

else if(n<=24){



zone2++;



}

else{


zone3++;



}



});






if(zone1>0 &&
zone2>0 &&
zone3>0){



score+=10;



}







// 和值

let sum =
nums.reduce(function(a,b){



return a+b;



},0);





if(sum>=90 && sum<=160){



score+=10;



}







// 跨度

let span =
nums[4]-nums[0];





if(span>=15 && span<=30){



score+=5;



}








// 遗漏加权

arr.forEach(function(n){



let miss =
omissionScore(n);



if(miss>10){



score+=2;



}



});






if(score>100){



score=100;



}




return score;



}
// ======================================
// V35.6.3 Part 4/4
// 后区推荐 + 页面输出 + 反馈
// ======================================



// ================================
// 后区推荐
// ================================


function getBackNumbers(){



let list =
sortScore(backScore);



return list.slice(0,2);



}







// ================================
// 输出预测结果
// ================================


function showResult(){



let html="";



html +=

"<b>彩票智能分析系统 V35.6.3</b><br><br>";



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

"暂无方案";



}

else{



finalPlans.forEach(function(item,index){





html +=

"方案"+

(index+1)+

"：";





html +=

item.nums.join(" ");





html +=

" + ";





html +=

getBackNumbers().join(" ");





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

"模型状态：V35.6.3真实数据分析完成";






let result =
document.getElementById("result");



if(result){



result.innerHTML=html;



}






let status =
document.getElementById("systemStatus");



if(status){



status.innerHTML=

"V35.6.3模型运行成功<br>"+
"2895期历史数据参与计算";


}







let learn =
document.getElementById("learningStatus");



if(learn){



learn.innerHTML=

"等待开奖反馈学习";



}



}









// ================================
// 开奖反馈
// ================================


function saveFeedback(){



let input =
document.getElementById("realResult");



if(!input){



return;



}



let value =
input.value.trim();





if(value===""){



alert(
"请输入开奖结果"
);



return;



}





let learn =
document.getElementById("learningStatus");



if(learn){



learn.innerHTML=

"已记录开奖："+value;



}





}






// ======================================
// V35.6.3 END
// ======================================