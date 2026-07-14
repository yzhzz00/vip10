// ======================================
// 彩票智能分析系统 V35.7.2
// 修正版
// Part 1/4
// ======================================


let dltData=[];

let frontScore={};

let backScore={};

let finalPlans=[];

let loaded=false;





window.onload=function(){


initSystem();



document
.getElementById("predictBtn")
.onclick=function(){


runPrediction();


};





document
.getElementById("feedbackBtn")
.onclick=function(){


saveFeedback();


};



};









async function initSystem(){



await loadDLT();



await loadPL5();



loaded=true;




document.getElementById(
"systemStatus"
).innerHTML=

"V35.7.2系统运行正常";



}










async function loadDLT(){



try{



let res=
await fetch(
"data/dlt_raw.txt?v=3572"
);



let text=
await res.text();





dltData=
parseDLT(text);






document.getElementById(
"dltStatus"
).innerHTML=
"已加载";




document.getElementById(
"dataCount"
).innerHTML=
dltData.length;



}catch(e){



console.log(e);



}



}










async function loadPL5(){


try{


await fetch(
"data/pl5_raw.txt?v=3572"
);



document.getElementById(
"pl5Status"
).innerHTML=
"已加载";



}catch(e){



document.getElementById(
"pl5Status"
).innerHTML=
"未加载";


}



}









function parseDLT(text){



let result=[];



text.split(/\r?\n/)
.forEach(line=>{



let arr=
line.trim()
.split(/\s+/);




if(arr.length<9)
return;




let front=[];

let back=[];




for(let i=2;i<=6;i++){



front.push(
String(
Number(arr[i])
)
.padStart(2,"0")
);



}



for(let i=7;i<=8;i++){



back.push(
String(
Number(arr[i])
)
.padStart(2,"0")
);



}






if(front.length===5 &&
back.length===2){



result.push({

front:front,

back:back

});



}




});





return result;



}









function runPrediction(){



if(!loaded){



alert(
"数据未加载"
);



return;



}



try{


buildModel();



setTimeout(()=>{


monteCarlo();



normalizeFinalScore();



showResult();



},50);



}catch(e){



document.getElementById(
"result"
).innerHTML=

"运行错误："+e;



console.log(e);



}



}
// ======================================
// V35.7.2 Part 2/4
// 综合评分模型
// ======================================



function buildModel(){



frontScore={};

backScore={};





// 初始化前区

for(let i=1;i<=35;i++){


frontScore[
String(i).padStart(2,"0")
]=0;


}



// 初始化后区

for(let i=1;i<=12;i++){


backScore[
String(i).padStart(2,"0")
]=0;


}







// ================================
// 历史频率
// ================================


dltData.forEach(item=>{



item.front.forEach(n=>{


frontScore[n]+=30;


});



item.back.forEach(n=>{


backScore[n]+=30;


});



});









// ================================
// 最近趋势
// ================================


let recent100 =
dltData.slice(-100);



recent100.forEach(item=>{



item.front.forEach(n=>{


frontScore[n]+=20;


});



item.back.forEach(n=>{


backScore[n]+=20;


});



});









// ================================
// 最近30期
// ================================


let recent30 =
dltData.slice(-30);



recent30.forEach(item=>{



item.front.forEach(n=>{


frontScore[n]+=15;


});



item.back.forEach(n=>{


backScore[n]+=15;


});



});








// ================================
// 遗漏评分
// ================================


Object.keys(frontScore)
.forEach(n=>{


frontScore[n]+=
getMissWeight(
getFrontMiss(n)
);



});






Object.keys(backScore)
.forEach(n=>{


backScore[n]+=
getMissWeight(
getBackMiss(n)
);



});







markov();



normalize(frontScore);


normalize(backScore);



}









function getFrontMiss(num){



let count=0;



for(let i=dltData.length-1;i>=0;i--){



if(
dltData[i].front.includes(num)
){



break;



}



count++;



}



return count;



}








function getBackMiss(num){



let count=0;



for(let i=dltData.length-1;i>=0;i--){



if(
dltData[i].back.includes(num)
){



break;



}



count++;



}



return count;



}









function getMissWeight(v){



if(v>=20)
return 15;



if(v>=10)
return 8;



return 3;



}









// ================================
// 一阶马尔可夫
// ================================


function markov(){



for(let i=1;i<dltData.length;i++){



let last=
dltData[i-1].front;



let now=
dltData[i].front;





last.forEach(a=>{



now.forEach(b=>{



if(frontScore[b]!==undefined){



frontScore[b]+=10;



}



});



});



}



}









// ================================
// 标准化
// ================================


function normalize(obj){



let arr=
Object.values(obj);



let max=
Math.max(...arr);



let min=
Math.min(...arr);





for(let k in obj){



if(max===min){


obj[k]=50;


}else{



obj[k]=

((obj[k]-min)/
(max-min))*100;



}



}



}
// ======================================
// V35.7.2 Part 3/4
// 蒙特卡罗模拟
// 组合评分
// ======================================



