// DLT-AI-CORE VIP
// models/matrix_model.js
//
// 矩阵关系模型 V2.1
//
// 功能:
// 1.号码共现矩阵
// 2.号码关联评分
// 3.组合关系评分
// 4.防止异常数据导致启动失败


class MatrixModel {


    constructor(){

        this.front = [];

        this.back = [];

        this.matrix = {};

    }





    train(history){


        this.matrix = {};



        // 初始化前区35号码矩阵

        for(let i = 1; i <= 35; i++){

            this.matrix[i] = {};

            for(let j = 1; j <= 35; j++){

                this.matrix[i][j] = 0;

            }

        }




        if(!Array.isArray(history)){

            return false;

        }




        history.forEach(item=>{


            if(
                !item ||
                !Array.isArray(item.front)
            ){

                return;

            }



            let nums = item.front
                .map(Number)
                .filter(
                    n =>
                    Number.isInteger(n)
                    &&
                    n >= 1
                    &&
                    n <= 35
                );



            if(nums.length < 2){

                return;

            }



            for(let i = 0; i < nums.length; i++){


                for(let j = i + 1; j < nums.length; j++){



                    let a = nums[i];

                    let b = nums[j];



                    // 双向初始化保护

                    if(!this.matrix[a]){

                        this.matrix[a] = {};

                    }



                    if(
                        typeof this.matrix[a][b]
                        !==
                        "number"
                    ){

                        this.matrix[a][b] = 0;

                    }



                    if(!this.matrix[b]){

                        this.matrix[b] = {};

                    }



                    if(
                        typeof this.matrix[b][a]
                        !==
                        "number"
                    ){

                        this.matrix[b][a] = 0;

                    }



                    this.matrix[a][b] += 1;

                    this.matrix[b][a] += 1;



                }


            }



        });




        this.front = this.calculate();



        return true;


    }







    calculate(){



        let score = {};



        Object.keys(this.matrix)
        .forEach(num=>{



            let total = 0;



            Object.values(this.matrix[num])
            .forEach(v=>{


                if(
                    typeof v === "number"
                ){

                    total += v;

                }


            });



            score[num] = total;



        });






        let max = Math.max(

            ...Object.values(score),

            1

        );






        return Object.keys(score)

        .map(num=>({


            number:Number(num),


            score:Number(

                (

                    score[num]
                    /
                    max
                    *
                    100

                )

                .toFixed(2)

            )


        }))

        .sort(

            (a,b)=>

            b.score-a.score

        );


    }









    combinationScore(nums){



        if(!Array.isArray(nums)){

            return 0;

        }



        let total = 0;




        for(let i = 0; i < nums.length; i++){


            for(let j = i + 1; j < nums.length; j++){



                let a = Number(nums[i]);

                let b = Number(nums[j]);



                if(

                    this.matrix[a]

                    &&

                    typeof this.matrix[a][b]
                    ===
                    "number"

                ){


                    total += this.matrix[a][b];


                }



            }


        }





        return total;


    }







    analyze(){


        return {


            front:this.front,


            back:this.back



        };


    }



}





export default new MatrixModel();