// ================================================
// 大乐透AI V90 FINAL
// 数据中心
// ================================================

"use strict";


window.V90Data={


history:[],



// ================================================
// 自动加载历史数据
// ================================================


async load(){


try{


let response=

await fetch(
"data/dlt.txt"
);



let text=

await response.text();




let data=

this.parse(text);





this.history=data;





window.V90.history=data;





return data;



}catch(e){



console.error(
"历史数据加载失败",
e
);



return [];



}



},







// ================================================
// 自动解析数据
// 支持：
// 1. 期号+7号码
// 2. 直接7号码
// 3. 空格/逗号
// ================================================


parse(text){



let result=[];



let lines=

text
.split(/\r?\n/);






lines.forEach(line=>{



line=line.trim();



if(!line)

return;






let nums=

line

.replace(/,/g," ")

.split(/\s+/)

.map(Number)

.filter(
n=>
!isNaN(n)
);






// 找最后7个有效号码


if(nums.length>=7){



let seven=

nums.slice(
nums.length-7
);





let front=

seven.slice(
0,5
);





let back=

seven.slice(
5,7
);






// 大乐透合法范围检查


if(

front.every(
n=>n>=1&&n<=35
)

&&


back.every(
n=>n>=1&&n<=12
)

){



result.push({



front,


back



});



}



}




});






return result;



},







// ================================================
// 获取历史
// ================================================


get(){


return this.history;



},







// ================================================
// 最新一期
// ================================================


last(){


if(
this.history.length===0
)

return null;



return this.history[
this.history.length-1
];



}





};