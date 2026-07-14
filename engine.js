class AIEngine {


constructor(){

this.version="V70.TEST";

this.dlt=[];

this.agents={};

}



async init(){


await this.loadData();


return true;


}




async loadData(){


try{


let res=await fetch(
"data/dlt.txt?t="+Date.now()
);



if(!res.ok){

throw new Error(
"dlt.txt读取失败"
);

}



let text=await res.text();



let lines=text.trim().split(/\n+/);



this.dlt=[];



lines.forEach(line=>{


let arr=line.trim().split(/\s+/);



if(arr.length>=8){


this.dlt.push({


front:[

arr[2],
arr[3],
arr[4],
arr[5],
arr[6]

],


back:[

arr[7],
arr[8]

]


});


}



});



console.log(
"数据数量:",
this.dlt.length
);



}catch(e){


console.log(
"数据错误:",
e
);



throw e;


}



}





loadAgents(){



return true;


}





status(){


return {


version:this.version,


data:this.dlt.length,


agents:[]

};


}



}





window.AIEngine=new AIEngine();