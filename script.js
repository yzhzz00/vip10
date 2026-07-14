async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V24.0深度评分模型...";


try{


const res=await fetch("data/dlt_raw.txt?v=2400");

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

throw new Error("历史数据读取失败");

}





// =====================
// 统计模型
// =====================


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





// =====================
// 前区评分
// =====================


let freq=countFront(data);


let recent=countFront(

data.slice(0,100)

);



let frontScore={};



for(let n in freq){


frontScore[n]={


freq:

freq[n]*0.35,


trend:

recent[n]*0.25,


structure:

0,


markov:

0,


miss:

0


};



// 奇偶结构奖励

if(parseInt(n)%2===1){

frontScore[n].structure+=5;

}



// 马尔可夫简单趋势

if(freq[n]>300){

frontScore[n].markov+=5;

}



// 遗漏评分

frontScore[n].miss=

100/(freq[n]+1);



}





// 综合

for(let n in frontScore){


let s=frontScore[n];


s.total=

s.freq+

s.trend+

s.structure+

s.markov+

s.miss;


}
// =====================
// 组合评分
// =====================


function comboScore(nums){


let detail={

freq:0,

trend:0,

structure:0,

markov:0,

miss:0

};



nums.forEach(n=>{


let s=frontScore[n];


detail.freq+=s.freq;

detail.trend+=s.trend;

detail.structure+=s.structure;

detail.markov+=s.markov;

detail.miss+=s.miss;


});



// 奇偶过滤

let odd=nums.filter(

n=>parseInt(n)%2===1

).length;



if(odd>=2&&odd<=3){

detail.structure+=20;

}



// 三区

let a=0,b=0,c=0;


nums.forEach(n=>{


let x=parseInt(n);


if(x<=12)a++;

else if(x<=24)b++;

else c++;


});



if(a>0&&b>0&&c>0){

detail.structure+=20;

}




let total=

detail.freq+

detail.trend+

detail.structure+

detail.markov+

detail.miss;



return {

detail:detail,

total:total

};


}




// =====================
// 生成组合
// =====================


let pool=

Object.keys(frontScore)

.sort(

(a,b)=>

frontScore[b].total-

frontScore[a].total

)

.slice(0,25);





let list=[];



for(let i=0;i<pool.length;i++){

for(let j=i+1;j<pool.length;j++){

for(let k=j+1;k<pool.length;k++){

for(let m=k+1;m<pool.length;m++){

for(let n=m+1;n<pool.length;n++){



let nums=[

pool[i],

pool[j],

pool[k],

pool[m],

pool[n]

].sort();



let result=comboScore(nums);



list.push({

nums:nums,

score:result.total,

detail:result.detail

});


}

}

}

}

}



list.sort(

(a,b)=>b.score-a.score

);




// =====================
// 三方案差异化
// =====================


let plans=[];



for(let item of list){


let same=false;


for(let p of plans){


let common=item.nums.filter(

n=>p.front.includes(n)

).length;



if(common>2){

same=true;

}


}



if(!same){


plans.push({

front:item.nums,

detail:item.detail,

score:item.score

});


}



if(plans.length===3){

break;

}


}




// =====================
// 后区模型
// =====================


let backs=countBack(data);



let backPool=

Object.keys(backs)

.sort(

(a,b)=>backs[b]-backs[a]

)

.slice(0,8);



plans.forEach((p,i)=>{


p.back=

backPool.slice(i,i+2);


});





// =====================
// 输出
// =====================


let html="";


html+="<h3>V24.0深度评分模型</h3>";

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

+"<br>";



html+="马尔可夫："

+p.detail.markov.toFixed(1)

+" 遗漏："

+p.detail.miss.toFixed(1)

+"<br><br>";



});



html+="模型状态：深度评分完成<br>";

html+="三方案差异化：开启";



result.innerHTML=html;



}catch(e){


result.innerHTML=

"运行失败："+e.message;


}


}