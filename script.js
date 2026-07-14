async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V14.5真实滚动回测模型...";


try{


const res=await fetch("data/dlt_raw.txt?v=1450");

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



// =================
// 学习权重
// =================


let weight=JSON.parse(

localStorage.getItem("v145_weight")

||

'{"freq":0.3,"trend":0.3,"structure":0.2,"random":0.2}'

);




// =================
// 统计函数
// =================


function getScore(history){


let count={};


for(let i=1;i<=35;i++){

count[String(i).padStart(2,"0")]=0;

}



history.forEach(d=>{


d.front.forEach(n=>{

count[n]++;

});


});



return count;


}




// =================
// 预测函数
// =================


function predict(history){


let count=getScore(history);


let recent=getScore(history.slice(0,100));


let score={};



for(let n in count){


score[n]=

count[n]*weight.freq

+

recent[n]*weight.trend;


}



let front=

Object.entries(score)

.sort((a,b)=>b[1]-a[1])

.slice(0,15)

.map(x=>x[0]);




let backCount={};


for(let i=1;i<=12;i++){

backCount[String(i).padStart(2,"0")]=0;

}



history.forEach(d=>{


d.back.forEach(n=>{

backCount[n]++;

});


});



let back=

Object.entries(backCount)

.sort((a,b)=>b[1]-a[1])

.slice(0,6)

.map(x=>x[0]);




function pick(arr,num){


let t=[...arr];

let r=[];


while(r.length<num){


let i=Math.floor(Math.random()*t.length);


r.push(t[i]);


t.splice(i,1);


}


return r.sort();


}



return {

front:pick(front,5),

back:pick(back,2)

};


}
// =================
// 滚动回测
// =================


let test=500;

let start=data.length-test;


let hit={

"3+0":0,
"3+1":0,
"4+0":0,
"4+1":0,
"5+0":0,
"5+1":0,
"5+2":0

};



let modelScore=0;



for(let i=start;i<data.length;i++){


let history=data.slice(0,i);


let p=predict(history);



let f=p.front.filter(

x=>data[i].front.includes(x)

).length;



let b=p.back.filter(

x=>data[i].back.includes(x)

).length;



let key=f+"+"+b;



if(hit[key]!=undefined){

hit[key]++;

}



if(f>=3){

modelScore+=f;

}



}




// =================
// 权重学习
// =================


if(modelScore>1000){

weight.trend+=0.01;

weight.freq-=0.01;

}else{

weight.freq+=0.01;

weight.trend-=0.01;

}



localStorage.setItem(

"v145_weight",

JSON.stringify(weight)

);




// =================
// 当前推荐
// =================


let now=predict(data);



let html="";


html+="<h3>V14.5真实滚动回测</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>最新推荐</h3>";

html+=

now.front.join(" ")

+" + "

+now.back.join(" ")

+"<br><br>";




html+="<h3>500期回测</h3>";



for(let k in hit){

html+=k+"："+hit[k]+"次<br>";

}




html+="<h3>模型状态</h3>";

html+="频率权重："+

(weight.freq*100).toFixed(1)

+"%<br>";



html+="趋势权重："+

(weight.trend*100).toFixed(1)

+"%<br>";



html+="模型评分："+modelScore;



result.innerHTML=html;



}catch(e){


result.innerHTML=

"运行失败："+e.message;


}


}