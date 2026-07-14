/*
====================================

大乐透智能分析系统 V70 CORE

Risk Agent

风险控制专家


功能：

1. 组合风险检测
2. 结构异常提醒
3. 给Master AI提供反向意见


====================================
*/


class RiskAgent{


constructor(){


this.name="Risk AI";


this.version="V70.0";


}







analyze(numbers){



if(!numbers || numbers.length===0){



return {


risk:true,


reason:[

"没有检测号码"

]



};



}







let risk=[];




let odd=0;

let even=0;


let sum=0;




numbers.forEach(n=>{



let num=

Number(n);



sum+=num;



if(num%2===0){

even++;

}else{

odd++;

}



});







// 奇偶风险

if(odd===5 || even===5){



risk.push(

"奇偶比例极端"

);



}





// 和值风险


if(sum<60){


risk.push(

"和值过低"

);


}



if(sum>140){


risk.push(

"和值过高"

);


}







return {



agent:this.name,



risk:

risk.length>0,



score:

Math.max(

0,

100-risk.length*20

),



reason:

risk.length

?

risk

:

[

"结构风险正常"

]



};





}



}







window.RiskAgent=

new RiskAgent();