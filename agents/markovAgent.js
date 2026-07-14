/*
====================================

大乐透智能分析系统 V70

Markov AI Agent

马尔可夫转移专家

====================================
*/


const MarkovAgent={


version:"V70.0",





analyze(history){



let transition={};



let repeatCount=0;



let total=0;






// 建立上一期→下一期关系


for(

let i=0;

i<history.length-1;

i++

){



let current=

history[i].front;



let next=

history[i+1].front;






current.forEach(a=>{



if(!transition[a])

transition[a]={};





next.forEach(b=>{



if(!transition[a][b])

transition[a][b]=0;



transition[a][b]++;



});



});






// 统计重号


let repeat=

current.filter(n=>

next.includes(n)

).length;



repeatCount+=repeat;


total++;



}








let repeatAverage=

Number(

(repeatCount/total)

.toFixed(2)

);







// 找高转移号码


let score={};





Object.keys(transition)

.forEach(a=>{



Object.keys(

transition[a]

)

.forEach(b=>{



if(!score[b])

score[b]=0;



score[b]+=

transition[a][b];



});



});







let nextHot=

Object.keys(score)

.sort(

(a,b)=>

score[b]-score[a]

)

.slice(0,10);








let strategy="balanced";


let reason=[];






if(repeatAverage>=2){



reason.push(

"近期重号概率偏高"

);



strategy="repeat";



}

else{


reason.push(

"近期号码延续性较弱"

);



}








return {


agent:"Markov AI",


strategy,


repeatAverage,


nextHot,


reason



};





}



};






window.MarkovAgent=

MarkovAgent;