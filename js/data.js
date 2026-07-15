// ================================================
// V90 AI CORE R5
// 数据中心
// ================================================

"use strict";


window.V90Data={


history:[],


storageKey:"V90_HISTORY_DATA",






// =================================
// 初始化数据
// =================================


async load(){


let local=

localStorage.getItem(
this.storageKey
);





if(local){


this.history=

JSON.parse(local);


return this.history;


}







try{


let res=

await fetch(
"data/dlt.txt"
);



let text=

await res.text();





this.history=

this.parse(text);






this.save();






return this.history;



}catch(e){



console.error(
"历史数据读取失败",
e
);



return [];



}



},







// =================================
// 解析txt
// =================================


parse(text){



let arr=[];


let lines=

text.split(/\r?\n/);






lines.forEach(line=>{



let nums=

line

.trim()

.replace(/,/g," ")

.split(/\s+/)

.map(Number)

.filter(

x=>!isNaN(x)

);








if(nums.length>=7){



let n=

nums.slice(
nums.length-7
);





arr.push({



front:

n.slice(0,5),



back:

n.slice(5,7)



});



}



});






return arr;



},







// =================================
// 获取数据
// =================================


get(){


return this.history;


},







// =================================
// 保存数据库
// =================================


save(){



localStorage.setItem(

this.storageKey,

JSON.stringify(

this.history

)

);



},







// =================================
// 新增开奖
// =================================


addDraw(period,front,back){



let item={



period,


front,


back,


time:

Date.now()



};






this.history.push(item);





this.save();






return item;



},







// =================================
// 最新一期
// =================================


latest(){



if(
this.history.length===0
)

return null;






return this.history[

this.history.length-1

];



},







// =================================
// 期数
// =================================


count(){


return this.history.length;


}





};