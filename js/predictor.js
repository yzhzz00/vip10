window.DLT_PREDICTOR={



scoreNumber(n,data){



let w=

DLT_CONFIG.modelWeights;



let score=0;



score+=

DLT_MODELS.frequency(n,data)

*w.frequency;



score+=

DLT_MODELS.trend(n,data)

*w.trend;



score+=

DLT_MODELS.missing(n,data)

*w.missing;



return {


number:n,


score:score


};



},







buildPool(data){



let arr=[];



for(let i=1;i<=35;i++){


arr.push(

this.scoreNumber(i,data)

);


}



arr.sort(

(a,b)=>b.score-a.score

);



return arr.slice(

0,

DLT_CONFIG.mobile.numberPool

);



},







makeCombination(pool){



let temp=[...pool];


let result=[];



while(result.length<5){



let index=

Math.floor(

Math.random()*temp.length

);



result.push(

temp[index].number

);



temp.splice(index,1);



}



return result.sort(

(a,b)=>a-b

);



},







predict(data){



let pool=this.buildPool(data);



let result=[];



for(

let i=0;

i<DLT_CONFIG.mobile.combinations;

i++

){



let front=

this.makeCombination(pool);



let score=

DLT_MODELS.structure(front)

+

DLT_MODELS.shape(front)

+

DLT_MODELS.antiHuman(front);



result.push({


front,


score


});



}



result.sort(

(a,b)=>b.score-a.score

);



return result.slice(

0,

DLT_CONFIG.mobile.outputTop

);



}






};