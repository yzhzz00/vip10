import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";





const __filename =

fileURLToPath(import.meta.url);



const __dirname =

path.dirname(__filename);






const DLT_FILE =

path.join(

__dirname,

"../data/dlt_history.txt"

);





const PL5_FILE =

path.join(

__dirname,

"../data/pl5_history.txt"

);









function readFile(file){



    try{


        if(

            !fs.existsSync(file)

        ){

            return [];

        }



        return fs.readFileSync(

            file,

            "utf-8"

        )

        .split(/\r?\n/)

        .filter(

            x=>x.trim()

        );



    }

    catch(e){


        return [];


    }


}









function parseDLT(){



    const lines=

    readFile(

        DLT_FILE

    );



    const result=[];





    lines.forEach(line=>{



        const nums=

        line.match(/\d+/g);



        if(

            !nums

            ||

            nums.length<7

        ){

            return;

        }







        const numbers=

        nums.map(Number);





        result.push({



            front:

            numbers

            .slice(

                0,

                5

            )

            .sort(

                (a,b)=>a-b

            ),




            back:

            numbers

            .slice(

                5,

                7

            )

            .sort(

                (a,b)=>a-b

            )



        });



    });







    return result;



}









function parsePL5(){



    const lines=

    readFile(

        PL5_FILE

    );



    const result=[];





    lines.forEach(line=>{



        const nums=

        line.match(/\d/g);



        if(

            !nums

            ||

            nums.length<5

        ){

            return;

        }





        result.push(



            nums

            .slice(

                0,

                5

            )

            .map(Number)



        );



    });





    return result;



}









function getDataInfo(){



    const dlt=

    parseDLT();



    const pl5=

    parsePL5();





    return {


        dltCount:

        dlt.length,



        pl5Count:

        pl5.length,



        latest:

        dlt.length

        ?

        dlt[0]

        :

        null



    };


}









export {


    parseDLT,


    parsePL5,


    getDataInfo


};