async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V13.0 自适应学习模型...";


try{


const response=await fetch("data/dlt_raw.txt?v=1300");

const text=await response.text();

const lines=text.split("\n");


let data=[];


lines.forEach(line=>{

let nums=line.match(/\b\d{2}\b/g);


if(nums && nums.length>=7){

let arr=nums.slice(-7);


data.push({

front:arr.slice(0,5),

back:arr.slice(5,7)

});

}

});



// =====================
// 模型权重
// =====================

let weight={

frequency:0.25,

trend:0.20,

structure:0.20,

markov:0.15,

anti:0.10,

random:0.10

};




// =====================
// 前区频率
// =====================

let frontCount={};


for(let i=1;i<=35;i++){

let n=i.toString().padStart(2,"0");

frontCount[n]=0;

}


data.forEach(item=>{

item.front.forEach(n=>{

frontCount[n]++;

});

});




// =====================
// 后区频率
// =====================

let backCount={};


for(let i=1;i<=12;i++){

let n=i.toString().padStart(2,"0");

backCount[n]=0;

}


data.forEach(item=>{

item.back.forEach(n=>{

backCount[n]++;

});

});




// =====================
// 最近100期趋势
// =====================

let recent={};


for(let i=1;i<=35;i++){

let n=i.toString().padStart(2,"0");

recent[n]=0;

}


data.slice(0,100).forEach(item=>{

item.front.forEach(n=>{

recent[n]++;

});

});




// =====================
// 综合评分
// =====================

let score={};


for(let n in frontCount){


score[n]=

frontCount[n]*weight.frequency/100

+

recent[n]*weight.trend;



}




let frontPool=Object.entries(score)

.sort((a,b)=>b[1]-a[1])

.slice(0,20)

.map(x=>x[0]);



let backPool=Object.entries(backCount)

.sort((a,b)=>b[1]-a[1])

.slice(0,8)

.map(x=>x[0]);



// 后半部分下一条继续