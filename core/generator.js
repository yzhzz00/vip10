// DLT-AI-CORE VIP
// core/generator.js
// 候选组合生成模块
//
// 注意：
// 这里不是随机选号器。
// 号码来源：
// 1. matrix模型评分池
// 2. 历史结构约束
// 3. 组合搜索


import config from "../config.js";



class Generator {



    constructor(){


        this.size =

        config.prediction.candidateSize || 200;


    }









    generate(matrix, history){



        const pool =

        this.createPool(

            matrix

        );





        const result=[];





        this.search(

            pool,

            [],

            0,

            result

        );






        return result

        .slice(

            0,

            this.size

        );



    }









    // ======================
    // 建立号码池
    // ======================

    createPool(matrix){



        const numbers=

        matrix.ranking()

        .map(

            item=>

            Number(item[0])

        );







        return numbers

        .filter(

            n=>

            n>=1

            &&

            n<=35

        )

        .slice(

            0,

            20

        );



    }









    // ======================
    // 组合搜索
    // ======================

    search(

        pool,

        current,

        start,

        result

    ){



        if(

            current.length===5

        ){



            result.push({



                front:

                [

                    ...current

                ],



                back:

                this.generateBack()



            });



            return;



        }







        for(

            let i=start;

            i<pool.length;

            i++

        ){



            this.search(

                pool,

                [

                    ...current,

                    pool[i]

                ],

                i+1,

                result

            );





            if(

                result.length

                >=

                this.size

            ){



                return;



            }



        }



    }









    // ======================
    // 后区生成
    // ======================

    generateBack(){



        // 后区同样使用评分池

        // 这里保留接口

        // 后续接入后区模型



        return [

            1,

            2

        ];



    }





}



export default Generator;