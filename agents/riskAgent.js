/*
====================================

大乐透智能分析系统 V70

Risk AI Agent

风险控制专家

====================================
*/


const RiskAgent={


version:"V70.0",




check(front){



let risk=0;


let reason=[];



let nums=

front.map(Number);







// ==================
// 奇偶检查
// ==================


let odd=

nums.filter(

n=>n%2===1

).length;



let even=

5-odd;



if(

odd===5 ||

even===5

){



risk+=30;



reason.push(

"奇偶过度集中"

);



}







// ==================
// 大小检查
// ==================


let small=

nums.filter(

n=>n<=17

).length;



let big=

5-small;



if(

small===5 ||

big===5

){



risk+=25;



reason.push(

"大小结构异常"

);



}







// ==================
// 和值检查
// ==================


let sum=

nums.reduce(

(a,b)=>a+b,

0

);





if(sum<55){



risk+=20;



reason.push(

"和值过低"

);



}



if(sum>140){



risk+=20;



reason.push(

"和值过高"

);



}







// ==================
// 连号检查
// ==================


let sorted=

[...nums]

.sort(

(a,b)=>a-b

);





let consecutive=0;



for(

let i=1;

i<sorted.length;

i++

){



if(

sorted[i]-sorted[i-1]===1

){



consecutive++;

}


}





if(consecutive>=3){



risk+=15;



reason.push(

"连续号码过多"

);



}







// ==================
// 三区检查
// ==================


let zone=[0,0,0];



nums.forEach(n=>{


if(n<=12)

zone[0]++;


else if(n<=24)

zone[1]++;


else

zone[2]++;


});





if(

Math.max(...zone)-

Math.min(...zone)

>=4

){



risk+=15;



reason.push(

"三区失衡"

);



}







return {



agent:"Risk AI",


risk,


pass:

risk<40,


reason



};



}




};






window.RiskAgent=

RiskAgent;