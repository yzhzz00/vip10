// ================================================
// V90 AI CORE FINAL R3
// 历史数据中心
// ================================================

"use strict";


window.V90Data={


history:[],






// 加载历史数据

async load(){



try{



let res=

await fetch(
"data/dlt.txt"
);



let text=

await res.text();





this.history=

this.parse(text);






return this.history;





}catch(e){



console.error(
"数据读取失败",
e
);



return [];



}



},







// 数据解析


parse(text){



let list=[];



let lines=

text.split(/\r?\n/);







for(
let line of lines
){



line=line.trim();






if(!line)

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







let arr=

nums.slice(
nums.length-7
);






let front=

arr.slice(
0,5
);



let back=

arr.slice(
5,7
);








if(

front.every(

n=>n>=1&&n<=35

)

&&

back.every(

n=>n>=1&&n<=12

)

){



list.push({



front,


back



});



}




}





return list;



},







get(){



return this.history;



},







count(){



return this.history.length;



}



};