// ================================================
// 大乐透AI V90 FINAL
// 预测记录模块
// ================================================

"use strict";


window.V90Record={



key:"V90_PREDICTION_RECORD",







// ================================================
// 保存预测
// ================================================


save(data){



let list=

this.getAll();





list.push(data);





localStorage.setItem(

this.key,

JSON.stringify(list)

);



},







// ================================================
// 获取全部记录
// ================================================


getAll(){



return JSON.parse(

localStorage.getItem(
this.key
)

||

"[]"

);



},







// ================================================
// 获取最近一次预测
// ================================================


last(){



let list=

this.getAll();





if(
list.length===0
){


return null;


}





return list[
list.length-1
];



},







// ================================================
// 显示记录
// ================================================


show(){



let box=

document.getElementById(
"predictionRecord"
);





if(!box)

return;






let last=

this.last();






if(!last){



box.innerHTML=

"暂无预测记录";


return;


}






box.innerHTML=



"预测时间："

+

new Date(
last.time
)
.toLocaleString()

+

"<br><br>"

+

"预测号码：<br>"

+

last.front.join(" ")

+

" + "

+

last.back.join(" ")

+

"<br><br>"

+

"评分："

+

last.score;



}






};