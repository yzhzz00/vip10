/**
 * DLT-AI-CORE VIP
 * Structure Model V5.0 FINAL
 *
 * 大乐透结构分析模型
 */


class StructureModel {



    constructor(){


        this.name =

        "structure";


    }









    train(

        history=[]

    ){



        const patterns = [];






        history.forEach(

            item=>{



                const front =

                item.front;





                let z1=0;

                let z2=0;

                let z3=0;





                front.forEach(

                    n=>{



                        if(n<=12)

                        z1++;



                        else if(n<=24)

                        z2++;



                        else

                        z3++;



                    }

                );








                const odd =

                front.filter(

                    n=>

                    n%2!==0

                )

                .length;








                const sum =

                front.reduce(

                    (a,b)=>

                    a+b,

                    0

                );








                let consecutive=0;





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

                    ){


                        consecutive++;


                    }



                }








                patterns.push({



                    z1,

                    z2,

                    z3,

                    odd,

                    sum,

                    consecutive



                });



            }

        );









        const stats = {




            zone:

            this.zoneScore(

                patterns

            ),





            parity:

            this.parityScore(

                patterns

            ),




            sum:

            this.sumScore(

                patterns

            ),




            consecutive:

            this.consecutiveScore(

                patterns

            )



        };









        const numbers=[];





        for(

            let n=1;

            n<=35;

            n++

        ){



            let score=0;






            if(

                n<=12

            )

            score+=stats.zone.z1;





            else if(

                n<=24

            )

            score+=stats.zone.z2;





            else

            score+=stats.zone.z3;







            score+=

            stats.parity;



            score+=

            stats.sum;



            score+=

            stats.consecutive;








            numbers.push({



                number:n,



                score:

                Number(

                    score.toFixed(3)

                )



            });



        }







        numbers.sort(

            (a,b)=>

            b.score-a.score

        );







        return {



            name:

            this.name,



            patterns,



            numbers,



            top:

            numbers.slice(

                0,

                10

            )



        };



    }









    zoneScore(

        patterns

    ){



        const avg =

        {

            z1:0,

            z2:0,

            z3:0

        };





        patterns.forEach(

            p=>{


                avg.z1+=p.z1;

                avg.z2+=p.z2;

                avg.z3+=p.z3;


            }

        );





        const len=

        patterns.length;






        return {



            z1:

            avg.z1/len,



            z2:

            avg.z2/len,



            z3:

            avg.z3/len



        };



    }









    parityScore(

        patterns

    ){



        return 5;



    }









    sumScore(

        patterns

    ){



        return 5;



    }









    consecutiveScore(

        patterns

    ){



        return 3;



    }



}



export default StructureModel;