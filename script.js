async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行V10.5模型...";


try{

const response=await fetch("data/dlt_raw.txt?v=105");

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


// 前区统计

let front={};

for(let i=1;i<=35;i++){

let n=i.toString().padStart(2,"0");

front[n]=0;

}


data.forEach(d=>{

d.front.forEach(n=>front[n]++);

});


// 后区统计

let back={};

for(let i=1;i<=12;i++){

let n=i.toString().padStart(2,"0");

back[n]=0;

}


data.forEach(d=>{

d.back.forEach(n=>back[n]++);

});



// 后区遗漏

let miss={};

for(let n in back){

miss[n]=0;

for(let i=0;i<data.length;i++){

if(data[i].back.includes(n)){

break;

}

miss[n]++;

}

}



// 马尔可夫：上一期号码到下一期出现次数

let transition={};


data.forEach((d,i)=>{

if(i<data.length-1){

let next=data[i+1].front;


d.front.forEach(a=>{

if(!transition[a]){

transition[a]={};

}


next.forEach(b=>{

if(!transition[a][b])

transition[a][b]=0;


transition[a][b]++;

});


});

}

});



// 前区排序

let frontRank=Object.entries(front)

.sort((a,b)=>b[1]-a[1])

.slice(0,10);



// 后区排序

let backRank=Object.entries(back)

.sort((a,b)=>b[1]-a[1])

.slice(0,6);




// 输出

let html="";


html+="<h3>V10.5模型结果</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>前区TOP10</h3>";

frontRank.forEach((x,i)=>{

html+=`${i+1}. ${x[0]} ${x[1]}次<br>`;

});



html+="<h3>后区TOP6</h3>";

backRank.forEach((x,i)=>{

html+=`${i+1}. ${x[0]} ${x[1]}次 遗漏${miss[x[0]]}期<br>`;

});



html+="<h3>最新一期转移参考</h3>";


let last=data[0].front;


last.forEach(n=>{


if(transition[n]){


let best=Object.entries(transition[n])

.sort((a,b)=>b[1]-a[1])

[0];


html+=`${n} → ${best[0]} (${best[1]}次)<br>`;

}


});



result.innerHTML=html;


}


catch(e){

result.innerHTML="模型失败："+e.message;

}


}