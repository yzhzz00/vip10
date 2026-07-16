const decisionEngine =
require("./engine/decisionEngine");


const candidates=[


{
front:[3,8,17,26,31],
back:[4,11],
sum:85,
zone:"2-1-2"
},


{
front:[6,12,18,27,35],
back:[2,9],
sum:98,
zone:"2-1-2"
}


];



const portrait={


sum:{
min:90,
max:105
},


span:{
range:{
min:20,
max:35
}
},


zone:{
value:"2-1-2"
},


oddEven:{
value:"3-2"
}


};



console.log(
decisionEngine(
candidates,
portrait
)
);