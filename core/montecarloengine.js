// 大乐透AI_V90
// Monte Carlo Engine
// 蒙特卡罗模拟引擎（分批版）


window.MonteCarloEngine = {


    simulations:1000000,


    batchSize:10000,


    result:{},


    running:false,






    init(config={}){


        this.simulations =

        config.simulations ||

        1000000;



        this.batchSize =

        config.batchSize ||

        10000;



        console.log(
            "MonteCarloEngine初始化"
        );


    },









    // 开始模拟


    async run(
        options={}
    ){



        if(this.running){

            return;

        }



        this.running=true;



        this.result={};




        let total =
        this.simulations;



        let batch =
        this.batchSize;





        if(
            window.TaskEngine
        ){



            await TaskEngine.chunkCompute(

                total,

                batch,

                async(
                    size,
                    completed
                )=>{


                    this.simulateBatch(
                        size,
                        options
                    );


                },

                "蒙特卡罗模拟"

            );



        }else{


            for(
                let i=0;
                i<total;
                i++
            ){


                this.simulateOne(
                    options
                );


            }


        }





        this.running=false;



        return this.getResult();



    },









    // 单批计算


    simulateBatch(
        count,
        options
    ){



        for(
            let i=0;
            i<count;
            i++
        ){


            this.simulateOne(
                options
            );


        }


    },









    // 单次模拟


    simulateOne(
        options
    ){



        let front =

        this.randomNumbers(
            35,
            5
        );



        let back =

        this.randomNumbers(
            12,
            2
        );





        let key =

        front.join(",")

        +

        "|"

        +

        back.join(",");





        if(
            !this.result[key]
        ){


            this.result[key]={


                front,

                back,


                count:0


            };


        }




        this.result[key].count++;



    },









    // 随机选号


    randomNumbers(
        max,
        count
    ){



        let pool=[];



        for(
            let i=1;
            i<=max;
            i++
        ){


            pool.push(i);


        }





        let result=[];



        while(
            result.length<count
        ){



            let index =

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





        return result.sort(
            (
                a,b
            )=>
            a-b
        );



    },









    // 获取结果排序


    getResult(){



        return Object.values(

            this.result

        )
        .sort(

            (
                a,b
            )=>

            b.count-a.count

        )
        .slice(
            0,
            100
        );



    }



};