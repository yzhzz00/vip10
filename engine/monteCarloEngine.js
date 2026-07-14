/*
================================

大乐透智能分析系统

V70.8

Monte Carlo AI Engine

多维评分版

================================
*/


class MonteCarloEngine {



constructor(){


this.name="Monte Carlo AI";


this.simulations=100000;


}







random(min,max){


return Math.floor(

Math.random()*(max-min+1)

)+min;


}









createUniqueNumbers(count,min,max){



let arr=[];



while(arr.length<count){



let n=

this.random(min,max);



if(!arr.includes(n)){



arr.push(n);



}



}



return arr.sort(
(a,b)=>a-b
);



}









generateTicket(){



return {



front:

this.createUniqueNumbers(
5,
1,
35
),



back:

this.createUniqueNumbers(
2,
1,
12
)



};



}











// 综合评分模型


score(ticket){



let score=50;



let front=

ticket.front;







// ==================
// 奇偶结构
// ==================


let odd=

front.filter(

n=>n%2!==0

).length;



if(odd===2 || odd===3){



score+=8;



}

else{


score-=5;


}









// ==================
// 大小结构
// ==================


let small=

front.filter(

n=>n<=17

).length;



if(
small===2 ||
small===3
){



score+=8;



}

else{


score-=4;


}









// ==================
// 和值模型
// ==================


let sum=

front.reduce(

(a,b)=>a+b,

0

);



if(
sum>=85 &&
sum<=115
){



score+=12;



}

else if(
sum>=70 &&
sum<=130
){



score+=5;



}

else{


score-=5;


}









// ==================
// 连号概率
// ==================


let link=0;



for(
let i=1;
i<front.length;
i++
){



if(
front[i]-front[i-1]===1
){


link++;


}



}




if(link===1){



score+=5;



}

else if(link>=3){



score-=5;



}









// ==================
// 分布平衡
// ==================


let zones=[0,0,0];



front.forEach(n=>{



if(n<=12)

zones[0]++;


else if(n<=24)

zones[1]++;


else

zones[2]++;



});






let maxZone=

Math.max(...zones);






if(maxZone<=3){



score+=8;



}

else{


score-=3;


}









// ==================
// 随机微调
// 防止大量同分
// ==================


score +=

Math.random()*6;






return Number(

score.toFixed(2)

);



}









simulate(){



let result=[];






for(
let i=0;
i<this.simulations;
i++
){



let ticket=

this.generateTicket();





ticket.score=

this.score(ticket);





result.push(ticket);



}








// 排序


result.sort(

(a,b)=>

b.score-a.score

);









// 去除重复组合


let unique=[];



let cache={};





for(let item of result){



let key=

item.front.join(",")

+

"|"

+

item.back.join(",");





if(!cache[key]){



cache[key]=true;


unique.push(item);



}





if(unique.length>=20)

break;



}








return {



engine:this.name,


count:this.simulations,


top:unique



};



}



}






window.MonteCarloEngine=

new MonteCarloEngine();