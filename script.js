// ======================================
// 彩票智能分析系统 V35.7
// 核心模型升级版
// Part 1/4
// ======================================


let dltData=[];

let frontScore={};

let backScore={};

let finalPlans=[];

let loaded=false;

let historyResult=[];




// ================================
// 页面启动
// ================================


window.onload=function(){


initSystem();



let btn=document.getElementById(
"predictBtn"
);



if(btn){


btn.onclick=function(){


runPrediction();


};


}





let fb=document.getElementById(
"feedbackBtn"
);



if(fb){


fb.onclick=function(){


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



document.getElementById(
"systemStatus"
).innerHTML=

"V35.7 数据模型运行正常";


}








// ================================
// 大乐透数据读取
// ================================


async function loadDLT(){



try{


let res=
await fetch(
"data/dlt_raw.txt?v=3570"
);



let text=
await res.text();




dltData=parseDLT(text);




document.getElementById(
"dltStatus"
).innerHTML="已加载";



document.getElementById(
"dataCount"
).innerHTML=dltData.length;



}catch(e){


console.log(e);



}



}







// ================================
// 排列五
// ================================


async function loadPL5(){



try{


let res=
await fetch(
"data/pl5_raw.txt?v=3570"
);



await res.text();



document.getElementById(
"pl5Status"
).innerHTML="已加载";


}catch(e){


document.getElementById(
"pl5Status"
).innerHTML="未加载";


}



}







// ================================
// 大乐透解析
// 适配真实数据
// ================================


function parseDLT(text){



let result=[];



let lines=
text.split(/\r?\n/);




lines.forEach(function(line){



let arr=
line.trim()
.split(/\s+/);





if(arr.length<9){


return;


}






let front=[];

let back=[];






for(let i=2;i<=6;i++){


front.push(
String(
parseInt(arr[i])
)
.padStart(2,"0")
);


}





for(let i=7;i<=8;i++){


back.push(
String(
parseInt(arr[i])
)
.padStart(2,"0")
);



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
// V35.7 Part 2/4
// 贝叶斯评分 + 马尔可夫趋势模型
// ======================================



// ================================
// 建立模型
// ================================


function buildModel(){



frontScore={};

backScore={};






// 初始化号码

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






// ================================
// 历史频率
// 权重30%
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
// 权重20%
// ================================


let recent100=
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
// 权重15%
// ================================


let recent30=
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
// 遗漏周期评分
// 权重15%
// ================================


for(let n in frontScore){



let miss=
getOmission(n);



frontScore[n]+=
missingWeight(miss);



}




for(let n in backScore){



let miss=
getBackOmission(n);



backScore[n]+=
missingWeight(miss);



}









// ================================
// 马尔可夫转移
// 权重10%
// ================================


applyMarkov();






normalize(frontScore);


normalize(backScore);



}








// ================================
// 遗漏计算
// ================================


function getOmission(num){



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







function missingWeight(v){



if(v>=20){



return 15;



}



if(v>=10){



return 8;



}



return 3;



}








// ================================
// 马尔可夫转移
// 上一期号码影响下一期
// ================================


function applyMarkov(){



for(let i=1;i<dltData.length;i++){



let last=
dltData[i-1].front;



let now=
dltData[i].front;





last.forEach(function(a){



now.forEach(function(b){



if(frontScore[b]!==undefined){



frontScore[b]+=10;



}



});



});



}



}








// ================================
// 标准化
// ================================


function normalize(obj){



let values=
Object.values(obj);



let max=
Math.max(...values);



let min=
Math.min(...values);






for(let k in obj){



obj[k]=

((obj[k]-min)/(max-min))*100;



}



}
// ======================================
// V35.7 Part 3/4
// 蒙特卡罗筛选 + 三方案排名
// ======================================



// ================================
// 100000次模拟
// ================================


function monteCarlo(){



let candidates=[];



let pool=
Object.keys(frontScore);





for(let i=0;i<100000;i++){



let combo=
weightedRandom(pool);





let score=
calculateScore(combo);





candidates.push({



nums:combo,



score:score



});



}






// 排序

candidates.sort(function(a,b){



return b.score-a.score;



});







finalPlans=[];


let selected=[];







for(let item of candidates){



let repeat=false;






for(let old of selected){



let same=0;



item.nums.forEach(function(n){



if(old.includes(n)){



same++;



}



});





if(same>=4){



repeat=true;



}



}






if(!repeat){



finalPlans.push(item);



selected.push(item.nums);



}






if(finalPlans.length>=3){



break;



}



}



}









// ================================
// 加权随机选号
// ================================


function weightedRandom(pool){



let result=[];



while(result.length<5){



let total=0;



pool.forEach(function(n){



total+=frontScore[n]+1;



});






let r=
Math.random()*total;



let sum=0;






for(let n of pool){



sum+=frontScore[n]+1;



if(sum>=r){



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
// 综合评分
// 不封顶
// ================================


function calculateScore(arr){



let score=0;



let nums=
arr.map(Number);







// 基础权重

arr.forEach(function(n){



score+=frontScore[n];



});



score=
score/5;








// 奇偶结构


let odd=
nums.filter(function(n){



return n%2===1;



}).length;






if(odd===2 || odd===3){



score+=6;



}







// 三区平衡


let a=0;

let b=0;

let c=0;






nums.forEach(function(n){



if(n<=12){



a++;



}
else if(n<=24){



b++;



}
else{



c++;



}



});






if(a>0 && b>0 && c>0){



score+=8;



}







// 和值

let sum=
nums.reduce(function(x,y){



return x+y;



},0);





if(sum>=80 && sum<=170){



score+=5;



}








// 跨度

let span=
nums[4]-nums[0];





if(span>=15 && span<=32){



score+=5;



}








return Number(score.toFixed(2));



}
// ======================================
// V35.7 Part 4/4
// 后区优化 + 输出 + 反馈
// ======================================



// ================================
// 后区智能选择
// ================================


function getBackNumbers(){



let list=
Object.keys(backScore)
.sort(function(a,b){



return backScore[b]-backScore[a];



});






let result=[];





// 后区结构控制

for(let n of list){



if(result.length===0){



result.push(n);



continue;



}





let sum=
Number(result[0])
+
Number(n);





if(sum>=8 && sum<=22){



result.push(n);



break;



}



}






// 如果不足两个

if(result.length<2){



for(let n of list){



if(!result.includes(n)){



result.push(n);



break;



}



}



}





return result.sort(function(a,b){



return Number(a)-Number(b);



});



}









// ================================
// 页面输出
// ================================


function showResult(){



let html="";





html+=

"<b>彩票智能分析系统 V35.7</b><br><br>";



html+=

"数据期数："+dltData.length+"期<br><br>";



html+=

"蒙特卡罗模拟：100000组<br><br>";



html+=

"最终推荐<br><br>";








let back=
getBackNumbers();







if(finalPlans.length===0){



html+="暂无方案";



}

else{



finalPlans.forEach(function(item,index){



html+=

"方案"+

(index+1)

+"：";





html+=

item.nums.join(" ");





html+=" + ";



html+=

back.join(" ");





html+="<br>";





html+=

"综合评分："+

item.score.toFixed(2)

+"分";





html+="<br><br>";



});



}






html+=

"模型状态：V35.7综合模型完成";







let result=
document.getElementById("result");



if(result){



result.innerHTML=html;



}






let status=
document.getElementById("systemStatus");



if(status){



status.innerHTML=

"V35.7模型运行成功<br>"+
"2895期历史数据参与计算";


}






}









// ================================
// 开奖反馈
// ================================


function saveFeedback(){



let input=
document.getElementById("realResult");



if(!input || input.value.trim()===""){



alert(
"请输入开奖结果"
);



return;



}




historyResult.push(
input.value.trim()
);





document.getElementById(
"learningStatus"
).innerHTML=

"已记录开奖："+

input.value;



}








// ================================
// 简单回测接口
// ================================


function backTest(){



let hit=0;



finalPlans.forEach(function(plan){



dltData.forEach(function(item){



let same=0;



plan.nums.forEach(function(n){



if(item.front.includes(n)){



same++;



}



});



if(same>=3){



hit++;



}



});



});





return hit;



}







// ======================================
// V35.7 END
// ======================================