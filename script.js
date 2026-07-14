// ======================================
// 彩票智能分析系统 V34.3
// 预测 / 学习分离版
// Part 1 固定预测引擎
// ======================================



let currentModel={};





async function startPrediction(){


const result=document.getElementById("result");

const status=document.getElementById("modelStatus");

const count=document.getElementById("dataCount");



result.innerHTML="V34.3固定预测计算中...";



try{


const res=await fetch(

"data/dlt_raw.txt?v=3430"

);



if(!res.ok){

throw new Error("数据读取失败");

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
// 读取固定模型快照
// ================================


let snapshot=localStorage.getItem(

"V34_snapshot"

);





if(snapshot){


currentModel=JSON.parse(snapshot);


}

else{



currentModel={


weights:{


freq:0.20,

trend:0.20,

miss:0.20,

structure:0.20,

markov:0.20


},


created:new Date().toLocaleString()


};



localStorage.setItem(

"V34_snapshot",

JSON.stringify(currentModel)

);


}








// ================================
// 统计号码
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


let score={};



for(let n in freq){


score[n]=


(freq[n]/data.length)

*currentModel.weights.freq



+

(recent[n]/300)

*currentModel.weights.trend;



}





let pool=

Object.keys(score)

.sort((a,b)=>{


if(score[b]===score[a]){


return parseInt(a)-parseInt(b);


}


return score[b]-score[a];


})

.slice(0,20);







// ===== V34.3 PART 1 END =====
// ======================================
// V34.3 Part 2
// 固定组合生成 + 快照保存
// ======================================



// ================================
// 组合评分
// ================================


function calcCombo(arr){


let total=0;



arr.forEach(n=>{


total+=score[n];


});



// 结构奖励

let odd=arr.filter(

n=>parseInt(n)%2===1

).length;



if(odd===2||odd===3){

total+=0.2;

}



// 和值控制

let sum=arr.reduce(

(a,b)=>a+parseInt(b),

0

);



if(sum>=90&&sum<=150){

total+=0.3;

}



// 跨度

let span=

parseInt(arr[4])

-

parseInt(arr[0]);



if(span>=18){

total+=0.2;

}



return total;


}







// ================================
// 确定性组合
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

score:calcCombo(arr)


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
// 三方案
// ================================


let plans=[];



for(let c of candidates){



let same=false;



for(let p of plans){


let overlap=c.front.filter(

x=>p.front.includes(x)

).length;



if(overlap>=3){

same=true;

}



}




if(!same){


plans.push(c);


}




if(plans.length===3){

break;

}



}







// ================================
// 后区固定排序
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






let backPool=

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


let snapshot={


time:new Date().toLocaleString(),


plans:plans,


weights:currentModel.weights


};




localStorage.setItem(

"V34_prediction",

JSON.stringify(snapshot)

);






// ===== V34.3 PART 2 END =====
// ======================================
// V34.3 Part 3
// 输出 + 开奖反馈训练
// ======================================




// ================================
// 输出预测
// ================================


function showPrediction(){



let html="";



html+="<h3>彩票智能分析系统 V34.3</h3>";



html+="预测模式：确定性模式<br>";

html+="随机扰动：关闭<br><br>";



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







html+="模型快照：已保存<br>";

html+="预测结果固定<br>";

html+="等待开奖反馈";


result.innerHTML=html;







document.getElementById("learningStatus").innerHTML=


"预测记录：已保存<br>"+

"学习状态：等待开奖反馈";






document.getElementById("modelStatus").innerHTML=


"V34.3预测模块运行完成";



}







// 自动显示预测

showPrediction();







// ================================
// 开奖反馈训练
// ================================


function feedbackTraining(){



let input=

document.getElementById(

"realResult"

).value.trim();



if(!input){


alert("请输入开奖号码");


return;


}





let nums=input.match(/\d+/g);



if(!nums || nums.length<7){


alert("格式错误，例如：03 08 17 26 33 + 07 10");


return;


}





let realFront=nums.slice(0,5)

.map(n=>n.padStart(2,"0"));



let realBack=nums.slice(5,7)

.map(n=>n.padStart(2,"0"));







let old=

localStorage.getItem(

"V34_prediction"

);



if(!old){


alert("没有预测记录");


return;


}



let prediction=JSON.parse(old);





let hitResult=[];



prediction.plans.forEach((p,i)=>{


let hit=p.front.filter(

n=>realFront.includes(n)

).length;



hitResult.push(

"方案"+(i+1)+"命中前区："+hit+"个"

);


});







// ================================
// 简单反馈记录
// ================================


let feedback={


time:new Date().toLocaleString(),


realFront:realFront,


realBack:realBack,


result:hitResult


};





let logs=localStorage.getItem(

"V34_feedback"

);



let arr=logs?

JSON.parse(logs):

[];




arr.push(feedback);



if(arr.length>100){

arr.shift();

}



localStorage.setItem(

"V34_feedback",

JSON.stringify(arr)

);








document.getElementById("learningStatus").innerHTML=


"开奖反馈完成<br>"+

hitResult.join("<br>")+

"<br>反馈记录："+arr.length+"次";





document.getElementById("modelStatus").innerHTML=


"V34.3反馈训练完成";



}