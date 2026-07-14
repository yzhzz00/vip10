document.getElementById("analyzeBtn").onclick = async function(){

let result = document.getElementById("result");

result.innerHTML = "正在清洗大乐透数据...";


try{


let response = await fetch("data/dlt_raw.txt");

let text = await response.text();


let lines = text.split("\n");


let data=[];


lines.forEach(line=>{


let nums=line.match(/\b\d{2}\b/g);


if(!nums) return;


// 只处理包含7个号码的开奖行

if(nums.length>=7){


let arr=nums.slice(-7);


let front=arr.slice(0,5);

let back=arr.slice(5,7);


// 验证号码范围

let valid=true;


front.forEach(n=>{

let x=parseInt(n);

if(x<1||x>35) valid=false;

});


back.forEach(n=>{

let x=parseInt(n);

if(x<1||x>12) valid=false;

});


if(valid){

data.push({

front:front,

back:back

});

}


}


});



// 统计前区

let count={};


for(let i=1;i<=35;i++){

count[i.toString().padStart(2,"0")]=0;

}



data.forEach(item=>{


item.front.forEach(n=>{

count[n]++;

});


});



let top=Object.entries(count)

.sort((a,b)=>b[1]-a[1])

.slice(0,10);



let html=`


<h3>数据检测</h3>

有效开奖：${data.length} 期<br>

异常数据：${lines.length-data.length} 行<br>


<h3>最新一期</h3>

${data[0].front.join(" ")}
+
${data[0].back.join(" ")}


<h3>前区热号TOP10</h3>

`;



top.forEach((item,index)=>{


html+=

`${index+1}. ${item[0]} 出现 ${item[1]} 次<br>`;


});



result.innerHTML=html;



}

catch(e){


result.innerHTML="错误："+e.message;


}


}