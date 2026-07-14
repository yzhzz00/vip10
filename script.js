async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V20.0综合智能模型...";


try{

const res=await fetch("data/dlt_raw.txt?v=2001");

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



let weight=JSON.parse(

localStorage.getItem("v20_weight")

||

'{"freq":0.25,"trend":0.25,"struct":0.25,"anti":0.25}'

);





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




function getFrontScore(arr){

let all=frontCount(arr);

let recent=frontCount(arr.slice(0,100));


let score={};


for(let n in all){

score[n]=

all[n]*weight.freq

+

recent[n]*weight.trend;


if(parseInt(n)%2==1){

score[n]+=weight.struct;

}


if(all[n]<350){

score[n]+=weight.anti*10;

}


}


return score;

}



function getBackScore(arr){

let c=backCount(arr);

return c;

}
// 选号函数

function pick(arr,num){

let a=[...arr];

let r=[];


while(r.length<num){

let i=Math.floor(Math.random()*a.length);

r.push(a[i]);

a.splice(i,1);

}


return r.sort();

}




// 蒙特卡罗

function simulation(frontPool,backPool){


let best=null;


for(let i=0;i<3000;i++){


let f=pick(frontPool,5);

let b=pick(backPool,2);


let value=0;


f.forEach(n=>{

value+=Math.random();

});


if(!best || value>best.value){

best={

front:f,

back:b,

value:value

};

}


}


return best;

}




let frontScore=getFrontScore(data);


let backResult=getBackScore(data);



let frontPool=

Object.entries(frontScore)

.sort((a,b)=>b[1]-a[1])

.slice(0,20)

.map(x=>x[0]);



let backPool=

Object.entries(backResult)

.sort((a,b)=>b[1]-a[1])

.slice(0,8)

.map(x=>x[0]);




let plans=[];


for(let i=0;i<3;i++){

plans.push(

simulation(frontPool,backPool)

);

}





// 回测

let hit={

"3+0":0,
"3+1":0,
"4+0":0,
"4+1":0,
"5+0":0,
"5+1":0,
"5+2":0

};



data.slice(-500).forEach(real=>{


plans.forEach(p=>{


let f=p.front.filter(

x=>real.front.includes(x)

).length;


let b=p.back.filter(

x=>real.back.includes(x)

).length;



let key=f+"+"+b;


if(hit[key]!==undefined){

hit[key]++;

}


});


});




// 保存学习

weight.trend+=0.005;


localStorage.setItem(

"v20_weight",

JSON.stringify(weight)

);





let html="";


html+="<h3>V20.0综合智能模型</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>最终推荐</h3>";



plans.forEach((p,i)=>{


html+=

"方案"+(i+1)+"："+

p.front.join(" ")

+" + "

+p.back.join(" ")

+"<br>";

});



html+="<br><h3>500期回测</h3>";



for(let k in hit){

html+=k+"："+hit[k]+"次<br>";

}



html+="<br>模型学习：已保存";


result.innerHTML=html;



}catch(e){


result.innerHTML=

"运行失败："+e.message;


}


}
