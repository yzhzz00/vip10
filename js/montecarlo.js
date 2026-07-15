window.DLT_MONTECARLO = {


    running:false,


    /*
    ==========================
    分批模拟
    ==========================
    */


    async run(results, history, deep=false, progress){


        if(this.running){

            return [];

        }


        this.running=true;



        let output=[];



        // 手机优化参数

        let times = deep

        ?

        100000

        :

        10000;



        let batch = 500;



        let totalTask = results.length;



        let finished=0;



        for(let item of results){



            let totalScore=0;



            let stable=0;



            let completed=0;



            while(completed < times){



                let currentBatch = Math.min(

                    batch,

                    times-completed

                );



                for(
                    let i=0;
                    i<currentBatch;
                    i++
                ){



                    let score =

                    this.simulate(

                        item.front,

                        history

                    );



                    totalScore += score;



                    if(score > 300){


                        stable++;


                    }



                }



                completed += currentBatch;



                // 释放手机线程

                await this.sleep(10);



            }





            output.push({



                front:item.front,



                score:

                totalScore/times,



                stability:

                stable/times*100



            });



            finished++;



            if(progress){



                progress(

                    Math.floor(

                        finished/

                        totalTask*

                        100

                    )

                );



            }



        }







        output.sort((a,b)=>{



            let sa =

            a.score*0.7

            +

            a.stability*0.3;



            let sb =

            b.score*0.7

            +

            b.stability*0.3;



            return sb-sa;



        });





        this.running=false;



        return output.slice(

            0,

            DLT_CONFIG.candidate.outputTop

        );



    },









    /*
    ==========================
    单次模拟评分
    ==========================
    */


    simulate(combination,history){



        let score=0;



        for(let n of combination){



            let result =

            DLT_PREDICTOR.numberScore(

                n,

                history

            );



            score += result.score;



        }



        return score;



    },









    /*
    ==========================
    延迟释放
    ==========================
    */


    sleep(ms){



        return new Promise(

            resolve =>

            setTimeout(resolve,ms)

        );



    },









    stop(){



        this.running=false;



    }



};