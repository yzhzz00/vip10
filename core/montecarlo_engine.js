/**
 * DLT-AI-CORE VIP
 * Monte Carlo Engine V3.0 FINAL
 *
 * 蒙特卡罗模拟核心
 */


class MonteCarloEngine {



    constructor(){


        this.times = 1000000;


    }









    simulate(

        numbers=[],

        backNumbers=[]

    ){



        if(

            !numbers.length

        ){



            return [];

        }







        const result = {};







        /*
         * 初始化号码权重
         */


        numbers.forEach(

            item=>{


                result[item.number]=0;


            }

        );








        /*
         * 模拟次数

         *
         * 采用批处理
         * 防止网页卡死
         */


        const batch = 10000;


        const rounds =

        Math.floor(

            this.times / batch

        );








        for(

            let r=0;

            r<rounds;

            r++

        ){



            for(

                let i=0;

                i<batch;

                i++

            ){



                const pick =

                this.randomPick(

                    numbers,

                    5

                );






                pick.forEach(

                    n=>{


                        result[n]++;

                    }

                );



            }



        }








        return Object.keys(

            result

        )

        .map(

            n=>({



                number:

                Number(n),



                score:

                result[n]



            })

        )

        .sort(

            (a,b)=>

            b.score-a.score

        );



    }









    randomPick(

        pool,

        count

    ){



        const temp =

        [...pool];



        const arr=[];







        while(

            arr.length<count

        ){



            const index =

            Math.floor(

                Math.random()

                *

                temp.length

            );





            arr.push(

                temp[index]

                .number

            );





            temp.splice(

                index,

                1

            );


        }







        return arr.sort(

            (a,b)=>

            a-b

        );



    }









    setTimes(

        value

    ){


        this.times=value;


    }





}





export default MonteCarloEngine;