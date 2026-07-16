const rankingEngine =
require("./engine/rankingEngine");



const data=[


{

front:[3,8,17,26,31],

back:[4,11],

finalScore:88,


scores:{

sum:100,

zone:100,

span:90,

oddEven:60

}

}


];



console.log(
rankingEngine(data)
);