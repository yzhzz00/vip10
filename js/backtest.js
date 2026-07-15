// ================================================
// V90 AI CORE FINAL R6.1
// 滚动回测中心
// ================================================

"use strict";


window.V90Backtest={




// =================================
// 获取回测数据
// =================================


getRange(total=100){



let data=

V90Database.get();





if(data.length<=total){

return data;

}





return data.slice(

data.length-total

);



},







// =================================
// 单期预测
// =================================


predict(history){



// 临时训练模型


let frontModel=

this.trainFront(history);



let backModel=

this.trainBack(history);







let front=

Object.values(frontModel)

.sort(

(a,b)=>

b.score-a.score

)

.slice(0,5)

.map(x=>x.number);







let back=

Object.values(backModel)

.sort(

(a,b)=>

b.score-a.score

)

.slice(0,2)

.map(x=>x.number);








return {


front,

back


};



},







// =================================
// 前区临时训练
// =================================


trainFront(data){



let model={};




for(
let i=1;

i<=35;

i++

){



model[i]={


number:i,

score:0


};



}







data.forEach(draw=>{



draw.front.forEach(n=>{



model[n].score+=1;



});



});





return model;



},







// =================================
// 后区临时训练
// =================================


trainBack(data){



let model={};



for(
let i=1;

i<=12;

i++

){



model[i]={



number:i,


score:0



};



}






data.forEach(draw=>{



draw.back.forEach(n=>{



model[n].score+=1;



});



});






return model;



},







// =================================
// 执行滚动回测
// =================================


run(){



let data=

this.getRange(100);






let result={



periods:data.length,


front5:0,


front4:0,


front3:0,


front2:0,


back2:0,


back1:0,


total:0



};







for(
let i=20;

i<data.length;

i++

){



// 只能使用之前数据


let history=

data.slice(
0,
i
);





let real=

data[i];






let pred=

this.predict(history);








let fh=

pred.front.filter(

n=>

real.front.includes(n)

).length;







let bh=

pred.back.filter(

n=>

real.back.includes(n)

).length;







if(fh>=5)

result.front5++;


if(fh>=4)

result.front4++;


if(fh>=3)

result.front3++;


if(fh>=2)

result.front2++;





if(bh===2)

result.back2++;


if(bh>=1)

result.back1++;





result.total+=fh+bh;



}






return result;



},







// =================================
// 页面显示
// =================================


show(){



let r=

this.run();






let box=

document.getElementById(
"backtest"
);







if(box){



box.innerHTML=

`

真实滚动回测：

${r.periods}期


<br><br>


前区5中：

${r.front5} 次


<br>


前区4中：

${r.front4} 次


<br>


前区3中：

${r.front3} 次


<br>


前区2中：

${r.front2} 次


<br><br>


后区2中：

${r.back2} 次


<br>


后区1中：

${r.back1} 次


<br><br>


累计命中：

${r.total}

`;



}






return r;



}






};







document.addEventListener(

"DOMContentLoaded",

()=>{


let btn=

document.getElementById(
"backtestBtn"
);






if(btn){



btn.onclick=

()=>{


V90Backtest.show();



};



}



});