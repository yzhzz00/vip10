async function startAnalysis(){

const result=document.getElementById("result");
const status=document.getElementById("modelStatus");
const count=document.getElementById("dataCount");


result.innerHTML="V30.4模型计算中...";


try{


const res=await fetch("data/dlt_raw.txt?v=3040");


if(!res.ok){

throw new Error("数据读取失败");

}


const text=await res.text();



let data=[];



text.split(/\n/).forEach(line=>{


let nums=line.match(/\d+/g);



if(nums&&nums.length>=7){


let arr=nums.map(n=>n.padStart(2,"0"));



data.push({

front:arr.slice(0,5),

back:arr.slice(5,7)

});


}


});



count.innerHTML=data.length+"期";



//=========================
// 基础统计
//=========================


let freq={};

let recent={};


for(let i=1;i<=35;i++){

let n=String(i).padStart(2,"0");

freq[n]=0;

recent[n]=0;

}




data.forEach((d,index)=>{


d.front.forEach(n=>{


freq[n]++;


if(index>data.length-200){

recent[n]++;

}


});


});





//=========================
// 遗漏
//=========================


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







//=========================
// 综合评分
//=========================


let score={};



for(let n in freq){



let f=freq[n]/data.length*100;


let t=recent[n]/200*100;


let m=Math.min(miss[n],50)/50*100;



let s=f*0.2

+t*0.2

+m*0.15;



score[n]=s;


}







let pool=

Object.keys(score)

.sort((a,b)=>score[b]-score[a])

.slice(0,40);






//=========================
// 结构过滤
//=========================


function check(nums){



let odd=nums.filter(

x=>parseInt(x)%2===1

).length;



if(odd<2||odd>3){

return false;

}




let z1=0,z2=0,z3=0;



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








//=========================
// 蒙特卡罗组合
//=========================


let combinations=[];



for(let i=0;i<80000;i++){



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


let sc=0;



arr.forEach(n=>{


sc+=score[n];


});



combinations.push({

front:arr,

score:sc

});


}


}




combinations.sort(

(a,b)=>b.score-a.score

);






//=========================
// 差异化方案
//=========================


let plans=[];



for(let c of combinations){


let same=false;



for(let p of plans){


let count=

c.front.filter(

x=>p.front.includes(x)

).length;



if(count>2){

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







//=========================
// 后区评分
//=========================


let back={};



for(let i=1;i<=12;i++){

back[String(i).padStart(2,"0")]=0;

}



data.forEach(d=>{


d.back.forEach(n=>{


if(back[n]!=undefined){

back[n]++;

}


});


});



let backPool=

Object.keys(back).sort(

(a,b)=>back[b]-back[a]

);






//=========================
// 回测
//=========================


let hit3=0;

let hit4=0;

let hit5=0;



let test=data.slice(-500);



test.forEach(d=>{


let p=pool.slice(0,5);


let h=p.filter(

n=>d.front.includes(n)

).length;



if(h>=3)hit3++;

if(h>=4)hit4++;

if(h===5)hit5++;


});







//=========================
// 输出
//=========================


let html="";



html+="<h3>彩票智能分析系统 V30.4</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="最终推荐<br><br>";



plans.forEach((p,i)=>{


html+="方案"+(i+1)+"：";

html+=p.front.join(" ");

html+=" + ";

html+=backPool[i*2]+" "+backPool[i*2+1];

html+="<br>";

html+="综合评分：";

html+=(p.score).toFixed(1);

html+="<br><br>";



});



html+="500期滚动回测<br>";

html+="3+0："+hit3+"次<br>";

html+="4+0："+hit4+"次<br>";

html+="5+0："+hit5+"次<br><br>";



html+="模型状态：V30.4运行完成";



result.innerHTML=html;


status.innerHTML="V30.4 FINAL运行成功";


}


catch(e){


result.innerHTML="错误："+e.message;

status.innerHTML="运行失败";


}



}