/**
 * DLT-AI-CORE VIP
 * Structure Model V2.0
 *
 * 大乐透结构分析模型
 */



class StructureModel {



    constructor(){


        this.name =
        "structure";


    }









    train(

        history=[],

        features={}

    ){



        const stats={


            odd:{

                min:0,

                max:5,

                avg:0

            },


            zones:{


                low:0,

                mid:0,

                high:0


            },


            sum:{


                avg:0


            },


            span:{


                avg:0


            }



        };








        let totalOdd=0;


        let totalSum=0;


        let totalSpan=0;







        history.forEach(

            item=>{



                const nums =

                item.front;





                const odd =

                nums.filter(

                    n=>n%2

                )

                .length;





                totalOdd += odd;







                const sum =

                nums.reduce(

                    (a,b)=>

                    a+b,

                    0

                );



                totalSum += sum;






                totalSpan +=

                nums[4]

                -

                nums[0];





                nums.forEach(

                    n=>{


                        if(n<=12){

                            stats.zones.low++;

                        }

                        else if(n<=24){

                            stats.zones.mid++;

                        }

                        else{

                            stats.zones.high++;

                        }



                    }

                );




            }

        );







        if(

            history.length

        ){



            stats.odd.avg =

            totalOdd

            /

            history.length;





            stats.sum.avg =

            totalSum

            /

            history.length;





            stats.span.avg =

            totalSpan

            /

            history.length;



        }








        const numbers=[];






        for(

            let num=1;

            num<=35;

            num++

        ){



            let score=50;





            /*
             * 高频结构奖励
             */


            if(

                num<=12

            ){

                score+=

                stats.zones.low

                /

                history.length;


            }

            else if(

                num<=24

            ){

                score+=

                stats.zones.mid

                /

                history.length;


            }

            else{


                score+=

                stats.zones.high

                /

                history.length;


            }







            numbers.push({



                number:num,



                score:

                Number(

                    score

                    .toFixed(3)

                )



            });





        }









        return {



            name:this.name,



            structure:stats,



            numbers:

            numbers.sort(

                (a,b)=>

                b.score-a.score

            )



        };



    }









    check(

        nums=[]

    ){



        let score=0;





        // 奇偶

        const odd =

        nums.filter(

            n=>n%2

        )

        .length;





        if(

            odd>=2

            &&

            odd<=3

        ){

            score+=20;

        }







        // 和值

        const sum =

        nums.reduce(

            (a,b)=>

            a+b,

            0

        );





        if(

            sum>=90

            &&

            sum<=130

        ){

            score+=20;

        }







        // 跨度

        const span =

        nums[4]

        -

        nums[0];





        if(

            span>=15

            &&

            span<=30

        ){

            score+=20;

        }






        return score;



    }





}



export default StructureModel;