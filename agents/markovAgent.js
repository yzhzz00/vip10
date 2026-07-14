/*
================================

大乐透智能分析系统

V71.1

Markov AI

号码转移分析模块

================================
*/


class MarkovAgent {


constructor(){


this.name="Markov AI";


}








analyze(history){



if(

!history ||

history.length<2

){



return {



error:"历史数据不足"



};



}






let transition={};






for(

let i=0;

i<history.length-1;

i++

){



let current=

history[i].front;



let next=

history[i+1].front;








current.forEach(from=>{



if(!transition[from]){



transition[from]={};



}






next.forEach(to=>{



if(!transition[from][to]){



transition[from][to]=0;



}



transition[from][to]++;



});



});



}









let probability={};








for(let from in transition){



let total=0;





for(let to in transition[from]){



total+=transition[from][to];



}






probability[from]={};






for(let to in transition[from]){



probability[from][to]=



Number(

(

transition[from][to]

/

total

)

.toFixed(3)

);



}



}








// 最近一期作为参考


let last=

history[history.length-1];








let suggestion={};








last.front.forEach(num=>{



if(probability[num]){



suggestion[num]=

probability[num];



}



});









return {



agent:this.name,



sample:

history.length,



lastFront:

last.front,



transitionCount:

Object.keys(

transition

).length,



probability:

probability,



latestSuggestion:

suggestion,



strategy:

"上一期→下一期 Markov 转移模型"



};






}





}






window.MarkovAgent=

new MarkovAgent();