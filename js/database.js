// ================================================
// V90 AI CORE FINAL R7.0
// 历史数据库中心
// ================================================

"use strict";


window.V90Database={


key:"V90_R7_HISTORY",


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



}

catch(e){



console.log(

"读取历史失败"

);



return [];



}



},







// =================================
// TXT解析
// =================================


parse(text){



let arr=[];







let lines=

text.split(

/\r?\n/

);







lines.forEach(line=>{



let nums=

line

.trim()

.split(/\s+/)

.map(Number)

.filter(

n=>

!isNaN(n)

);







if(nums.length>=7){



arr.push({



front:

nums.slice(0,5),



back:

nums.slice(5,7)



});



}



});







return arr;



},







// =================================
// 保存
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
// 获取
// =================================


get(){



return this.history;



},







// =================================
// 添加开奖
// =================================


add(period,front,back){



let exists=

this.history.some(

x=>

x.period===period

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






return true;



},







// =================================
// 数量
// =================================


count(){



return this.history.length;



},







// =================================
// 最近一期
// =================================


last(){



return this.history[

this.history.length-1

];



}







};