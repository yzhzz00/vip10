// DLT-AI-CORE VIP
// models/matrix_model.js
//
// 矩阵模型 V2
//
// 号码共现关系矩阵


class MatrixModel {


    constructor(){


        this.front=[];

        this.back=[];

        this.matrix={};


    }







    train(history){


        this.matrix={};





        // 初始化35号码矩阵

        for(let i=1;i<=35;i++){


            this.matrix[i]={};


            for(let j=1;j<=35;j++){


                this.matrix[i][j]=0;


            }


        }






        history.forEach(item=>{



            if(

                !item.front

                ||

                !Array.isArray(item.front)

            )

            return;







            let nums=

            item.front

            .map(Number)

            .filter(

                n=>

                n>=1

                &&

                n<=35

            );








            for(

                let i=0;

                i<nums.length;

                i++

            ){



                for(

                    let j=i+1;

                    j<nums.length;

                    j++

                ){



                    let a=nums[i];

                    let b=nums[j];






                    // 防止异常

                    if(

                        !this.matrix[a]

                    ){



                        this.matrix[a]={};



                    }







                    if(

                        !this.matrix[a][b]

                    ){



                        this.matrix[a][b]=0;


                    }






                    if(

                        !this.matrix[b]

                    ){



                        this.matrix[b]={};



                    }







                    if(

                        !this.matrix[b][a]

                    ){



                        this.matrix[b][a]=0;



                    }







                    this.matrix[a][b]++;


                    this.matrix[b][a]++;



                }


            }



        });








        this.front=

        this.calculate();







        return true;


    }









    calculate(){



        let score={};







        Object.keys(

            this.matrix

        )

        .forEach(num=>{



            score[num]=

            Object.values(

                this.matrix[num]

            )

            .reduce(

                (a,b)=>

                a+b,

                0

            );



        });







        let max=

        Math.max(

            ...Object.values(score),

            1

        );







        return Object.keys(score)

        .map(num=>({



            number:Number(num),



            score:

            Number(

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



        let total=0;







        for(

            let i=0;

            i<nums.length;

            i++

        ){



            for(

                let j=i+1;

                j<nums.length;

                j++

            ){



                let a=Number(nums[i]);

                let b=Number(nums[j]);






                if(

                    this.matrix[a]

                    &&

                    this.matrix[a][b]

                ){



                    total +=

                    this.matrix[a][b];



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