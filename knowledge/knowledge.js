import fs from "fs";


const caseFile =
"./knowledge/cases.json";


const experienceFile =
"./knowledge/experience.json";



function loadCases(){


    try{


        return JSON.parse(

            fs.readFileSync(
                caseFile,
                "utf-8"
            )

        );


    }catch(e){


        return {
            cases:[]
        };


    }


}




function saveCase(data){


    const db =
    loadCases();



    db.cases.push(data);



    fs.writeFileSync(

        caseFile,

        JSON.stringify(
            db,
            null,
            2
        )

    );


}





function loadExperience(){


    try{


        return JSON.parse(

            fs.readFileSync(
                experienceFile,
                "utf-8"
            )

        );


    }catch(e){


        return {

            models:{},

            history:[]

        };


    }


}




function saveExperience(data){


    fs.writeFileSync(

        experienceFile,

        JSON.stringify(
            data,
            null,
            2
        )

    );


}




function recordPrediction(
prediction,
actual
){


    const exp =
    loadExperience();



    exp.history.push({


        time:
        new Date()
        .toISOString(),


        prediction,


        actual


    });



    saveExperience(exp);


}



export {

loadCases,

saveCase,

loadExperience,

saveExperience,

recordPrediction

};