// ================================================
// V90 AI CORE FINAL R6
// 数字模型训练中心
// ================================================

"use strict";


window.V90Model={



// ================================
// 获取历史
// ================================


getHistory(){


return V90Database.get();


},







// ================================
// 创建评分表
// ================================


create(max){



let obj={};



for(
let i=1;i<=max;i++
){



obj[i]={


number:i,


frequency:0,


recent:0,


missing:0,


hot:0,


cold:0,


score:0



};



}




return obj;



},







// ================================
// 前区训练
// ================================


trainFront(){



let data=

this.getHistory();




let model=

this.create(35);







data.forEach((item,index)=>{



item.front.forEach(n=>{



if(model[n]){



model[n].frequency++;



// 最近50期加权

if(
index>
data.length-50
){



model[n].recent++;



}



}



});



});









for(
let n=1;n<=35;n++
){



let item=

model[n];






// 遗漏


let miss=0;






for(
let i=data.length-1;

i>=0;

i--

){



if(
data[i].front.includes(n)
)

break;



miss++;



}






item.missing=

miss;








// 热度


item.hot=

item.recent/50;







// 冷度


item.cold=

miss/(data.length+1);







// 综合评分


item.score=

(

item.frequency*0.35

+

item.hot*40

+

(1-item.cold)*20

+

1/(item.missing+1)*50

);






}







return model;



},







// ================================
// 后区训练
// ================================


trainBack(){



let data=

this.getHistory();




let model=

this.create(12);







data.forEach((item,index)=>{



item.back.forEach(n=>{



if(model[n]){



model[n].frequency++;





if(
index>
data.length-50
){



model[n].recent++;



}



}



});



});







for(
let n=1;n<=12;n++
){



let item=

model[n];






let miss=0;







for(
let i=data.length-1;

i>=0;

i--

){



if(
data[i].back.includes(n)
)

break;



miss++;



}






item.missing=

miss;







item.hot=

item.recent/50;







item.cold=

miss/(data.length+1);








item.score=

(

item.frequency*0.4

+

item.hot*50

+

(1-item.cold)*20

+

1/(item.missing+1)*50

);







}







return model;



},







// ================================
// 获取排名
// ================================


rank(model){



return Object.values(model)

.sort(

(a,b)=>

b.score-a.score

);



}





};