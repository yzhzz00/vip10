async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行 V20.0模型...";


try{


const response=await fetch("data/dlt_raw.txt?v=2002");

const text=await response.text();


let data=[];


text.split("\n").forEach(line=>{


let nums=line.match(/\b\d{2}\b/g);


if(nums && nums.length>=7){


let a=nums.slice(-7);


data.push({

front:a.slice(0,5),

back:a.slice(5,7)

});


}


});



if(data.length===0){

throw new Error("没有读取到大乐透数据");

}



// 前区统计

let front={};


for(let i=1;i<=35;i++){

let n=i.toString().padStart(2,"0");

front[n]=0;

}



data.forEach(d=>{


d.front.forEach(n=>{

front[n]++;

});


});



// 后区统计

let back={};


for(let i=1;i<=12;i++){

let n=i.toString().padStart(2,"0");

back[n]=0;

}



data.forEach(d=>{


d.back.forEach(n=>{

back[n]++;

});


});





// 排序


let frontPool=

Object.entries(front)

.sort((a,b)=>b[1]-a[1])

.slice(0,20)

.map(x=>x[0]);



let backPool=

Object.entries(back)

.sort((a,b)=>b[1]-a[1])

.slice(0,8)

.map(x=>x[0]);






function randomPick(arr,num){


let copy=[...arr];

let out=[];


while(out.length<num){


let index=Math.floor(Math.random()*copy.length);


out.push(copy[index]);


copy.splice(index,1);


}


return out.sort();


}





let plans=[];


for(let i=0;i<3;i++){


plans.push({

front:randomPick(frontPool,5),

back:randomPick(backPool,2)

});


}






// 简单回测


let hit3=0;

let hit4=0;


data.slice(-500).forEach(old=>{


plans.forEach(p=>{


let hit=

p.front.filter(n=>old.front.includes(n)).length;



if(hit>=3){

hit3++;

}


if(hit>=4){

hit4++;

}


});


});






let html="";


html+="<h3>V20.0综合智能模型</h3>";

html+="数据期数："+data.length+"期<br><br>";



html+="<h3>最终推荐</h3>";



plans.forEach((p,i)=>{


html+=

"方案"+(i+1)+"："+

p.front.join(" ")

+" + "

+p.back.join(" ")

+"<br>";

});



html+="<br><h3>500期回测</h3>";

html+="3个以上前区："+hit3+"次<br>";

html+="4个以上前区："+hit4+"次<br>";



html+="<br>模型状态：运行成功";



result.innerHTML=html;



}

catch(e){


result.innerHTML=

"运行失败："+e.message;


}


}