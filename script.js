// ======================================
// 彩票智能分析系统 V35.6
// 蒙特卡罗组合优化版
// Part 1
// ======================================


let dltData = [];

let frontScore = {};

let backScore = {};

let finalPlans = [];

let loaded = false;






// ================================
// 启动
// ================================


window.onload = function(){


    initSystem();



    document.getElementById("predictBtn").onclick=function(){


        runPrediction();


    };



    document.getElementById("feedbackBtn").onclick=function(){


        saveFeedback();


    };


};







// ================================
// 初始化
// ================================


async function initSystem(){


    await loadDLT();


    await loadPL5();


    loaded=true;



    document.getElementById("systemStatus").innerHTML=

    "V35.6 蒙特卡罗模型运行正常";


}







// ================================
// 加载大乐透
// ================================


async function loadDLT(){


try{


let res=await fetch(
"data/dlt_raw.txt?v=3560"
);



let text=await res.text();



dltData=parseDLT(text);



document.getElementById("dltStatus").innerHTML=

"已加载";



document.getElementById("dataCount").innerHTML=

dltData.length;



}catch(e){



document.getElementById("dltStatus").innerHTML=

"读取失败";


}



}






// ================================
// 加载排列五
// ================================


async function loadPL5(){


try{


let res=await fetch(
"data/pl5_raw.txt?v=3560"
);



await res.text();



document.getElementById("pl5Status").innerHTML=

"已加载";


}catch(e){


document.getElementById("pl5Status").innerHTML=

"读取失败";


}


}







// ================================
// 数据解析
// ================================


function parseDLT(text){


let arr=[];



text.split("\n").forEach(function(line){



let n=line.match(/\d+/g);



if(n && n.length>=7){



arr.push({


front:n.slice(0,5)
.map(x=>x.padStart(2,"0")),


back:n.slice(5,7)
.map(x=>x.padStart(2,"0"))


});



}



});



return arr;



}








// ================================
// 开始分析
// ================================


function runPrediction(){



if(!loaded){


alert("数据未加载");


return;


}



buildModel();



monteCarlo();



showResult();



}







// ================================
// 建立模型
// ================================


function buildModel(){



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


dltData.forEach(function(item){



item.front.forEach(function(n){


frontScore[n]+=1;


});



item.back.forEach(function(n){


backScore[n]+=1;


});


});






// 最近趋势增强


dltData.slice(-200)
.forEach(function(item){



item.front.forEach(function(n){


frontScore[n]+=3;


});



item.back.forEach(function(n){


backScore[n]+=3;


});


});





normalize(frontScore);

normalize(backScore);



}





// ================================
// 归一化
// ================================


function normalize(obj){


let values=Object.values(obj);



let max=Math.max(...values);

let min=Math.min(...values);



for(let k in obj){


if(max===min){


obj[k]=50;


}else{


obj[k]=

((obj[k]-min)/(max-min))*100;


}


}


}
// ======================================
// V35.6 Part 2
// 蒙特卡罗组合筛选
// ======================================



// ================================
// 蒙特卡罗模拟
// ================================


function monteCarlo(){



let candidates=[];



let numbers=Object.keys(frontScore);





// 模拟10万组

for(let i=0;i<100000;i++){



let combo=randomFront(numbers);




if(checkStructure(combo)){



let score=

calculateScore(combo);



candidates.push({


nums:combo,

score:score


});



}



}






// 排序

candidates.sort(function(a,b){


return b.score-a.score;


});






// 三方案差异化

finalPlans=[];



let selected=[];



for(let item of candidates){



let duplicate=false;



selected.forEach(function(old){



let same=0;



item.nums.forEach(function(n){



if(old.includes(n)){


same++;


}


});



if(same>=4){


duplicate=true;


}


});





if(!duplicate){



finalPlans.push(item);



selected.push(item.nums);



}



if(finalPlans.length>=3){


break;


}



}




}








// ================================
// 随机生成5个号码
// ================================


function randomFront(pool){



let arr=[];



while(arr.length<5){



let index=Math.floor(
Math.random()*pool.length
);



let n=pool[index];



if(!arr.includes(n)){


arr.push(n);


}



}




arr.sort(function(a,b){


return Number(a)-Number(b);


});



return arr;



}









// ================================
// 结构过滤
// ================================


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


let a=0;

let b=0;

let c=0;



nums.forEach(function(n){



if(n<=12){


a++;


}else if(n<=24){


b++;


}else{


c++;


}



});




if(a===0 || b===0 || c===0){


return false;


}





// 和值


let sum=

nums.reduce(function(x,y){


return x+y;


},0);




if(sum<85 || sum>170){


return false;


}





// 跨度


let span=

nums[4]-nums[0];



if(span<12 || span>33){


return false;


}






// 连号限制


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









// ================================
// 综合评分
// ================================


function calculateScore(arr){



let score=0;



arr.forEach(function(n){



let v=Number(frontScore[n]);



if(isNaN(v)){


v=0;


}



score+=v;



});




score=score/5;






// 结构奖励


if(checkStructure(arr)){


score+=10;


}






// 分散奖励

let span=

Number(arr[4])-Number(arr[0]);



if(span>=18){


score+=5;


}





if(score>100){


score=100;


}



return score;


}
// ======================================
// V35.6 Part 3
// 后区 + 输出 + 反馈
// ======================================



// ================================
// 后区选择
// ================================


function getBackNumbers(){



let arr=Object.keys(backScore)
.sort(function(a,b){



return backScore[b]-backScore[a];



});



return arr.slice(0,2);



}









// ================================
// 显示结果
// ================================


function showResult(){



let html="";



html +=

"<b>彩票智能分析系统 V35.6</b><br><br>";



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


}else{



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

"模型状态：V35.6 蒙特卡罗优化完成";





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

"V35.6模型运行成功<br>100000次组合筛选开启";



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
"请输入开奖结果"
);



return;


}





document.getElementById(
"learningStatus"
).innerHTML=

"已记录开奖结果："+
value;



}
