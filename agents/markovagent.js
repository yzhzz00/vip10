// 大乐透AI_V90
// Markov Agent
// 马尔可夫分析智能体


window.MarkovAgent = {


    name:
    "马尔可夫分析Agent",




    analyze(
        data
    ){



        let result={


            score:0,


            message:""



        };





        if(
            !data.markov
        ){



            return {


                score:0,


                message:
                "马尔可夫模型未加载"



            };


        }






        let markov =
        data.markov;





        /*
        
        判断转移模型是否存在
        
        */



        if(
            markov.front
        ){



            result.score +=30;



            result.message +=

            "前区转移关系已分析";



        }





        if(
            markov.back
        ){



            result.score +=20;



            result.message +=

            "，后区转移参与";



        }





        /*
        
        马尔可夫不是决定因素

        只提供趋势参考
        
        */



        result.score =

        Math.min(
            result.score,
            100
        );






        return result;



    }




};