// DLT-AI-CORE V11 FINAL
// core/health.js
// 模型健康监控


class HealthEngine {


    constructor(){


        this.status =
        "normal";


    }









    check(modelState){


        const issues =
        [];



        if(
            !modelState
        ){


            issues.push(
                "model state missing"
            );


        }



        else{


            this.checkModels(
                modelState,
                issues
            );


        }



        this.status =
        issues.length
        ?
        "warning"
        :
        "normal";



        return {


            status:
            this.status,


            issues,


            score:
            this.score(
                issues
            )



        };


    }









    checkModels(
        state,
        issues
    ){


        if(
            !state.models
        ){


            issues.push(
                "models missing"
            );


            return;


        }



        Object.entries(
            state.models
        )
        .forEach(
            ([name,model])=>{


                if(
                    model.weight
                    <=
                    0
                ){


                    issues.push(
                        name+
                        " weight error"
                    );


                }



                if(
                    model.train_count
                    <
                    0
                ){


                    issues.push(
                        name+
                        " train count error"
                    );


                }



            }
        );


    }









    score(
        issues
    ){


        return Math.max(

            0,

            100 -
            issues.length
            *
            10

        );


    }









    getStatus(){


        return this.status;


    }



}



export default HealthEngine;