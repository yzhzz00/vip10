window.V110_PREDICTOR = {



    async predict(history){



        let candidates=[];



        // 1. 号码评分

        let scores=[];



        for(
            let i=1;
            i<=35;
            i++
        ){


            scores.push({


                number:i,


                score:

                V110_AI.numberScore(
                    i,
                    history
                )


            });


        }




        // 排序

        scores.sort(

            (a,b)=>

            b.score-a.score

        );





        // 取高分号码池

        let pool =

        scores.slice(
            0,
            25
        );








        // 2. 生成候选组合


        for(
            let i=0;
            i<1000;
            i++
        ){



            let front =

            this.randomSelect(
                pool,
                5
            );



            front.sort(
                (a,b)=>a-b
            );




            let score =

            this.frontScore(
                front,
                history
            );





            candidates.push({


                front,


                back:

                this.randomBack(),



                score



            });



        }






        // 3. 候选排序


        candidates.sort(

            (a,b)=>

            b.score-a.score

        );






        let topPool =

        candidates.slice(
            0,
            200
        );





        // 4. Monte Carlo


        let result =

        await this.monteCarlo(
            topPool
        );






        return {


            best:result[0],


            top10:result


        };



    },









    randomSelect(pool,count){



        let arr=[];


        let copy=[...pool];



        while(
            arr.length<count
        ){


            let index =

            Math.floor(

                Math.random()
                *
                copy.length

            );



            arr.push(

                copy[index].number

            );



            copy.splice(
                index,
                1
            );


        }



        return arr;



    },









    randomBack(){



        let result=[];



        while(
            result.length<2
        ){


            let n=

            Math.floor(
                Math.random()*12
            )+1;



            if(
                !result.includes(n)
            ){


                result.push(n);


            }



        }



        return result.sort(
            (a,b)=>a-b
        );



    },









    frontScore(front,history){



        let score =

        V110_AI.structure(
            front
        );




        score +=

        V110_AI.matrixScore(
            front,
            history
        );




        score +=

        V110_AI.antiHuman(
            front
        );



        return score;



    },









    // 分批Monte Carlo

    async monteCarlo(pool){



        let count={};



        let total=

        V110_CONFIG.monteCarloTotal;



        let batch=

        V110_CONFIG.monteCarloBatch;



        let finish=0;





        while(
            finish<total
        ){



            for(
                let i=0;
                i<batch;
                i++
            ){



                let item =

                pool[

                    Math.floor(

                    Math.random()
                    *
                    pool.length

                    )

                ];





                let key=

                item.front.join("-")
                +
                "+"
                +
                item.back.join("-");





                if(
                    !count[key]
                ){


                    count[key]={

                        front:item.front,

                        back:item.back,

                        times:0


                    };


                }





                count[key].times++;



            }






            finish+=batch;



            // 防止手机卡死

            await new Promise(

                r=>

                setTimeout(
                    r,
                    20
                )

            );



        }







        return Object.values(count)

        .sort(

            (a,b)=>

            b.times-a.times

        )

        .slice(
            0,
            10
        );



    }





};