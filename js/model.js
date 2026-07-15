// ================================================
// V90 AI CORE FINAL R6.1
// 数字综合评分模型
// ================================================

"use strict";


window.V90Model={



// ================================
// 获取数据
// ================================


history(){


return V90Database.get();


},







// ================================
// 初始化评分
// ================================


create(max){



let obj={};



for(
let i=1;

i<=max;

i++

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
// 前区模型
// ================================


trainFront(){



let data=

this.history();



let model=

this.create(35);






data.forEach(

(item,index)=>{



item.front.forEach(n=>{



if(model[n]){



model[n].frequency++;





if(
index>=data.length-50
){



model[n].recent++;



}



}



});



});








for(
let n=1;

n<=35;

n++

){



let m=model[n];





// 遗漏计算


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





m.missing=miss;





// 热度


m.hot=

m.recent/50;





// 冷度


m.cold=

miss/(data.length+1);







// 综合评分


m.score=


m.frequency*0.3

+

m.hot*35

+

(1-m.cold)*30

+

(1/(m.missing+1))*50;





// 冷热反转

if(
m.missing>30 &&
m.missing<80
){



m.score+=8;



}




}







return model;



},







// ================================
// 后区强化模型
// ================================


trainBack(){



let data=

this.history();



let model=

this.create(12);






data.forEach(

(item,index)=>{



item.back.forEach(n=>{



if(model[n]){



model[n].frequency++;





if(
index>=data.length-50
){



model[n].recent++;



}



}



});



});








for(
let n=1;

n<=12;

n++

){



let m=model[n];





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







m.missing=miss;






m.hot=

m.recent/50;






m.cold=

miss/(data.length+1);







// 后区加强遗漏

m.score=


m.frequency*0.25

+

m.hot*45

+

(1-m.cold)*35

+

(1/(m.missing+1))*70;







// 后区遗漏反弹


if(
m.missing>=15
){



m.score+=10;



}




}






return model;



},







// ================================
// 排名
// ================================


rank(model){



return Object.values(model)

.sort(

(a,b)=>

b.score-a.score

);



}







};