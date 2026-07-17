// DLT-AI-CORE VIP
// models/matrix_model.js
//
// 矩阵模型
//
// 分析号码之间共现关系


class MatrixModel {



    constructor(){


        this.front=[];


        this.back=[];


        this.matrix={};


    }









    train(history){



        this.matrix={};






        for(

            let i=1;

            i<=35;

            i++

        ){



            this.matrix[i]={};



            for(

                let j=1;

                j<=35;

                j++

            ){



                this.matrix[i][j]=0;



            }


        }









        history.forEach(item=>{



            let nums=

            item.front;







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



            let total=

            Object.values(

                this.matrix[num]

            )

            .reduce(

                (a,b)=>

                a+b,

                0

            );







            score[num]=total;



        });







        let max=

        Math.max(

            ...Object.values(score)

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









    // 组合评分

    combinationScore(nums){



        let score=0;







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



                score +=

                this.matrix

                [nums[i]]

                [nums[j]];



            }



        }







        return score;


    }









    analyze(){



        return {



            front:this.front,



            back:this.back



        };


    }



}





export default new MatrixModel();