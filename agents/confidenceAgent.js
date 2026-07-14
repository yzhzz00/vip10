/*
================================

大乐透智能分析系统

V70.4

Confidence AI

信心指数模型

================================
*/


class ConfidenceAgent {


constructor(){


this.name="Confidence AI";


}



analyze(models){



let score=0;


let count=0;



for(let key in models){



if(models[key].confidence){



score +=

models[key].confidence;



count++;


}



}






let confidence=0;



if(count>0){



confidence=

score/count;


}




return {



agent:this.name,


confidence:

Number(

(confidence*100)

.toFixed(2)

),



level:

confidence>=0.7

?

"高信心"

:

confidence>=0.5

?

"中等信心"

:

"低信心",



reason:[

"已综合多个AI模型评分",

"用于Master AI决策参考"

]



};



}



}





window.ConfidenceAgent =

new ConfidenceAgent();