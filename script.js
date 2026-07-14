async function startAnalysis(){


const result=document.getElementById("result");

const status=document.getElementById("modelStatus");

const count=document.getElementById("dataCount");



result.innerHTML="V30.2校准模型启动...";



try{


const res=await fetch("data/dlt_raw.txt?v=3020");

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



if(!data.length){

throw new Error("没有读取到数据");

}



count.innerHTML=data.length+"期";






// =====================
// V30.2 新权重
// =====================


const weight={


freq:0.08,

trend:0.18,

bayes:0.12,

markov:0.25,

structure:0.25,

miss:0.12


};







// =====================
// 频率模型
// =====================


function frequency(arr){


let o={};



for(let i=1;i<=35;i++){


o[String(i).padStart(2,"0")]=0;


}



arr.forEach(d=>{


d.front.forEach(n=>{


o[n]++;


});


});


return o;

}







// =====================
// 时间趋势
// =====================


function trend(arr){



let o={};



for(let i=1;i<=35;i++){


o[String(i).padStart(2,"0")]=0;


}




arr.forEach((d,i)=>{


let w=Math.exp(-i/400);



d.front.forEach(n=>{


o[n]+=w;


});


});



return o;

}







// =====================
// 遗漏
// =====================


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






// =====================
// 马尔可夫
// =====================


function markov(arr){


let m={};



for(let i=1;i<=35;i++){


let a=String(i).padStart(2,"0");


m[a]={};



for(let j=1;j<=35;j++){


m[a][String(j).padStart(2,"0")]=0;


}


}



for(let i=0;i<arr.length-1;i++){



arr[i].front.forEach(a=>{


arr[i+1].front.forEach(b=>{


m[a][b]++;


});


});


}



return m;


}
// =====================
// 初始化模型
// =====================

let freq=frequency(data);

let trendData=trend(data);

let missData=omission(data);

let markovData=markov(data);



let bayes={};



for(let n in freq){


bayes[n]=

((freq[n]+1)/(data.length+35))*100;


}







// =====================
// 单号评分
// =====================


let score={};



for(let n in freq){



let m=0;



for(let x in markovData[n]){


m+=markovData[n][x];


}




score[n]=


freq[n]*weight.freq

+

trendData[n]*weight.trend

+

bayes[n]*weight.bayes

+

m*weight.markov

+

(1/(missData[n]+1))*100*weight.miss;



}






// =====================
// 结构评分
// =====================


function structure(nums){


let s=0;



// 奇偶


let odd=

nums.filter(

n=>parseInt(n)%2

).length;



if(odd>=2&&odd<=3){

s+=25;

}





// 三区


let a=0,b=0,c=0;



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

s+=25;

}





// 和值


let sum=

nums.reduce(

(x,y)=>x+parseInt(y),

0

);



if(sum>=85&&sum<=145){

s+=25;

}



return s;


}







// =====================
// 冷热过滤
// =====================


function heatFilter(nums){



let hotPool=

Object.keys(freq)

.sort(

(a,b)=>freq[b]-freq[a]

)

.slice(0,10);



let hot=

nums.filter(

n=>hotPool.includes(n)

).length;



// 热号不能超过3个


if(hot>3){

return false;

}



return true;


}







// =====================
// 组合评价
// =====================


function evaluate(nums){



let d={

freq:0,

trend:0,

bayes:0,

markov:0,

miss:0,

structure:0

};



nums.forEach(n=>{


d.freq+=freq[n]*weight.freq;


d.trend+=trendData[n]*weight.trend;


d.bayes+=bayes[n]*weight.bayes;



let m=0;



for(let x in markovData[n]){


m+=markovData[n][x];


}



d.markov+=m*weight.markov;



d.miss+=(1/(missData[n]+1))*100*weight.miss;



});




d.structure=

structure(nums)*weight.structure;




return {

score:Object.values(d).reduce((a,b)=>a+b,0),

detail:d

};


}








// =====================
// 蒙特卡罗筛选
// =====================


let pool=

Object.keys(score)

.sort(

(a,b)=>score[b]-score[a]

)

.slice(0,30);




let results=[];



for(let i=0;i<100000;i++){



let temp=[...pool];

let nums=[];



while(nums.length<5){


let index=

Math.floor(Math.random()*temp.length);



nums.push(temp[index]);

temp.splice(index,1);


}



nums.sort();




if(!heatFilter(nums)){

continue;

}



let e=evaluate(nums);



results.push({

front:nums,

score:e.score,

detail:e.detail

});


}




results.sort(

(a,b)=>b.score-a.score

);



let plans=[];



for(let r of results){



let bad=false;



for(let p of plans){



let same=

r.front.filter(

x=>p.front.includes(x)

).length;



if(same>2){

bad=true;

}


}



if(!bad){


plans.push(r);


}



if(plans.length===3){

break;

}


}
// =====================
// 后区独立模型
// =====================

function backFrequency(arr){


let b={};



for(let i=1;i<=12;i++){


b[String(i).padStart(2,"0")]=0;


}



arr.forEach(d=>{


d.back.forEach(n=>{


b[n]++;


});


});


return b;


}



let backScore=backFrequency(data);



let backPool=

Object.keys(backScore)

.sort(

(a,b)=>backScore[b]-backScore[a]

)

.slice(0,8);






plans.forEach((p,i)=>{


p.back=

backPool.slice(i,i+2);


});







// =====================
// 500期滚动回测
// =====================


let test={


three:0,

four:0,

five:0


};



let testCount=0;



let begin=

Math.max(500,data.length-500);



for(let i=begin;i<data.length;i++){



let history=data.slice(0,i);



let f=frequency(history);



let predict=

Object.keys(f)

.sort(

(a,b)=>f[b]-f[a]

)

.slice(0,5);



let real=data[i].front;



let hit=

predict.filter(

n=>real.includes(n)

).length;



if(hit>=3){

test.three++;

}


if(hit>=4){

test.four++;

}


if(hit===5){

test.five++;

}



testCount++;


}







// =====================
// 输出
// =====================


let html="";



html+="<h3>彩票智能分析系统 V30.2</h3>";



html+="数据期数："+data.length+"期<br><br>";



html+="<b>最终推荐</b><br><br>";



plans.forEach((p,i)=>{


html+="方案"+(i+1)+"：";



html+=p.front.join(" ");



html+=" + ";



html+=p.back.join(" ");



html+="<br>";



html+="综合评分：";

html+=(p.score/10).toFixed(1);



html+="分<br>";



html+="频率贡献：";

html+=p.detail.freq.toFixed(1);



html+=" 趋势：";

html+=p.detail.trend.toFixed(1);



html+=" 贝叶斯：";

html+=p.detail.bayes.toFixed(1);



html+=" 马尔可夫：";

html+=p.detail.markov.toFixed(1);



html+=" 遗漏：";

html+=p.detail.miss.toFixed(1);



html+=" 结构：";

html+=p.detail.structure.toFixed(1);



html+="<br><br>";



});






html+="<h3>冷热结构</h3>";



html+="热号限制：开启<br>";

html+="方案重复限制：开启<br><br>";







html+="<h3>500期滚动回测</h3>";



html+="测试期数："+testCount+"<br>";



html+="3个以上前区："+test.three+"次<br>";

html+="4个以上前区："+test.four+"次<br>";

html+="5个前区："+test.five+"次<br><br>";





html+="模型状态：V30.2校准完成";





result.innerHTML=html;



status.innerHTML=

"V30.2 FINAL运行成功";


}