/*
====================================

大乐透智能分析系统 V70 CORE

Structure Agent

号码结构分析专家


分析：

1. 奇偶结构
2. 大小结构
3. 三区结构
4. 和值趋势
5. 组合风险


====================================
*/


class StructureAgent{


constructor(){


this.name="Structure AI";


this.version="V70.0";


}





analyze(history){



if(!history || history.length===0){


return {


strategy:"unknown",


reason:[

"无历史数据"

]


};


}






let recent=

history.slice(-100);






let odd=0;

let even=0;


let small=0;

let big=0;


let sumList=[];


let zones={

zone1:0,

zone2:0,

zone3:0

};






recent.forEach(item=>{



if(!item.front)return;




let sum=0;



item.front.forEach(num=>{


let n=

Number(num);



sum+=n;




if(n%2===0){

even++;

}else{

odd++;

}





if(n<=17){

small++;

}

else{

big++;

}





if(n<=11){


zones.zone1++;


}

else if(n<=22){


zones.zone2++;


}

else{


zones.zone3++;


}



});



sumList.push(sum);



});









let averageSum=0;



if(sumList.length){


averageSum=

sumList.reduce(

(a,b)=>a+b,0

)

/sumList.length;


}






return {



agent:this.name,



strategy:"structure",




oddEven:{


odd,

even


},




bigSmall:{


big,

small


},




zones:zones,




averageSum:

Number(

averageSum.toFixed(2)

),




confidence:0.7,




reason:[



"最近100期结构分析",



"平均和值："+

averageSum.toFixed(2),



"奇偶统计：奇"+

odd+

" 偶"+

even,



"三区结构完成分析"



]



};




}



}





window.StructureAgent=

new StructureAgent();