window.V110_CONFERENCE={




vote(history){



let models=[

"trend",

"bayes",

"markov",

"matrix"

];



let votes={};



let members=[];




models.forEach(type=>{


let arr=[];


for(
let i=1;i<=35;i++
){


arr.push({

n:i,

s:
V110_MODELS[type](i,history)

});


}



arr.sort(
(a,b)=>b.s-a.s
);



let nums=

arr.slice(0,5)
.map(x=>x.n);



members.push({

name:type,

numbers:nums

});




nums.forEach(n=>{


votes[n]=
(votes[n]||0)+1;


});




});






let final=

Object.keys(votes)

.map(n=>({

n:Number(n),

v:votes[n]

}))

.sort(

(a,b)=>b.v-a.v

)

.slice(0,5)

.map(x=>x.n)

.sort(
(a,b)=>a-b
);







let result={


members,


final,


time:Date.now()


};





V110_DB.saveConference(
result
);



return result;


}



};