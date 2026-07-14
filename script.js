async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V21.0多模型竞技系统...";


try{


const res=await fetch("data/dlt_raw.txt?v=2100");

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




// ======================
// 模型权重
// ======================


let weights=JSON.parse(

localStorage.getItem("v21_weights")

||

JSON.stringify({

freq:20,

trend:20,

miss:15,

structure:20,

markov:15,

anti:10

})

);





// ======================
// 前区统计
// ======================


function frontCount(arr){


let c={};


for(let i=1;i<=35;i++){

let n=String(i).padStart(2,"0");

c[n]=0;

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

let n=String(i).padStart(2,"0");

c[n]=0;

}


arr.forEach(d=>{


d.back.forEach(n=>{

c[n]++;

});


});


return c;

}




// ======================
// 综合评分
// ======================


function modelScore(arr){


let all=frontCount(arr);


let recent=frontCount(arr.slice(0,100));


let score={};



for(let n in all){


score[n]=

all[n]*weights.freq

+

recent[n]*weights.trend;



// 结构奖励

if(

(parseInt(n)<=12)

||

(parseInt(n)>=25)

){

score[n]+=weights.structure;

}



// 反冷门过滤

if(all[n]<300){

score[n]+=weights.anti;

}


}



return score;


}




// 后区评分


function backScore(arr){


let c=backCount(arr);


return c;


}
// ======================
// 选号
// ======================


function pick(arr,num){


let pool=[...arr];

let r=[];


while(r.length<num){


let i=Math.floor(Math.random()*pool.length);


r.push(pool[i]);


pool.splice(i,1);


}


return r.sort();

}




// ======================
// 蒙特卡罗筛选
// ======================


function monte(frontPool,backPool){


let best=null;


let bestValue=-1;



for(let i=0;i<10000;i++){


let f=pick(frontPool,5);

let b=pick(backPool,2);



let value=0;



// 奇偶结构

let odd=f.filter(n=>parseInt(n)%2).length;


if(odd>=2&&odd<=3){

value+=10;

}



// 区间结构

let low=f.filter(n=>parseInt(n)<=12).length;

let mid=f.filter(n=>parseInt(n)>12&&parseInt(n)<=24).length;

let high=f.filter(n=>parseInt(n)>24).length;


if(low>0&&mid>0&&high>0){

value+=10;

}



value+=Math.random()*20;



if(value>bestValue){

bestValue=value;

best={

front:f,

back:b

};

}


}



return best;


}





let frontScore=modelScore(data);


let backScoreData=backScore(data);



let frontPool=

Object.entries(frontScore)

.sort((a,b)=>b[1]-a[1])

.slice(0,20)

.map(x=>x[0]);



let backPool=

Object.entries(backScoreData)

.sort((a,b)=>b[1]-a[1])

.slice(0,8)

.map(x=>x[0]);





let plans=[];


for(let i=0;i<3;i++){

plans.push(

monte(frontPool,backPool)

);

}






// ======================
// 回测
// ======================


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





// ======================
// 自动学习
// ======================


if(hit["4+1"]>0){


weights.structure+=1;

weights.markov+=1;


}else{


weights.freq+=1;


}




localStorage.setItem(

"v21_weights",

JSON.stringify(weights)

);





// ======================
// 输出
// ======================


let html="";


html+="<h3>V21.0多模型竞技系统</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>模型权重</h3>";



for(let k in weights){

html+=k+"："+weights[k]+"<br>";

}



html+="<h3>最终推荐</h3>";



plans.forEach((p,i)=>{


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



html+="<br>学习状态：已保存";


result.innerHTML=html;



}catch(e){


result.innerHTML=

"运行失败："+e.message;


}


}