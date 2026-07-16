const express = require("express");
const cors = require("cors");
const path = require("path");


const app = express();


app.use(cors());

app.use(
    express.json()
);



app.use(
    express.static(
        path.join(
            __dirname,
            "frontend"
        )
    )
);



app.get("/",(req,res)=>{

    res.sendFile(

        path.join(
            __dirname,
            "frontend",
            "index.html"
        )

    );

});



app.get(
    "/api/test",
    (req,res)=>{

        res.json({

            status:"ok",

            version:"V1.0"

        });

    }
);



app.get(
    "/api/analyze",
    (req,res)=>{


        const result =
        require("./app")();



        res.json(result);


    }
);



const PORT =
process.env.PORT || 3000;



app.listen(
    PORT,
    ()=>{

        console.log(
            "DLT-AI CORE START"
        );

    }
);