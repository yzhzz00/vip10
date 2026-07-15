window.V110_CONFERENCE = {



    // =========================
    // 单模型提案
    // =========================

    speak(history){



        let members=[];



        // Trend

        members.push({


            name:"Trend",


            numbers:

            this.topNumbers(

                history,

                "trend"

            )


        });







        // Bayes

        members.push({


            name:"Bayes",


            numbers:

            this.topNumbers(

                history,

                "bayes"

            )


        });







        // Markov

        members.push({


            name:"Markov",


            numbers:

            this.topNumbers(

                history,

                "markov"

            )


        });







        // Matrix

        members.push({


            name:"Matrix",


            numbers:

            this.topNumbers(

                history,

                "matrix"

            )


        });









        // Theory

        members.push({


            name:"Theory",


            numbers:

            this.topNumbers(

                history,

                "theory"

            )


        });







        // Rhythm

        let rhythm =

        V110_RHYTHM.report(
            history
        );



        members.push({


            name:"Rhythm",


            numbers:

            rhythm.hotCold.hot


        });







        return members;



    },









    // =========================
    // 获取模型推荐号码
    // =========================

    topNumbers(history,type){



        let arr=[];




        for(
            let i=1;
            i<=35;
            i++
        ){


            let score=0;



            switch(type){



                case "trend":

                    score=

                    V110_MODELS.trend(

                        i,

                        history

                    );

                    break;




                case "bayes":

                    score=

                    V110_MODELS.bayes(

                        i,

                        history

                    );

                    break;




                case "markov":

                    score=

                    V110_MODELS.markov(

                        i,

                        history

                    );

                    break;




                case "matrix":

                    score=

                    V110_MODELS.matrix(

                        i,

                        history

                    );

                    break;



                case "theory":

                    score=

                    V110_MODELS.frequency(

                        i,

                        history

                    );

                    break;



            }





            arr.push({


                number:i,


                score


            });



        }






        arr.sort(

            (a,b)=>

            b.score-a.score

        );





        return arr

        .slice(0,5)

        .map(

            x=>x.number

        );



    },









    // =========================
    // AI会议融合
    // =========================

    vote(history){



        let meeting=

        this.speak(history);




        let votes={};




        meeting.forEach(member=>{



            member.numbers.forEach(n=>{



                if(
                    !votes[n]
                ){

                    votes[n]=0;

                }



                votes[n]++;



            });



        });






        let result=Object.keys(votes)

        .map(n=>({


            number:Number(n),


            votes:votes[n]


        }))



        .sort(

            (a,b)=>

            b.votes-a.votes

        );






        let final=

        result

        .slice(0,5)

        .map(

            x=>x.number

        )

        .sort(

            (a,b)=>

            a-b

        );








        let report={



            time:

            Date.now(),



            members:meeting,



            final



        };






        V110_DB.saveConference(

            report

        );






        return report;



    }





};