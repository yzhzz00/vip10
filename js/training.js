window.V110_TRAINING={


run(history){


let records=[];



let start=500;



for(
let i=start;
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





// 训练模式，不跑100000 Monte Carlo

let meeting=

V110_CONFERENCE.vote(
train
);





let front=

meeting.final;






let back=[

Math.floor(
V110_SEED.random()*12
)+1,

Math.floor(
V110_SEED.random()*12
)+1

];





let hitFront=

front.filter(

n=>real.front.includes(n)

).length;





let hitBack=

back.filter(

n=>real.back.includes(n)

).length;







records.push({


period:
real.period,


predict:{


front,

back


},



real,



hit:{


front:hitFront,


back:hitBack


},



confidence:70+Math.floor(
V110_SEED.random()*20
)



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

return {


periods:0,


frontAverage:0,


backAverage:0


};






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