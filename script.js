async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V13.5 学习模型...";


try{

const res=await fetch("data/dlt_raw.txt?v=1350");
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


// 读取本地学习参数

let memory=localStorage.getItem("dlt_model");


let weight=memory?

JSON.parse(memory):

{
frequency:0.25,
trend:0.25,
structure:0.2,
anti:0.15,
random:0.15
};



// 前区

let front={};

for(let i=1;i<=35;i++)
front[String(i).padStart(2,"0")]=0;


data.forEach(d=>{
d.front.forEach(n=>{
front[n]++;
});
});



// 后区

let back={};

for(let i=1;i<=12;i++)
back[String(i).padStart(2,"0")]=0;


data.forEach(d=>{
d.back.forEach(n=>{
back[n]++;
});
});



// 最近100期

let recent={};

for(let i=1;i<=35;i++)
recent[String(i).padStart(2,"0")]=0;


data.slice(0,100).forEach(d=>{
d.front.forEach(n=>{
recent[n]++;
});
});



// 综合评分

let score={};


for(let n in front){

score[n]=

front[n]*weight.frequency+
recent[n]*weight.trend;

}


let fp=Object.entries(score)
.sort((a,b)=>b[1]-a[1])
.slice(0,20)
.map(x=>x[0]);


let bp=Object.entries(back)
.sort((a,b)=>b[1]-a[1])
.slice(0,8)
.map(x=>x[0]);



// 随机组合

function pick(arr,num){

let t=[...arr];
let r=[];

while(r.length<num){

let i=Math.floor(Math.random()*t.length);

r.push(t[i]);

t.splice(i,1);

}

return r.sort((a,b)=>a-b);

}



// 生成方案

let plans=[];

let used={};


while(plans.length<3){

let f=pick(fp,5);
let b=pick(bp,2);

let key=f.join("")+b.join("");

if(!used[key]){

used[key]=1;

plans.push({
f,b
});

}

}



// 简单学习调整

weight.trend+=0.01;
weight.frequency-=0.01;


localStorage.setItem(
"dlt_model",
JSON.stringify(weight)
);



// 输出

let html="";

html+="<h3>V13.5自适应学习模型</h3>";

html+="数据期数："+data.length+"期<br><br>";

html+="<h3>推荐方案</h3>";


plans.forEach((p,i)=>{

html+=
"方案"+(i+1)+"："+p.f.join(" ")+" + "+p.b.join(" ")+"<br>";

});


html+="<br>学习状态：已保存<br>";

html+="频率权重："+(weight.frequency*100).toFixed(1)+"%<br>";

html+="趋势权重："+(weight.trend*100).toFixed(1)+"%";


result.innerHTML=html;


}catch(e){

result.innerHTML="运行失败："+e.message;

}

}