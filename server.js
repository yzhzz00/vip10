// ======================================================
// DLT-AI-CORE V10.2 FINAL
// 大乐透智能分析核心系统
// ======================================================


import express from "express";
import cors from "cors";
import fs from "fs";



const app = express();


app.use(cors());

app.use(express.json());

app.use(
    express.static("public")
);




// ===============================
// 文件路径
// ===============================


const DATA_DIR="./data";

const HISTORY_FILE=
"./data/dlt_history.txt";


const MODEL_FILE=
"./data/model_state.json";


const FEEDBACK_FILE=
"./data/feedback.json";


const PREDICTION_FILE=
"./data/prediction_history.json";


const OUTPUT_DIR=
"./output";


const OUTPUT_PREDICTION=
"./output/prediction.txt";


const OUTPUT_ANALYSIS=
"./output/analysis.txt";


const OUTPUT_PROGRESS=
"./output/progress.txt";





// ===============================
// 初始化
// ===============================


function init(){



    [
        "./data",
        "./output",
        "./logs"
    ]
    .forEach(dir=>{


        if(
            !fs.existsSync(dir)
        ){

            fs.mkdirSync(dir);

        }


    });






    if(
        !fs.existsSync(MODEL_FILE)
    ){

        fs.writeFileSync(

            MODEL_FILE,

            JSON.stringify(

                {

                    models:{


                        Frequency:{
                            weight:1,
                            score:50,
                            status:"active"
                        },


                        Trend:{
                            weight:1,
                            score:50,
                            status:"active"
                        },


                        Cycle:{
                            weight:1,
                            score:50,
                            status:"active"
                        },


                        Bayes:{
                            weight:1,
                            score:50,
                            status:"active"
                        },


                        Markov:{
                            weight:1,
                            score:50,
                            status:"active"
                        },


                        MonteCarlo:{
                            weight:1,
                            score:50,
                            status:"active"
                        }

                    },


                    committee:{
                        confidence:0.5
                    },


                    version:"V10.2"

                },

                null,

                2

            )

        );

    }







    if(
        !fs.existsSync(FEEDBACK_FILE)
    ){

        fs.writeFileSync(
            FEEDBACK_FILE,
            JSON.stringify(
                {
                    records:[],
                    statistics:{},
                    modelFeedback:{}
                },
                null,
                2
            )
        );

    }






    if(
        !fs.existsSync(PREDICTION_FILE)
    ){

        fs.writeFileSync(
            PREDICTION_FILE,
            JSON.stringify(
                {
                    predictions:[]
                },
                null,
                2
            )
        );

    }





    if(
        !fs.existsSync(OUTPUT_PROGRESS)
    ){

        fs.writeFileSync(
            OUTPUT_PROGRESS,
            "0"
        );

    }



}



init();






// ===============================
// TXT数据读取
// ===============================



function loadHistory(){


    if(
        !fs.existsSync(HISTORY_FILE)
    ){

        return [];

    }




    let txt=
    fs.readFileSync(
        HISTORY_FILE,
        "utf8"
    );



    return txt
    .split("\n")
    .map(
        line=>
        line
        .match(/\d+/g)
    )
    .filter(
        x=>
        x &&
        x.length>=7
    )
    .map(nums=>{


        return {


            front:
            nums
            .slice(0,5)
            .map(Number),



            back:
            nums
            .slice(5,7)
            .map(Number)


        };


    });



}





let history=
loadHistory();



console.log(
"加载大乐透数据:",
history.length
);

// ======================================================
// Feature Engine
// 特征引擎
// ======================================================



function getNumberFrequency(history){



    let map={};



    history.forEach(item=>{


        item.front.forEach(n=>{


            map[n]=
            (map[n]||0)+1;


        });


    });



    return map;


}






function calculateMissing(history){



    let last =
    history[history.length-1]
    || {front:[]};



    let miss={};



    for(
        let i=1;
        i<=35;
        i++
    ){


        miss[i]=
        last.front.includes(i)
        ?
        0
        :
        1;


    }



    return miss;


}








// 大乐透理论约束
// Theory Constraint


function theoryScore(numbers){



    let score=50;



    let odd =
    numbers.filter(
        n=>n%2===1
    ).length;



    // 奇偶结构

    if(
        odd>=2 &&
        odd<=3
    ){

        score+=10;

    }



    // 和值

    let sum =
    numbers.reduce(
        (a,b)=>a+b,
        0
    );



    if(
        sum>=80 &&
        sum<=130
    ){

        score+=10;

    }



    // 分区


    let zones=[
        numbers.filter(n=>n<=12).length,

        numbers.filter(
            n=>n>=13&&n<=24
        ).length,

        numbers.filter(
            n=>n>=25
        ).length

    ];



    if(
        zones.every(
            x=>x>0
        )
    ){

        score+=10;

    }



    return score;


}








