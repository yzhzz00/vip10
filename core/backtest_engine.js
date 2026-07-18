/**
 * DLT-AI-CORE VIP
 *
 * Backtest Engine V9.0 FINAL
 *
 * 历史回测系统
 */


import MonteCarloEngine from "./montecarlo_engine.js";




class BacktestEngine {



constructor(

models

){


this.models=models;


}









async run(

history=[],

period=1000

){



const data=

history.slice(

-history.length,

-history.length+period

);







const result={



period,


tests:0,


hit3:0,


hit4:0,


hit5:0,


averageHit:0



};








let totalHit=0;









for(

let i=0;

i<data.length-1;

i++

){



const trainData=

data.slice(

0,

i+1

);





const real=

data[i+1];








const prediction=

await this.predict();









const hit=

this.check(

prediction,

real

);







result.tests++;






totalHit+=hit;







if(

hit>=3

)

result.hit3++;





if(

hit>=4

)

result.hit4++;





if(

hit>=5

)

result.hit5++;





}









result.averageHit=

Number(

(

totalHit /

result.tests

)

.toFixed(3)

);








return result;



}









async predict(){



const monte=

new MonteCarloEngine(

this.models.ensemble,

{


times:10000


}

);





const result=

await monte.run();






return result[0];



}









check(

prediction,

real

){



const front=

prediction.front.filter(

n=>

real.front.includes(n)

)

.length;







const back=

prediction.back.filter(

n=>

real.back.includes(n)

)

.length;







return front+back;



}



}



export default BacktestEngine;