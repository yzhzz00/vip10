async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V25.0融合智能模型...";


try{


const res=await fetch("data/dlt_raw.txt?v=2500");

const text=await res.text();



let data=[];



text.split("\n").forEach(line=>{


let nums=line.match(/\b\d{2}\b/g);



if(nums&&nums.length>=7){


let a=nums.slice(-7);


data.push({

front:a.slice(0,5),

back:a.slice(5,7)

});


}

});



if(data.length===0){

throw new Error("数据读取失败");

}




// =======================
// 模型权重
// =======================


let weight=JSON.parse(

localStorage.getItem("v25_weight")

||

JSON.stringify({

freq:0.25,

trend:0.15,

bayes:0.15,

markov:0.20,

miss:0.10,

structure:0.15

})

);






// =======================
// 频率统计
// =======================


function countFront(arr){


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





// =======================
// 后区统计
// =======================


function countBack(arr){


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






// =======================
// 时间衰减趋势
// =======================


function trendScore(arr){


let score={};



for(let i=1;i<=35;i++){

score[String(i).padStart(2,"0")]=0;

}



arr.forEach((d,index)=>{


let w=1/(index+1);



d.front.forEach(n=>{


score[n]+=w;


});


});



return score;

}






// =======================
// 遗漏周期
// =======================


function missScore(arr){


let score={};



for(let i=1;i<=35;i++){

score[String(i).padStart(2,"0")]=1;

}



for(let i=0;i<arr.length;i++){


arr[i].front.forEach(n=>{


if(score[n]===1){

score[n]=i+1;

}


});


}



return score;

}




// =======================
// 马尔可夫矩阵
// =======================


function markovMatrix(arr){


let matrix={};



for(let i=1;i<=35;i++){


let a=String(i).padStart(2,"0");

matrix[a]={};



for(let j=1;j<=35;j++){

matrix[a][String(j).padStart(2,"0")]=0;

}


}




for(let i=0;i<arr.length-1;i++){



arr[i].front.forEach(a=>{


arr[i+1].front.forEach(b=>{


matrix[a][b]++;


});


});


}



return matrix;

}
// =======================
// 综合评分
// =======================


let freq=countFront(data);

let trend=trendScore(data);

let miss=missScore(data);

let markov=markovMatrix(data);



let score={};



for(let n in freq){


let mark=0;



for(let k in markov[n]){

mark+=markov[n][k];

}




score[n]=

freq[n]*weight.freq

+

trend[n]*weight.trend

+

(1/(miss[n]+1))*100*weight.miss

+

mark*weight.markov

+

(freq[n]/2895)*100*weight.bayes;



}





// =======================
// 组合评分
// =======================


function comboEvaluate(nums){


let detail={

freq:0,

trend:0,

bayes:0,

markov:0,

miss:0,

structure:0

};



nums.forEach(n=>{


detail.freq+=freq[n]*weight.freq;

detail.trend+=trend[n]*weight.trend;

detail.miss+=(1/(miss[n]+1))*100*weight.miss;

detail.bayes+=(freq[n]/2895)*100*weight.bayes;


});




// 奇偶

let odd=nums.filter(

n=>parseInt(n)%2===1

).length;



if(odd>=2&&odd<=3){

detail.structure+=20;

}




// 三区

let low=0,mid=0,high=0;


nums.forEach(n=>{


let x=parseInt(n);


if(x<=12)low++;

else if(x<=24)mid++;

else high++;


});



if(low>0&&mid>0&&high>0){

detail.structure+=20;

}



let total=

detail.freq+

detail.trend+

detail.miss+

detail.bayes+

detail.structure;



return {

total:total,

detail:detail

};


}





// =======================
// 蒙特卡罗筛选
// =======================


let pool=

Object.keys(score)

.sort((a,b)=>score[b]-score[a])

.slice(0,22);



let results=[];



for(let i=0;i<30000;i++){



let temp=[...pool];


let nums=[];



while(nums.length<5){


let index=Math.floor(Math.random()*temp.length);


nums.push(temp[index]);


temp.splice(index,1);


}



nums.sort();



let ev=comboEvaluate(nums);



results.push({

front:nums,

score:ev.total,

detail:ev.detail

});


}



results.sort(

(a,b)=>b.score-a.score

);





// =======================
// 差异化方案
// =======================


let plans=[];



for(let r of results){


let same=false;



for(let p of plans){


let common=r.front.filter(

x=>p.front.includes(x)

).length;



if(common>=3){

same=true;

}


}



if(!same){


plans.push(r);


}



if(plans.length===3){

break;

}


}






// 后区评分


let backs=countBack(data);



let backPool=

Object.keys(backs)

.sort((a,b)=>backs[b]-backs[a])

.slice(0,8);





plans.forEach((p,i)=>{


p.back=

backPool.slice(i,i+2);


});







// =======================
// 输出
// =======================


let html="";



html+="<h3>V25.0融合智能模型</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>最终推荐</h3>";




plans.forEach((p,i)=>{


html+="方案"+(i+1)+"："

+p.front.join(" ")

+" + "

+p.back.join(" ")

+"<br>";



html+="综合评分："

+(p.score/10).toFixed(1)

+"分<br>";



html+="频率："

+p.detail.freq.toFixed(1)

+" 趋势："

+p.detail.trend.toFixed(1)

+" 结构："

+p.detail.structure.toFixed(1)

+"<br><br>";



});



html+="模型状态：融合评分完成<br>";

html+="蒙特卡罗筛选：30000次";


result.innerHTML=html;



}catch(e){


result.innerHTML=

"运行失败："+e.message;


}


}