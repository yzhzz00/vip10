alert("新的engine.js已经加载");


class AIEngine {


async init(){

return true;

}



status(){

return {

version:"TEST",

data:0

};


}


}


window.AIEngine=new AIEngine();