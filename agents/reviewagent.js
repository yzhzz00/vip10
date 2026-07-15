// 大乐透AI_V90
// Review Agent
// 历史复盘智能体


window.ReviewAgent = {


    name:
    "历史复盘Agent",






    analyze(
        data
    ){



        let result={


            score:0,


            message:""



        };






        if(
            !data.evaluation
        ){



            return {


                score:0,


                message:
                "暂无回测数据"



            };


        }








        let evaluation =

        data.evaluation;





        /*
        
        根据历史回测表现

        判断模型状态
        
        */



        if(
            evaluation.average
        ){



            let avg =

            Number(
                evaluation.average
            );





            if(
                avg>=3
            ){



                result.score+=70;



                result.message =

                "历史表现较稳定";



            }

            else{



                result.score+=30;



                result.message =

                "历史表现需要优化";



            }



        }







        if(
            evaluation.best
        ){


            result.message +=

            "，最高命中记录已参考";



        }








        return result;



    }




};