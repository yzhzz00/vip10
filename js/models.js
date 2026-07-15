window.DLT_MODELS = {



frequency(n,data){


let c=0;


data.forEach(d=>{


if(d.front.includes(n)){

c++;

}


});


return c/data.length*100;


},







trend(n,data){


let recent=data.slice(-30);



let c=0;



recent.forEach(d=>{


if(d.front.includes(n)){


c++;


}


});



return c/30*100;


},







missing(n,data){



let miss=0;



for(let i=data.length-1;i>=0;i--){



if(data[i].front.includes(n)){


break;


}


miss++;


}



return Math.max(

0,

100-Math.abs(miss-10)*5

);



},







structure(front){



let a=0,b=0,c=0;



front.forEach(n=>{


if(n<=12)a++;

else if(n<=24)b++;

else c++;


});



let key=

a+":"+b+":"+c;



return [

"2:2:1",

"1:2:2",

"2:1:2"

].includes(key)

?

90

:

60;



},







shape(front){


let score=70;



let arr=[...front].sort(

(a,b)=>a-b

);



for(let i=1;i<arr.length;i++){



if(arr[i]-arr[i-1]==1){


score+=5;


}



}



return Math.min(

100,

score

);



},







antiHuman(front){


let score=100;



let small=

front.filter(

n=>n<=12

).length;



if(small>=4){

score-=20;

}



return score;


}





};