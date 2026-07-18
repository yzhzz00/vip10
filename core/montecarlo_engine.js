/**
 * DLT-AI-CORE VIP
 * Monte Carlo 模拟引擎
 */


class MonteCarloEngine {


    constructor(){


        this.progress = 0;


        this.result = null;


    }





    /**
     * 执行模拟
     */
    async run(
        total = 1000000,
        callback = null
    ){


        const frontCount = {};

        const backCount = {};


        const batch = 10000;


        let completed = 0;




        while(
            completed < total
        ){


            const current =
            Math.min(
                batch,
                total-completed
            );



            for(
                let i=0;
                i<current;
                i++
            ){


                const front =
                this.randomNumbers(
                    35,
                    5
                );


                const back =
                this.randomNumbers(
                    12,
                    2
                );



                front.forEach(
                    n=>{

                        frontCount[n]
                        =
                        (
                        frontCount[n]
                        ||
                        0
                        )
                        +
                        1;

                    }
                );



                back.forEach(
                    n=>{

                        backCount[n]
                        =
                        (
                        backCount[n]
                        ||
                        0
                        )
                        +
                        1;

                    }
                );


            }




            completed += current;



            this.progress =
            Number(
                (
                completed / total
                *
                100
                )
                .toFixed(2)
            );



            if(callback){

                callback(
                    this.progress
                );

            }



            /*
             * 防止阻塞服务器
             */
            await new Promise(
                resolve =>
                setImmediate(
                    resolve
                )
            );


        }



        this.result = {


            simulation:

            total,



            progress:

            100,



            front:

            this.sortResult(
                frontCount
            ),



            back:

            this.sortResult(
                backCount
            )


        };



        return this.result;


    }






    /**
     * 随机号码
     */
    randomNumbers(
        max,
        count
    ){


        const pool=[];



        for(
            let i=1;
            i<=max;
            i++
        ){

            pool.push(i);

        }



        const result=[];



        while(
            result.length<count
        ){


            const index =
            Math.floor(
                Math.random()
                *
                pool.length
            );


            result.push(
                pool[index]
            );


            pool.splice(
                index,
                1
            );


        }



        return result;


    }





    /**
     * 排序概率
     */
    sortResult(
        obj={}
    ){


        return Object.entries(
            obj
        )

        .map(
            ([number,count])=>({

                number:
                Number(number),


                count

            })
        )

        .sort(
            (a,b)=>
            b.count-a.count
        );


    }





    /**
     * 当前进度
     */
    getProgress(){

        return this.progress;

    }


}



export default MonteCarloEngine;