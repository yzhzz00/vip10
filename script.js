// ======================================
// 彩票智能分析系统 V35.6.1
// 蒙特卡罗优化修正版
// Part 1
// ======================================


let dltData = [];

let frontScore = {};

let backScore = {};

let finalPlans = [];

let loaded = false;





// ================================
// 页面启动
// ================================

window.onload = function(){


    initSystem();



    let btn1=document.getElementById("predictBtn");

    if(btn1){

        btn1.onclick=function(){

            runPrediction();

        };

    }



    let btn2=document.getElementById("feedbackBtn");

    if(btn2){

        btn2.onclick=function(){

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

    "V35.6.1模型运行正常";


}







// ================================
// 大乐透数据读取
// ================================


async function loadDLT(){



try{


let res=await fetch(
"data/dlt_raw.txt?v=3561"
);



let text=await res.text();



dltData=parseDLT(text);



document.getElementById("dltStatus").innerHTML=

"已加载";



document.getElementById("dataCount").innerHTML=

dltData.length;



}

catch(e){


document.getElementById("dltStatus").innerHTML=

"读取失败";


}



}







// ================================
// 排列五读取
// ================================


async function loadPL5(){


try{


let res=await fetch(
"data/pl5_raw.txt?v=3561"
);



await res.text();



document.getElementById("pl5Status").innerHTML=

"已加载";


}

catch(e){


document.getElementById("pl5Status").innerHTML=

"读取失败";


}


}







// ================================
// 数据解析
// ================================


function parseDLT(text){



let arr=[];



let lines=text.split("\n");



lines.forEach(function(line){



let nums=line.match(/\d+/g);



if(nums && nums.length>=7){



arr.push({


front:
nums.slice(0,5)
.map(function(n){

return n.padStart(2,"0");

}),



back:
nums.slice(5,7)
.map(function(n){

return n.padStart(2,"0");

})


});



}



});



return arr;


}







// ================================
// 开始预测
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
// 建立评分模型
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






// 全历史频率

dltData.forEach(function(item){



item.front.forEach(function(n){


frontScore[n]+=1;


});



item.back.forEach(function(n){


backScore[n]+=1;


});



});






// 最近趋势权重

dltData.slice(-300)
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
// 评分归一化
// ================================


function normalize(obj){



let values=Object.values(obj);



let max=Math.max.apply(null,values);


let min=Math.min.apply(null,values);




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
// V35.6.1 Part 2
// 蒙特卡罗组合筛选核心
// ======================================



// ================================
// 100000次模拟
// ================================


function monteCarlo(){



let candidates=[];



let pool=Object.keys(frontScore);





for(let i=0;i<100000;i++){



let combo=randomFront(pool);



if(checkStructure(combo)){



let score=calculateScore(combo);



candidates.push({


nums:combo,


score:score


});



}



}





// 如果过滤过严，备用全部候选

if(candidates.length<100){



candidates=[];



for(let i=0;i<5000;i++){



let combo=randomFront(pool);



candidates.push({



nums:combo,


score:calculateScore(combo)



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
// 随机生成前区5个号码
// ================================


function randomFront(pool){



let result=[];



while(result.length<5){



let index=Math.floor(
Math.random()*pool.length
);



let num=pool[index];



if(!result.includes(num)){


result.push(num);


}



}



result.sort(function(a,b){


return Number(a)-Number(b);


});



return result;


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



if(odd===0 || odd===5){


return false;


}





// 和值

let sum=nums.reduce(function(a,b){


return a+b;


},0);



if(sum<60 || sum>180){


return false;


}






// 跨度

let span=

nums[4]-nums[0];



if(span<8 || span>34){


return false;


}





// 连号限制


let link=0;



for(let i=1;i<nums.length;i++){



if(nums[i]-nums[i-1]===1){


link++;


}



}



if(link>=4){


return false;


}





return true;



}








// ================================
// 综合评分
// ================================


function calculateScore(arr){



let total=0;



arr.forEach(function(n){



let value=Number(frontScore[n]);



if(isNaN(value)){


value=0;


}



total+=value;



});




let score=

total/5;







// 结构奖励

if(checkStructure(arr)){


score+=15;


}





// 分散奖励

let span=

Number(arr[4])-Number(arr[0]);



if(span>=18){


score+=5;


}





// 限制范围

if(score>100){


score=100;


}



if(score<0){


score=0;


}




return score;



}
// ======================================
// V35.6.1 Part 3
// 后区评分 + 输出 + 反馈
// ======================================



// ================================
// 后区推荐
// ================================


function getBackNumbers(){



let list=Object.keys(backScore)
.sort(function(a,b){



return backScore[b]-backScore[a];



});



return list.slice(0,2);



}







// ================================
// 输出结果
// ================================


function showResult(){



let html="";



html+="<b>彩票智能分析系统 V35.6.1</b><br><br>";



html+="数据期数："+
dltData.length+
"期<br><br>";



html+="蒙特卡罗模拟：100000组<br><br>";



html+="最终推荐<br><br>";





if(finalPlans.length===0){



html+="暂无方案";



}else{



finalPlans.forEach(function(item,index){



html+="方案"+
(index+1)+
"：";



html+=item.nums.join(" ");



html+=" + ";



html+=getBackNumbers().join(" ");



html+="<br>";



html+="综合评分："+
item.score.toFixed(2)+
"分";



html+="<br><br>";



});



}





html+="模型状态：V35.6.1 蒙特卡罗优化完成";





let result=document.getElementById("result");



if(result){


result.innerHTML=html;


}




let learn=document.getElementById("learningStatus");



if(learn){


learn.innerHTML="等待开奖反馈学习";


}




let status=document.getElementById("systemStatus");



if(status){


status.innerHTML=

"V35.6.1模型运行成功<br>"+
"100000次组合筛选开启";


}



}









// ================================
// 开奖反馈
// ================================


function saveFeedback(){



let input=document.getElementById(
"realResult"
);



if(!input){


return;


}



let value=input.value;



if(!value){


alert("请输入开奖结果");


return;


}




let learn=document.getElementById(
"learningStatus"
);



if(learn){



learn.innerHTML=

"已记录开奖："+value;



}



}





// ======================================
// V35.6.1 END
// ======================================