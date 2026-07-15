// ================================================
// V90 AI CORE FINAL R6.1
// 历史数据中心
// ================================================

"use strict";


window.V90Database={



key:"V90_R61_DATABASE",


recordKey:"V90_R61_DRAW_RECORD",


history:[],







// =================================
// 初始化
// =================================


async init(){



let save=

localStorage.getItem(
this.key
);







if(save){



this.history=

JSON.parse(save);



return this.history;



}







try{



let response=

await fetch(
"data/dlt.txt"
);






let text=

await response.text();






this.history=

this.parse(text);







this.save();






return this.history;



}
catch(e){



console.log(
"数据读取失败",
e
);



return [];



}



},







// =================================
// 解析txt
// =================================


parse(text){



let result=[];






let lines=

text.split(/\r?\n/);








lines.forEach(line=>{



let nums=

line

.trim()

.split(/\s+/)

.map(Number)

.filter(

x=>!isNaN(x)

);








if(nums.length>=7){



result.push({



front:

nums.slice(0,5),



back:

nums.slice(5,7)



});



}



});







return result;



},







// =================================
// 保存数据库
// =================================


save(){



localStorage.setItem(

this.key,

JSON.stringify(

this.history

)

);



},







// =================================
// 获取数据
// =================================


get(){



return this.history;



},







// =================================
// 添加开奖
// =================================


add(period,front,back){



// 防重复


let exists=

this.history.some(

item=>


item.period===period

);








if(exists){



return false;



}








let draw={



period,


front,


back,


time:

Date.now()



};







this.history.push(draw);






this.save();






this.saveRecord(draw);







return draw;



},







// =================================
// 保存开奖记录
// =================================


saveRecord(draw){



let list=

JSON.parse(

localStorage.getItem(

this.recordKey

)

||

"[]"

);






list.push(draw);







localStorage.setItem(

this.recordKey,

JSON.stringify(list)

);



},







// =================================
// 最新一期
// =================================


last(){



return this.history[

this.history.length-1

];



},







// =================================
// 数据数量
// =================================


count(){



return this.history.length;



}






};