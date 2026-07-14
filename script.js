async function startAnalysis(){

const result=document.getElementById("result");
result.innerHTML="正在运行 V14.0智能回测模型...";

try{

let res=await fetch("data/dlt_raw.txt?v=1400");
let text=await res.text();

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


// 学习参数

let weight=JSON.parse(
localStorage.getItem("v14_weight")
||
'{"f":0.25,"t":0.25}'
);


// 前区统计

let fc={};

for(let i=1;i<=35;i++)
fc[String(i).padStart(2,"0")]=0;


data.forEach(d=>{

d.front.forEach(n=>fc[n]++);

});



// 后区统计

let bc={};

for(let i=1;i<=12;i++)
bc[String(i).padStart(2,"0")]=0;


data.forEach(d=>{

d.back.forEach(n=>bc[n]++);

});



// 最近趋势

let rc={};

for(let i=1;i<=35;i++)
rc[String(i).padStart(2,"0")]=0;


data.slice(0,100).forEach(d=>{

d.front.forEach(n=>rc[n]++);

});



// 综合评分

let score={};


for(let n in fc){

score[n]=
fc[n]*weight.f+
rc[n]*weight.t;

}



let fp=Object.entries(score)
.sort((a,b)=>b[1]-a[1])
.slice(0,20)
.map(x=>x[0]);


let bp=Object.entries(bc)
.sort((a,b)=>b[1]-a[1])
.slice(0,8)
.map(x=>x[0]);



// 选号

function pick(a,n){

let t=[...a],r=[];

while(r.length<n){

let i=Math.floor(Math.random()*t.length);

r.push(t[i]);

t.splice(i,1);

}

return r.sort();

}



let plans=[];

while(plans.length<3){

plans.push({

f:pick(fp,5),

b:pick(bp,2)

});

}



// 简单回测

let hit3=0;
let hit4=0;
let hit5=0;


data.slice(0,500).forEach(d=>{

plans.forEach(p=>{

let h=p.f.filter(x=>d.front.includes(x)).length;

if(h>=3)hit3++;

if(h>=4)hit4++;

if(h==5)hit5++;

});

});



// 学习调整

weight.t+=0.01;
weight.f-=0.01;

localStorage.setItem(
"v14_weight",
JSON.stringify(weight)
);



// 输出

let html="";

html+="<h3>V14.0智能回测模型</h3>";

html+="有效数据："+data.length+"期<br><br>";

html+="<h3>推荐方案</h3>";


plans.forEach((p,i)=>{

html+=
"方案"+(i+1)+"："+p.f.join(" ")+" + "+p.b.join(" ")+"<br>";

});


html+="<h3>500期回测</h3>";

html+="3个以上前区："+hit3+"次<br>";

html+="4个以上前区："+hit4+"次<br>";

html+="5个前区："+hit5+"次<br>";


html+="<br>模型学习：已保存";


result.innerHTML=html;


}catch(e){

result.innerHTML="错误："+e.message;

}

}