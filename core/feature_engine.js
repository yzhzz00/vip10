/**
 * DLT-AI-CORE VIP
 * Feature Engine V5.0 FINAL
 *
 * 特征提取核心
 */


class FeatureEngine {



    constructor(){


        this.version=

        "V5.0 FINAL";


    }









    async build(

        history=[]

    ){



        return {



            version:

            this.version,



            count:

            history.length,



            frequency:

            this.frequency(

                history

            ),




            missing:

            this.missing(

                history

            ),




            sum:

            this.sumTrend(

                history

            ),




            parity:

            this.parity(

                history

            ),




            zones:

            this.zones(

                history

            ),




            consecutive:

            this.consecutive(

                history

            )



        };



    }









    frequency(

        history

    ){



        const map={};





        for(

            let i=1;

            i<=35;

            i++

        ){


            map[i]=0;


        }






        history.forEach(

            item=>{



                item.front.forEach(

                    n=>{


                        map[n]++;


                    }

                );



            }

        );







        return Object.keys(

            map

        )

        .map(

            n=>({


                number:

                Number(n),



                count:

                map[n]


            })

        )

        .sort(

            (a,b)=>

            b.count-a.count

        );



    }









    missing(

        history

    ){



        const last=

        history[

            history.length-1

        ];





        const result=[];






        for(

            let n=1;

            n<=35;

            n++

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

                    .includes(n)

                ){


                    break;


                }





                miss++;


            }







            result.push({



                number:n,



                missing:miss



            });



        }







        return result.sort(

            (a,b)=>

            b.missing-a.missing

        );



    }









    sumTrend(

        history

    ){



        return history.map(

            item=>({



                issue:

                item.issue,



                sum:

                item.front.reduce(

                    (a,b)=>

                    a+b,

                    0

                )



            })

        )

        .slice(

            -100

        );



    }









    parity(

        history

    ){



        return history.map(

            item=>{



                const odd=

                item.front.filter(

                    n=>

                    n%2!==0

                )

                .length;





                return {



                    issue:

                    item.issue,



                    odd,



                    even:

                    5-odd



                };



            }

        )

        .slice(

            -100

        );



    }









    zones(

        history

    ){



        return history.map(

            item=>{



                let z1=0;

                let z2=0;

                let z3=0;





                item.front.forEach(

                    n=>{



                        if(n<=12)

                        z1++;



                        else if(n<=24)

                        z2++;



                        else

                        z3++;



                    }

                );








                return {



                    issue:

                    item.issue,



                    z1,

                    z2,

                    z3



                };



            }

        )

        .slice(

            -100

        );



    }









    consecutive(

        history

    ){



        return history.map(

            item=>{



                let count=0;





                for(

                    let i=1;

                    i<item.front.length;

                    i++

                ){



                    if(

                        item.front[i]

                        -

                        item.front[i-1]

                        ===1

                    ){


                        count++;


                    }



                }







                return {



                    issue:

                    item.issue,



                    consecutive:

                    count



                };



            }

        )

        .slice(

            -100

        );



    }





}



export default FeatureEngine;