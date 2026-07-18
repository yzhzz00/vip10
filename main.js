import http from "http";

import fs from "fs";

import path from "path";

import {
    fileURLToPath
} from "url";


import {
    apiHandler
} from "./api/api.js";





const __filename =

fileURLToPath(
    import.meta.url
);



const __dirname =

path.dirname(
    __filename
);







const PORT =

process.env.PORT || 3000;







function sendFile(
    res,
    file,
    type
){


    const filepath =

    path.join(

        __dirname,

        file

    );




    if(

        !fs.existsSync(filepath)

    ){



        res.statusCode=404;



        res.end(

            "file not found"

        );



        return;


    }





    res.writeHead(

        200,

        {

        "Content-Type":

        type

        }

    );




    fs.createReadStream(

        filepath

    )

    .pipe(res);



}









const server =

http.createServer(

(req,res)=>{



    // API接口


    if(

        req.url.startsWith(

            "/api/"

        )

    ){



        apiHandler(

            req,

            res

        );



        return;

    }







    // 首页


    if(

        req.url==="/"

        ||

        req.url==="/index.html"

    ){



        sendFile(

            res,

            "index.html",

            "text/html;charset=utf-8"

        );



        return;


    }








    // css


    if(

        req.url==="/style.css"

    ){



        sendFile(

            res,

            "style.css",

            "text/css"

        );



        return;


    }








    // js


    if(

        req.url==="/app.js"

    ){



        sendFile(

            res,

            "app.js",

            "application/javascript"

        );



        return;


    }









    res.statusCode=404;


    res.end(

        "not found"

    );



}

);









server.listen(

    PORT,

    ()=>{


        console.log(

        `DLT-AI-CORE V21.5 running on ${PORT}`

        );


    }

);