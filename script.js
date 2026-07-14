async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V12.5 前后区联合智能模型...";


try{


const response=await fetch("data/dlt_raw.txt?v=1250");

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




// ======================
// 前区时间衰减评分
// ======================


let frontScore={};


for(let i=1;i<=35;i++){

let n=i.toString().padStart(2,"0");

frontScore[n]=0;

}



data.forEach((d,index)=>{


let w=Math.pow(0.995,index);


d.front.forEach(n=>{

frontScore[n]+=w;

});


});





// ======================
// 后区评分
// ======================


let backScore={};


for(let i=1;i<=12;i++){

let n=i.toString().padStart(2,"0");

backScore[n]=0;

}



data.forEach((d,index)=>{


let w=Math.pow(0.995,index);


d.back.forEach(n=>{

backScore[n]+=w;

});


});





// ======================
// 前区号码池
// ======================


let frontPool=Object.entries(frontScore)

.sort((a,b)=>b[1]-a[1])

.slice(0,20)

.map(x=>x[0]);





// 后区号码池


let backPool=Object.entries(backScore)

.sort((a,b)=>b[1]-a[1])

.slice(0,8)

.map(x=>x[0]);





// ======================
// 组合函数
// ======================


function pick(arr,num){


let temp=[...arr];

let r=[];


while(r.length<num){


let i=Math.floor(Math.random()*temp.length);


r.push(temp[i]);


temp.splice(i,1);


}


return r.sort((a,b)=>Number(a)-Number(b));


}





// ======================
// 反人类过滤
// ======================


function penalty(nums){


let p=0;


let same=nums.filter(n=>Number(n)<=31).length;


if(same===5){

p+=5;

}



for(let i=0;i<nums.length-1;i++){


if(Number(nums[i+1])-Number(nums[i])===1){

p+=8;

}


}


return p;

}





// ======================
// 蒙特卡罗联合模拟
// ======================


let candidates=[];


for(let i=0;i<100000;i++){


let front=pick(frontPool,5);


let back=pick(backPool,2);


let sum=front.reduce((a,b)=>a+Number(b),0);


let odd=front.filter(n=>Number(n)%2).length;


let p=penalty(front);



if(sum<75||sum>115)

continue;


if(odd<2||odd>3)

continue;



let score=100-p;



candidates.push({

front,

back,

score

});


}





candidates.sort((a,b)=>b.score-a.score);





// 去重输出


let resultList=[];

let used={};


candidates.forEach(x=>{


let key=x.front.join("-")+x.back.join("-");


if(!used[key] && resultList.length<3){


used[key]=1;

resultList.push(x);


}


});







// ======================
// 完整回测
// ======================


let hit={

"3+1":0,

"4+1":0,

"5+1":0,

"5+2":0

};



for(let i=0;i<500;i++){


let real=data[i];


let test=resultList[0];



let f=test.front.filter(n=>real.front.includes(n)).length;


let b=test.back.filter(n=>real.back.includes(n)).length;



if(f>=3&&b>=1) hit["3+1"]++;

if(f>=4&&b>=1) hit["4+1"]++;

if(f>=5&&b>=1) hit["5+1"]++;

if(f>=5&&b>=2) hit["5+2"]++;


}







// ======================
// 输出
// ======================


let html="";


html+="<h3>V12.5前后区联合模型</h3>";

html+="有效数据："+data.length+"期<br><br>";



html+="<h3>最终推荐</h3>";



resultList.forEach((x,i)=>{


html+=

`方案${i+1}：${x.front.join(" ")} + ${x.back.join(" ")}<br>`;


});



html+="<br><h3>500期回测</h3>";

html+="3+1："+hit["3+1"]+"次<br>";

html+="4+1："+hit["4+1"]+"次<br>";

html+="5+1："+hit["5+1"]+"次<br>";

html+="5+2："+hit["5+2"]+"次<br>";



html+="<br>模型：前区评分+后区评分+蒙特卡罗";


result.innerHTML=html;



}


catch(e){

result.innerHTML="V12.5运行失败："+e.message;

}


}