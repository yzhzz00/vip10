async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V22.0稳定评分模型...";


try{


const res=await fetch("data/dlt_raw.txt?v=2200");

const text=await res.text();


let data=[];


text.split("\n").forEach(line=>{


let nums=line.match(/\b\d{2}\b/g);


if(nums&&nums.length>=7){


let a=nums.slice(-7);


data.push({

front:a.slice(0,5),

back:a.slice(5,7)

});


}

});



if(data.length===0){

throw new Error("历史数据读取失败");

}




// ====================
// 基础统计
// ====================


function countFront(arr){


let obj={};


for(let i=1;i<=35;i++){

obj[String(i).padStart(2,"0")]=0;

}


arr.forEach(d=>{


d.front.forEach(n=>{

obj[n]++;

});


});


return obj;

}




function countBack(arr){


let obj={};


for(let i=1;i<=12;i++){

obj[String(i).padStart(2,"0")]=0;

}


arr.forEach(d=>{


d.back.forEach(n=>{

obj[n]++;

});


});


return obj;

}




// ====================
// 遗漏评分
// ====================


function missScore(arr){


let last={};


for(let i=1;i<=35;i++){

last[String(i).padStart(2,"0")]=999;

}



for(let i=0;i<arr.length;i++){


arr[i].front.forEach(n=>{


if(last[n]===999){

last[n]=i;

}


});


}



return last;

}




// ====================
// 马尔可夫趋势
// ====================


function markovScore(arr){


let score={};


for(let i=1;i<=35;i++){

score[String(i).padStart(2,"0")]=0;

}



for(let i=0;i<arr.length-1;i++){


let current=arr[i].front;

let next=arr[i+1].front;



current.forEach(a=>{


next.forEach(b=>{


if(a===b){

score[b]+=1;

}


});


});


}



return score;

}




// ====================
// 综合评分
// ====================


let freq=countFront(data);

let recent=countFront(data.slice(0,100));

let miss=missScore(data);

let markov=markovScore(data);



let score={};



for(let n in freq){


score[n]=

freq[n]*0.35

+

recent[n]*0.25

+

markov[n]*0.25

+

(1/(miss[n]+1))*100*0.15;



}
// ====================
// 组合评分
// ====================


function combinationScore(nums){


let s=0;


// 号码总评分

nums.forEach(n=>{

s+=score[n];

});



// 奇偶结构

let odd=nums.filter(n=>parseInt(n)%2===1).length;


if(odd>=2&&odd<=3){

s+=20;

}



// 三区结构

let a=0,b=0,c=0;


nums.forEach(n=>{


let x=parseInt(n);


if(x<=12)a++;

else if(x<=24)b++;

else c++;


});


if(a>0&&b>0&&c>0){

s+=20;

}



// 和值范围

let sum=nums.reduce(

(x,y)=>x+parseInt(y),0

);


if(sum>=80&&sum<=140){

s+=15;

}



return s;

}





// ====================
// 固定排序选号
// ====================


let frontPool=

Object.keys(score)

.sort((a,b)=>score[b]-score[a])

.slice(0,18);





let candidates=[];



for(let i=0;i<frontPool.length;i++){

for(let j=i+1;j<frontPool.length;j++){

for(let k=j+1;k<frontPool.length;k++){



let arr=[

frontPool[i],

frontPool[j],

frontPool[k]

];



let temp=frontPool.filter(

x=>!arr.includes(x)

).slice(0,2);



if(temp.length===2){


let nums=arr.concat(temp).sort();


candidates.push({

nums:nums,

value:combinationScore(nums)

});


}



}

}

}




// 排序取前三

candidates.sort(

(a,b)=>b.value-a.value

);



let backCountData=countBack(data);



let backPool=

Object.keys(backCountData)

.sort(

(a,b)=>backCountData[b]-backCountData[a]

)

.slice(0,8);





let plans=[];



for(let i=0;i<3;i++){


plans.push({


front:candidates[i].nums,


back:

backPool.slice(i,i+2),


score:

candidates[i].value


});


}





// ====================
// 输出
// ====================


let html="";


html+="<h3>V22.0稳定评分模型</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>最终推荐</h3>";



plans.forEach((p,i)=>{


html+=

"方案"+(i+1)+"："

+p.front.join(" ")

+" + "

+p.back.join(" ")

+"<br>"

+"综合评分："

+p.score.toFixed(2)

+"<br><br>";


});



html+="模型状态：固定评分排序完成<br>";

html+="重复点击结果保持一致";



result.innerHTML=html;



}catch(e){


result.innerHTML=

"运行失败："+e.message;


}


}
