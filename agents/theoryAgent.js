/*
================================

大乐透智能分析系统

V71.1

Theory AI

大乐透理论库模块

================================
*/


class TheoryAgent {



constructor(){


this.name="Theory AI";


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






let odd={};


let size={};


let zones={};



let sums=[];









recent.forEach(item=>{



let front=item.front;








// 奇偶


let oddCount=

front.filter(

n=>n%2!==0

).length;






let evenCount=

5-oddCount;






let oddPattern=

oddCount+":"+evenCount;






odd[oddPattern]=

(odd[oddPattern]||0)+1;










// 大小


let small=

front.filter(

n=>n<=17

).length;






let big=

5-small;






let sizePattern=

small+":"+big;






size[sizePattern]=

(size[sizePattern]||0)+1;











// 三区


front.forEach(num=>{



if(num<=12){



zones.zone1=

(zones.zone1||0)+1;



}

else if(num<=24){



zones.zone2=

(zones.zone2||0)+1;



}

else{



zones.zone3=

(zones.zone3||0)+1;



}



});











// 和值


let sum=

front.reduce(

(a,b)=>a+b,

0

);






sums.push(sum);



});









let avgSum=

Math.round(

sums.reduce(

(a,b)=>a+b,

0

)

/

sums.length

);








return {



agent:this.name,



period:100,






oddEven:{



pattern:

this.maxKey(odd),



detail:odd



},







size:{



pattern:

this.maxKey(size),



detail:size



},







zone:zones,







sum:{



value:avgSum,



range:

avgSum>=80 && avgSum<=120

?

"正常和值"

:

"偏离和值"



},








theoryCheck:[



"奇偶结构理论分析完成",



"大小比例理论分析完成",



"三区分布理论分析完成",



"和值模型分析完成"



],








strategy:



"理论结构验证"





};






}









maxKey(obj){



return Object.keys(obj)

.sort(

(a,b)=>

obj[b]-obj[a]

)[0]

|| "";



}







}






window.TheoryAgent=

new TheoryAgent();