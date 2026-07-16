const fs = require("fs");

const path = require("path");



const historyFile = path.join(

    __dirname,

    "../data/dlt_history.json"

);





function loadHistory(){


    try{


        if(!fs.existsSync(historyFile)){

            return [];

        }



        const data = fs.readFileSync(

            historyFile,

            "utf-8"

        );



        return JSON.parse(data);



    }catch(error){


        console.log(
            "history error:",
            error.message
        );


        return [];


    }


}






function getLatest(count=5){


    const data = loadHistory();


    return data.slice(-count);


}






module.exports={

    loadHistory,

    getLatest

};