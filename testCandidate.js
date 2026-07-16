const generateCandidates =
require("./engine/candidateGenerator");


const portrait={


sum:{

min:90,

max:105

},


zone:{

value:"2-1-2"

}


};



const result =
generateCandidates(
    portrait,
    20
);



console.log(
    result
);