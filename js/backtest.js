// ================================================
// V90 AI CORE FINAL R6
// 回测分析中心
// ================================================

"use strict";


window.V90Backtest={





// =================================
// 获取最近多少期
// =================================


getData(count=100){



let data=

V90Database.get();






if(data.length<=count)

return data;







return data.slice(

data.length-count

);



},







// =================================
// 模拟预测
// =================================


simulate(){



let data=

this.getData(100);






let result={



periods:

data.length,



front3:0,


front2:0,


front1:0,


back2:0,


back1:0,


totalHit:0



};







data.forEach(draw=>{



let front=

V90Model

.trainFront();





let back=

V90Model

.trainBack();







let frontRank=

V90Model

.rank(front)

.slice(0,5)

.map(x=>x.number);






let backRank=

V90Model

.rank(back)

.slice(0,2)

.map(x=>x.number);







let fh=

frontRank.filter(

n=>

draw.front.includes(n)

).length;







let bh=

backRank.filter(

n=>

draw.back.includes(n)

).length;









if(fh>=3)

result.front3++;



if(fh>=2)

result.front2++;



if(fh>=1)

result.front1++;







if(bh===2)

result.back2++;







if(bh>=1)

result.back1++;







result.totalHit+=

fh+bh;



});







return result;



},







// =================================
// 显示
// =================================


show(){



let result=

this.simulate();






let box=

document.getElementById(
"backtest"
);







if(box){



box.innerHTML=

`

回测周期：

${result.periods}期


<br><br>


前区≥3个：

${result.front3}次


<br>


前区≥2个：

${result.front2}次


<br>


前区≥1个：

${result.front1}次


<br><br>


后区2个：

${result.back2}次


<br>


后区命中：

${result.back1}次


<br><br>


累计命中：

${result.totalHit}


`;



}







return result;



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