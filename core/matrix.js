// DLT-AI-CORE VIP
// core/matrix.js
// 多模型融合矩阵
//
// 将：
// frequency
// trend
// bayes
// markov
// omission
// cycle
//
// 融合成统一号码评分


class Matrix {



    constructor(){


        this.matrix={};


    }









    build(models){



        this.matrix={};





        const modelList=[



            "frequency",

            "trend",

            "bayes",

            "markov",

            "omission",

            "cycle"



        ];







        modelList.forEach(model=>{



            const data=

            models[model];





            if(!data)

                return;







            Object.entries(data)

            .forEach(([num,value])=>{



                if(!this.matrix[num]){



                    this.matrix[num]={



                        frequency:0,

                        trend:0,

                        bayes:0,

                        markov:0,

                        omission:0,

                        cycle:0,

                        total:0



                    };



                }






                this.matrix[num][model]

                =

                Number(value);



            });



        });









        this.calculate();





        return this.matrix;



    }









    // ======================
    // 综合评分
    // ======================

    calculate(){



        Object.keys(

            this.matrix

        )

        .forEach(num=>{



            const item=

            this.matrix[num];







            let total=0;





            total +=

            item.frequency;



            total +=

            item.trend;



            total +=

            item.bayes;



            total +=

            item.markov;



            total +=

            item.omission;



            total +=

            item.cycle;






            item.total=

            total;



        });



    }









    // ======================
    // 排序
    // ======================

    ranking(){



        return Object.entries(

            this.matrix

        )

        .sort(

            (a,b)=>

            b[1].total

            -

            a[1].total

        );



    }









    // ======================
    // 获取号码池
    // ======================

    topNumbers(count=20){



        return this.ranking()

        .slice(

            0,

            count

        )

        .map(

            item=>

            Number(item[0])

        );



    }





}



export default Matrix;