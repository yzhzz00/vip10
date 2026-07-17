// DLT-AI-CORE VIP
// models/matrix_model.js
//
// 矩阵模型
//
// 包含:
// 号码状态矩阵
// 三区结构矩阵
// 状态转移矩阵


class MatrixModel {


    constructor(){


        this.name = "matrix";


        this.frontMatrix = {};

        this.zoneMatrix = {};

        this.structureMatrix = {};



    }







    // ======================
    // 训练
    // ======================

    train(history){



        this.createNumberMatrix(

            history

        );



        this.createZoneMatrix(

            history

        );



        this.createStructureMatrix(

            history

        );





        return this;


    }









    // ======================
    // 号码状态矩阵
    // ======================

    createNumberMatrix(history){



        for(

            let i=1;

            i<=35;

            i++

        ){



            this.frontMatrix[i]={


                recent:0,


                total:0,


                weight:0


            };



        }







        history.forEach(

        (item,index)=>{



            item.front.forEach(num=>{



                this.frontMatrix[num].total++;



                this.frontMatrix[num].recent +=

                index + 1;



            });



        });








        Object.keys(

            this.frontMatrix

        )

        .forEach(num=>{



            let data=

            this.frontMatrix[num];





            data.weight=

            Number(



                (

                data.recent

                /

                (

                data.total+1

                )

                )

                .toFixed(4)



            );



        });



    }









    // ======================
    // 三区状态矩阵
    // ======================

    createZoneMatrix(history){



        history.forEach(item=>{



            let zone=

            this.getZone(

                item.front

            );






            if(

                !this.zoneMatrix[zone]

            ){



                this.zoneMatrix[zone]=0;



            }






            this.zoneMatrix[zone]++;



        });



    }









    // ======================
    // 结构矩阵
    // ======================

    createStructureMatrix(history){



        history.forEach(item=>{



            let odd=0;





            item.front.forEach(num=>{



                if(num%2!==0)

                    odd++;



            });







            let key=

            `${odd}-${6-odd}`;



            if(

                !this.structureMatrix[key]

            ){



                this.structureMatrix[key]=0;



            }






            this.structureMatrix[key]++;



        });



    }









    // ======================
    // 三区计算
    // ======================

    getZone(numbers){



        let a=0;

        let b=0;

        let c=0;







        numbers.forEach(num=>{



            if(num<=12)

                a++;



            else if(num<=24)

                b++;



            else

                c++;



        });






        return `${a}-${b}-${c}`;



    }









    // ======================
    // 号码评分
    // ======================

    score(num){



        if(

            !this.frontMatrix[num]

        )

            return 0;







        return this.frontMatrix[num].weight;



    }









    // ======================
    // 输出分析
    // ======================

    analyze(){



        return {



            model:

            this.name,



            numberMatrix:

            this.frontMatrix,



            zoneMatrix:

            this.zoneMatrix,



            structureMatrix:

            this.structureMatrix



        };



    }



}





export default new MatrixModel();