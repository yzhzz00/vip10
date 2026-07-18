/**
 * DLT-AI-CORE VIP
 * 数字矩阵模型
 */


class MatrixModel {


    constructor(){


        this.matrix={};


        this.history=[];


    }





    /**
     * 训练
     */
    train(
        history=[],
        features={}
    ){


        this.history =
        history;


        this.matrix={};



        /*
         * 建立35×35数字关系矩阵
         */

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





        /*
         * 统计同期开出关系
         */
        history.forEach(
            item=>{


                const nums =
                item.front;



                for(
                    let i=0;
                    i<nums.length;
                    i++
                ){


                    for(
                        let j=0;
                        j<nums.length;
                        j++
                    ){


                        if(
                            nums[i]!==nums[j]
                        ){


                            this.matrix
                            [nums[i]]
                            [nums[j]]++;


                        }


                    }


                }


            }
        );



        return {


            name:
            "matrix",



            numbers:
            this.rankNumbers()


        };


    }





    /**
     * 数字关联评分
     */
    score(
        number
    ){


        if(
            !this.matrix[number]
        ){

            return 0;

        }



        const row =
        this.matrix[number];



        const total =
        Object.values(row)
        .reduce(
            (a,b)=>a+b,
            0
        );



        /*
         * 关联强度
         */

        return Number(

            (
            total /
            (
            this.history.length || 1
            )

            )

            .toFixed(4)

        );


    }





    /**
     * 排序
     */
    rankNumbers(){


        const result=[];



        for(
            let i=1;
            i<=35;
            i++
        ){


            result.push({

                number:i,


                score:
                this.score(i)

            });


        }



        return result.sort(

            (a,b)=>
            b.score-a.score

        );


    }





    /**
     * 获取矩阵
     */
    getMatrix(){

        return this.matrix;

    }





    /**
     * 状态
     */
    status(){


        return {


            type:
            "matrix",


            size:
            35


        };


    }



}



export default MatrixModel;