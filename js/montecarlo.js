// ================================================
// 大乐透AI V90 FINAL
// Monte Carlo 模拟模块
// ================================================

"use strict";


window.V90MonteCarlo={



// ================================================
// 单次生成
// ================================================


createNumber(){



let nums=[];



while(
nums.length<5
){



let n=

Math.floor(
Math.random()*35
)+1;



if(
!nums.includes(n)
){


nums.push(n);


}



}



return nums.sort(
(a,b)=>a-b
);



},







// ================================================
// 后区生成
// ================================================


createBack(){



let nums=[];



while(
nums.length<2
){



let n=

Math.floor(
Math.random()*12
)+1;



if(
!nums.includes(n)
){


nums.push(n);


}



}



return nums.sort(
(a,b)=>a-b
);



},







// ================================================
// 模拟100万次
// ================================================


run(times=1000000,callback){



return new Promise(resolve=>{



let result={};





let i=0;





function loop(){



let batch=5000;





for(
let j=0;
j<batch && i<times;
j++,i++
){



let front=

this.createNumber();



let back=

this.createBack();





let key=

front.join("-")

+

"|"

+

back.join("-");






if(
!result[key]
){



result[key]={



front,


back,


count:0



};



}




result[key].count++;



}







// 更新进度


let progress=

Math.floor(
i/times*100
);





if(callback){



callback(progress);



}






if(
i<times
){



setTimeout(
loop,
0
);



}else{



let ranking=

Object.values(result)

.sort(

(a,b)=>

b.count-a.count

)

.slice(0,50);





resolve(ranking);



}





}





loop();



});



}







};