import {
    runDLT,
    runPL5
} from "../core/runner.js";



function apiHandler(req,res){


    res.setHeader(
        "Content-Type",
        "application/json;charset=utf-8"
    );



    if(
        req.method==="GET"
        &&
        req.url==="/api/dlt"
    ){


        const result =
        runDLT();



        res.end(

            JSON.stringify(
                result
            )

        );


        return;

    }




    if(
        req.method==="GET"
        &&
        req.url==="/api/pl5"
    ){


        const result =
        runPL5();



        res.end(

            JSON.stringify(
                result
            )

        );


        return;

    }




    res.statusCode=404;


    res.end(

        JSON.stringify({

            error:
            "api not found"

        })

    );


}



export {

apiHandler

};