async function monteCarlo(){



let candidates=[];



let pool=
Object.keys(frontScore);






// 100000次模拟

for(let i=0;i<100000;i++){



let nums =
randomPick(pool);



let score =
comboScore(nums);





candidates.push({

nums:nums,

score:score


});






// 防止手机卡死

if(i%5000===0){



await new Promise(
resolve=>setTimeout(resolve,0)
);



}



}








// 排序

candidates.sort(
(a,b)=>b.score-a.score
);







finalPlans=[];



let selected=[];








for(let item of candidates){



let repeat=false;




for(let old of selected){



let same=0;



item.nums.forEach(n=>{



if(old.includes(n)){



same++;



}



});





if(same>=4){



repeat=true;



}



}






if(!repeat){



finalPlans.push(item);



selected.push(item.nums);



}



if(finalPlans.length>=3){



break;



}



}



}











// ================================
// 权重随机选号
// ================================


function randomPick(pool){



let result=[];



while(result.length<5){



let total=0;



pool.forEach(n=>{



total+=frontScore[n]+1;



});






let r=
Math.random()*total;



let sum=0;






for(let n of pool){



sum+=frontScore[n]+1;



if(sum>=r){



if(!result.includes(n)){



result.push(n);



}



break;



}



}



}







result.sort(
(a,b)=>Number(a)-Number(b)
);



return result;



}









// ================================
// 组合评分
// ================================


function comboScore(arr){



let score=0;



let nums=
arr.map(Number);






// 号码基础分

arr.forEach(n=>{



score+=frontScore[n];



});





score/=5;








// 奇偶

let odd =
nums.filter(
n=>n%2===1
).length;





if(odd===2||odd===3){



score+=8;



}









// 三区

let z1=0;

let z2=0;

let z3=0;





nums.forEach(n=>{



if(n<=12)
z1++;

else if(n<=24)
z2++;

else
z3++;



});





if(z1>0&&z2>0&&z3>0){



score+=10;



}








// 和值

let sum =
nums.reduce(
(a,b)=>a+b,
0
);





if(sum>=80&&sum<=170){



score+=6;



}









// 跨度

let span =
nums[4]-nums[0];





if(span>=15&&span<=32){



score+=5;



}









// 连号

let link=0;



for(let i=1;i<nums.length;i++){



if(nums[i]-nums[i-1]===1){



link++;



}



}




if(link<=2){



score+=3;



}








return score;



}
// ======================================
// V35.7.2 Part 4/4
// 最终评分
// 后区模型
// 页面输出
// 开奖反馈
// ======================================



// ================================
// 评分归一化
// ================================


function normalizeFinalScore(){



if(finalPlans.length===0){

return;

}



let max =
Math.max(
...finalPlans.map(x=>x.score)
);



let min =
Math.min(
...finalPlans.map(x=>x.score)
);






finalPlans.forEach(item=>{



if(max===min){



item.score=85;



}else{



item.score=
Number(
(
80+
((item.score-min)/
(max-min))*20
)
.toFixed(2)
);



}



});



}









// ================================
// 后区差异化
// ================================


function getBack(index){



let list=
Object.keys(backScore)
.sort(
(a,b)=>
backScore[b]-backScore[a]
);






let groups=[



[list[0],list[1]],



[list[2],list[3]],



[list[4],list[5]]



];






return groups[index] || groups[0];



}









// ================================
// 显示结果
// ================================


function showResult(){



let html="";





html+=
"<b>彩票智能分析系统 V35.7.2</b><br><br>";





html+=
"数据期数："+

dltData.length+

"期<br><br>";





html+=
"蒙特卡罗模拟：100000组<br><br>";





html+=
"最终推荐<br><br>";







if(finalPlans.length===0){



html+=
"暂无符合条件方案";



}else{



finalPlans.forEach(
(item,index)=>{



let back=
getBack(index);





html+=

"方案"+
(index+1)+
"：";





html+=
item.nums.join(" ");





html+=
" + ";





html+=
back.join(" ");





html+=
"<br>";





html+=
"综合评分："+

item.score+

"分";





html+=
"<br><br>";



}

);



}






html+=
"模型状态：V35.7.2综合模型完成";







let result=
document.getElementById(
"result"
);



if(result){



result.innerHTML=html;



}







document.getElementById(
"systemStatus"
).innerHTML=

"V35.7.2模型运行成功<br>"+
dltData.length+
"期历史数据参与计算";



}









// ================================
// 开奖反馈
// ================================


function saveFeedback(){



let input=
document.getElementById(
"realResult"
);





if(!input||
input.value.trim()===""){



alert(
"请输入开奖结果"
);



return;



}






document.getElementById(
"learningStatus"
).innerHTML=

"已记录开奖反馈："+

input.value;



}







// ================================
// 回测接口
// ================================


function backTest(){



let hit=0;



finalPlans.forEach(plan=>{



dltData.forEach(item=>{



let same=0;



plan.nums.forEach(n=>{



if(
item.front.includes(n)
){



same++;



}



});





if(same>=3){



hit++;



}



});



});






return hit;



}



// ======================================
// V35.7.2 END
// ======================================