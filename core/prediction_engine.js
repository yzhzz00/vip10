// DLT-AI-CORE VIP
// core/prediction_engine.js
//
// 预测引擎升级版
//
// 功能:
// 1.融合模型评分
// 2.生成号码池
// 3.蒙特卡罗组合
// 4.输出候选结果


import CONFIG from "../config.js";



class PredictionEngine {


    constructor(){


        this.result=[];


    }









    // ======================
    // 生成预测
    // ======================

    generate(

        modelResult,

        count=10

    ){



        let frontPool=

        this.buildPool(

            modelResult,

            "front"

        );







        let backPool=

        this.buildPool(

            modelResult,

            "back"

        );







        let candidates=[];







        for(

            let i=0;

            i<CONFIG.MONTE_CARLO_TIMES;

            i++

        ){



            let front=

            this.randomPick(

                frontPool,

                5

            );







            let back=

            this.randomPick(

                backPool,

                2

            );







            let score=

            this.score(

                front,

                back,

                modelResult

            );







            candidates.push({



                front:

                front.sort(

                    (a,b)=>a-b

                ),



                back:

                back.sort(

                    (a,b)=>a-b

                ),



                score



            });



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









    // ======================
    // 建立评分池
    // ======================

    buildPool(

        models,

        type

    ){



        let map={};







        Object.values(models)

        .forEach(model=>{



            let list=

            model[type];







            if(

                Array.isArray(list)

            ){



                list.forEach(item=>{



                    if(

                        item.number

                    ){



                        map[item.number]=

                        (

                            map[item.number]

                            ||

                            0

                        )

                        +

                        item.score;



                    }



                });



            }



        });







        return Object.keys(map)

        .map(n=>({



            number:Number(n),



            score:

            map[n]



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









    // ======================
    // 随机抽取
    // ======================

    randomPick(

        pool,

        size

    ){



        let arr=

        [...pool];



        let result=[];







        while(

            result.length<size

        ){



            let index=

            Math.floor(

                Math.random()

                *

                arr.length

            );







            result.push(

                arr[index].number

            );







            arr.splice(

                index,

                1

            );



        }







        return result;


    }









    // ======================
    // 综合评分
    // ======================

    score(

        front,

        back,

        models

    ){



        let score=0;







        Object.values(models)

        .forEach(model=>{



            ["front","back"]

            .forEach(type=>{



                let list=

                model[type];







                if(

                    Array.isArray(list)

                ){



                    list.forEach(item=>{



                        if(

                            front.includes(item.number)

                            ||

                            back.includes(item.number)

                        ){



                            score+=

                            item.score || 0;



                        }



                    });



                }



            });



        });







        return Number(

            score.toFixed(4)

        );


    }









    // ======================
    // 去重
    // ======================

    unique(list){



        let map={};

        let result=[];







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


                result.push(item);



            }



        });







        return result;


    }



}





export default new PredictionEngine();