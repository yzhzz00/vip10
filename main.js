import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename =
fileURLToPath(import.meta.url);


const __dirname =
path.dirname(__filename);



const PORT =
process.env.PORT || 3000;



const mime = {

    ".html":"text/html",

    ".js":"application/javascript",

    ".css":"text/css",

    ".json":"application/json",

    ".txt":"text/plain"

};



const server =
http.createServer(
(req,res)=>{


    let filePath =
    path.join(
        __dirname,
        req.url===" /"
        ?
        "index.html"
        :
        req.url
    );


    if(req.url==="/"){

        filePath =
        path.join(
            __dirname,
            "index.html"
        );

    }



    fs.readFile(
        filePath,
        (err,data)=>{


            if(err){


                res.writeHead(404);

                res.end(
                    "404 Not Found"
                );


                return;

            }



            const ext =
            path.extname(filePath);



            res.writeHead(
                200,
                {
                    "Content-Type":
                    mime[ext] ||
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
`DLT-AI-CORE V21.5 running on ${PORT}`
);


});