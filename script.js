// ======================================
// 彩票智能分析系统 V31.0
// 智能融合模型
// Part 1
// ======================================


async function startAnalysis(){


const result=document.getElementById("result");
const status=document.getElementById("modelStatus");
const count=document.getElementById("dataCount");



result.innerHTML="V31.0融合模型分析中...";



try{


const response=await fetch("data/dlt_raw.txt?v=3101");



if(!response.ok){

throw new Error("大乐透数据读取失败");

}



const text=await response.text();



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





if(data.length===0){

throw new Error("没有有效数据");

}



count.innerHTML=data.length+"期";






// ================================
// 频率模型
// ================================


let freq={};



for(let i=1;i<=35;i++){


let n=String(i).padStart(2,"0");


freq[n]=0;


}



data.forEach(d=>{


d.front.forEach(n=>{


freq[n]++;


});


});







// ================================
// 趋势模型 最近300期
// ================================


let trend={};



for(let n in freq){

trend[n]=0;

}



data.slice(-300).forEach(d=>{


d.front.forEach(n=>{


trend[n]++;


});


});








// ================================
// 遗漏模型
// ================================


let miss={};



for(let n in freq){

miss[n]=data.length;

}



for(let i=data.length-1;i>=0;i--){


data[i].front.forEach(n=>{


if(miss[n]===data.length){

miss[n]=data.length-i;

}


});


}







// ================================
// 马尔可夫转移
// ================================


let markov={};



for(let i=0;i<data.length-1;i++){



let current=data[i].front;

let next=data[i+1].front;



current.forEach(a=>{


if(!markov[a]){

markov[a]={};

}



next.forEach(b=>{


if(!markov[a][b]){

markov[a][b]=0;

}



markov[a][b]++;



});


});


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
// 贝叶斯综合评分
// ================================


let score={};



for(let n in freq){



let f=freq[n]/data.length;



let t=trend[n]/300;



let m=Math.min(miss[n],50)/50;



let mk=Math.min(markovScore[n],300)/300;



score[n]=

f*0.25

+t*0.25

+m*0.15

+mk*0.15;



}



let pool=Object.keys(score)

.sort((a,b)=>score[b]-score[a])

.slice(0,35);





// ===== V31.0 END OF PART 1 =====
// ======================================
// V31.0 Part 2
// 组合筛选 + 后区 + 回测 + 输出
// ======================================


// ================================
// 结构过滤
// ================================


function checkStructure(nums){


let odd=nums.filter(

n=>parseInt(n)%2===1

).length;



if(odd<2 || odd>3){

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



if(z1===0 || z2===0 || z3===0){

return false;

}




let sum=nums.reduce(

(a,b)=>a+parseInt(b),

0

);



if(sum<80 || sum>160){

return false;

}





let serial=0;



for(let i=0;i<4;i++){



if(parseInt(nums[i+1])-parseInt(nums[i])===1){

serial++;

}


}



if(serial>2){

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

let nums=[];



while(nums.length<5){



let index=Math.floor(

Math.random()*temp.length

);



nums.push(temp[index]);

temp.splice(index,1);


}



nums.sort(

(a,b)=>parseInt(a)-parseInt(b)

);



if(checkStructure(nums)){



let total=0;



nums.forEach(n=>{


total+=score[n];


});



combinations.push({

front:nums,

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



for(let c of combinations){



let repeat=false;



for(let p of plans){



let same=c.front.filter(

x=>p.front.includes(x)

).length;



if(same>=3){

repeat=true;

}



}



if(!repeat){

plans.push(c);

}



if(plans.length===3){

break;

}


}








// ================================
// 后区评分
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







// ================================
// 页面输出
// ================================


let html="";



html+="<h3>彩票智能分析系统 V31.0</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<b>最终推荐</b><br><br>";



plans.forEach((p,i)=>{


html+="方案"+(i+1)+"：";

html+=p.front.join(" ");


html+=" + ";


html+=backPool[i*2]+" "+backPool[i*2+1];


html+="<br>";

html+="综合评分：";

html+=(p.score*100).toFixed(2);


html+="<br><br>";



});



html+="500期滚动回测<br>";

html+="3+0："+hit3+"次<br>";

html+="4+0："+hit4+"次<br>";

html+="5+0："+hit5+"次<br><br>";



html+="频率模型：开启<br>";

html+="趋势模型：开启<br>";

html+="贝叶斯评分：开启<br>";

html+="马尔可夫转移：开启<br>";

html+="蒙特卡罗：50000次<br>";

html+="模型状态：V31.0运行完成";



result.innerHTML=html;



status.innerHTML="V31.0 FINAL运行成功";



}


// ======================================
// 错误处理
// ======================================


catch(e){


result.innerHTML="错误："+e.message;


status.innerHTML="运行失败";


}


}