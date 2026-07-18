/**
 * DLT-AI-CORE VIP
 * Data Test V1.0
 */


import DataEngine from "../core/data_engine.js";


const engine =

new DataEngine();



async function test(){


const data =

await engine.load();



console.log(
"数据数量:",
data.length
);



if(data.length>0){


console.log(
"最新一期:",
data[data.length-1]
);


console.log(
"DATA TEST PASS"
);


}else{


console.log(
"DATA TEST FAIL"
);


}


}



test();