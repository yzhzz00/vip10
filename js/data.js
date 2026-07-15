"use strict";



window.V90Data={



history:[],





// =================================
// 加载历史数据
// =================================


async load(){


try{


let res=

await fetch(
"data/dlt.txt"
);



let text=

await res.text();




let data=

this.parse(text);





this.history=data;



window.V90.history=data;



return data;



}catch(e){



console.error(
"数据加载失败",
e
);



return [];



}



},







// =================================
// 数据解析
// 自动兼容：
// 期号+号码
// 号码直接排列
// 空格/逗号
// =================================


parse(text){



let list=[];



let lines=

text.split(/\r?\n/);






for(let line of lines){



line=line.trim();



if(!line)

continue;





let nums=

line

.replace(/,/g," ")

.split(/\s+/)

.map(Number)

.filter(
x=>!isNaN(x)
);






if(nums.length<7)

continue;





// 取最后7个数字

let arr=

nums.slice(
nums.length-7
);






let front=

arr.slice(0,5);



let back=

arr.slice(5,7);







// 大乐透范围过滤


let ok=



front.every(

n=>n>=1&&n<=35

)

&&


back.every(

n=>n>=1&&n<=12

);







if(ok){



list.push({



front,


back



});



}





}





return list;



},







// =================================
// 获取数据
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