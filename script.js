async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行V10.3智能评分模型...";


try{


const response=await fetch("data/dlt_raw.txt?v=103");

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



// 基础频率

let count={};


for(let i=1;i<=35;i++){

let n=i.toString().padStart(2,"0");

count[n]=0;

}


data.forEach(item=>{

item.front.forEach(n=>{

count[n]++;

});

});




// 最近100期

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




// 当前遗漏

let miss={};


for(let i=1;i<=35;i++){

let n=i.toString().padStart(2,"0");

miss[n]=0;


for(let j=0;j<data.length;j++){

if(data[j].front.includes(n)){

break;

}

miss[n]++;

}

}



// 评分

let score={};


for(let n in count){


let freqScore=count[n]/497*35;


let missScore=Math.min(miss[n]/25,1)*25;


let recentScore=recent[n]/20*20;


let balanceScore=20;


if(count[n]<380){

balanceScore+=5;

}


score[n]=

freqScore+

missScore+

recentScore+

balanceScore;


}



// 排序

let ranking=Object.entries(score)

.sort((a,b)=>b[1]-a[1])

.slice(0,15);





let html="";


html+="<h3>V10.3智能评分结果</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>前区号码评分TOP15</h3>";



ranking.forEach((x,i)=>{


html+=

`${i+1}. ${x[0]} 评分 ${x[1].toFixed(1)}分<br>`;


});





html+="<h3>推荐号码池</h3>";


html+=ranking

.slice(0,10)

.map(x=>x[0])

.join(" ");



result.innerHTML=html;



}


catch(e){

result.innerHTML="模型运行失败："+e.message;

}


}