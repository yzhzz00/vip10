// DLT-AI-CORE VIP
// core/prediction_engine.js
//
// 预测引擎 V3.0
//
// 模型融合后的最终选号生成


import matrixModel from "../models/matrix_model.js";

import dltTheoryModel from "../models/dlt_theory_model.js";



class PredictionEngine {



    constructor(){


        this.result=[];


    }









    generate(

        modelResult,

        count=10

    ){



        let frontPool=

        this.pool(

            modelResult,

            "front"

        );







        let backPool=

        this.pool(

            modelResult,

            "back"

        );






        let candidates=[];






        let times=50000;






        for(

            let i=0;

            i<times;

            i++

        ){



            let front=

            this.pick(

                frontPool,

                5

            );







            let back=

            this.pick(

                backPool,

                2

            );







            front.sort(

                (a,b)=>a-b

            );



            back.sort(

                (a,b)=>a-b

            );







            let theory=

            dltTheoryModel

            .combinationScore(

                front,

                back

            );








            let matrix=

            matrixModel

            .combinationScore(

                front

            );








            let score=

            (

                theory

                +

                matrix

            )

            /

            2;








            if(

                this.valid(

                    front,

                    back

                )

            ){



                candidates.push({



                    front,


                    back,


                    score:Number(

                        score.toFixed(2)

                    )



                });



            }



        }






        this.result=

        this.unique(

            candidates

        )

        .sort(

            (a,b)=>

            b.score-a.score

        )

        .slice(

            0,

            count

        );






        return this.result;


    }









    pool(

        models,

        type

    ){



        let map={};







        Object.values(models)

        .forEach(model=>{



            if(

                !model[type]

            )

            return;







            model[type]

            .forEach(item=>{



                let n=

                Number(

                    item.number

                );







                if(!map[n])

                    map[n]=0;







                map[n]+=

                Number(

                    item.score

                    ||

                    0

                );



            });



        });








        return Object.keys(map)

        .map(n=>({



            number:Number(n),


            score:map[n]



        }))

        .sort(

            (a,b)=>

            b.score-a.score

        )

        .slice(

            0,

            type==="front"

            ?

            25

            :

            10

        );


    }









    pick(

        pool,

        size

    ){



        let copy=[...pool];


        let result=[];






        while(

            result.length<size

        ){



            let index=

            Math.floor(

                Math.random()

                *

                copy.length

            );







            result.push(

                copy[index].number

            );







            copy.splice(

                index,

                1

            );



        }







        return result;


    }









    valid(

        front,

        back

    ){



        let odd=

        front.filter(

            n=>n%2

        )

        .length;







        if(

            odd===0

            ||

            odd===5

        )

        return false;







        let sum=

        front.reduce(

            (a,b)=>

            a+b,

            0

        );







        if(

            sum<70

            ||

            sum>140

        )

        return false;








        let repeat=0;







        for(

            let i=1;

            i<front.length;

            i++

        ){



            if(

                front[i]

                -

                front[i-1]

                ===1

            )

            repeat++;



        }







        if(

            repeat>2

        )

        return false;







        return true;


    }









    unique(list){



        let map={};


        let arr=[];







        list.forEach(item=>{



            let key=

            item.front.join(",")

            +

            "|"

            +

            item.back.join(",");







            if(

                !map[key]

            ){



                map[key]=true;


                arr.push(item);



            }



        });







        return arr;


    }



}





export default new PredictionEngine();