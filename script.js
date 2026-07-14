async function startAnalysis(){

const result=document.getElementById("result");
const status=document.getElementById("modelStatus");


result.innerHTML="V30.1 FINAL模型启动中...";


try{


const res=await fetch("data/dlt_raw.txt?v=3011");

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

throw new Error("数据为空");

}




// =======================
// 权重系统
// =======================


let weight=JSON.parse(

localStorage.getItem("v301_final_weight")

||

JSON.stringify({

freq:0.20,

trend:0.18,

miss:0.12,

structure:0.18,

markov:0.17,

bayes:0.15

})

);






// =======================
// 频率
// =======================


function frequency(arr){


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






// =======================
// 趋势
// =======================


function trend(arr){


let t={};



for(let i=1;i<=35;i++){

t[String(i).padStart(2,"0")]=0;

}




arr.forEach((d,index)=>{


let w=1/(index+1);



d.front.forEach(n=>{


t[n]+=w;


});


});



return t;

}






// =======================
// 遗漏
// =======================


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





// =======================
// 马尔可夫
// =======================


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
// =======================
// 模型初始化
// =======================

let freq=frequency(data);

let trendData=trend(data);

let miss=omission(data);

let markovData=markov(data);



let bayes={};


for(let n in freq){

bayes[n]=

((freq[n]+1)/(data.length+35))*100;


}




// =======================
// 单号综合评分
// =======================


let numberScore={};



for(let n in freq){



let move=0;



for(let x in markovData[n]){

move+=markovData[n][x];

}



numberScore[n]=

freq[n]*weight.freq

+

trendData[n]*weight.trend

+

(1/(miss[n]+1))*100*weight.miss

+

move*weight.markov

+

bayes[n]*weight.bayes;


}




// =======================
// 结构评分
// =======================


function structure(nums){


let s=0;



let odd=

nums.filter(

x=>parseInt(x)%2===1

).length;



if(odd>=2&&odd<=3){

s+=20;

}



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

s+=20;

}



let sum=

nums.reduce(

(t,n)=>t+parseInt(n),

0

);



if(sum>=80&&sum<=150){

s+=15;

}



return s;

}





// =======================
// 组合评分
// =======================


function evaluate(nums){



let d={

freq:0,

trend:0,

miss:0,

bayes:0,

structure:0

};



nums.forEach(n=>{


d.freq+=freq[n]*weight.freq;

d.trend+=trendData[n]*weight.trend;

d.miss+=(1/(miss[n]+1))*100*weight.miss;

d.bayes+=bayes[n]*weight.bayes;


});



d.structure=

structure(nums)*weight.structure;



let total=

d.freq+

d.trend+

d.miss+

d.bayes+

d.structure;



return {

score:total,

detail:d

};


}





// =======================
// 蒙特卡罗组合
// =======================


let pool=

Object.keys(numberScore)

.sort(

(a,b)=>numberScore[b]-numberScore[a]

)

.slice(0,25);



let simulations=[];



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



let e=evaluate(nums);



simulations.push({

front:nums,

score:e.score,

detail:e.detail

});


}



simulations.sort(

(a,b)=>b.score-a.score

);



let plans=[];



for(let x of simulations){



let same=false;



for(let p of plans){



let c=x.front.filter(

n=>p.front.includes(n)

).length;



if(c>=3){

same=true;

}


}



if(!same){

plans.push(x);

}



if(plans.length===3){

break;

}


}
// =======================
// 后区评分
// =======================


function backScore(arr){


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



let back=backScore(data);



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







// =======================
// 滚动回测
// =======================


let test={

three:0,

four:0,

five:0

};



let totalTest=0;



for(let i=500;i<data.length;i++){



let history=

data.slice(0,i);



let f=

frequency(history);



let pred=

Object.keys(f)

.sort(

(a,b)=>f[b]-f[a]

)

.slice(0,5);



let real=

data[i].front;



let hit=

pred.filter(

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



totalTest++;


}





// =======================
// 自动调整权重
// =======================


if(test.four>5){


weight.structure+=0.01;

weight.trend+=0.01;


}



if(test.three<30){


weight.freq+=0.01;


}




localStorage.setItem(

"v301_final_weight",

JSON.stringify(weight)

);







// =======================
// 输出
// =======================


let html="";



html+="<h3>彩票智能分析系统 V30.1 FINAL</h3>";



html+="数据期数："+data.length+"期<br><br>";



html+="<h3>最终推荐</h3>";



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



html+=" 结构：";

html+=p.detail.structure.toFixed(1);



html+="<br><br>";



});





html+="<h3>滚动回测</h3>";



html+="测试期数："+totalTest+"<br>";



html+="3个以上前区："+test.three+"次<br>";



html+="4个以上前区："+test.four+"次<br>";



html+="5个前区："+test.five+"次<br><br>";





html+="模型状态：学习完成<br>";

html+="权重已保存";




result.innerHTML=html;



status.innerHTML=

"V30.1 FINAL运行完成";


}catch(e){



result.innerHTML=

"错误："+e.message;



}

}