/*
================================

大乐透智能分析系统

V70.7

Monte Carlo AI Engine

蒙特卡罗模拟核心

================================
*/


class MonteCarloEngine {



constructor(){


this.name="Monte Carlo AI";


this.simulations=100000;


}







randomNumber(min,max,set){



let num;



do{


num=

Math.floor(

Math.random()*(max-min+1)

)+min;



}

while(set.includes(num));



return num;


}








generateFront(){



let result=[];



while(result.length<5){



let n=

this.randomNumber(
1,
35,
result
);



result.push(n);



}



return result.sort(
(a,b)=>a-b
);



}









generateBack(){



let result=[];



while(result.length<2){



let n=

this.randomNumber(
1,
12,
result
);



result.push(n);



}



return result.sort(
(a,b)=>a-b
);



}











// 大乐透基础评分


score(ticket){



let front=

ticket.front;



let score=50;





// 奇偶结构


let odd=

front.filter(

n=>n%2!==0

).length;



if(

odd>=2 && odd<=3

){



score+=10;



}





// 大小结构


let small=

front.filter(

n=>n<=17

).length;



if(

small>=2 && small<=3

){



score+=10;



}






// 和值


let sum=

front.reduce(

(a,b)=>a+b,

0

);



if(

sum>=80 && sum<=120

){


score+=15;


}





// 连号检测


let consecutive=false;



for(

let i=1;

i<front.length;

i++

){



if(

front[i]-front[i-1]===1

){


consecutive=true;


}



}



if(consecutive){



score+=5;



}






return score;



}









simulate(){



let result=[];



for(

let i=0;

i<this.simulations;

i++

){



let ticket={



front:

this.generateFront(),



back:

this.generateBack()



};





ticket.score=

this.score(ticket);





result.push(ticket);



}







result.sort(

(a,b)=>

b.score-a.score

);







return {



engine:this.name,


count:this.simulations,


top:

result.slice(
0,
20
)



};



}



}







window.MonteCarloEngine=

new MonteCarloEngine();