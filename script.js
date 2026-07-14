// ======================================
// 彩票智能分析系统 V34.3 修正版
// 预测学习分离
// Part 1
// ======================================


let plans=[];

let backPool=[];

let score={};

let modelData={};





async function startPrediction(){


const result=document.getElementById("result");

const status=document.getElementById("modelStatus");

const count=document.getElementById("dataCount");

const learning=document.getElementById("learningStatus");



result.innerHTML="正在计算 V34.3 固定预测...";



try{


const res=await fetch(

"data/dlt_raw.txt?v=3431"

);



if(!res.ok){

throw new Error("数据文件读取失败");

}



const text=await res.text();



let data=[];



text.split("\n").forEach(line=>{


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
// 固定模型参数
// ================================


let snapshot=localStorage.getItem(

"V34_model"

);



if(snapshot){


modelData=JSON.parse(snapshot);


}else{


modelData={


weights:{


freq:0.25,

trend:0.25,

structure:0.30,

balance:0.20


}


};



localStorage.setItem(

"V34_model",

JSON.stringify(modelData)

);


}







// ================================
// 统计
// ================================


let freq={};

let recent={};



for(let i=1;i<=35;i++){


let n=String(i).padStart(2,"0");


freq[n]=0;

recent[n]=0;


}





data.forEach(d=>{


d.front.forEach(n=>{


freq[n]++;


});


});





data.slice(-300).forEach(d=>{


d.front.forEach(n=>{


recent[n]++;


});


});







// ================================
// 固定评分
// ================================


score={};



for(let n in freq){



score[n]=


(freq[n]/data.length)

*

modelData.weights.freq



+

(recent[n]/300)

*

modelData.weights.trend;



}





let pool=

Object.keys(score)

.sort((a,b)=>{


if(score[b]===score[a]){


return parseInt(a)-parseInt(b);


}



return score[b]-score[a];


})

.slice(0,25);



// ===== Part 1结束 =====
// ======================================
// V34.3 修正版 Part 2
// 固定组合生成 + 输出
// ======================================



// ================================
// 组合评分
// ================================


function comboScore(arr){


let total=0;



arr.forEach(n=>{


total+=score[n];


});



// 奇偶平衡

let odd=arr.filter(

n=>parseInt(n)%2===1

).length;



if(odd===2||odd===3){

total+=0.2;

}







// 三区结构

let low=0;

let mid=0;

let high=0;



arr.forEach(n=>{


let x=parseInt(n);



if(x<=12){

low++;

}

else if(x<=24){

mid++;

}

else{

high++;

}


});



if(low>0&&mid>0&&high>0){

total+=0.3;

}





// 和值

let sum=arr.reduce(

(a,b)=>a+parseInt(b),

0

);



if(sum>=90&&sum<=150){

total+=0.3;

}




return total;


}







// ================================
// 生成候选组合
// ================================


let candidates=[];



for(let i=0;i<pool.length-4;i++){



for(let j=i+1;j<pool.length-3;j++){



for(let k=j+1;k<pool.length-2;k++){



for(let m=k+1;m<pool.length-1;m++){



for(let n=m+1;n<pool.length;n++){



let arr=[

pool[i],

pool[j],

pool[k],

pool[m],

pool[n]

];



arr.sort(

(a,b)=>parseInt(a)-parseInt(b)

);



candidates.push({


front:arr,

score:comboScore(arr)


});



}

}

}

}

}







// 固定排序

candidates.sort((a,b)=>{


if(b.score===a.score){


return a.front.join("")

.localeCompare(

b.front.join("")

);


}



return b.score-a.score;


});








// ================================
// 三方案差异化
// ================================


plans=[];



for(let c of candidates){



let duplicate=false;



for(let p of plans){



let same=c.front.filter(

x=>p.front.includes(x)

).length;



if(same>=4){

duplicate=true;

}



}



if(!duplicate){


plans.push(c);


}



if(plans.length===3){

break;

}


}








// ================================
// 后区统计
// ================================


let back={};



for(let i=1;i<=12;i++){


back[String(i).padStart(2,"0")]=0;


}



data.forEach(d=>{


d.back.forEach(n=>{


if(back[n]!==undefined){


back[n]++;

}


});


});






backPool=

Object.keys(back)

.sort((a,b)=>{


if(back[b]===back[a]){


return parseInt(a)-parseInt(b);

}


return back[b]-back[a];


});








// ================================
// 保存预测快照
// ================================


let prediction={


time:new Date().toLocaleString(),


plans:plans,


back:backPool


};





localStorage.setItem(

"V34_prediction",

JSON.stringify(prediction)

);







// ================================
// 输出
// ================================


let html="";



html+="<h3>彩票智能分析系统 V34.3</h3>";



html+="数据期数："+data.length+"期<br><br>";



html+="最终推荐<br><br>";





plans.forEach((p,i)=>{


html+="方案"+(i+1)+"：";


html+=p.front.join(" ");



html+=" + ";



html+=

backPool[i*2]

+" "

+

backPool[i*2+1];



html+="<br>";



html+="评分："

+

(p.score*100).toFixed(2);



html+="<br><br>";



});







html+="预测快照：已保存<br>";

html+="预测模式：固定模式<br>";

html+="等待开奖反馈";







result.innerHTML=html;



learning.innerHTML=

"预测记录：已保存<br>"+

"学习状态：等待开奖";





status.innerHTML=

"V34.3预测模块运行完成";




// ===== Part 2结束 =====
// ======================================
// V34.3 修正版 Part 3
// 开奖反馈训练
// ======================================



function feedbackTraining(){



const input=

document.getElementById(

"realResult"

).value.trim();



const learning=

document.getElementById(

"learningStatus"

);



const status=

document.getElementById(

"modelStatus"

);





if(!input){


alert("请输入开奖号码");


return;


}





let nums=input.match(/\d+/g);



if(!nums || nums.length<7){


alert("格式错误");

return;


}





let realFront=

nums.slice(0,5)

.map(n=>n.padStart(2,"0"));



let realBack=

nums.slice(5,7)

.map(n=>n.padStart(2,"0"));








let old=

localStorage.getItem(

"V34_prediction"

);





if(!old){


alert("没有预测记录，请先预测");


return;


}





let prediction=

JSON.parse(old);





let result=[];



prediction.plans.forEach((p,i)=>{


let hit=p.front.filter(

n=>realFront.includes(n)

).length;



let backHit=p.back?

p.back.filter(

n=>realBack.includes(n)

).length

:0;



result.push(

"方案"+

(i+1)+

" 前区命中："+

hit+

" 后区命中："+

backHit

);


});







// ================================
// 保存反馈记录
// ================================


let logs=

localStorage.getItem(

"V34_feedback"

);



let history=logs?

JSON.parse(logs):

[];





history.push({


time:new Date().toLocaleString(),


realFront:realFront,


realBack:realBack,


result:result


});





if(history.length>100){


history.shift();


}





localStorage.setItem(

"V34_feedback",

JSON.stringify(history)

);







learning.innerHTML=

"开奖反馈完成<br>"+

result.join("<br>")+

"<br>反馈次数："+history.length;






status.innerHTML=

"V34.3反馈训练完成";



}
