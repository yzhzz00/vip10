async function startAnalysis(){

const result=document.getElementById("result");
result.innerHTML="正在运行 V13.0 自适应学习模型...";

try{

const res=await fetch("data/dlt_raw.txt?v=1300");
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


// 权重

let w={
freq:.25,
trend:.25,
structure:.2,
anti:.15,
random:.15
};


// 前区统计

let front={};

for(let i=1;i<=35;i++)
front[String(i).padStart(2,"0")]=0;


data.forEach(d=>{

d.front.forEach(n=>front[n]++);

});



// 后区统计

let back={};

for(let i=1;i<=12;i++)
back[String(i).padStart(2,"0")]=0;


data.forEach(d=>{

d.back.forEach(n=>back[n]++);

});



// 最近趋势

let recent={};

for(let i=1;i<=35;i++)
recent[String(i).padStart(2,"0")]=0;


data.slice(0,100).forEach(d=>{

d.front.forEach(n=>recent[n]++);

});




// 评分

let score={};

for(let n in front){

score[n]=
front[n]*w.freq+
recent[n]*w.trend;

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




function penalty(a){

let p=0;

for(let i=0;i<a.length-1;i++){

if(Number(a[i+1])-Number(a[i])==1)
p+=5;

}


if(a.filter(x=>Number(x)<=31).length==5)
p+=5;


return p;

}



// 模拟

let list=[];


for(let i=0;i<50000;i++){


let f=pick(fp,5);

let b=pick(bp,2);


let sum=f.reduce((a,b)=>a+Number(b),0);


if(sum<75||sum>115)
continue;


let s=100-penalty(f);


list.push({
f,
b,
s
});


}



list.sort((a,b)=>b.s-a.s);



// 去重

let out=[];
let used={};


list.forEach(x=>{

let k=x.f.join("")+x.b.join("");

if(!used[k]&&out.length<3){

used[k]=1;
out.push(x);

}

});




// 自动调整权重

if(out.length>=3){

w.trend+=0.01;
w.freq-=0.01;

}



// 输出

let html="";

html+="<h3>V13.0自适应学习模型</h3>";

html+="数据期数："+data.length+"期<br><br>";

html+="<h3>推荐方案</h3>";


out.forEach((x,i)=>{

html+=
"方案"+(i+1)+"："+x.f.join(" ")+" + "+x.b.join(" ")+"<br>";

});


html+="<br><h3>当前权重</h3>";

html+="频率："+(w.freq*100).toFixed(1)+"%<br>";

html+="趋势："+(w.trend*100).toFixed(1)+"%<br>";

html+="结构："+(w.structure*100).toFixed(1)+"%<br>";

html+="反人类："+(w.anti*100).toFixed(1)+"%<br>";

html+="<br>学习状态：已完成一次调整";


result.innerHTML=html;


}catch(e){

result.innerHTML="运行失败："+e.message;

}

}