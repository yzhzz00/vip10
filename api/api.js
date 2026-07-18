import {

parseDLT,

parsePL5,

getDataInfo

} from "../core/data.js";



import {

rankCandidates

} from "../ai/fusion.js";



import {

saveFeedback,

getLearningState

} from "../core/feedback.js";









function randomSelect(arr,count){


    const pool=[...arr];

    const result=[];



    while(

        result.length<count

        &&

        pool.length

    ){


        const index=

        Math.floor(

            Math.random()

            *

            pool.length

        );



        result.push(

            pool[index]

        );



        pool.splice(

            index,

            1

        );


    }



    return result.sort(

        (a,b)=>a-b

    );

}









function buildPool(history){


    const set=new Set();



    history.forEach(item=>{


        item.front.forEach(n=>{


            set.add(n);


        });


    });



    return Array.from(set);


}









function generateCandidates(){



    const history=

    parseDLT();



    const pool=

    buildPool(history);



    const list=[];



    for(

        let i=0;

        i<300;

        i++

    ){



        list.push({



            front:

            randomSelect(

                pool,

                5

            ),



            back:

            randomSelect(

                [

                1,2,3,

                4,5,6,

                7,8,9,

                10,11,12

                ],

                2

            )



        });



    }



    return list;


}









function runDLT(){



    const result=

    rankCandidates(

        generateCandidates()

    );



    return {


        lottery:

        "大乐透",



        version:

        "V21.5",



        prediction:

        result.slice(

            0,

            10

        )


    };

}









function runPL5(){



    const data=

    parsePL5();



    return {


        lottery:

        "排列五",



        periods:

        data.length


    };


}









function runStatus(){



    return getDataInfo();


}









function runHistory(){



    const history=

    parseDLT();



    return history

    .slice(

        0,

        30

    )

    .map(

        (item,index)=>({



            period:

            index+1,



            front:

            item.front,



            back:

            item.back



        })

    );



}









function runTrend(){



    const history=

    parseDLT();



    const map={};



    history.forEach(item=>{


        item.front.forEach(n=>{


            map[n]=

            (map[n]||0)+1;


        });


    });







    const list=

    Object.keys(map)

    .map(n=>({


        number:

        Number(n),


        count:

        map[n]


    }))

    .sort(

        (a,b)=>

        b.count-a.count

    );






    return {


        hot:

        list.slice(

            0,

            10

        ),



        cold:

        list.slice(

            -10

        ),



        odd:

        history[0]

        ?

        history[0].front.filter(

            n=>n%2!==0

        ).length

        :

        0,



        even:

        history[0]

        ?

        history[0].front.filter(

            n=>n%2===0

        ).length

        :

        0



    };

}









function getBody(req,callback){



    let body="";



    req.on(

        "data",

        c=>{

            body+=c;

        }

    );



    req.on(

        "end",

        ()=>{


            try{


                callback(

                    JSON.parse(body)

                );


            }

            catch(e){


                callback({});


            }


        }

    );

}









function apiHandler(req,res){



    res.setHeader(

        "Content-Type",

        "application/json;charset=utf-8"

    );





    if(req.url==="/api/dlt"){


        res.end(

            JSON.stringify(

                runDLT()

            )

        );

        return;


    }







    if(req.url==="/api/pl5"){


        res.end(

            JSON.stringify(

                runPL5()

            )

        );


        return;


    }








    if(req.url==="/api/status"){


        res.end(

            JSON.stringify(

                runStatus()

            )

        );


        return;


    }








    if(req.url==="/api/history"){


        res.end(

            JSON.stringify(

                runHistory()

            )

        );


        return;


    }








    if(req.url==="/api/trend"){


        res.end(

            JSON.stringify(

                runTrend()

            )

        );


        return;


    }








    if(req.url==="/api/learning"){


        res.end(

            JSON.stringify(

                getLearningState()

            )

        );


        return;


    }








    if(

        req.url==="/api/feedback"

        &&

        req.method==="POST"

    ){


        getBody(

            req,

            data=>{


                res.end(

                    JSON.stringify(

                        saveFeedback(data)

                    )

                );


            }

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