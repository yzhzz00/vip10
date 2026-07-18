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
fileURLToPath(import.meta.url);


const __dirname =
path.dirname(__filename);



const PORT =
process.env.PORT || 3000;



const mime={


".html":
"text/html;charset=utf-8",


".js":
"application/javascript;charset=utf-8",


".css":
"text/css;charset=utf-8",


".json":
"application/json;charset=utf-8"


};





const server =
http.createServer(
(req,res)=>{


    // API接口

    if(
        req.url.startsWith("/api/")
    ){

        apiHandler(
            req,
            res
        );

        return;

    }



    let filePath;



    if(req.url==="/"){

        filePath=
        path.join(
            __dirname,
            "index.html"
        );


    }else{


        filePath=
        path.join(
            __dirname,
            req.url
        );

    }




    fs.readFile(
        filePath,
        (err,data)=>{


            if(err){


                res.writeHead(404);

                res.end(
                    "404"
                );

                return;

            }



            const ext =
            path.extname(
                filePath
            );



            res.writeHead(
                200,
                {

                "Content-Type":
                mime[ext]
                ||
                "text/plain"

                }

            );



            res.end(data);


        }

    );


});





server.listen(
PORT,
()=>{


console.log(
"DLT-AI-CORE V21.5 API RUNNING:"
+
PORT
);


});