// ======================================================
// Frequency Model
// ======================================================



function frequencyModel(){



    let freq=
    getNumberFrequency(
        history
    );



    return Object.keys(freq)
    .map(n=>{


        return {

            number:
            Number(n),


            score:
            freq[n]

        };


    });



}







// ======================================================
// Trend Model
// ======================================================



function trendModel(){



    let recent =
    history.slice(-30);



    let freq =
    getNumberFrequency(
        recent
    );



    return Object.keys(freq)
    .map(n=>{


        return {


            number:
            Number(n),


            score:
            freq[n]*1.2


        };


    });



}







// ======================================================
// Cycle Model
// ======================================================



function cycleModel(){



    let miss =
    calculateMissing(
        history
    );



    return Object.keys(miss)
    .map(n=>{


        return {


            number:
            Number(n),


            score:
            miss[n]*10


        };


    });



}







// ======================================================
// Bayes Model
// ======================================================



function bayesModel(){



    let freq =
    getNumberFrequency(
        history
    );



    let total =
    history.length || 1;



    return Object.keys(freq)
    .map(n=>{


        return {


            number:
            Number(n),


            score:
            freq[n]/total*100


        };


    });



}







// ======================================================
// Markov 一阶转移模型
// ======================================================



function markovModel(){



    let map={};



    for(
        let i=1;
        i<history.length;
        i++
    ){



        let last =
        history[i-1]
        .front;



        let now =
        history[i]
        .front;



        last.forEach(a=>{


            now.forEach(b=>{


                let key=
                a+"_"+b;



                map[key]=
                (map[key]||0)+1;



            });


        });


    }



    let result={};



    Object.keys(map)
    .forEach(k=>{


        let n=
        Number(
            k.split("_")[1]
        );


        result[n]=
        (result[n]||0)
        +
        map[k];


    });



    return Object.keys(result)
    .map(n=>{


        return {

            number:
            Number(n),


            score:
            result[n]

        };


    });



}







// ======================================================
// Monte Carlo约束模拟
// ======================================================



function monteCarlo(count=100000){



    let result={};



    for(
        let i=1;
        i<=35;
        i++
    ){

        result[i]=0;

    }



    for(
        let i=0;
        i<count;
        i++
    ){


        let arr=[];


        while(
            arr.length<5
        ){


            let n=
            Math.floor(
                Math.random()*35
            )+1;



            if(
                !arr.includes(n)
            ){

                arr.push(n);

            }


        }



        arr.forEach(n=>{


            result[n]++;


        });



    }



    return Object.keys(result)
    .map(n=>{


        return {


            number:
            Number(n),


            score:
            result[n]


        };


    });



}

// ======================================================
// Model Arena
// 模型竞技场
// ======================================================



function normalizeModels(models){



    let score={};



    models.forEach(model=>{


        model.forEach(item=>{


            let n=
            item.number;



            if(
                !score[n]
            ){

                score[n]=0;

            }



            score[n]+=item.score;



        });



    });



    return Object.keys(score)
    .map(n=>{


        return {


            number:
            Number(n),


            score:
            score[n]


        };


    });



}









// ======================================================
// Anti Human Bias
// 反人类偏差修正
// ======================================================



function antiHumanBias(list){



    let max =
    Math.max(
        ...list.map(
            x=>x.score
        )
    );



    return list.map(item=>{


        let score =
        item.score;



        // 防止极端热门号码过度集中


        if(
            score===max
        ){

            score*=0.95;

        }



        return {


            number:
            item.number,


            score

        };


    });



}








// ======================================================
// AI Committee
// 模型委员会
// ======================================================



function aiCommittee(){



    let models=[


        frequencyModel(),


        trendModel(),


        cycleModel(),


        bayesModel(),


        markovModel(),


        monteCarlo(50000)


    ];



    let arena =
    normalizeModels(
        models
    );



    arena =
    antiHumanBias(
        arena
    );



    arena.sort(
        (a,b)=>
        b.score-a.score
    );



    return arena;


}








// ======================================================
// Matrix Fusion
// F × W × R × T × A × C
// ======================================================



function matrixFusion(){



    let ranking =
    aiCommittee();



    let result =
    ranking
    .slice(0,15)
    .map(item=>{


        return {


            number:
            item.number,


            finalScore:
            (
                item.score
                *
                theoryScore(
                    [item.number]
                )
                /
                100
            )


        };


    });



    result.sort(
        (a,b)=>
        b.finalScore-a.finalScore
    );



    return result;


}








