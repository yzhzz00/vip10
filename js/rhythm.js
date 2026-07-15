window.V110_RHYTHM={



report(history){


let sum=[];

let odd=[];


history.slice(-30)

.forEach(x=>{


sum.push(

x.front.reduce(
(a,b)=>a+b,
0

)

);


odd.push(

x.front.filter(
n=>n%2
).length

);



});



return {


sumAverage:

(
sum.reduce(
(a,b)=>a+b,
0
)/sum.length
).toFixed(2),



oddTrend:odd,



lastSum:
sum[sum.length-1]

};



}



};