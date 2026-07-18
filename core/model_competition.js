/**
 * DLT-AI-CORE VIP
 * Model Competition V8.0 FINAL
 *
 * 多模型竞争进化
 */


class ModelCompetition {



constructor(){


this.models={



statistics:{

weight:0.25,

score:0,

count:0

},



bayesian:{

weight:0.20,

score:0,

count:0

},



markov:{

weight:0.20,

score:0,

count:0

},



matrix:{

weight:0.15,

score:0,

count:0

},



structure:{

weight:0.20,

score:0,

count:0

}



};



}









update(

feedback

){



Object.keys(

this.models

)

.forEach(

name=>{



const model=

this.models[name];





model.count++;






if(

feedback>=3

){



model.score++;


}



const rate=

model.score

/

model.count;








model.weight=

this.normalize(

rate

);



}



);







return this.models;



}









normalize(

value

){



if(

value<=0

)

return 0.05;



if(

value>=1

)

return 0.5;



return Number(

value.toFixed(3)

);



}









ranking(){



return Object.keys(

this.models

)

.map(

name=>({



model:name,



weight:

this.models[name].weight,



score:

this.models[name].score,



count:

this.models[name].count



})

)

.sort(

(a,b)=>

b.weight-a.weight

);



}









getWeights(){



const total=

Object.values(

this.models

)

.reduce(

(a,b)=>

a+b.weight,

0

);





const result={};





Object.keys(

this.models

)

.forEach(

name=>{



result[name]=

Number(

(

this.models[name].weight

/

total

)

.toFixed(3)

);



});







return result;



}



}



export default ModelCompetition;