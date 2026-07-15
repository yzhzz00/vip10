// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// montecarlo.js
// 加权分段蒙特卡罗模拟
// ==================================================

"use strict";


window.V100MonteCarlo = {


    running:false,


    result:[],


    // 默认模拟次数

    total:

    100000,



    // 分段大小

    batch:

    1000,





    async run(

        candidates,

        total=100000

    ){



        this.running=true;


        this.result=[];



        let count=0;




        let scoreMap={};




        V100Progress.start(

            "蒙特卡罗模拟",

            total

        );






        while(

            count < total

        ){



            let currentBatch=

            Math.min(

                this.batch,

                total-count

            );






            for(

                let i=0;

                i<currentBatch;

                i++

            ){



                let item=

                this.weightPick(

                    candidates

                );





                let key=

                item.front.join("-")

                +

                "+"

                +

                item.back.join("-");







                if(
                    !scoreMap[key]
                ){


                    scoreMap[key]={


                        front:item.front,


                        back:item.back,


                        hit:0,


                        score:item.score


                    };


                }





                scoreMap[key].hit++;



            }






            count += currentBatch;



            V100Progress.update(

                count

            );







            // 给手机释放时间

            await this.sleep(20);



        }







        this.result=

        Object.values(

            scoreMap

        )

        .sort(

            (a,b)=>{


                return (

                    b.hit

                    -

                    a.hit

                );


            }

        )

        .slice(

            0,

            10

        );







        this.running=false;



        V100Progress.finish();




        return this.result;



    },









    // ==========================
    // 权重抽样
    // ==========================


    weightPick(

        candidates

    ){



        let total=0;



        candidates.forEach(c=>{


            total +=

            Math.max(

                c.score,

                1

            );


        });







        let random=

        Math.random()

        *

        total;






        let current=0;




        for(

            let c of candidates

        ){



            current +=

            Math.max(

                c.score,

                1

            );





            if(

                current >= random

            ){



                return c;


            }



        }





        return candidates[0];



    },









    sleep(ms){



        return new Promise(

            resolve=>

            setTimeout(

                resolve,

                ms

            )

        );

    }




};