// DLT-AI-CORE VIP
// ai/elimination.js
//
// 模型淘汰管理
//
// 状态:
// active
// warning
// low_score
// retired


class Elimination {



    constructor(){


        this.status={};


    }









    // ======================
    // 初始化模型状态
    // ======================

    init(models){



        models.forEach(name=>{



            this.status[name]={



                score:1,


                state:"active",


                failCount:0



            };



        });







        return this.status;


    }









    // ======================
    // 更新模型表现
    // ======================

    update(

        model,

        score

    ){



        if(

            !this.status[model]

        ){



            this.status[model]={



                score:1,


                state:"active",


                failCount:0



            };



        }







        let item=

        this.status[model];







        item.score=

        Number(

            score.toFixed(4)

        );







        if(

            score<0.3

        ){



            item.failCount++;



        }

        else{


            item.failCount=0;



        }







        this.check(model);



        return item;


    }









    // ======================
    // 淘汰判断
    // ======================

    check(model){



        let item=

        this.status[model];







        if(

            item.score>=0.7

        ){



            item.state=

            "active";



        }

        else if(

            item.score>=0.4

        ){



            item.state=

            "warning";



        }

        else if(

            item.failCount<5

        ){



            item.state=

            "low_score";



        }

        else{


            item.state=

            "retired";



        }



    }









    // ======================
    // 获取可用模型
    // ======================

    activeModels(){



        return Object.keys(

            this.status

        )

        .filter(name=>{



            return (

                this.status[name].state

                !==

                "retired"

            );


        });



    }









    // ======================
    // 获取全部状态
    // ======================

    get(){



        return this.status;


    }



}





export default new Elimination();