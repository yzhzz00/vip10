window.DLT_PARSER = {


parseLine(line){


if(!line || !line.trim()){

return null;

}


let arr=line.trim().split(/\s+/);



let nums=arr.map(Number).filter(n=>!isNaN(n));



if(nums.length<7){

return null;

}



return {


front:nums.slice(0,5),


back:nums.slice(5,7),


raw:line.trim()


};



},





parse(text){


let result=[];


let lines=text.split("\n");



lines.forEach(line=>{


let item=this.parseLine(line);


if(item){

result.push(item);

}


});



return result;


},







check(data){



return {


count:data.length,


valid:data.every(

x=>

x.front.length===5

&&

x.back.length===2

)



};


},







recent(data,num){



return data.slice(

Math.max(

0,

data.length-num

)

);



}






};