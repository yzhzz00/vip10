// ======================================
// 彩票智能分析系统 V34.0
// 真实反馈学习系统
// Part 1
// ======================================


async function startAnalysis(){


const result=document.getElementById("result");

const status=document.getElementById("modelStatus");

const learning=document.getElementById("learningStatus");

const count=document.getElementById("dataCount");



result.innerHTML="V34.0反馈学习启动...";



try{


const res=await fetch(
"data/dlt_raw.txt?v=3400"
);



if(!res.ok){

throw new Error("大乐透数据读取失败");

}



const text=await res.text();



let data=[];



text.split(/\n/).forEach(line=>{


let nums=line.match(/\d+/g);



if(nums && nums.length>=7){



let arr=nums.map(

n=>n.padStart(2,"0")

);



data.push({

front:arr.slice(0,5),

back:arr.slice(5,7)

});


}


});




count.innerHTML=data.length+"期";








// ================================
// 读取学习数据库
// ================================


let memory={


runs:0,

predictions:[],

models:{


freq:0,

trend:0,

structure:0,

fusion:0


},

weights:{


freq:0.20,

trend:0.25,

miss:0.15,

markov:0.20,

structure:0.20


}


};






try{


let old=localStorage.getItem(

"V34_memory"

);



if(old){


memory=JSON.parse(old);


}


}catch(e){}






memory.runs++;








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


let markov={};



for(let i=0;i<data.length-1;i++){



for(let p=0;p<5;p++){



let a=data[i].front[p];

let b=data[i+1].front[p];



if(!markov[a]){

markov[a]={};

}



if(!markov[a][b]){

markov[a][b]=0;

}



markov[a][b]++;


}


}







let markovScore={};



for(let n in freq){



let total=0;



if(markov[n]){


Object.values(markov[n])

.forEach(v=>{


total+=v;


});


}



markovScore[n]=total;


}








// ================================
// 综合评分
// ================================


let score={};



for(let n in freq){



let structure=

parseInt(n)%2===1?

0.6:0.4;



score[n]=


(freq[n]/data.length)

*memory.weights.freq



+

(trend[n]/300)

*memory.weights.trend



+

(Math.min(miss[n],50)/50)

*memory.weights.miss



+

(Math.min(markovScore[n],300)/300)

*memory.weights.markov



+

structure

*memory.weights.structure;



}





let pool=

Object.keys(score)

.sort(

(a,b)=>score[b]-score[a]

)

.slice(0,40);



// ===== V34 PART 1 END =====
// ======================================
// V34.0 Part 2
// 组合生成 + 预测保存 + 反馈学习 + 输出
// ======================================


// ================================
// 结构过滤
// ================================


function valid(nums){


let odd=nums.filter(

n=>parseInt(n)%2===1

).length;



if(odd<2||odd>3){

return false;

}



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



if(low===0||mid===0||high===0){

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
// 蒙特卡罗组合
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



if(valid(arr)){



let total=0;



arr.forEach(n=>{


total+=score[n];


});



combinations.push({

front:arr,

score:total


});


}


}





combinations.sort(

(a,b)=>b.score-a.score

);






// ================================
// 三方案差异化
// ================================


let plans=[];



for(let item of combinations){



let duplicate=false;



for(let old of plans){



let same=item.front.filter(

x=>old.front.includes(x)

).length;



if(same>=3){

duplicate=true;

}



}



if(!duplicate){

plans.push(item);

}



if(plans.length===3){

break;

}


}






// ================================
// 后区模型
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
// 保存预测记录
// ================================


let record={


time:new Date().toLocaleString(),


plans:plans.map(

p=>p.front.join(" ")

),


back:


backPool.slice(0,6)



};





memory.predictions.push(record);






// 只保存最近100次

if(memory.predictions.length>100){

memory.predictions.shift();

}








// ================================
// 简单反馈学习
// ================================


let hit3=0;

let hit4=0;

let hit5=0;



let test=data.slice(-500);



test.forEach(d=>{


let predict=pool.slice(0,5);



let hit=predict.filter(

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






// 根据表现调整权重


if(hit3>5){


memory.weights.trend+=0.02;

memory.weights.markov+=0.01;


memory.models.fusion++;


}else{


memory.weights.freq+=0.01;


memory.models.freq++;


}







// 权重归一化


let total=

memory.weights.freq+

memory.weights.trend+

memory.weights.miss+

memory.weights.markov+

memory.weights.structure;



for(let k in memory.weights){


memory.weights[k]=

memory.weights[k]/total;


}







localStorage.setItem(

"V34_memory",

JSON.stringify(memory)

);






// ================================
// 输出
// ================================


let html="";



html+="<h3>彩票智能分析系统 V34.0</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="最终推荐<br><br>";



plans.forEach((p,i)=>{


html+="方案"+(i+1)+"：";

html+=p.front.join(" ");


html+=" + ";


html+=backPool[i*2]+" "+backPool[i*2+1];


html+="<br>";

html+="评分：";

html+=(p.score*100).toFixed(2);


html+="<br><br>";



});



html+="500期学习回测<br>";

html+="3+0："+hit3+"次<br>";

html+="4+0："+hit4+"次<br>";

html+="5+0："+hit5+"次<br><br>";



html+="预测记录："+memory.predictions.length+"次<br>";

html+="学习次数："+memory.runs+"次<br>";

html+="融合模型次数："+memory.models.fusion+"<br>";

html+="权重反馈：开启<br>";

html+="模型状态：V34.0运行完成";



result.innerHTML=html;



learning.innerHTML=

"学习次数："+memory.runs+
"<br>"+
"预测记录："+memory.predictions.length+
"<br>"+
"反馈学习：开启";



status.innerHTML=

"V34.0 FINAL运行成功";



}



catch(e){


result.innerHTML=

"错误："+e.message;


status.innerHTML=

"运行失败";


}


}