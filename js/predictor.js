window.DLT_PREDICTOR = {



/*
==========================
单号码综合评分
==========================
*/


numberScore(number,history){



let w = DLT_CONFIG.modelWeights;



let scores={



frequency:

DLT_MODELS.frequency(
number,
history
),



trend:

DLT_MODELS.trend(
number,
history
),



missing:

DLT_MODELS.missing(
number,
history
),



markov:

DLT_MODELS.markov(
number,
history
)



};





let total=0;



total += scores.frequency*w.frequency;



total += scores.trend*w.trend;



total += scores.missing*w.missing;



total += scores.markov*w.markov;



return {



number:number,


score:total,


detail:scores



};



},







/*
==========================
生成号码池
==========================
*/


buildPool(history){



let pool=[];



for(
let i=1;
i<=35;
i++
){



pool.push(

this.numberScore(
i,
history
)

);



}



pool.sort(

(a,b)=>

b.score-a.score

);



return pool.slice(

0,

DLT_CONFIG.candidate.frontPool

);



},







/*
==========================
组合生成
==========================
*/


generateCombination(pool){



let result=[];



let copy=[...pool];



while(result.length<5){



let index=Math.floor(

Math.random()*copy.length

);



result.push(

copy[index].number

);



copy.splice(index,1);



}



return result.sort(

(a,b)=>a-b

);



},







/*
==========================
组合评分
==========================
*/


combinationScore(front,history){



let score=0;



// 结构

score +=

DLT_MODELS.structure(front)

*

DLT_CONFIG.modelWeights.structure;



// 形态

score +=

DLT_MODELS.shape(front)

*

DLT_CONFIG.modelWeights.shape;



// 矩阵

score +=

DLT_MODELS.matrix(
front,
history
)

*

DLT_CONFIG.modelWeights.matrix;



// 反人类

score +=

DLT_MODELS.antiHuman(front)

*

DLT_CONFIG.modelWeights.antiHuman;



return score;



},







/*
==========================
最终预测
==========================
*/


predict(history){



let pool=this.buildPool(history);



let result=[];



let times=

DLT_CONFIG.candidate.combinations;



for(
let i=0;
i<times;
i++
){



let front=

this.generateCombination(pool);



let score=

this.combinationScore(

front,

history

);




result.push({


front:front,


score:score


});



}





result.sort(

(a,b)=>

b.score-a.score

);



return result.slice(

0,

DLT_CONFIG.candidate.outputTop

);



}







};