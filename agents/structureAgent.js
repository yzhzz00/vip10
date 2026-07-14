/*
================================

大乐透智能分析系统

V71.1

Structure AI

号码结构分析模块

================================
*/


class StructureAgent {



constructor(){


this.name="Structure AI";


}









analyze(history){



if(

!history ||

history.length===0

){



return {

error:"暂无历史数据"

};



}







let recent=

history.slice(-100);








let oddPattern={};


let zone={};


let sumList=[];






let size={



small:0,


big:0



};









recent.forEach(item=>{



let front=item.front;







let odd=

front.filter(

n=>n%2!==0

).length;






let even=

5-odd;







let pattern=

odd+":"+even;






oddPattern[pattern]=

(oddPattern[pattern]||0)+1;







front.forEach(num=>{



// 大小


if(num<=17){



size.small++;



}

else{



size.big++;



}






// 三区


if(num<=12){



zone.zone1=

(zone.zone1||0)+1;



}

else if(num<=24){



zone.zone2=

(zone.zone2||0)+1;



}

else{



zone.zone3=

(zone.zone3||0)+1;



}



});







let sum=

front.reduce(

(a,b)=>a+b,

0

);






sumList.push(sum);



});








let avgSum=

Math.round(

sumList.reduce(

(a,b)=>a+b,

0

)

/

sumList.length

);









let bestPattern=

Object.keys(

oddPattern

).sort(

(a,b)=>

oddPattern[b]-oddPattern[a]

)[0];









return {



agent:this.name,



period:100,




oddEven:{



most:

bestPattern,



distribution:

oddPattern



},




size:{



small:size.small,


big:size.big



},





zone:zone,






sum:{



average:avgSum,



range:

avgSum>=80 && avgSum<=120

?

"正常和值"

:

"偏离和值"



},






strategy:



"结构多维评分"



};




}





}






window.StructureAgent=

new StructureAgent();