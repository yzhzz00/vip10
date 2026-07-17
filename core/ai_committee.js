// DLT-AI-CORE VIP
// core/ai_committee.js
//
// AI委员会决策模块
//
// 作用:
// 模拟多模型会议
//
// 参与:
// 频率模型
// 趋势模型
// 贝叶斯模型
// 马尔可夫模型
// 遗漏模型
// 周期模型
//
// 输出:
// 1.模型投票
// 2.推荐组合
// 3.决策说明


class AICommittee {



    constructor(){


        this.lastMeeting=null;


    }









    // ======================
    // AI会议
    // ======================

    meeting(results,models){



        if(

            !results

            ||

            results.length===0

        ){



            return null;


        }







        let top=results.slice(

            0,

            10

        );








        let votes=[];








        top.forEach(item=>{



            let modelVotes={





                frequency:

                this.vote(

                    item,

                    models.frequency

                ),





                trend:

                this.vote(

                    item,

                    models.trend

                ),





                bayes:

                this.vote(

                    item,

                    models.bayes

                ),





                markov:

                this.voteMarkov(

                    item,

                    models.markov

                ),





                omission:

                this.vote(

                    item,

                    models.omission

                ),





                cycle:

                this.vote(

                    item,

                    models.cycle

                )



            };








            let total=

            Object.values(

                modelVotes

            )

            .reduce(

                (a,b)=>a+b,

                0

            );








            votes.push({



                front:

                item.front,



                back:

                item.back,



                score:

                item.score,



                modelVotes,



                confidence:

                Number(

                    (

                    total/6

                    )

                    .toFixed(2)

                )



            });



        });









        votes.sort(

            (a,b)=>

            b.confidence

            -

            a.confidence

        );








        this.lastMeeting={



            time:

            new Date()

            .toISOString(),



            members:6,



            candidates:

            votes.length,



            winner:

            votes[0],



            discussion:

            this.summary(

                votes[0]

            )



        };








        return this.lastMeeting;


    }









    // ======================
    // 普通模型投票
    // ======================

    vote(

        item,

        model

    ){



        let score=0;



        item.front.forEach(n=>{


            score+=

            model.getFrontScore(n);



        });






        item.back.forEach(n=>{


            score+=

            model.getBackScore(n);



        });






        return Number(

            (

            score

            /

            7

            )

            .toFixed(2)

        );


    }









    // ======================
    // 马尔可夫投票
    // ======================

    voteMarkov(

        item,

        model

    ){



        return Number(

            model.evaluate(

                item.front,

                item.back,

                []

            )

            .toFixed(2)

        );


    }









    // ======================
    // 会议总结
    // ======================

    summary(item){



        return {


            conclusion:

            "六模型综合一致性评分最高",



            front:

            item.front,



            back:

            item.back,



            confidence:

            item.confidence,



            reason:[


                "历史频率支持",


                "近期趋势支持",


                "概率模型支持",


                "状态转移分析",


                "遗漏周期分析",


                "结构合理性分析"



            ]



        };


    }









    // ======================
    // 获取会议记录
    // ======================

    getLast(){



        return this.lastMeeting;


    }




}



export default new AICommittee();