async function startAnalysis(){

let result=document.getElementById("result");

result.innerHTML="正在分析数据...";


try{


let response=await fetch("data/dlt_raw.txt?v=2000");


let text=await response.text();



let lines=text.split("\n");


let count={};


for(let i=1;i<=35;i++){

count[i.toString().padStart(2,"0")]=0;

}



let total=0;



lines.forEach(line=>{


let nums=line.match(/\b\d{2}\b/g);


if(!nums) return;



if(nums.length>=7){


let arr=nums.slice(-7);



let front=arr.slice(0,5);



front.forEach(n=>{


if(count[n]!==undefined){

count[n]++;

}


});


total++;


}


});




let sort=Object.entries(count)

.sort((a,b)=>b[1]-a[1])

.slice(0,10);



let html="";


html+="<h3>数据检测</h3>";

html+="有效开奖："+total+"期<br><br>";



html+="<h3>大乐透前区热号TOP10</h3>";



sort.forEach((item,index)=>{


html+=

(index+1)+". "+item[0]+" 出现 "+item[1]+" 次<br>";


});



result.innerHTML=html;



}

catch(e){


result.innerHTML="分析失败："+e.message;


}


}