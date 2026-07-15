window.V110_TRAINING={




run(history){



let records=[];



for(
let i=500;
i<history.length;
i++
){



let train=

history.slice(
i-500,
i
);



let real=

history[i];



let p=

V110_PREDICTOR.predict(
train
);




let hitFront=

p.best.front.filter(

n=>real.front.includes(n)

).length;



let hitBack=

p.best.back.filter(

n=>real.back.includes(n)

).length;





records.push({


period:real.period,


predict:p.best,


real,


hit:{


front:hitFront,


back:hitBack


},


confidence:p.confidence


});



}




V110_DB.saveTraining(
records
);



return records;



},







statistics(range){



let data=

V110_DB.getTraining();



let arr=

data.slice(-range);



if(!arr.length)

return null;




let f=0;

let b=0;



arr.forEach(x=>{


f+=x.hit.front;


b+=x.hit.back;


});



return {


periods:arr.length,


frontAverage:

(f/arr.length).toFixed(2),



backAverage:

(b/arr.length).toFixed(2)



};



},








report(){



return {



last100:
this.statistics(100),



last500:
this.statistics(500),



last1000:
this.statistics(1000)



};



}



};