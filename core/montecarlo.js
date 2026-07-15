window.V1000_MONTE={




run(pool,times){



let result={};



for(
let i=0;
i<times;
i++
){



let item=

pool[

Math.floor(

V1000_SEED.random()

*

pool.length

)

];





let key=

item.front.join("-")

+

"+"

+

item.back.join("-");





if(!result[key]){


result[key]={


front:item.front,


back:item.back,


count:0


};


}



result[key].count++;



}






return Object.values(result)

.sort(

(a,b)=>

b.count-a.count

);



}





};