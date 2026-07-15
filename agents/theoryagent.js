// 大乐透AI_V90
// Theory Agent
// 大乐透理论智能体


window.TheoryAgent = {


    name:
    "大乐透理论Agent",






    analyze(
        data
    ){



        let result={


            score:0,


            message:""



        };







        if(
            !data.theory
        ){



            return {


                score:0,


                message:
                "理论模块未加载"



            };


        }






        let theory =
        data.theory;





        /*
        
        理论结构检查
        
        */



        if(
            theory.structure
        ){



            result.score +=30;



            result.message +=

            "结构理论通过";



        }






        if(
            theory.rule
        ){



            if(
                theory.rule.pass
            ){



                result.score +=30;



                result.message +=

                "，规则检查通过";



            }

            else{



                result.score -=20;



                result.message +=

                "，存在规则偏差";



            }



        }








        if(
            theory.area
        ){



            result.score +=20;



            result.message +=

            "，区间分布已分析";



        }






        result.score =

        Math.max(

            0,

            Math.min(
                100,
                result.score
            )

        );





        return result;



    }




};