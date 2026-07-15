// ================================================
// V90 AI CORE FINAL R6
// 数据库管理中心
// ================================================

"use strict";


window.V90Database={


key:"V90_DLT_DATABASE",


drawKey:"V90_DRAW_RECORD",


history:[],




// =================================
// 初始化数据库
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



let txt=

await res.text();





this.history=

this.parse(txt);





this.save();



return this.history;



}catch(e){



console.log(
"读取失败",
e
);



return [];



}



},







// =================================
// 解析历史数据
// =================================


parse(txt){



let result=[];



let lines=

txt.split(/\r?\n/);





lines.forEach(line=>{



let nums=

line

.trim()

.split(/\s+/)

.map(Number)

.filter(
n=>!isNaN(n)
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
// 获取全部历史
// =================================


get(){



return this.history;



},







// =================================
// 添加开奖
// =================================


add(period,front,back){



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
// 开奖记录
// =================================


saveRecord(draw){



let list=

JSON.parse(

localStorage.getItem(
this.drawKey
)

||

"[]"

);






list.push(draw);






localStorage.setItem(

this.drawKey,

JSON.stringify(list)

);



},







// =================================
// 数据数量
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