// ======================================
// 彩票智能分析系统 V35.8.2
// engine.js
// 后区优化版
// ======================================


const DLTEngine={


version:"V35.8.2",


seed:3582,


cacheKey:"DLT_V3582_RESULT",


data:[],


frontScore:{},


backScore:{},


markov:{},







random(){


this.seed=
(
this.seed*9301+
49297
)%233280;



return this.seed/233280;


},







init(data){


this.data=data||[];


this.frontScore={};


this.backScore={};


this.markov={};


this.seed=3582;



this.initNumber();


this.frequencyModel();


this.omissionModel();


this.hotColdModel();


this.markovModel();


this.backModel();


this.normalize();



},







initNumber(){



for(
let i=1;
i<=35;
i++
){


let n=
String(i)
.padStart(2,"0");


this.frontScore[n]=0;


}





for(
let i=1;
i<=12;
i++
){


let n=
String(i)
.padStart(2,"0");


this.backScore[n]=0;


}



},







// ==============================
// 前区历史频率
// ==============================


frequencyModel(){



this.data.forEach(item=>{


item.front.forEach(n=>{


this.frontScore[n]+=25;


});




item.back.forEach(n=>{


this.backScore[n]+=25;


});



});



},







// ==============================
// 遗漏模型
// ==============================


omissionModel(){



Object.keys(
this.frontScore
)
.forEach(n=>{


let miss=0;



for(
let i=this.data.length-1;
i>=0;
i--
){



if(
this.data[i]
.front
.includes(n)
){


break;


}



miss++;


}




if(miss>=20){


this.frontScore[n]+=15;


}
else if(miss>=10){


this.frontScore[n]+=8;


}



});



},
// ==============================
// 冷热趋势模型
// ==============================


hotColdModel(){


let recent50 =
this.data.slice(-50);



recent50.forEach(item=>{


item.front.forEach(n=>{


if(
this.frontScore[n]!==undefined
){

this.frontScore[n]+=12;

}


});



});



},







// ==============================
// 马尔可夫转移模型
// ==============================


markovModel(){



for(
let i=1;
i<this.data.length;
i++
){



let before =
this.data[i-1].front;



let after =
this.data[i].front;



before.forEach(a=>{



if(
!this.markov[a]
){

this.markov[a]={};

}





after.forEach(b=>{


if(
!this.markov[a][b]
){

this.markov[a][b]=0;

}



this.markov[a][b]++;



});



});



}



},







// ==============================
// 后区独立模型
// ==============================


backModel(){



this.data.forEach(item=>{



item.back.forEach(n=>{



if(
this.backScore[n]!==undefined
){


this.backScore[n]+=30;


}



});



});






// 后区近期加强


let recent30 =
this.data.slice(-30);



recent30.forEach(item=>{



item.back.forEach(n=>{


if(
this.backScore[n]!==undefined
){


this.backScore[n]+=15;


}



});



});



},







// ==============================
// 归一化
// ==============================


normalize(){



let max=
Math.max(
...Object.values(
this.frontScore
)
);



for(let n in this.frontScore){



this.frontScore[n]=
Number(
(
this.frontScore[n]
/
max
*
100
)
.toFixed(2)
);



}






let max2=
Math.max(
...Object.values(
this.backScore
)
);




for(let n in this.backScore){



this.backScore[n]=
Number(
(
this.backScore[n]
/
max2
*
100
)
.toFixed(2)
);



}




},







// ==============================
// 前区候选池
// ==============================


getTopNumbers(limit=18){



return Object.keys(
this.frontScore
)

.sort(
(a,b)=>
this.frontScore[b]
-
this.frontScore[a]
)

.slice(0,limit);



},







// ==============================
// 生成前区
// ==============================


generateCombination(){



let pool =
this.getTopNumbers(18);



let result=[];


let safe=0;



while(
result.length<5 &&
safe<200
){


safe++;



let n =
pool[
Math.floor(
this.random()
*
pool.length
)
];



if(
!result.includes(n)
){


result.push(n);


}



}



if(
result.length<5
){


result=
pool.slice(0,5);


}



return result.sort(
(a,b)=>
Number(a)-Number(b)
);



},
// ==============================
// 组合评分
// ==============================


combinationScore(nums){


let score=0;



nums.forEach(n=>{


score+=
this.frontScore[n]||0;


});



score/=5;




let arr =
nums.map(Number);




// 奇偶结构


let odd =
arr.filter(
n=>n%2===1
).length;



if(
odd===2||
odd===3
){

score+=8;

}






// 三区结构


let one=0;

let two=0;

let three=0;



arr.forEach(n=>{


if(n<=12){

one++;

}
else if(n<=24){

two++;

}
else{

three++;

}


});



if(
one>0 &&
two>0 &&
three>0
){

score+=10;

}







// 和值


let sum =
arr.reduce(
(a,b)=>a+b,
0
);



if(
sum>=80 &&
sum<=170
){

score+=8;

}






// 限制最高100分


if(score>100){

score=100;

}




return Number(
score.toFixed(2)
);



},







// ==============================
// 后区评分
// ==============================


backCombinationScore(nums){



let score=0;



nums.forEach(n=>{


score+=
this.backScore[n]||0;


});



score/=2;






let a=
Number(nums[0]);

let b=
Number(nums[1]);



// 后区跨度


let span =
b-a;



if(
span>=3 &&
span<=10
){

score+=10;

}






// 后区和值


let sum =
a+b;



if(
sum>=8 &&
sum<=18
){

score+=10;

}





return score;



},







// ==============================
// 后区生成
// ==============================


generateBack(){



let pool =
Object.keys(
this.backScore
);



let best=null;


let bestScore=-1;





for(
let i=0;
i<500;
i++
){



let nums=[];



while(
nums.length<2
){


let n =
pool[
Math.floor(
this.random()
*
pool.length
)
];



if(
!nums.includes(n)
){


nums.push(n);


}



}





nums.sort(
(a,b)=>
Number(a)-Number(b)
);




let score =
this.backCombinationScore(nums);





if(score>bestScore){


bestScore=score;


best=nums;


}



}





return best;



},







// ==============================
// 相似过滤
// ==============================


sameCount(a,b){


let count=0;


a.forEach(n=>{


if(
b.includes(n)
){

count++;

}


});


return count;


},







// ==============================
// 蒙特卡罗
// ==============================


monteCarlo(times=20000){



let list=[];




for(
let i=0;
i<times;
i++
){



let nums =
this.generateCombination();



let score =
this.combinationScore(nums);




list.push({

nums:nums,

score:score

});



}




list.sort(
(a,b)=>
b.score-a.score
);






let result=[];



for(
let item of list
){



let same=false;



for(
let old of result
){


if(
this.sameCount(
item.nums,
old.nums
)>=3
){


same=true;


}



}



if(!same){


result.push(item);


}




if(
result.length>=3
){

break;


}



}




return result;



},







// ==============================
// 主运行
// ==============================


run(){



let cache =
localStorage.getItem(
this.cacheKey
);



if(cache){


return JSON.parse(cache);


}




this.init(
this.data
);





let result =
this.monteCarlo(20000);






let output =
result.map(item=>{


return{


front:item.nums,


back:this.generateBack(),


score:item.score



};



});






localStorage.setItem(

this.cacheKey,

JSON.stringify(output)

);






return output;



},




status(){


return{

version:this.version,

periods:this.data.length

};


}



};







window.DLTEngine =
DLTEngine;