// 大乐透AI_V90
// Risk Engine
// 风险控制引擎


window.RiskEngine = {


    config:{},


    initialized:false,






    init(){



        this.config={



            maxSameNumber:3,


            minSum:50,


            maxSum:170,


            maxConsecutive:3,


            maxSameTail:3



        };



        this.initialized=true;



        console.log(
            "RiskEngine初始化完成"
        );



    },









    // 总风险评估


    evaluate(
        candidate
    ){



        let risk=0;



        let reasons=[];




        let sum =

        candidate.front.reduce(
            (
                a,b
            )=>a+b,
            0
        );





        // 和值风险


        if(
            sum<this.config.minSum
            ||
            sum>this.config.maxSum
        ){


            risk+=20;


            reasons.push(
                "和值异常"
            );


        }









        // 连号风险


        let consecutive =

        this.checkConsecutive(
            candidate.front
        );



        if(
            consecutive >
            this.config.maxConsecutive
        ){


            risk+=15;



            reasons.push(
                "连续号码过多"
            );


        }









        // 尾数风险


        let tail =

        this.checkTail(
            candidate.front
        );



        if(
            tail >
            this.config.maxSameTail
        ){


            risk+=15;



            reasons.push(
                "尾数重复过高"
            );


        }









        return {


            risk,


            level:

            this.level(
                risk
            ),



            reasons



        };



    },









    // 连号检测


    checkConsecutive(
        numbers
    ){



        let max=1;

        let current=1;



        for(
            let i=1;
            i<numbers.length;
            i++
        ){



            if(
                numbers[i]
                -
                numbers[i-1]
                ===1
            ){


                current++;


                if(
                    current>max
                ){

                    max=current;

                }



            }else{


                current=1;


            }


        }



        return max;



    },









    // 尾数检测


    checkTail(
        numbers
    ){



        let map={};



        numbers.forEach(
            n=>{


                let t=n%10;



                map[t]=

                (
                    map[t]||0
                )

                +1;



            }
        );



        return Math.max(
            ...Object.values(map)
        );



    },









    // 风险等级


    level(
        score
    ){


        if(
            score<20
        ){

            return "低风险";


        }



        if(
            score<50
        ){

            return "中风险";


        }



        return "高风险";



    },









    // 过滤候选


    filter(
        candidates
    ){



        return candidates.filter(
            item=>{


                let result =
                this.evaluate(
                    item
                );



                return result.risk < 50;



            }
        );



    }




};