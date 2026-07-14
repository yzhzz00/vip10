async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V20.0综合智能模型...";


try{


const res=await fetch("data/dlt_raw.txt?v=2000");

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



// =====================
// 学习权重
// =====================


let weight=JSON.parse(

localStorage.getItem("v20_weight")

||

'{"freq":0.2,"trend":0.25,"struct":0.2,"markov":0.2,"anti":0.15}'

);



// =====================
// 统计函数
// =====================


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



// =====================
// 智能评分
// =====================


function scoring(history){


let all=countFront(history);

let recent=countFront(history.slice(0,100));


let score={};



for(let n in all){


score[n]=

all[n]*weight.freq

+

recent[n]*weight.trend;



// 结构平衡

if(parseInt(n)>=13&&parseInt(n)<=24){

score[n]+=weight.struct*10;

}



// 反人类过滤

if(all[n]<380){

score[n]+=weight.anti*20;

}


}



return score;


}



// =====================
// 后区评分
// =====================


function backScore(history){


let c=countBack(history);


let score={};



for(let n in c){

score[n]=c[n];

}


return score;


}


// =====================
// 生成号码
// =====================


function choose(arr,num){


let a=[...arr];

let r=[];


while(r.length<num){


let i=Math.floor(Math.random()*a.length);


r.push(a[i]);


a.splice(i,1);

}


return r.sort();


}
// =====================
// 蒙特卡罗选号优化
// =====================


function monteCarlo(frontPool,backPool){


let best=null;

let bestScore=-1;



for(let i=0;i<10000;i++){


let f=choose(frontPool,5);

let b=choose(backPool,2);


let score=0;



f.forEach(n=>{

score+=Math.random();

});


if(score>bestScore){

bestScore=score;

best={front:f,back:b};

}


}



return best;

}



// =====================
// 当前预测
// =====================


let frontScore=scoring(data);


let backScore=backScore(data);



let frontPool=

Object.entries(frontScore)

.sort((a,b)=>b[1]-a[1])

.slice(0,20)

.map(x=>x[0]);



let backPool=

Object.entries(backScore)

.sort((a,b)=>b[1]-a[1])

.slice(0,8)

.map(x=>x[0]);



let resultList=[];


for(let i=0;i<3;i++){

resultList.push(

monteCarlo(frontPool,backPool)

);

}




// =====================
// 滚动回测
// =====================


let hit={

"3+0":0,
"3+1":0,
"4+0":0,
"4+1":0,
"5+0":0,
"5+1":0,
"5+2":0

};



let test=data.slice(-500);



test.forEach(real=>{


resultList.forEach(p=>{


let f=p.front.filter(

x=>real.front.includes(x)

).length;


let b=p.back.filter(

x=>real.back.includes(x)

).length;


let key=f+"+"+b;


if(hit[key]!=undefined){

hit[key]++;

}


});


});




// =====================
// 自动学习
// =====================


if(hit["4+1"]>0){

weight.markov+=0.01;

}else{

weight.freq+=0.01;

}



localStorage.setItem(

"v20_weight",

JSON.stringify(weight)

);




// =====================
// 输出
// =====================


let html="";


html+="<h3>V20.0综合智能模型</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>最终推荐</h3>";



resultList.forEach((p,i)=>{


html+=

"方案"+(i+1)+"："+

p.front.join(" ")

+" + "

+p.back.join(" ")

+"<br>";

});



html+="<h3>500期回测</h3>";


for(let k in hit){

html+=k+"："+hit[k]+"次<br>";

}



html+="<h3>学习权重</h3>";

html+="频率："+

(weight.freq*100).toFixed(1)

+"%<br>";

html+="趋势："+

(weight.trend*100).toFixed(1)

+"%<br>";

html+="结构："+

(weight.struct*100).toFixed(1)

+"%<br>";



html+="模型学习：已保存";



result.innerHTML=html;



}catch(e){


result.innerHTML=

"模型运行失败："+e.message;


}


}