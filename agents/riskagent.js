// 大乐透AI_V90
// Risk Agent
// 风险审查智能体


window.RiskAgent = {


    name:
    "风险审查Agent",




    analyze(
        data
    ){



        let result={


            score:50,


            message:""



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





        let risk=0;



        let reasons=[];









        // 和值检查


        let sum =

        candidate.front.reduce(
            (
                a,b
            )=>a+b,
            0
        );




        if(
            sum<50 ||
            sum>170
        ){



            risk+=20;


            reasons.push(
                "和值异常"
            );


        }









        // 连号检查


        for(
            let i=1;
            i<candidate.front.length;
            i++
        ){



            if(
                candidate.front[i]
                -
                candidate.front[i-1]
                ===1
            ){


                risk+=5;


            }



        }








        if(
            risk>30
        ){



            result.score=30;



            result.message =

            "风险较高："
            +
            reasons.join(",");



        }

        else{



            result.score=80;



            result.message=

            "风险处于可接受范围";



        }





        return result;



    }




};