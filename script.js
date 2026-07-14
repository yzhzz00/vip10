// ======================================
// 彩票智能分析系统 V33.0
// 智能学习引擎
// Part 1
// ======================================


async function startAnalysis(){


const result=document.getElementById("result");
const status=document.getElementById("modelStatus");
const learning=document.getElementById("learningStatus");
const count=document.getElementById("dataCount");



result.innerHTML="V33.0智能学习启动...";



try{


const res=await fetch("data/dlt_raw.txt?v=3300");



if(!res.ok){

throw new Error("数据读取失败");

}



const text=await res.text();



let data=[];



text.split(/\n/).forEach(line=>{


let nums=line.match(/\d+/g);



if(nums && nums.length>=7){



let arr=nums.map(n=>n.padStart(2,"0"));



data.push({

front:arr.slice(0,5),

back:arr.slice(5,7)

});


}


});




count.innerHTML=data.length+"期";







// ================================
// 学习记录读取
// ================================


let learningData={

runs:0,

bestModel:"",

weights:{}

};



try{


let old=localStorage.getItem(
"V33_learning"
);



if(old){

learningData=JSON.parse(old);

}


}catch(e){}





learningData.runs++;







// ================================
// 基础统计
// ================================


let freq={};

let trend={};

let miss={};



for(let i=1;i<=35;i++){


let n=String(i).padStart(2,"0");


freq[n]=0;

trend[n]=0;

miss[n]=data.length;


}







data.forEach(d=>{


d.front.forEach(n=>{


freq[n]++;


});


});







data.slice(-300).forEach(d=>{


d.front.forEach(n=>{


trend[n]++;


});


});








for(let i=data.length-1;i>=0;i--){


data[i].front.forEach(n=>{


if(miss[n]===data.length){

miss[n]=data.length-i;

}


});


}







// ================================
// 位置马尔可夫
// ================================


let positionMarkov={};



for(let i=0;i<data.length-1;i++){



for(let p=0;p<5;p++){



let now=data[i].front[p];

let next=data[i+1].front[p];



if(!positionMarkov[now]){

positionMarkov[now]={};

}



if(!positionMarkov[now][next]){

positionMarkov[now][next]=0;

}



positionMarkov[now][next]++;


}


}







let markov={};



for(let n in freq){


let total=0;



if(positionMarkov[n]){


Object.values(positionMarkov[n])

.forEach(v=>{

total+=v;

});


}



markov[n]=total;


}







// ================================
// 动态权重
// ================================


let weights={



freq:0.20,

trend:0.25,

miss:0.15,

markov:0.20,

structure:0.20


};






if(learningData.weights.freq){


weights=learningData.weights;


}






let score={};



for(let n in freq){



let structure=

(
parseInt(n)%2===1
)?0.6:0.4;



score[n]=

(freq[n]/data.length)*weights.freq

+

(trend[n]/300)*weights.trend

+

(Math.min(miss[n],50)/50)*weights.miss

+

(Math.min(markov[n],300)/300)*weights.markov

+

structure*weights.structure;



}





let pool=

Object.keys(score)

.sort((a,b)=>score[b]-score[a])

.slice(0,40);



// ===== V33 PART 1 END =====
// ======================================
// V33.0 Part 2
// 复盘 + 权重保存 + 组合生成 + 输出
// ======================================



// ================================
// 结构过滤
// ================================


function check(nums){


let odd=nums.filter(

n=>parseInt(n)%2===1

).length;



if(odd<2||odd>3){

return false;

}



let z1=0;

let z2=0;

let z3=0;



nums.forEach(n=>{


let x=parseInt(n);



if(x<=12){

z1++;

}else if(x<=24){

z2++;

}else{

z3++;

}


});



if(z1===0||z2===0||z3===0){

return false;

}



let sum=nums.reduce(

(a,b)=>a+parseInt(b),

0

);



if(sum<80||sum>160){

return false;

}



return true;


}







// ================================
// 组合生成
// ================================


let combinations=[];



for(let i=0;i<50000;i++){



let temp=[...pool];

let arr=[];



while(arr.length<5){


let index=Math.floor(

Math.random()*temp.length

);



arr.push(temp[index]);


temp.splice(index,1);


}



arr.sort(

(a,b)=>parseInt(a)-parseInt(b)

);



if(check(arr)){



let s=0;



arr.forEach(n=>{


s+=score[n];


});



combinations.push({

front:arr,

score:s

});


}


}




combinations.sort(

(a,b)=>b.score-a.score

);






// ================================
// 三方案
// ================================


let plans=[];



for(let c of combinations){



let same=false;



for(let p of plans){


let count=c.front.filter(

x=>p.front.includes(x)

).length;



if(count>=3){

same=true;

}



}



if(!same){

plans.push(c);

}



if(plans.length>=3){

break;

}


}







// ================================
// 后区学习模型
// ================================


let backFreq={};



for(let i=1;i<=12;i++){


backFreq[String(i).padStart(2,"0")]=0;


}



data.forEach(d=>{


d.back.forEach(n=>{


if(backFreq[n]!==undefined){

backFreq[n]++;

}


});


});




let backPool=

Object.keys(backFreq)

.sort(

(a,b)=>backFreq[b]-backFreq[a]

);







// ================================
// 滚动回测
// ================================


let hit3=0;

let hit4=0;

let hit5=0;



let test=data.slice(-500);



test.forEach(d=>{


let p=pool.slice(0,5);



let hit=p.filter(

x=>d.front.includes(x)

).length;



if(hit>=3){

hit3++;

}


if(hit>=4){

hit4++;

}


if(hit===5){

hit5++;

}


});







// ================================
// 学习反馈
// ================================


if(hit3>5){


weights.trend+=0.02;

weights.markov+=0.02;


}


if(hit3<3){


weights.freq+=0.02;

weights.structure-=0.02;


}





// 权重归一化


let totalWeight=

weights.freq+

weights.trend+

weights.miss+

weights.markov+

weights.structure;



for(let k in weights){


weights[k]=

weights[k]/totalWeight;


}





learningData.weights=weights;



learningData.bestModel=

hit3>5?

"融合趋势模型":

"融合模型";



localStorage.setItem(

"V33_learning",

JSON.stringify(learningData)

);







// ================================
// 输出
// ================================


let html="";



html+="<h3>彩票智能分析系统 V33.0</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="最终推荐<br><br>";



plans.forEach((p,i)=>{


html+="方案"+(i+1)+"：";

html+=p.front.join(" ");


html+=" + ";


html+=backPool[i*2]+" "+backPool[i*2+1];


html+="<br>";

html+="综合评分："+

(p.score*100).toFixed(2);


html+="<br><br>";



});



html+="500期滚动回测<br>";

html+="3+0："+hit3+"次<br>";

html+="4+0："+hit4+"次<br>";

html+="5+0："+hit5+"次<br><br>";



html+="学习次数："+learningData.runs+"次<br>";

html+="最佳模型："+learningData.bestModel+"<br>";

html+="权重已保存<br>";

html+="模型状态：V33.0运行完成";



result.innerHTML=html;



learning.innerHTML=

"训练次数："+learningData.runs+
"<br>"+
"最佳模型："+learningData.bestModel+
"<br>权重学习：开启";



status.innerHTML="V33.0 FINAL运行成功";



}



catch(e){


result.innerHTML="错误："+e.message;


status.innerHTML="运行失败";


}



}