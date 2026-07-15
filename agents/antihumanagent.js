// 大乐透AI_V90
// Anti Human Agent
// 反人类偏差智能体


window.AntiHumanAgent = {


    name:
    "反人类思维Agent",






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







        // ===================
        // 检查号码集中热门
        // ===================


        if(
            data.features &&
            data.features.frequency
        ){



            let freq =

            data.features.frequency.front;




            let hotCount=0;





            candidate.front.forEach(
                n=>{


                    if(
                        freq[n]
                        &&
                        freq[n]
                        >
                        30
                    ){


                        hotCount++;


                    }


                }
            );







            if(
                hotCount>=4
            ){



                result.score-=20;



                result.warnings.push(
                    "号码过度集中热门"
                );


            }



        }









        // ===================
        // 检查号码过于整齐
        // ===================


        let sum=

        candidate.front.reduce(
            (
                a,b
            )=>
            a+b,
            0
        );





        if(
            sum%10===0
        ){



            result.score-=5;



            result.warnings.push(
                "和值存在人为偏好风险"
            );



        }









        // ===================
        // 检查尾数规律
        // ===================


        let tails =

        candidate.front.map(
            n=>n%10
        );



        let unique =

        new Set(
            tails
        );




        if(
            unique.size<=2
        ){



            result.score-=15;



            result.warnings.push(
                "尾数过度集中"
            );


        }








        if(
            result.warnings.length
            >0
        ){



            result.message=

            "反人类检查发现："

            +

            result.warnings.join(
                "、"
            );



        }

        else{


            result.message=

            "未发现明显人为偏差";



        }






        result.score=

        Math.max(
            0,
            result.score
        );





        return result;



    }




};