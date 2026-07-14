async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V30.0全模块融合模型...";


try{


const res=await fetch("data/dlt_raw.txt?v=3000");

const text=await res.text();



let data=[];



text.split("\n").forEach(line=>{


let nums=line.match(/\b\d{2}\b/g);



if(nums && nums.length>=7){


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





// ======================
// 自动权重
// ======================


let weight=JSON.parse(

localStorage.getItem("v30_weight")

||

JSON.stringify({

freq:0.20,

trend:0.18,

bayes:0.15,

markov:0.20,

structure:0.17,

miss:0.10

})

);






// ======================
// 前区统计
// ======================


function frontCount(arr){


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





// ======================
// 后区统计
// ======================


function backCount(arr){


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





// ======================
// 时间衰减
// ======================


function decayScore(arr){


let s={};



for(let i=1;i<=35;i++){


s[String(i).padStart(2,"0")]=0;


}




arr.forEach((d,index)=>{


let w=Math.exp(-index/300);



d.front.forEach(n=>{


s[n]+=w;


});


});



return s;

}





// ======================
// 遗漏
// ======================


function omission(arr){


let o={};



for(let i=1;i<=35;i++){


o[String(i).padStart(2,"0")]=arr.length;


}





for(let i=0;i<arr.length;i++){


arr[i].front.forEach(n=>{


if(o[n]===arr.length){


o[n]=i;


}



});


}



return o;

}
// ======================
// 贝叶斯评分
// ======================


function bayesScore(count,total){


let result={};



for(let n in count){


let p=(count[n]+1)/(total+35);


result[n]=p*1000;


}



return result;

}





// ======================
// 马尔可夫矩阵
// ======================


function markov(arr){


let matrix={};



for(let i=1;i<=35;i++){


let a=String(i).padStart(2,"0");


matrix[a]={};



for(let j=1;j<=35;j++){


matrix[a][String(j).padStart(2,"0")]=0;


}


}




for(let i=0;i<arr.length-1;i++){



let current=arr[i].front;

let next=arr[i+1].front;



current.forEach(a=>{


next.forEach(b=>{


matrix[a][b]++;


});


});


}



return matrix;


}





// ======================
// 模型计算
// ======================


let freq=frontCount(data);


let trend=decayScore(data);


let miss=omission(data);


let bayes=bayesScore(freq,data.length);


let markovData=markov(data);




let finalScore={};



for(let n in freq){



let move=0;



for(let x in markovData[n]){


move+=markovData[n][x];


}



finalScore[n]=

freq[n]*weight.freq

+

trend[n]*weight.trend

+

bayes[n]*weight.bayes

+

move*weight.markov

+

(1/(miss[n]+1))*100*weight.miss;



}






// ======================
// 结构评分
// ======================


function structureScore(nums){



let score=0;



// 奇偶

let odd=

nums.filter(

n=>parseInt(n)%2

).length;



if(odd>=2&&odd<=3){

score+=20;

}




// 三区

let a=0;

let b=0;

let c=0;



nums.forEach(n=>{


let x=parseInt(n);



if(x<=12){

a++;

}else if(x<=24){

b++;

}else{

c++;

}


});



if(a>0&&b>0&&c>0){

score+=20;

}




// 和值

let sum=

nums.reduce(

(x,y)=>x+parseInt(y),

0

);



if(sum>=80&&sum<=150){

score+=15;

}



return score;


}





// ======================
// 组合评价
// ======================


function evaluate(nums){



let detail={

freq:0,

trend:0,

bayes:0,

markov:0,

structure:0,

miss:0

};



nums.forEach(n=>{


detail.freq+=freq[n]*weight.freq;

detail.trend+=trend[n]*weight.trend;

detail.bayes+=bayes[n]*weight.bayes;


});



detail.structure=

structureScore(nums);



let total=

detail.freq+

detail.trend+

detail.bayes+

detail.structure;



return{

total:total,

detail:detail

};



}
// ======================
// 蒙特卡罗组合模拟
// ======================


let pool=

Object.keys(finalScore)

.sort(

(a,b)=>finalScore[b]-finalScore[a]

)

.slice(0,25);




let simulations=[];



// 当前浏览器安全运行量
// 后续可升级 WebWorker 百万模拟


for(let i=0;i<100000;i++){



let temp=[...pool];

let nums=[];



while(nums.length<5){



let index=Math.floor(

Math.random()*temp.length

);



nums.push(temp[index]);



temp.splice(index,1);



}



nums.sort();



let ev=evaluate(nums);



simulations.push({

front:nums,

score:ev.total,

detail:ev.detail

});


}




// 排序

simulations.sort(

(a,b)=>b.score-a.score

);





// ======================
// 三方案差异化
// ======================


let plans=[];



for(let item of simulations){



let duplicate=false;



for(let p of plans){



let same=item.front.filter(

n=>p.front.includes(n)

).length;



if(same>=3){

duplicate=true;

}



}



if(!duplicate){



plans.push(item);



}



if(plans.length===3){

break;

}


}





// ======================
// 后区模型
// ======================


let back=backCount(data);



let backPool=

Object.keys(back)

.sort(

(a,b)=>back[b]-back[a]

)

.slice(0,8);





plans.forEach((p,i)=>{



p.back=

backPool.slice(i,i+2);



});





// ======================
// 自动学习记录
// ======================


localStorage.setItem(

"v30_last_result",

JSON.stringify(plans)

);






// ======================
// 输出
// ======================


let html="";



html+="<h3>V30.0全模块融合模型</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>最终推荐</h3>";





plans.forEach((p,i)=>{



html+="方案"+(i+1)+"："

+p.front.join(" ")

+" + "

+p.back.join(" ")

+"<br>";



html+="综合评分："

+(p.score/10).toFixed(1)

+"分<br>";



html+="频率贡献："

+p.detail.freq.toFixed(1)

+"<br>";



html+="趋势贡献："

+p.detail.trend.toFixed(1)

+"<br>";



html+="贝叶斯贡献："

+p.detail.bayes.toFixed(1)

+"<br>";



html+="结构贡献："

+p.detail.structure.toFixed(1)

+"<br><br>";



});




html+="模型状态：运行完成<br>";

html+="蒙特卡罗模拟：100000次<br>";

html+="学习记录：已保存";



result.innerHTML=html;



}catch(e){



result.innerHTML=

"运行失败："+e.message;



}


}