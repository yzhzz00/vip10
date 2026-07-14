async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V10.6 自动选号+回测系统...";


try{


const response=await fetch("data/dlt_raw.txt?v=600");

const text=await response.text();

const lines=text.split("\n");

let data=[];


// 读取数据

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



// =================
// 前区评分
// =================


let frontCount={};


for(let i=1;i<=35;i++){

let n=i.toString().padStart(2,"0");

frontCount[n]=0;

}



data.forEach(d=>{

d.front.forEach(n=>{

frontCount[n]++;

});

});



// 最近100期

let recent={};


for(let i=1;i<=35;i++){

let n=i.toString().padStart(2,"0");

recent[n]=0;

}



data.slice(0,100).forEach(d=>{

d.front.forEach(n=>{

recent[n]++;

});

});




// 遗漏

let miss={};


for(let n in frontCount){


miss[n]=0;


for(let i=0;i<data.length;i++){


if(data[i].front.includes(n)){

break;

}


miss[n]++;


}

}



// 综合评分

let score={};


for(let n in frontCount){


score[n]=

frontCount[n]*0.4+

recent[n]*1.5+

miss[n]*0.8;


}




let frontPool=Object.entries(score)

.sort((a,b)=>b[1]-a[1])

.slice(0,18)

.map(x=>x[0]);





// =================
// 后区模型
// =================


let backCount={};


for(let i=1;i<=12;i++){

let n=i.toString().padStart(2,"0");

backCount[n]=0;

}


data.forEach(d=>{

d.back.forEach(n=>{

backCount[n]++;

});

});



let backPool=Object.entries(backCount)

.sort((a,b)=>b[1]-a[1])

.slice(0,6)

.map(x=>x[0]);





// =================
// 随机选号
// =================


function randomPick(arr,num){


let temp=[...arr];

let out=[];


while(out.length<num){


let index=Math.floor(Math.random()*temp.length);


out.push(temp[index]);


temp.splice(index,1);


}


return out.sort((a,b)=>Number(a)-Number(b));


}




let tickets=[];



for(let i=0;i<50000;i++){


let front=randomPick(frontPool,5);


let sum=front.reduce((a,b)=>a+Number(b),0);



let odd=front.filter(n=>Number(n)%2).length;



if(sum<75||sum>115) continue;


if(odd<2||odd>3) continue;



let back=randomPick(backPool,2);



tickets.push({

front,

back,

score:sum

});


}





// 去重

let unique={};


tickets.forEach(t=>{


let key=t.front.join("-")+t.back.join("-");


unique[key]=t;


});



let final=Object.values(unique).slice(0,3);





// =================
// 回测500期
// =================


let hit3=0;

let hit4=0;


for(let i=0;i<500;i++){


let real=data[i];


let test=final[0];


let same=test.front.filter(n=>real.front.includes(n)).length;



if(same>=3){

hit3++;

}


if(same>=4){

hit4++;

}


}





// =================
// 输出
// =================


let html="";


html+="<h3>V10.6自动选号结果</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>推荐方案</h3>";



final.forEach((t,i)=>{


html+=

`第${i+1}注：${t.front.join(" ")} + ${t.back.join(" ")}<br>`;


});



html+="<br><h3>500期简单回测</h3>";

html+="3个以上前区命中："+hit3+"次<br>";

html+="4个以上前区命中："+hit4+"次<br>";



html+="<br><h3>模型说明</h3>";

html+="频率40% + 近期走势30% + 遗漏30%";


result.innerHTML=html;



}


catch(e){

result.innerHTML="运行失败："+e.message;

}


}