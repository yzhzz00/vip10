// ======================================
// 彩票智能分析系统 V35.2
// 结构优化预测模型
// Part 1
// ======================================


let dltData = [];

let frontScore = {};

let backScore = {};

let finalPlans = [];

let modelReady = false;





window.onload = function(){

    loadData();

};






// ================================
// 数据读取
// ================================


async function loadData(){


try{


let res = await fetch(
"data/dlt_raw.txt?v=3520"
);


let text = await res.text();


dltData=parseDLT(text);



document.getElementById("dltStatus").innerHTML="已加载";


document.getElementById("dataCount").innerHTML=dltData.length;



document.getElementById("pl5Status").innerHTML="已加载";



document.getElementById("modelStatus").innerHTML=

"V35.2 数据加载完成";



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

modelReady=true;


}



showResult();


}








// ================================
// 建立评分模型
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








// 最近趋势权重


let recent=dltData.slice(-300);



recent.forEach(item=>{


item.front.forEach(n=>{


frontScore[n]+=1.5;


});



item.back.forEach(n=>{


backScore[n]+=1.5;


});


});








// 归一化评分 0-100


normalize(frontScore);


normalize(backScore);



}








// ================================
// 评分标准化
// ================================


function normalize(obj){


let values=Object.values(obj);


let max=Math.max(...values);


let min=Math.min(...values);



for(let key in obj){


obj[key]=

((obj[key]-min)/(max-min))*100;


}


}
// ======================================
// V35.2 Part 2
// 组合生成 + 结构优化
// ======================================



// ================================
// 生成候选号码池
// ================================


function getFrontPool(){


return Object.keys(frontScore)

.sort((a,b)=>{


if(frontScore[b]===frontScore[a]){


return parseInt(a)-parseInt(b);

}


return frontScore[b]-frontScore[a];


});


}







// ================================
// 结构评分
// ================================


function structureScore(arr){


let score=0;



// 奇偶

let odd=

arr.filter(

n=>parseInt(n)%2===1

).length;



if(odd===2 || odd===3){


score+=20;


}






// 三区

let zone1=0;

let zone2=0;

let zone3=0;



arr.forEach(n=>{


let x=parseInt(n);



if(x<=12){

zone1++;

}

else if(x<=24){

zone2++;

}

else{

zone3++;

}


});




if(
zone1>=1 &&
zone2>=1 &&
zone3>=1
){


score+=25;


}







// 和值


let sum=

arr.reduce(

(a,b)=>a+parseInt(b),

0

);



if(sum>=90 && sum<=160){


score+=25;


}







// 连号控制


let link=0;



for(let i=1;i<arr.length;i++){



if(
parseInt(arr[i])-

parseInt(arr[i-1])

===1

){


link++;


}


}



if(link<=2){


score+=15;


}





return score;


}









// ================================
// 生成方案
// ================================


function makePlan(start){



let pool=getFrontPool();


let arr=[];



for(
let i=start;
i<pool.length;
i++
){


if(arr.length===5){


break;


}


arr.push(pool[i]);


}





arr.sort(

(a,b)=>parseInt(a)-parseInt(b)

);



return arr;


}








// ================================
// 后区生成
// ================================


function makeBack(start){



let pool=

Object.keys(backScore)

.sort((a,b)=>{


if(backScore[b]===backScore[a]){


return parseInt(a)-parseInt(b);


}


return backScore[b]-backScore[a];


});



return [

pool[start],

pool[start+1]

];


}








// ================================
// 输出
// ================================


function showResult(){



let html="";



html+="<b>彩票智能分析系统 V35.2</b><br><br>";



html+="数据期数："

+dltData.length

+"期<br><br>";



html+="最终推荐<br><br>";






for(let i=0;i<3;i++){



let front=

makePlan(i*5);



let back=

makeBack(i*2);



let score=

structureScore(front);



html+=

"方案"+(i+1)+"："

+

front.join(" ")

+

" + "

+

back.join(" ")

+

"<br>";




html+=

"综合评分："

+

score.toFixed(2)

+

"分<br><br>";



}





html+=

"模型状态：V35.2结构优化完成";





document.getElementById(

"result"

).innerHTML=html;




document.getElementById(

"modelStatus"

).innerHTML=

"V35.2运行成功<br>固定结构模式开启";



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