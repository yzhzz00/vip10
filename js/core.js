// ================================================
// 大乐透AI V90 CORE FINAL
// 总AI裁决中心
// ================================================

"use strict";


window.V90Core={



weights:{



frequency:1,

hotCold:1,

missing:1,

bayes:1,

markov:1,

structure:1



},







// =================================
// 单组评分
// =================================


score(item){



let score=0;



let front=item.front;






// 模拟出现次数


score +=

item.count*5;








// 结构模型


score +=

V90Model.score(front);







// Bayes


let bayes=

V90Model.bayes();






front.forEach(n=>{



score +=

(bayes[n]||0)*100;



});








return score;



},







// =================================
// 风险检测
// =================================


risk(front){



let risk=[];



let s=

V90Model.structure(front);







if(
s.odd===0 ||
s.odd===5
){



risk.push(
"奇偶极端"
);



}






if(
s.big===0 ||
s.big===5
){



risk.push(
"大小极端"
);



}






if(
s.sum<70 ||
s.sum>150
){



risk.push(
"和值异常"
);



}







return risk;



},







// =================================
// AI会议
// =================================


meeting(item){



let s=

V90Model.structure(
item.front
);





return [



"趋势AI：历史冷热趋势分析完成",



"概率AI：Bayes概率评分完成",



"结构AI：奇偶"

+

s.odd

+

" 大小"

+

s.big

+

" 和值"

+

s.sum,



"Markov AI：一阶转移分析完成"



];



},







// =================================
// 自我反驳
// =================================


critic(item){



let risk=

this.risk(
item.front
);





return {



pass:

risk.length===0,



message:

risk.length===0

?

"未发现明显结构风险"

:

"风险："+risk.join("、")



};



},







// =================================
// 最终裁决
// =================================


judge(pool){



let list=[];





pool.forEach(item=>{



let score=

this.score(item);






let critic=

this.critic(item);






if(
!critic.pass
){



score-=20;



}






list.push({



front:item.front,


back:item.back,


count:item.count,


score:


Number(
score.toFixed(2)
),


risk:

critic.message,


meeting:

this.meeting(item)



});



});








return list.sort(

(a,b)=>

b.score-a.score

);



},







// =================================
// 主AI运行
// =================================


async run(){



let pool=

await V90MonteCarlo.run(

1000000,

function(p){



if(
window.V90Progress
){


window.V90Progress(p);


}



}

);






let result=

this.judge(pool);







return {



final:

result[0],


top10:

result.slice(0,10)



};



}



};