window.DLT_MODELS = {



/*
==========================
频率模型
==========================
*/

frequency(number,history){


let count=0;


history.forEach(item=>{


if(item.front.includes(number)){


count++;


}


});



return count/history.length*100;



},







/*
==========================
趋势模型
==========================
*/


trend(number,history){



let recent=

history.slice(-30);



let count=0;



recent.forEach(item=>{


if(item.front.includes(number)){


count++;


}


});



return count/30*100;



},







/*
==========================
遗漏周期模型
==========================
*/


missing(number,history){



let miss=0;



for(
let i=history.length-1;
i>=0;
i--
){



if(history[i].front.includes(number)){


break;


}



miss++;


}




// 接近平均遗漏给予较高分

return Math.max(

0,

100-Math.abs(miss-10)*5

);



},







/*
==========================
三区结构模型
==========================
*/


structure(front){



let low=0;

let mid=0;

let high=0;



front.forEach(n=>{



if(n<=12)

low++;


else if(n<=24)

mid++;


else

high++;



});




let key=

`${low}:${mid}:${high}`;



let good=[

"2:2:1",

"1:2:2",

"2:1:2"

];



return good.includes(key)

?

90

:

60;



},







/*
==========================
矩阵关系模型
==========================
*/


matrix(front,history){



let score=0;



for(
let i=0;
i<front.length;
i++
){



for(
let j=i+1;
j<front.length;
j++
){



let a=front[i];

let b=front[j];



let together=0;



history.forEach(item=>{


if(
item.front.includes(a)

&&

item.front.includes(b)

){


together++;


}


});



score+=together;



}



}




return Math.min(

100,

score

);



},







/*
==========================
Markov模型
==========================
*/


markov(number,history){



if(history.length<2){

return 50;

}



let last=

history[history.length-1];



let next=0;



history.forEach((item,index)=>{



if(
index<history.length-1

&&

item.front.some(n=>last.front.includes(n))

){


if(history[index+1].front.includes(number)){


next++;


}


}



});



return Math.min(

100,

next*10

);



},







/*
==========================
Bayes融合评分
==========================
*/


bayes(scores){



let total=0;



scores.forEach(s=>{


total+=s;


});



return total/scores.length;



},







/*
==========================
形态模型
==========================
*/


shape(front){



let score=70;



let sorted=[...front].sort(

(a,b)=>a-b

);



for(
let i=1;
i<sorted.length;
i++
){



if(
sorted[i]-sorted[i-1]===1
){



score+=5;



}



}



return Math.min(

100,

score

);



},







/*
==========================
反人类模型
==========================
*/


antiHuman(front){



let score=100;



// 全连续

let continuous=true;



for(
let i=1;
i<front.length;
i++
){



if(
front[i]!==front[i-1]+1

){


continuous=false;


}



}



if(continuous){

score-=40;

}




// 生日号过多

let small=

front.filter(n=>n<=12).length;



if(small>=4){


score-=20;


}




return score;



}







};