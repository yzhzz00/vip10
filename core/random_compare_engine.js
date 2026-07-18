/**
 * DLT-AI-CORE VIP
 *
 * Random Compare Engine V10.0 FINAL
 *
 * AI vs Random 对比
 */


class RandomCompareEngine {



constructor(){




this.result={


aiWin:0,


randomWin:0,


equal:0,


total:0



};



}









run(

history,

aiPredictions=[]

){



let totalHitAI=0;


let totalHitRandom=0;






history.forEach(

(item,index)=>{



const ai=

aiPredictions[index];



if(!ai){

return;

}





const aiHit=

this.hit(

ai,

item

);





const random=

this.randomNumber();





const randomHit=

this.hit(

random,

item

);









if(aiHit>randomHit){



this.result.aiWin++;



}

else if(

randomHit>aiHit

){



this.result.randomWin++;



}

else{



this.result.equal++;



}







this.result.total++;







totalHitAI+=aiHit;


totalHitRandom+=randomHit;



}

);









return {



aiWin:

this.result.aiWin,



randomWin:

this.result.randomWin,



equal:

this.result.equal,



total:

this.result.total,



aiAverage:

Number(

(

totalHitAI /

this.result.total

)

.toFixed(3)

),



randomAverage:

Number(

(

totalHitRandom /

this.result.total

)

.toFixed(3)

),




aiRate:

Number(

(

this.result.aiWin /

this.result.total *

100

)

.toFixed(2)

)



};



}









hit(

prediction,

real

){



let count=0;





prediction.front.forEach(

n=>{


if(

real.front.includes(n)

)

count++;


});





prediction.back.forEach(

n=>{


if(

real.back.includes(n)

)

count++;


});





return count;



}









randomNumber(){



const front=new Set();





while(

front.size<5

){



front.add(

Math.floor(

Math.random()*35

)+1

);



}







const back=new Set();





while(

back.size<2

){



back.add(

Math.floor(

Math.random()*12

)+1

);



}







return {



front:

Array.from(front),



back:

Array.from(back)



};



}



}



export default RandomCompareEngine;