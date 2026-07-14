// ======================================
// 彩票智能分析系统 V35.5 FINAL 修正版
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



    document.getElementById("predictBtn").onclick =
    function(){

        runPrediction();

    };



    document.getElementById("feedbackBtn").onclick =
    function(){

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



    document.getElementById("systemStatus").innerHTML =
    "V35.5 FINAL运行正常";


}







// ================================
// 大乐透读取
// ================================


async function loadDLT(){


try{


let res = await fetch(
"data/dlt_raw.txt?v=3555"
);



let text = await res.text();



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
"data/pl5_raw.txt?v=3555"
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


alert("数据正在加载");


return;


}



buildScore();



generatePlans();



showResult();



}








// ================================
// 评分模型
// ================================


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


dltData.forEach(function(item){



item.front.forEach(function(n){


frontScore[n]+=1;


});



item.back.forEach(function(n){


backScore[n]+=1;


});



});






// 最近趋势


dltData.slice(-300)
.forEach(function(item){



item.front.forEach(function(n){


frontScore[n]+=2;


});



item.back.forEach(function(n){


backScore[n]+=2;


});



});




normalize(frontScore);

normalize(backScore);



}









// ================================
// 标准化
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









// ================================
// 生成方案
// ================================


function generatePlans(){



let pool=Object.keys(frontScore)
.sort(function(a,b){


return frontScore[b]-frontScore[a];


});



let result=[];



for(let i=0;i<pool.length-4;i++){



let arr=[


pool[i],
pool[i+1],
pool[i+2],
pool[i+3],
pool[i+4]


];



arr.sort(function(a,b){


return Number(a)-Number(b);


});



if(checkStructure(arr)){



result.push({


nums:arr,

score:calculateScore(arr)


});



}



}






result.sort(function(a,b){


return b.score-a.score;


});





finalPlans=result.slice(0,3);



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




// 和值


let sum=nums.reduce(function(a,b){


return a+b;


},0);



if(sum<80 || sum>170){


return false;


}




return true;


}








// ================================
// 评分
// ================================


function calculateScore(arr){



let total=0;



arr.forEach(function(n){



let v=Number(frontScore[n]);



if(isNaN(v)){


v=0;


}



total+=v;



});



let score=total/5;



if(checkStructure(arr)){


score+=10;


}



if(score>100){


score=100;


}



return score;



}









// ================================
// 后区
// ================================


function getBack(){



return Object.keys(backScore)
.sort(function(a,b){


return backScore[b]-backScore[a];


})
.slice(0,2);



}








// ================================
// 显示
// ================================


function showResult(){



let html="";



html+="彩票智能分析系统 V35.5<br><br>";



html+="数据期数："+dltData.length+"期<br><br>";



html+="最终推荐<br><br>";



if(finalPlans.length===0){


html+="暂无方案";


}else{



finalPlans.forEach(function(p,i){



html+="方案"+(i+1)+"：";



html+=p.nums.join(" ");



html+=" + ";



html+=getBack().join(" ");



html+="<br>";



html+="综合评分："+
p.score.toFixed(2)
+
"分<br><br>";



});



}



html+="模型状态：V35.5 FINAL完成";



document.getElementById("result").innerHTML=
html;



}








// ================================
// 反馈
// ================================


function saveFeedback(){



let value=
document.getElementById("realResult").value;



if(!value){


alert("请输入开奖结果");


return;


}



document.getElementById("learningStatus").innerHTML=
"已保存："+value;



}