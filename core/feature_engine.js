/**
 * DLT-AI-CORE VIP
 * Feature Engine V2.0 FINAL
 *
 * 大乐透特征提取
 */


class FeatureEngine {



    constructor(){


        this.maxNumber = 35;


    }







    async build(

        history=[]

    ){



        return {



            frequency:

            this.frequency(

                history

            ),




            hotCold:

            this.hotCold(

                history

            ),




            omission:

            this.omission(

                history

            ),




            structure:

            this.structure(

                history

            )



        };



    }









    // ===================
    // 号码频率
    // ===================


    frequency(

        history

    ){



        const result={};





        for(

            let i=1;

            i<=35;

            i++

        ){


            result[i]=0;


        }







        history.forEach(

            item=>{


                item.front

                .forEach(

                    n=>{


                        result[n]++;


                    }

                );


            }

        );





        return result;



    }









    // ===================
    // 热冷号
    // ===================


    hotCold(

        history

    ){



        const recent =

        history.slice(

            -100

        );





        const result={};





        for(

            let i=1;

            i<=35;

            i++

        ){



            let count=0;



            recent.forEach(

                item=>{


                    if(

                        item.front

                        .includes(i)

                    ){


                        count++;

                    }



                }

            );




            result[i]=count;



        }






        return result;



    }









    // ===================
    // 遗漏统计
    // ===================


    omission(

        history

    ){



        const result={};






        for(

            let num=1;

            num<=35;

            num++

        ){



            let miss=0;





            for(

                let i=

                history.length-1;

                i>=0;

                i--

            ){



                if(

                    history[i]

                    .front

                    .includes(num)

                ){


                    break;


                }





                miss++;


            }





            result[num]=miss;



        }






        return result;



    }









    // ===================
    // 结构特征
    // ===================


    structure(

        history

    ){



        let oddTotal=0;


        let sumTotal=0;


        let spanTotal=0;







        const zones={



            zone1:0,


            zone2:0,


            zone3:0



        };








        history.forEach(

            item=>{



                const nums =

                item.front;





                oddTotal +=

                nums.filter(

                    n=>

                    n%2

                )

                .length;





                sumTotal +=

                nums.reduce(

                    (a,b)=>

                    a+b,

                    0

                );






                spanTotal +=

                nums[4]

                -

                nums[0];







                nums.forEach(

                    n=>{



                        if(

                            n<=12

                        ){


                            zones.zone1++;


                        }

                        else if(

                            n<=24

                        ){


                            zones.zone2++;


                        }

                        else{


                            zones.zone3++;


                        }



                    }

                );



            }

        );







        return {



            averageOdd:

            oddTotal

            /

            history.length,





            averageSum:

            sumTotal

            /

            history.length,





            averageSpan:

            spanTotal

            /

            history.length,





            zones



        };



    }





}



export default FeatureEngine;