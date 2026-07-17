// DLT-AI-CORE VIP
// core/filter.js
// 候选组合过滤模块
//
// 作用：
// 去除历史结构概率较低组合
//
// 不负责预测号码
// 只负责质量控制


import Theory from "./theory.js";



class Filter {



    constructor(){


        this.theory =

        new Theory();


    }









    filter(candidates, history=[]){



        const result=[];






        for(

            const item of candidates

        ){



            if(

                this.check(

                    item,

                    history

                )

            ){



                result.push(

                    item

                );



            }



        }







        return result;



    }









    check(candidate,history){



        // 基础理论检测


        const theoryResult =

        this.theory.check(

            candidate

        );





        if(

            !theoryResult.sum

        ){



            return false;



        }






        if(

            !theoryResult.oddEven

        ){



            return false;



        }






        if(

            !theoryResult.zone

        ){



            return false;



        }







        if(

            !theoryResult.consecutive

        ){



            return false;



        }








        // 历史重复结构检测

        if(

            history.length>0

        ){



            if(

                this.tooSimilar(

                    candidate,

                    history

                )

            ){



                return false;



            }



        }








        return true;



    }









    // ======================
    // 判断是否过度重复历史
    // ======================

    tooSimilar(candidate,history){



        const last=

        history[

            history.length-1

        ].front;







        const same=

        candidate.front.filter(

            n=>

            last.includes(n)

        )

        .length;







        // 允许最多4个重复

        return same>=5;



    }









}



export default Filter;