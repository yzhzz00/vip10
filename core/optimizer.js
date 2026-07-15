window.V1000_OPTIMIZER={



valid(front){



let sum=

front.reduce(
(a,b)=>a+b,
0
);



let odd=

front.filter(
n=>n%2
).length;



// 和值限制

if(
sum<60 ||
sum>160
)

return false;



// 奇偶限制

if(
odd<1 ||
odd>4
)

return false;



// 连号限制

let link=0;



for(
let i=1;
i<front.length;i++
){


if(
front[i]-front[i-1]===1
)

link++;


}



if(link>=3)

return false;



return true;



}



};