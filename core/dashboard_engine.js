/**
 * DLT-AI-CORE VIP
 * Dashboard Engine V7.0 FINAL
 */


import StorageEngine from "./storage_engine.js";



class DashboardEngine {



constructor(){


this.storage=

new StorageEngine();


}









getDashboard(){



const predictions=

this.storage.read(

"predictions.json"

);





const learning=

this.storage.read(

"learning.json"

);





const weights=

this.storage.read(

"weights.json"

);









return {



system:{



status:

"running",



version:

"V7.0 FINAL"



},







prediction:{



total:

predictions.length,



latest:

predictions.slice(-10)



},







learning:{



total:

learning.length,



history:

this.learningCurve(

learning

)



},







models:



this.modelRank(

weights

)



};



}









learningCurve(

data

){



return data.map(

(item,index)=>({



step:

index+1,



score:

item.hit

?

item.hit.score

:

0



})

);



}









modelRank(

weights

){



return Object.keys(

weights

)

.map(

name=>({



model:

name,



weight:

weights[name]



})

)

.sort(

(a,b)=>

b.weight-a.weight

);



}



}



export default DashboardEngine;