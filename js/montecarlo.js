window.DLT_MONTECARLO = {



/*
==========================
组合模拟评分
==========================
*/


simulate(combination, history){


let score=0;



for(
let i=0;
i<combination.length;
i++
){



let number=combination[i];



let modelScore=

DLT_PREDICTOR.numberScore(

number,

history

);



score += modelScore.score;



}




return score;



},







/*
==========================
执行模拟
==========================
*/


run(results,history,deep=false){



let times = deep

?

DLT_CONFIG.monteCarlo.deepSimulation

:

DLT_CONFIG.monteCarlo.normalSimulation;



let output=[];



results.forEach(item=>{



let total=0;



let winCount=0;



for(
let i=0;
i<times;
i++
){



let score=

this.simulate(

item.front,

history

);



total+=score;



if(
score>300
){


winCount++;


}



}





output.push({



front:item.front,



score:

total/times,



stability:

winCount/times*100



});



});





output.sort(

(a,b)=>

{


let sa=

a.score*0.7

+

a.stability*0.3;



let sb=

b.score*0.7

+

b.stability*0.3;



return sb-sa;



}

);



return output.slice(

0,

DLT_CONFIG.candidate.outputTop

);



}







};