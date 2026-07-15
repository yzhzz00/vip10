// 大乐透AI_V90
// Critic Agent
// AI自我否定与批判智能体


window.CriticAgent = {


    name:
    "AI批判Agent",





    analyze(
        data
    ){


        let result={


            score:50,


            message:"",


            warnings:[]



        };





        if(
            !data.prediction
        ){



            return {


                score:0,


                message:
                "暂无预测方案"



            };


        }







        let candidate =

        data.prediction;





        // =================
        // 检查号码集中度
        // =================


        let unique =
        new Set(
            candidate.front
        );



        if(
            unique.size
            !==
            candidate.front.length
        ){



            result.score-=20;



            result.warnings.push(
                "号码重复异常"
            );


        }







        // =================
        // 检查和值偏移
        // =================


        let sum =

        candidate.front.reduce(
            (
                a,b
            )=>a+b,
            0
        );




        if(
            sum<60 ||
            sum>160
        ){



            result.score-=15;



            result.warnings.push(
                "和值偏离历史范围"
            );



        }









        // =================
        // 检查模型一致性
        // =================


        if(
            data.models
        ){



            let count=

            Object.keys(
                data.models
            ).length;



            if(
                count<3
            ){



                result.score-=10;



                result.warnings.push(
                    "模型数量不足"
                );



            }



        }








        // =================
        // 最终批判意见
        // =================


        if(
            result.warnings.length
            >0
        ){



            result.message=

            "发现风险："+

            result.warnings.join(
                "、"
            );



        }

        else{



            result.message=

            "当前方案通过批判检查";



        }






        result.score =

        Math.max(
            0,
            result.score
        );





        return result;



    }




};