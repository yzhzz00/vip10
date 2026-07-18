import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";



const __filename =
fileURLToPath(import.meta.url);


const __dirname =
path.dirname(__filename);



const FEEDBACK_FILE =
path.join(
__dirname,
"../data/feedback.json"
);







function ensureFile(){


    if(
        !fs.existsSync(
            FEEDBACK_FILE
        )
    ){


        fs.writeFileSync(

            FEEDBACK_FILE,

            "[]",

            "utf-8"

        );


    }


}









function readFeedback(){



    ensureFile();



    try{


        return JSON.parse(

            fs.readFileSync(

                FEEDBACK_FILE,

                "utf-8"

            )

        );


    }

    catch(e){


        return [];

    }


}









function saveFeedback(data){



    const list=

    readFeedback();





    list.push({


        time:

        new Date()

        .toISOString(),



        result:

        data.result || "",



        predict:

        data.predict || [],



        hit:

        data.hit || 0



    });






    fs.writeFileSync(

        FEEDBACK_FILE,

        JSON.stringify(

            list,

            null,

            2

        ),

        "utf-8"

    );





    return {


        success:true,


        count:list.length


    };

}









function getFeedbackCount(){


    return readFeedback().length;


}







function getLearningState(){



    const list=

    readFeedback();




    let hit=0;



    list.forEach(item=>{


        if(
            item.hit
        ){

            hit++;

        }


    });





    return {


        samples:

        list.length,


        hitSamples:

        hit,



        rate:

        list.length

        ?

        Number(

        (

        hit/list.length*100

        )

        .toFixed(2)

        )

        :

        0



    };

}








export {


    saveFeedback,


    getFeedbackCount,


    getLearningState


};