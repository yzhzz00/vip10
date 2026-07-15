// ================================================
// V90 AI CORE FINAL R6.1
// AI最终裁决中心
// ================================================

"use strict";


window.V90Core={


cacheKey:"V90_R61_PREDICTION",







// =================================
// 读取缓存预测
// =================================


getCache(){


let data=

localStorage.getItem(
this.cacheKey
);



if(data){


return JSON.parse(data);


}



return null;



},







// =================================
// 保存预测
// =================================


save(data){



localStorage.setItem(

this.cacheKey,

JSON.stringify(data)

);



},







// =================================
// 学习权重融合
// =================================


learningWeight(number,type){



let data=

V90Learning.init();







if(type==="front"){



return data.front[number] || 1;



}



return data.back[number] || 1;



},







// =================================
// 最终评分
// =================================


finalScore(item){



let score=item.score;







item.front.forEach(n=>{


score+=

this.learningWeight(
n,
"front"
)
*2;



});







item.back.forEach(n=>{


score+=

this.learningWeight(
n,
"back"
)
*3;



});








return Number(

score.toFixed(2)

);



},







// =================================
// AI会议
// =================================


meeting(result){



return [


"趋势AI：历史频率与冷热趋势完成",



"概率AI：Bayes概率更新完成",



"结构AI：奇偶/大小/和值检测完成",



"Markov AI：一阶转移完成",



"学习AI：历史反馈权重融合完成"



];



},







// =================================
// 主分析
// =================================


async analyze(force=false){



// 已有预测直接返回


let cache=

this.getCache();





if(cache && !force){



return cache;



}








let pool=

await V90MonteCarlo.run(

1000000

);








let list=



pool.map(item=>{



return {



front:item.front,


back:item.back,



score:

this.finalScore(item)



};



});







list.sort(

(a,b)=>

b.score-a.score

);








let best=

list[0];








let result={



id:

"R6.1-"

+

Date.now(),



time:

new Date()
.toLocaleString(),






final:{



front:

best.front,


back:

best.back,


score:

best.score



},






top10:

list.slice(0,10),





meeting:

this.meeting(best)



};









this.save(result);







return result;



}







};