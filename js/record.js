// ================================================
// 大乐透AI V90 FINAL R2
// 预测记录模块
// ================================================

"use strict";


window.V90Record={



key:"V90_RECORDS",







// 保存预测


save(data){



let list=

this.get();



list.push(data);






localStorage.setItem(

this.key,

JSON.stringify(list)

);



},







// 获取全部记录


get(){



return JSON.parse(

localStorage.getItem(
this.key
)

||

"[]"

);



},







// 最近一次预测


last(){



let list=

this.get();





if(
list.length===0
){



return null;


}





return list[
list.length-1
];



},







// 显示记录


show(){



let box=

document.getElementById(
"predictionRecord"
);





if(!box)

return;






let data=

this.last();





if(!data){



box.innerHTML=

"暂无预测记录";



return;



}






box.innerHTML=

`

预测时间：

${new Date(data.time).toLocaleString()}

<br><br>

前区：

${data.front.join(" ")}

<br>

后区：

${data.back.join(" ")}

<br><br>

评分：

${data.score}

`;



}







};