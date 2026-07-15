// ================================================
// V90 AI CORE FINAL R7.0
// 综合评分模型
// ================================================

"use strict";


window.V90Model={







// =================================
// 初始化数字池
// =================================


create(size){


let data={};




for(
let i=1;

i<=size;

i++

){



data[i]={



number:i,


frequency:0,


recent:0,


missing:0,


trend:0,


score:0



};



}



return data;



},







// =================================
// 获取训练权重
// =================================


weight(type,number){



if(
window.V90Learning
){



let w=

V90Learning.get();





if(type==="front"){


return w.front[number] || 1;


}



return w.back[number] || 1;



}



return 1;



},







// =================================
// 前区模型
// =================================


front(data){



let model=

this.create(35);







data.forEach(

(draw,index)=>{



draw.front.forEach(n=>{



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






// 计算遗漏


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









m.trend=

m.recent/50;








let learn=

this.weight(
"front",
n
);








m.score=



m.frequency*0.35


+

m.trend*30


+

(1/(m.missing+1))*40


+

learn*10;







}



return model;



},







// =================================
// 后区模型
// =================================


back(data){



let model=

this.create(12);







data.forEach(

(draw,index)=>{



draw.back.forEach(n=>{



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







m.trend=

m.recent/50;







let learn=

this.weight(
"back",
n
);







m.score=



m.frequency*0.30


+

m.trend*40


+

(1/(m.missing+1))*60


+

learn*15;






}



return model;



},







// =================================
// 综合排序
// =================================


rank(model){



return Object.values(model)

.sort(

(a,b)=>

b.score-a.score

);



}






};