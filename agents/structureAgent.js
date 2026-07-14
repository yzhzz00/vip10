/*
====================================

大乐透智能分析系统 V70

Structure AI Agent

结构分析专家

====================================
*/


const StructureAgent = {


version:"V70.0",




analyze(history){



let odd=0;

let even=0;


let small=0;

let big=0;



let zone={


one:0,


two:0,


three:0


};




let sumTotal=0;



let last100=

history.slice(-100);







last100.forEach(item=>{



let sum=0;



item.front.forEach(n=>{



let num=

Number(n);




sum+=num;






// 奇偶

if(num%2===0)

even++;

else

odd++;







// 大小

if(num<=17)

small++;

else

big++;







// 三区

if(num<=12)

zone.one++;


else if(num<=24)

zone.two++;


else

zone.three++;



});



sumTotal+=sum;



});







let avgSum=

Number(

(sumTotal/last100.length)

.toFixed(2)

);







let strategy="balanced";


let reason=[];






// 奇偶判断

let oddRate=

odd/(odd+even);





if(oddRate>0.65){



reason.push(

"近期奇数偏热，降低奇号比例"

);



}



if(oddRate<0.35){



reason.push(

"近期偶数偏热，关注奇号回补"

);



}







// 和值判断


if(avgSum>105){



reason.push(

"和值偏高，控制大号数量"

);



}



if(avgSum<85){



reason.push(

"和值偏低，关注和值回升"

);



}







// 三区判断


let zoneBalance=[

zone.one,

zone.two,

zone.three

];



if(

Math.max(...zoneBalance)

-

Math.min(...zoneBalance)

>80

){


reason.push(

"三区失衡，需要重新平衡"

);



}







return {


agent:"Structure AI",


strategy,


oddEven:{


odd,


even


},


size:{


small,


big


},


zone,


averageSum:avgSum,


reason



};



}



};





window.StructureAgent=

StructureAgent;