async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V23.0智能组合优化模型...";


try{


const res=await fetch("data/dlt_raw.txt?v=2300");

const text=await res.text();


let data=[];


text.split("\n").forEach(line=>{


let n=line.match(/\b\d{2}\b/g);


if(n&&n.length>=7){


let a=n.slice(-7);


data.push({

front:a.slice(0,5),

back:a.slice(5,7)

});


}

});



if(data.length===0){

throw new Error("数据读取失败");

}





function countFront(arr){


let c={};


for(let i=1;i<=35;i++){

c[String(i).padStart(2,"0")]=0;

}



arr.forEach(d=>{

d.front.forEach(n=>{

c[n]++;

});

});


return c;

}





function countBack(arr){


let c={};


for(let i=1;i<=12;i++){

c[String(i).padStart(2,"0")]=0;

}



arr.forEach(d=>{

d.back.forEach(n=>{

c[n]++;

});

});


return c;

}





let freq=countFront(data);

let recent=countFront(data.slice(0,100));



let score={};



for(let n in freq){


score[n]=

freq[n]*0.4

+

recent[n]*0.3;



if(parseInt(n)%2){

score[n]+=5;

}



}



function getScoreDetail(nums){


let frequency=0;


nums.forEach(n=>{

frequency+=score[n];

});


return frequency;

}
// =====================
// 组合生成
// =====================


let pool=

Object.keys(score)

.sort((a,b)=>score[b]-score[a])

.slice(0,25);




function combination(arr){


let list=[];



for(let i=0;i<arr.length;i++){

for(let j=i+1;j<arr.length;j++){

for(let k=j+1;k<arr.length;k++){

for(let m=k+1;m<arr.length;m++){

for(let n=m+1;n<arr.length;n++){


let nums=[

arr[i],

arr[j],

arr[k],

arr[m],

arr[n]

];


let value=getScoreDetail(nums);



list.push({

nums:nums,

score:value

});


}

}

}

}

}



return list;

}





let combinations=combination(pool);



// 结构过滤

combinations=combinations.filter(x=>{


let nums=x.nums;


let odd=nums.filter(

n=>parseInt(n)%2

).length;



let sum=nums.reduce(

(a,b)=>a+parseInt(b),0

);



return (

odd>=2

&&

odd<=3

&&

sum>=70

&&

sum<=150

);


});





// 排序

combinations.sort(

(a,b)=>b.score-a.score

);





// 选择不同方案

let plans=[];


for(let i=0;i<combinations.length;i++){


let item=combinations[i];


let same=false;


plans.forEach(p=>{


let common=item.nums.filter(

n=>p.front.includes(n)

).length;



if(common>=4){

same=true;

}


});



if(!same){

plans.push({

front:item.nums,

score:item.score

});

}


if(plans.length>=3){

break;

}


}





// 后区

let backs=countBack(data);



let backPool=

Object.keys(backs)

.sort(

(a,b)=>backs[b]-backs[a]

)

.slice(0,8);





plans.forEach((p,i)=>{


p.back=

backPool.slice(i,i+2);


p.score=

Math.min(

99,

p.score/10

);


});






// =====================
// 输出
// =====================


let html="";


html+="<h3>V23.0智能组合优化模型</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>最终推荐</h3>";



plans.forEach((p,i)=>{


html+=

"方案"+(i+1)+"："

+p.front.join(" ")

+" + "

+p.back.join(" ")

+"<br>";



html+="综合评分："

+p.score.toFixed(1)

+"分<br><br>";



});



html+="模型状态：优化完成<br>";

html+="三方案差异化：开启";



result.innerHTML=html;



}catch(e){


result.innerHTML=

"运行失败："+e.message;


}


}