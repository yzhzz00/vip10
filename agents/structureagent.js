// 大乐透AI_V90
// Structure Agent
// 结构分析智能体


window.StructureAgent = {


    name:
    "结构分析Agent",



    analyze(
        data
    ){


        if(
            !data.features
        ){


            return {


                score:0,


                message:
                "暂无结构数据"


            };


        }





        let structure =

        data.features
        .structure;



        let result={


            score:0,


            message:""



        };





        if(
            structure &&
            structure.length>0
        ){



            let latest =

            structure[
                structure.length-1
            ];



            /*
            
            奇偶平衡

            */


            if(
                Math.abs(
                    latest.odd -
                    latest.even
                )
                <=2
            ){


                result.score+=30;


                result.message +=

                "奇偶结构平衡";


            }

            else{


                result.score+=10;


                result.message +=

                "奇偶偏离需关注";


            }





        }






        // 理论结构判断


        if(
            data.theory
        ){


            result.score+=20;



            result.message +=

            "，理论结构通过";


        }







        return result;



    }




};