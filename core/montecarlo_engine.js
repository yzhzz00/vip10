/**
 * DLT-AI-CORE VIP
 * Monte Carlo Engine V6.0 FINAL
 *
 * 分批百万模拟
 */


class MonteCarloEngine {



constructor(

model,

options={}

){


this.model=model;


this.times=

options.times || 1000000;


this.batch=

options.batch || 5000;


this.progress=

options.progress || null;


}









async run(){



const result=[];


const pool=

this.createScorePool();





let completed=0;







while(

completed < this.times

){



const currentBatch=

Math.min(

this.batch,

this.times-completed

);






for(

let i=0;

i<currentBatch;

i++

){



const front=

this.randomFront();



const back=

this.randomBack();





const score=

this.evaluate(

front,

pool

);





result.push({



front,


back,


score



});



}







completed += currentBatch;







if(this.progress){



this.progress(

Math.floor(

completed/

this.times*

100

)

);



}







await this.nextTick();



}







result.sort(

(a,b)=>

b.score-a.score

);








return result.slice(

0,

3

);



}









createScorePool(){



const pool={};



for(

let i=1;

i<=35;

i++

){



pool[i]=0;


}






if(

this.model

&&

this.model.numbers

){



this.model.numbers.forEach(

item=>{



pool[item.number]=

item.score;



}

);



}





return pool;



}









randomFront(){



const set=new Set();





while(

set.size<5

){



set.add(

Math.floor(

Math.random()*35

)+1

);



}





return Array.from(set)

.sort(

(a,b)=>a-b

);



}









randomBack(){



const set=new Set();





while(

set.size<2

){



set.add(

Math.floor(

Math.random()*12

)+1

);



}





return Array.from(set)

.sort(

(a,b)=>a-b

);



}









evaluate(

front,

pool

){



let score=0;





front.forEach(

n=>{


score+=pool[n]||0;


}

);





const sum=

front.reduce(

(a,b)=>a+b,

0

);





if(

sum>=80

&&

sum<=130

){

score+=15;

}



const odd=

front.filter(

n=>n%2

).length;





if(

odd===2

||

odd===3

){



score+=10;


}





return Number(

score.toFixed(3)

);



}









nextTick(){



return new Promise(

resolve=>{


setTimeout(

resolve,

0

);


}

);



}



}



export default MonteCarloEngine;