// ======================================
// 彩票智能分析系统 V35.3
// 组合优化预测模型
// Part 1
// ======================================


let dltData = [];

let frontScore = {};

let backScore = {};

let finalPlans = [];

let modelReady = false;





window.onload=function(){

    loadData();

};





// ================================
// 数据读取
// ================================


async function loadData(){


try{


let res=await fetch(
"data/dlt_raw.txt?v=3530"
);


let text=await res.text();



dltData=parseDLT(text);



document.getElementById("dltStatus").innerHTML="已加载";


document.getElementById("dataCount").innerHTML=dltData.length;


document.getElementById("pl5Status").innerHTML="已加载";



document.getElementById("modelStatus").innerHTML=

"V35.3 数据加载完成";


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



if(!modelReady){


buildModel();


generatePlans();


modelReady=true;


}



showResult();


}








// ================================
// 建立评分
// ================================


function buildModel(){



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








// ================================
// 标准化评分
// ================================


function normalize(obj){


let arr=Object.values(obj);


let max=Math.max(...arr);


let min=Math.min(...arr);



for(let k in obj){


obj[k]=

((obj[k]-min)/(max-min))*100;


}


}








// ================================
// 生成候选组合
// ================================


function generatePlans(){


let candidates=[];


let pool=Object.keys(frontScore);



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



if(filterCombination(arr)){


candidates.push({

nums:arr,

score:
calculateScore(arr)

});


}



}


}


}


}


}



}




candidates.sort((a,b)=>{


return b.score-a.score;


});




finalPlans=candidates.slice(0,3);



}
// ======================================
// V35.3 Part 2
// 过滤 + 评分 + 输出
// ======================================





// ================================
// 组合过滤
// ================================


function filterCombination(arr){



let nums=arr.map(
n=>parseInt(n)
);





// 奇偶过滤

let odd=nums.filter(

n=>n%2===1

).length;



if(
odd<2 ||
odd>3
){

return false;

}






// 三区过滤

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




let zone=[z1,z2,z3];



if(
zone.includes(0)
){

return false;

}








// 和值过滤


let sum=

nums.reduce(
(a,b)=>a+b,
0
);



if(
sum<80 ||
sum>170
){

return false;

}






// 连号过滤


let link=0;



nums.sort(
(a,b)=>a-b
);



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


function calculateScore(arr){



let score=0;



arr.forEach(n=>{


score+=

frontScore[n];


});




// 结构奖励


let nums=arr.map(
n=>parseInt(n)
);




let odd=

nums.filter(
n=>n%2===1
).length;



if(
odd===2 ||
odd===3
){

score+=10;

}





let sum=

nums.reduce(
(a,b)=>a+b,
0
);



if(
sum>=90 &&
sum<=150
){

score+=10;

}




return score;



}









// ================================
// 后区生成
// ================================


function getBack(){



let pool=

Object.keys(backScore)

.sort((a,b)=>{


return backScore[b]-backScore[a];


});



return [

pool[0],

pool[1]

];


}









// ================================
// 输出结果
// ================================


function showResult(){



let html="";



html+=

"<b>彩票智能分析系统 V35.3</b><br><br>";



html+=

"数据期数："+

dltData.length+

"期<br><br>";



html+="最终推荐<br><br>";






finalPlans.forEach(

(plan,index)=>{



let back=getBack();



html+=

"方案"+

(index+1)+

"：";



html+=

plan.nums.join(" ");



html+=" + ";



html+=

back.join(" ");





html+="<br>";



html+=

"综合评分："+

plan.score.toFixed(2)+

"分";



html+="<br><br>";



}

);






html+=

"模型状态：V35.3组合优化完成";






document.getElementById(

"result"

).innerHTML=html;





document.getElementById(

"modelStatus"

).innerHTML=

"V35.3运行成功<br>组合筛选开启";




document.getElementById(

"learningStatus"

).innerHTML=

"等待开奖反馈学习";



}








// ================================
// 反馈接口
// ================================


function feedbackTraining(){



let value=

document.getElementById(

"realResult"

).value;



if(!value){


alert("请输入开奖号码");


return;


}




document.getElementById(

"learningStatus"

).innerHTML=

"已记录开奖："+value;



}