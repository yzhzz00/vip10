window.V1000_TRAINING={



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





let predict=

V1000_PREDICTOR.predict(train)[0];





let frontHit=

predict.front.filter(

n=>real.front.includes(n)

).length;



let backHit=

predict.back.filter(

n=>real.back.includes(n)

).length;





records.push({



period:real.period,



predict,



real,



hit:{


front:frontHit,


back:backHit


},



time:new Date().toLocaleString()



});




}





V1000_STORAGE.training(

records

);



return records;



},







report(){



let data=

V1000_STORAGE.getTraining();



return {


total:data.length,


last100:

this.calc(data.slice(-100)),


last500:

this.calc(data.slice(-500)),


last1000:

this.calc(data.slice(-1000))



};



},





calc(arr){



let front=0;

let back=0;



arr.forEach(x=>{


front+=x.hit.front;


back+=x.hit.back;


});




return {


front:

(front/arr.length).toFixed(2),



back:

(back/arr.length).toFixed(2)



};



}




};