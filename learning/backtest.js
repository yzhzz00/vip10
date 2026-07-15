window.V1000_BACKTEST={



run(history,periods){



let result=[];



periods.forEach(p=>{



let arr=history.slice(

history.length-p

);



let train=

arr.slice(
0,
arr.length-1
);



let real=

arr[arr.length-1];



let pred=

V1000_PREDICTOR.predict(
train
)[0];




result.push({


period:p,


predict:pred,


real,


hit:

{


front:

pred.front.filter(
n=>real.front.includes(n)
).length,



back:

pred.back.filter(
n=>real.back.includes(n)
).length



}



});




});



return result;



}



};