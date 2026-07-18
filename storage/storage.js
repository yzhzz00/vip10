import fs from "fs";


const paths = {

    history:
    "./storage/history.json",

    feedback:
    "./storage/feedback.json",

    prediction:
    "./storage/prediction.json"

};





function read(path){


    try{


        return JSON.parse(

            fs.readFileSync(
                path,
                "utf-8"
            )

        );


    }catch(e){


        return {};


    }


}





function write(path,data){


    fs.writeFileSync(

        path,

        JSON.stringify(
            data,
            null,
            2
        )

    );


}





function savePrediction(data){


    const db=

    read(
        paths.prediction
    );



    db.latest=data;



    db.history.push({

        time:
        new Date()
        .toISOString(),

        data

    });



    write(

        paths.prediction,

        db

    );


}





function saveFeedback(data){


    const db=

    read(
        paths.feedback
    );



    db.records.push(data);



    write(

        paths.feedback,

        db

    );


}





function updateHistory(data){


    write(

        paths.history,

        data

    );


}





function getPrediction(){


    return read(

        paths.prediction

    );


}





export {

savePrediction,

saveFeedback,

updateHistory,

getPrediction

};