window.V110_PREDICTOR = {



    // =========================
    // 主预测入口
    // =========================

    predict(history){



        // 固定模式Seed

        if(
            V110_CONFIG.mode==="stable"
        ){

            V110_SEED.set(
                123456
            );


        }






        // AI会议

        let meeting =

        V110_CONFERENCE.vote(

            history

        );







        // 生成候选池


        let pool =

        this.createPool(

            history,

            meeting.final

        );







        // Monte Carlo


        let results =

        this.monteCarlo(

            pool

        );








        return {



            confidence:

            this.confidence(

                history,

                meeting

            ),



            conference:

            meeting,



            top10:

            results.slice(0,10),



            best:

            results[0]



        };



    },









    // =========================
    // 创建候选池
    // =========================

    createPool(history,meetingNumbers){



        let result=[];




        for(
            let i=0;
            i<300;
            i++
        ){



            let front=[];




            // 优先会议号码

            let copy=

            [...meetingNumbers];





            while(
                front.length<5
            ){



                let n;



                if(
                    Math.random()<0.7
                    &&
                    copy.length>0
                ){


                    let index=

                    Math.floor(

                    Math.random()
                    *
                    copy.length

                    );


                    n=

                    copy[index];


                    copy.splice(
                        index,
                        1
                    );


                }

                else{


                    n=

                    Math.floor(

                    V110_SEED.random()

                    *

                    35

                    )

                    +1;



                }






                if(
                    !front.includes(n)
                ){

                    front.push(n);

                }


            }





            front.sort(

                (a,b)=>

                a-b

            );






            result.push({



                front,



                back:

                this.randomBack()



            });



        }




        return result;



    },









    randomBack(){



        let back=[];



        while(
            back.length<2
        ){



            let n=

            Math.floor(

            V110_SEED.random()

            *

            12

            )

            +1;





            if(
                !back.includes(n)
            ){

                back.push(n);

            }



        }



        return back.sort(

            (a,b)=>

            a-b

        );



    },









    // =========================
    // Monte Carlo
    // =========================

    monteCarlo(pool){



        let map={};





        let times=

        V110_CONFIG.monteCarloTotal;






        for(
            let i=0;
            i<times;
            i++
        ){



            let index=

            Math.floor(

            V110_SEED.random()

            *

            pool.length

            );






            let item=

            pool[index];





            let key=

            item.front.join("-")

            +

            "+"

            +

            item.back.join("-");






            if(
                !map[key]
            ){



                map[key]={


                    front:item.front,


                    back:item.back,


                    count:0



                };


            }




            map[key].count++;




        }







        return Object.values(map)

        .sort(

            (a,b)=>

            b.count-a.count

        );



    },









    // =========================
    // 可信度
    // =========================

    confidence(history,meeting){



        let score=50;



        if(
            meeting.final.length===5
        ){

            score+=15;

        }




        let rhythm=

        V110_RHYTHM.report(

            history

        );




        if(
            rhythm.sum.average
        ){

            score+=10;

        }




        if(
            meeting.members.length>=5
        ){

            score+=10;

        }




        if(
            score>95
        ){

            score=95;

        }




        return score;



    }







};