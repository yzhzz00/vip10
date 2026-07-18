/**
 * DLT-AI-CORE VIP
 * Storage Engine V6.1 FINAL
 *
 * 数据持久化
 */


import fs from "fs";
import path from "path";



class StorageEngine {



constructor(){


this.base=

"./storage";


}









read(

file

){



const target=

path.join(

this.base,

file

);





if(

!fs.existsSync(target)

){



return [];



}





return JSON.parse(

fs.readFileSync(

target,

"utf-8"

)

);



}









write(

file,

data

){



const target=

path.join(

this.base,

file

);





fs.writeFileSync(

target,

JSON.stringify(

data,

null,

2

)

);



}









savePrediction(

data

){



const list=

this.read(

"predictions.json"

);





list.push({



time:

new Date(),


...data



});





this.write(

"predictions.json",

list.slice(-500)

);



}









saveLearning(

data

){



const list=

this.read(

"learning.json"

);





list.push({



time:

new Date(),


...data



});





this.write(

"learning.json",

list.slice(-1000)

);



}









getWeights(){



return this.read(

"weights.json"

);



}









saveWeights(

weights

){



this.write(

"weights.json",

weights

);



}



}



export default StorageEngine;