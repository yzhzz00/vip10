// DLT-AI-CORE VIP
// core/filter.js
//
// 结构过滤模块
//
// 作用:
// 对候选组合进行历史结构约束
//
// 过滤:
// 1. 奇偶结构
// 2. 和值范围
// 3. 三区分布
// 4. 连号数量
// 5. 重号数量


class FilterModel {


    constructor(){


        this.history=[];


    }








    // ======================
    // 初始化
    // ======================

    train(history){



        this.history=

        history;



    }









    // ======================
    // 主过滤
    // ======================

    filter(candidates){



        return candidates.filter(

            item=>{


                return (

                    this.checkSum(

                        item.front

                    )

                    &&


                    this.checkOddEven(

                        item.front

                    )


                    &&


                    this.checkZone(

                        item.front

                    )


                    &&


                    this.checkConsecutive(

                        item.front

                    )


                    &&


                    this.checkBack(

                        item.back

                    )


                );


            }

        );


    }









    // ======================
    // 和值过滤
    // ======================

    checkSum(front){



        let sum=

        front.reduce(

            (a,b)=>a+b,

            0

        );



        // 大乐透前区和值历史主要区间

        return (

            sum>=50

            &&

            sum<=150

        );


    }









    // ======================
    // 奇偶过滤
    // ======================

    checkOddEven(front){



        let odd=

        front.filter(

            n=>n%2!==0

        ).length;





        // 保留:

        // 2:3

        // 3:2

        // 1:4

        // 4:1

        return (

            odd>=1

            &&

            odd<=4

        );


    }









    // ======================
    // 三区过滤
    // ======================

    checkZone(front){



        let a=0;

        let b=0;

        let c=0;





        front.forEach(n=>{


            if(n<=12)

                a++;


            else if(n<=24)

                b++;


            else

                c++;


        });







        // 避免极端三区

        return (

            a>0

            &&

            b>0

            &&

            c>0

        );


    }









    // ======================
    // 连号过滤
    // ======================

    checkConsecutive(front){



        let count=0;





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

                count++;


        }







        // 大乐透常见0-2组连号

        return count<=2;


    }









    // ======================
    // 后区过滤
    // ======================

    checkBack(back){



        return (

            back.length===2

            &&

            back[0]>=1

            &&

            back[1]<=12

        );


    }









    status(){



        return {


            name:

            "structure_filter"



        };


    }



}



export default new FilterModel();