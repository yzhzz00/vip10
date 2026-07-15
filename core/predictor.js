window.V1000_PREDICTOR={



predict(history){



let numbers=[];



for(
let n=1;
n<=35;
n++
){



let score=0;



score+=

MODEL_FREQUENCY.score(
n,
history
)
*
V1000_CONFIG.weights.frequency;



score+=

MODEL_TREND.score(
n,
history
)
*
V1000_CONFIG.weights.trend;



score+=

MODEL_MISSING.score(
n,
history
)
*
V1000_CONFIG.weights.missing;



score+=

MODEL_BAYES.score(
n,
history
)
*
V1000_CONFIG.weights.bayes;



score+=

MODEL_MARKOV.score(
n,
history
)
*
V1000_CONFIG.weights.markov;




numbers.push({

num:n,

score

});



}





numbers.sort(

(a,b)=>

b.score-a.score

);





let pool=[];



for(
let i=0;
i<200;
i++
){



let front=[];



while(
front.length<5
){



let n=

numbers[

Math.floor(

V1000_SEED.random()

*

15

)

].num;



if(
!front.includes(n)
)

front.push(n);



}



front.sort(
(a,b)=>a-b
);



if(
V1000_OPTIMIZER.valid(front)
){



pool.push({

front,

back:[

1+
Math.floor(
V1000_SEED.random()*12
),

1+
Math.floor(
V1000_SEED.random()*12
)

]

});



}



}




let mc=

V1000_MONTE.run(

pool,

V1000_CONFIG.simulation.monteCarlo

);




return mc.slice(0,10);



}



};