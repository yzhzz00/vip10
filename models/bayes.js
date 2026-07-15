window.MODEL_BAYES={


score(num,history){



let p1=

MODEL_FREQUENCY.score(
num,
history
);



let p2=

MODEL_TREND.score(
num,
history
);




return (

p1*0.5

+

p2*0.5

);



}



};