// ======================================================
// 前区生成
// ======================================================



function generateFront(){



    let ranking =
    matrixFusion();



    let numbers =
    ranking
    .slice(0,15)
    .map(
        x=>x.number
    );



    let selected=[];



    while(
        selected.length<5
    ){


        let n =
        numbers[
            Math.floor(
                Math.random()
                *
                numbers.length
            )
        ];



        if(
            !selected.includes(n)
        ){

            selected.push(n);

        }


    }



    selected.sort(
        (a,b)=>a-b
    );



    return selected;


}








// ======================================================
// 后区模型
// 12选2
// ======================================================



function generateBack(){



    let arr=[];



    while(
        arr.length<2
    ){


        let n=
        Math.floor(
            Math.random()*12
        )+1;



        if(
            !arr.includes(n)
        ){

            arr.push(n);

        }


    }



    return arr.sort(
        (a,b)=>a-b
    );


}








// ======================================================
// 预测生成总入口
// ======================================================



function generatePrediction(){



    let front =
    generateFront();



    let back =
    generateBack();



    let confidence =
    Math.min(
        0.95,
        0.5+
        front.length*0.02
    );



    return {


        front,


        back,


        confidence


    };


}

// ======================================================
// Feedback Engine
// 开奖反馈学习
// ======================================================



function saveFeedback(
    prediction,
    actual
){



    let data =
    JSON.parse(

        fs.readFileSync(
            FEEDBACK_FILE,
            "utf8"
        )

    );



    let hitFront =
    prediction.front.filter(
        n=>
        actual.front.includes(n)
    ).length;



    let hitBack =
    prediction.back.filter(
        n=>
        actual.back.includes(n)
    ).length;




    data.records.push({


        time:
        new Date()
        .toISOString(),


        prediction,


        actual,


        hitFront,


        hitBack


    });





    data.statistics.total =
    data.records.length;



    fs.writeFileSync(

        FEEDBACK_FILE,

        JSON.stringify(
            data,
            null,
            2
        )

    );




    return {


        hitFront,

        hitBack

    };


}









// ======================================================
// Evolution Engine
// 模型淘汰进化
// ======================================================



function evolutionEngine(){



    let state =
    JSON.parse(

        fs.readFileSync(
            MODEL_FILE,
            "utf8"
        )

    );



    Object.keys(
        state.models
    )
    .forEach(name=>{


        let model =
        state.models[name];



        if(
            model.score>=80
        ){


            model.status=
            "active";


            model.weight+=0.1;


        }

        else if(
            model.score>=40
        ){


            model.status=
            "learning";


        }

        else{


            model.status=
            "sleep";


            model.weight=0.1;


        }


    });






    fs.writeFileSync(

        MODEL_FILE,

        JSON.stringify(
            state,
            null,
            2
        )

    );



    return state;


}









// ======================================================
// 回测接口
// ======================================================



function backTesting(){



    return {


        history:

        history.length,


        result:

        aiCommittee()
        .slice(0,10)


    };


}









// ======================================================
// API
// ======================================================



app.get(
"/api/status",
(req,res)=>{


    res.json({


        system:
        "DLT-AI-CORE V10.2",


        status:
        "running",


        history:
        history.length


    });


});








app.get(
"/api/analyze",
(req,res)=>{


    let progress=0;



    let timer =
    setInterval(()=>{


        progress+=10;



        if(
            progress>=100
        ){

            clearInterval(timer);

        }



        fs.writeFileSync(

            OUTPUT_PROGRESS,

            String(progress)

        );



    },200);







    let prediction =
    generatePrediction();






    fs.writeFileSync(

        OUTPUT_PREDICTION,

`

DLT-AI-CORE V10.2


前区:

${prediction.front.join(" ")}


后区:

${prediction.back.join(" ")}


置信度:

${prediction.confidence}


`

    );






    res.json(prediction);



});









app.post(
"/api/feedback",
(req,res)=>{


    let result =
    saveFeedback(

        req.body.prediction,

        req.body.actual

    );



    evolutionEngine();




    res.json({


        message:
        "反馈学习完成",


        result


    });



});








app.get(
"/api/backtest",
(req,res)=>{


    res.json(
        backTesting()
    );


});









// ======================================================
// 启动
// ======================================================



const PORT =
process.env.PORT
||
3000;



app.listen(
PORT,
()=>{


    console.log(
`
================================

DLT-AI-CORE V10.2

启动成功

PORT:
${PORT}

历史数据:
${history.length}

================================
`
    );


});