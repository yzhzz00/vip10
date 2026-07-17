// DLT-AI-CORE V11 FINAL
// core/backtest.js
// 历史回测模块


class Backtest {


    constructor(engine){


        this.engine = engine;


    }








    async run(history,limit=100){


        if(
            !history ||
            history.length<=limit
        ){


            return {


                error:

                "历史数据不足"



            };


        }






        const start =

        history.length-limit;





        let total=0;



        let front3=0;



        let front4=0;



        let front5=0;



        let back1=0;



        let back2=0;





        const records=[];








        for(
            let i=start;

            i<history.length-1;

            i++
        ){



            const train =

            history.slice(

                0,

                i

            );



            const real =

            history[i];






            const result =

            await this.engine.predict(

                train

            );







            const fhit =

            result.front.filter(

                n=>

                real.front.includes(n)

            );



            const bhit =

            result.back.filter(

                n=>

                real.back.includes(n)

            );





            total++;






            if(
                fhit.length>=3
            )

                front3++;





            if(
                fhit.length>=4
            )

                front4++;





            if(
                fhit.length===5
            )

                front5++;





            if(
                bhit.length>=1
            )

                back1++;





            if(
                bhit.length===2
            )

                back2++;








            records.push({



                issue:

                real.issue,



                predict:

                result,



                hit:{


                    front:

                    fhit.length,



                    back:

                    bhit.length



                }



            });



        }









        return {



            period:

            total,



            front3Rate:

            this.rate(front3,total),



            front4Rate:

            this.rate(front4,total),



            front5Rate:

            this.rate(front5,total),



            back1Rate:

            this.rate(back1,total),



            back2Rate:

            this.rate(back2,total),



            records



        };



    }








    rate(a,b){


        if(
            b===0
        )

            return 0;



        return Number(

            (

            a/b*100

            )

            .toFixed(2)

        );


    }





}



export default Backtest;