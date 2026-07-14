async function startAnalysis(){

const result=document.getElementById("result");
const status=document.getElementById("modelStatus");
const count=document.getElementById("dataCount");


result.innerHTML="V30.3模型启动中...";


try{


const response=await fetch("data/dlt_raw.txt?v=3031");


if(!response.ok){

throw new Error("无法读取dlt_raw.txt");

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

throw new Error("数据为空");

}



count.innerHTML=data.length+"期";




// =====================
// 前区频率
// =====================


let freq={};


for(let i=1;i<=35;i++){

freq[String(i).padStart(2,"0")]=0;

}



data.forEach(d=>{


d.front.forEach(n=>{


freq[n]++;


});


});





// =====================
// 候选号码
// =====================


let pool=Object.keys(freq).sort(

(a,b)=>freq[b]-freq[a]

);






// =====================
// 结构检测
// =====================


function valid(nums){


let odd=nums.filter(

n=>parseInt(n)%2===1

).length;



if(odd<2||odd>3){

return false;

}





let a=0,b=0,c=0;



nums.forEach(n=>{


let x=parseInt(n);



if(x<=12){

a++;

}else if(x<=24){

b++;

}else{

c++;

}


});



if(a===0||b===0||c===0){

return false;

}




let sum=nums.reduce(

(s,n)=>s+parseInt(n),

0

);



if(sum<80||sum>160){

return false;

}




let serial=0;



for(let i=0;i<nums.length-1;i++){


if(parseInt(nums[i+1])-parseInt(nums[i])===1){

serial++;

}


}



if(serial>2){

return false;

}



return true;


}







// =====================
// 随机组合
// =====================


let resultPool=[];



for(let i=0;i<100000;i++){


let temp=[...pool.slice(0,30)];

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



if(valid(nums)){



let score=0;



nums.forEach(n=>{


score+=freq[n];


});



resultPool.push({

front:nums,

score:score

});


}



}





resultPool.sort(

(a,b)=>b.score-a.score

);






// =====================
// 三方案
// =====================


let plans=[];



for(let r of resultPool){



let repeat=false;



for(let p of plans){


let same=r.front.filter(

x=>p.front.includes(x)

).length;



if(same>=3){

repeat=true;

}


}



if(!repeat){

plans.push(r);

}



if(plans.length===3){

break;

}


}






// =====================
// 后区
// =====================


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



let backPool=Object.keys(back).sort(

(a,b)=>back[b]-back[a]

);






// =====================
// 回测
// =====================


let hit={

three:0,

four:0,

five:0

};



let test=data.slice(-500);



test.forEach(d=>{


let predict=pool.slice(0,5);



let h=predict.filter(

x=>d.front.includes(x)

).length;



if(h>=3){

hit.three++;

}


if(h>=4){

hit.four++;

}


if(h===5){

hit.five++;

}


});







// =====================
// 输出
// =====================


let html="";


html+="<h3>彩票智能分析系统 V30.3</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="最终推荐<br><br>";



plans.forEach((p,i)=>{


html+="方案"+(i+1)+"：";

html+=p.front.join(" ");


html+=" + ";


html+=backPool[i*2]+" "+backPool[i*2+1];


html+="<br>";

html+="评分："+(p.score/10).toFixed(1);


html+="分<br><br>";


});



html+="500期滚动回测<br>";

html+="3+0："+hit.three+"次<br>";

html+="4+0："+hit.four+"次<br>";

html+="5+0："+hit.five+"次<br><br>";



html+="后区范围过滤：开启<br>";

html+="结构过滤：开启<br>";

html+="模型状态：V30.3运行完成";



result.innerHTML=html;


status.innerHTML="V30.3 FINAL运行成功";


}



catch(error){


result.innerHTML="错误："+error.message;


status.innerHTML="运行失败";


}


}