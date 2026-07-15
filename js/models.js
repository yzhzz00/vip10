window.V110_MODELS={



frequency(n,h){

let c=0;

h.forEach(x=>{

if(x.front.includes(n))
c++;

});

return c/h.length;

},




trend(n,h){

let r=h.slice(-50);

let c=0;

r.forEach(x=>{

if(x.front.includes(n))
c++;

});

return c/r.length;

},




missing(n,h){

let m=0;


for(let i=h.length-1;i>=0;i--){

if(h[i].front.includes(n))
break;

m++;

}


return 1/(m+1);

},





bayes(n,h){

return (

this.frequency(n,h)*0.5

+

this.trend(n,h)*0.5

);

},





markov(n,h){

if(h.length<2)
return 0;


let s=0;


let a=h[h.length-1];

let b=h[h.length-2];


if(a.front.includes(n))
s+=0.6;


if(b.front.includes(n))
s+=0.4;


return s;

},





matrix(n,h){

let score=0;

let total=0;


h.forEach(x=>{


if(x.front.includes(n)){


x.front.forEach(y=>{


if(y!==n){

score+=Math.abs(y-n);

total++;

}


});


}



});


return total?
score/(total*35):
0;


},





theory(front){


let score=1;



let odd=

front.filter(
x=>x%2
).length;



if(odd===2||odd===3)
score+=0.1;



let sum=

front.reduce(
(a,b)=>a+b,
0
);



if(sum>80&&sum<140)
score+=0.1;



return score;


},





antiHuman(front){


let score=1;



if(front[4]-front[0]>30)
score-=0.1;



let same=

front.filter(
x=>x<=31
).length;


if(same===5)
score-=0.05;



return score;


},





score(n,h){


return (

this.frequency(n,h)*0.2

+

this.trend(n,h)*0.2

+

this.missing(n,h)*0.15

+

this.bayes(n,h)*0.15

+

this.markov(n,h)*0.15

+

this.matrix(n,h)*0.15

);


}



};