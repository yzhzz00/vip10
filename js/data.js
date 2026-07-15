// ================================================
// 大乐透AI V90 CORE FINAL
// 数据中心模块
// ================================================

"use strict";


window.V90Data={


history:[],



// =================================
// 加载历史数据
// =================================

async load(){


try{


let response=

await fetch(
"data/dlt.txt"
);



let text=

await response.text();




this.history=

this.parse(text);






return this.history;



}catch(error){



console.error(
"历史数据加载失败:",
error
);



return [];



}



},







// =================================
// 数据解析
// 支持:
// 03 12 18 26 34 05 11
// =================================


parse(text){



let result=[];



let lines=

text.split(/\r?\n/);






for(
let line of lines
){



line=line.trim();





if(
line.length===0
)

continue;





let nums=



line

.replace(/,/g," ")

.split(/\s+/)

.map(Number)

.filter(
n=>!isNaN(n)
);






if(
nums.length<7
)

continue;







let last7=

nums.slice(
nums.length-7
);






let front=

last7.slice(0,5);



let back=

last7.slice(5,7);







// 大乐透号码范围检查


let valid=



front.every(

n=>

n>=1&&n<=35

)

&&



back.every(

n=>

n>=1&&n<=12

);







if(valid){



result.push({



front,


back



});



}



}





return result;



},







// =================================
// 获取历史
// =================================


get(){



return this.history;



},







// =================================
// 数据数量
// =================================


count(){



return this.history.length;



}



};