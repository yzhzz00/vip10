async function startAnalysis(){

const result=document.getElementById("result");

result.innerHTML="正在运行V10.4蒙特卡罗模拟...";


try{


const response=await fetch("data/dlt_raw.txt?v=104");

const text=await response.text();


const lines=text.split("\n");

let data=[];


lines.forEach(line=>{


let nums=line.match(/\b\d{2}\b/g);


if(nums && nums.length>=7){

let arr=nums.slice(-7);

data.push({

front:arr.slice(0,5),
back:arr.slice(5,7)

});

}

});


// 统计频率

let count={};

for(let i=1;i<=35;i++){

let n=i.toString().padStart(2,"0");

count[n]=0;

}


data.forEach(item=>{

item.front.forEach(n=>{

count[n]++;

});

});



// 评分

let score={};


for(let n in count){

score[n]=count[n];

}



// 取前20候选池

let pool=Object.entries(score)

.sort((a,b)=>b[1]-a[1])

.slice(0,20)

.map(x=>x[0]);





// 随机组合

let results=[];


function randomPick(arr,num){

let temp=[...arr];

let out=[];


while(out.length<num){

let index=Math.floor(Math.random()*temp.length);

out.push(temp[index]);

temp.splice(index,1);

}


return out.sort((a,b)=>a-b);

}




for(let i=0;i<100000;i++){


let nums=randomPick(pool,5);



let sum=nums.reduce(

(a,b)=>a+Number(b),0

);



// 和值过滤

if(sum<70 || sum>115){

continue;

}



// 奇偶

let odd=nums.filter(n=>Number(n)%2).length;


if(odd<2 || odd>3){

continue;

}



// 三区

let z1=0,z2=0,z3=0;


nums.forEach(n=>{

let x=Number(n);


if(x<=12)z1++;

else if(x<=24)z2++;

else z3++;

});


if(z1==0||z2==0||z3==0){

continue;

}



// 保存

results.push({

nums:nums,

score:sum

});


}





let unique={};


results.forEach(r=>{

unique[r.nums.join("-")]=r;

});



let final=Object.values(unique)

.slice(0,3);



let html="";


html+="<h3>V10.4蒙特卡罗模拟结果</h3>";

html+="模拟次数：100000次<br>";

html+="有效组合："+final.length+"组<br><br>";



final.forEach((r,i)=>{


html+=

`第${i+1}注：${r.nums.join(" ")}<br>`;



});



result.innerHTML=html;



}


catch(e){

result.innerHTML="模拟失败："+e.message;

}


}