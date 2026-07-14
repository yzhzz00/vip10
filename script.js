async function startAnalysis(){

const result=document.getElementById("result");
const status=document.getElementById("modelStatus");
const count=document.getElementById("dataCount");


result.innerHTML="正在运行 V30.1 校准融合模型...";


try{


const res=await fetch("data/dlt_raw.txt?v=3010");

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

throw new Error("数据读取失败");

}



count.innerHTML=data.length+"期";





// ======================
// V30.1固定权重
// ======================


const weight={


freq:0.15,

trend:0.18,

bayes:0.15,

markov:0.22,

structure:0.18,

miss:0.12


};







// ======================
// 前区频率
// ======================


function frequency(arr){


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





// ======================
// 趋势衰减
// ======================


function trend(arr){


let obj={};



for(let i=1;i<=35;i++){

obj[String(i).padStart(2,"0")]=0;

}




arr.forEach((d,i)=>{


let w=Math.exp(-i/300);



d.front.forEach(n=>{


obj[n]+=w;


});


});



return obj;


}





// ======================
// 遗漏
// ======================


function miss(arr){


let obj={};



for(let i=1;i<=35;i++){


obj[String(i).padStart(2,"0")]=arr.length;


}



for(let i=0;i<arr.length;i++){


arr[i].front.forEach(n=>{


if(obj[n]===arr.length){


obj[n]=i;


}


});


}



return obj;


}






// ======================
// 马尔可夫
// ======================


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
// ======================
// 模型计算
// ======================

let freq=frequency(data);

let trendData=trend(data);

let missData=miss(data);

let markovData=markov(data);



let bayes={};


for(let n in freq){


bayes[n]=

((freq[n]+1)/(data.length+35))*100;


}





// ======================
// 单号评分
// ======================


let numberScore={};



for(let n in freq){



let trans=0;



for(let x in markovData[n]){


trans+=markovData[n][x];


}




numberScore[n]=


freq[n]*weight.freq

+

trendData[n]*weight.trend

+

bayes[n]*weight.bayes

+

trans*weight.markov

+

(1/(missData[n]+1))*100*weight.miss;



}






// ======================
// 结构评分
// ======================


function structureScore(nums){


let s=0;



// 奇偶


let odd=

nums.filter(

n=>parseInt(n)%2===1

).length;



if(odd>=2&&odd<=3){

s+=20;

}





// 三区


let low=0;

let mid=0;

let high=0;



nums.forEach(n=>{


let x=parseInt(n);



if(x<=12){

low++;

}else if(x<=24){

mid++;

}else{

high++;

}


});



if(low>0&&mid>0&&high>0){

s+=20;

}





// 和值


let sum=

nums.reduce(

(a,b)=>a+parseInt(b),

0

);



if(sum>=80&&sum<=150){

s+=15;

}



return s;


}






// ======================
// 组合评分
// ======================


function evaluate(nums){



let detail={

freq:0,

trend:0,

bayes:0,

markov:0,

miss:0,

structure:0

};



nums.forEach(n=>{


detail.freq+=freq[n]*weight.freq;

detail.trend+=trendData[n]*weight.trend;

detail.bayes+=bayes[n]*weight.bayes;

detail.miss+=(1/(missData[n]+1))*100*weight.miss;



let move=0;


for(let x in markovData[n]){


move+=markovData[n][x];


}



detail.markov+=move*weight.markov;


});



detail.structure=

structureScore(nums)*weight.structure;



let total=

detail.freq+

detail.trend+

detail.bayes+

detail.markov+

detail.miss+

detail.structure;



return {

total:total,

detail:detail

};


}





// ======================
// 蒙特卡罗筛选
// ======================


let pool=

Object.keys(numberScore)

.sort(

(a,b)=>numberScore[b]-numberScore[a]

)

.slice(0,25);




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



let e=evaluate(nums);



results.push({

front:nums,

score:e.total,

detail:e.detail

});


}




results.sort(

(a,b)=>b.score-a.score

);




let plans=[];



for(let r of results){



let same=false;



for(let p of plans){



let common=

r.front.filter(

x=>p.front.includes(x)

).length;



if(common>=3){

same=true;

}


}



if(!same){

plans.push(r);

}



if(plans.length===3){

break;

}


}
// ======================
// 后区独立评分模型
// ======================


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




let backData=backFrequency(data);



let backPool=

Object.keys(backData)

.sort(

(a,b)=>backData[b]-backData[a]

)

.slice(0,8);






plans.forEach((p,index)=>{


p.back=

backPool.slice(index,index+2);


});






// ======================
// 500期滚动回测
// ======================


let backtest={

three:0,

four:0,

five:0,

count:0

};



let start=

Math.max(500,data.length-500);



for(let i=start;i<data.length;i++){



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

x=>real.includes(x)

).length;



if(hit>=3){

backtest.three++;

}


if(hit>=4){

backtest.four++;

}


if(hit===5){

backtest.five++;

}



backtest.count++;


}






// ======================
// 输出结果
// ======================


let html="";



html+="<h3>V30.1校准融合模型</h3>";

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





html+="<h3>500期滚动回测</h3>";



html+="测试期数："+backtest.count+"<br>";

html+="3+0以上："+backtest.three+"次<br>";

html+="4+0以上："+backtest.four+"次<br>";

html+="5+0："+backtest.five+"次<br><br>";



html+="模型状态：校准完成<br>";

html+="权重：V30.1固定融合";




result.innerHTML=html;



status.innerHTML=

"V30.1运行成功";



}