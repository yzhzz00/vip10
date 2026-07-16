// ======================================================
// DLT-AI-CORE V10.2
// 大乐透智能分析核心系统
//
// 核心:
// Data Engine
// Feature Engine
// AI Model Center
// Model Arena
// AI Committee
// Evolution Engine
// Rolling Training
// Feedback Learning
// Monte Carlo
// Matrix Fusion
// ======================================================


import express from "express";
import cors from "cors";
import fs from "fs";



// ===============================
// 基础服务
// ===============================


const app = express();


app.use(
    cors()
);


app.use(
    express.json()
);


app.use(
    express.static("public")
);



// ===============================
// 文件路径
// ===============================


const HISTORY_FILE =
"./data/dlt_history.txt";


const MODEL_FILE =
"./data/model_state.json";


const FEEDBACK_FILE =
"./data/feedback.json";


const PREDICTION_FILE =
"./data/prediction_history.json";



const OUTPUT_PREDICTION =
"./output/prediction.txt";


const OUTPUT_ANALYSIS =
"./output/analysis.txt";


const OUTPUT_PROGRESS =
"./output/progress.txt";




// ===============================
// 初始化系统文件
// ===============================


function initSystem(){


    const dirs=[

        "./data",
        "./output",
        "./logs"

    ];



    dirs.forEach(dir=>{


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
                    },


                    Committee:{
                        score:50
                    }


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
            "[]"
        );

    }





    if(
        !fs.existsSync(PREDICTION_FILE)
    ){

        fs.writeFileSync(
            PREDICTION_FILE,
            "[]"
        );

    }





    if(
        !fs.existsSync(OUTPUT_PROGRESS)
    ){

        fs.writeFileSync(
            OUTPUT_PROGRESS,
            "0%"
        );

    }


}



initSystem();




// ===============================
// TXT历史数据读取
// 保持你的原始格式
// ===============================


function loadHistory(){



    if(
        !fs.existsSync(HISTORY_FILE)
    ){

        return [];

    }



    const txt =
    fs.readFileSync(
        HISTORY_FILE,
        "utf8"
    );



    return parseTXT(txt);


}






// ===============================
// TXT解析
//
// 支持:
//
// 01 05 12 23 31 + 03 09
//
// 01,05,12,23,31+03,09
//
// ===============================


function parseTXT(text){


    let history=[];



    let lines =
    text
    .split("\n")
    .map(
        x=>x.trim()
    )
    .filter(
        x=>x
    );



    for(
        let line of lines
    ){


        let nums =
        line
        .match(/\d+/g)
        ?.map(Number)
        ||
        [];



        if(
            nums.length>=7
        ){


            let front =
            nums.slice(
                0,
                5
            );


            let back =
            nums.slice(
                5,
                7
            );



            history.push({

                front:
                front.sort(
                    (a,b)=>a-b
                ),


                back:
                back.sort(
                    (a,b)=>a-b
                )

            });


        }


    }



    return history;


}






// 当前历史数据


let history =
loadHistory();



console.log(
"历史数据:",
history.length,
"期"
);

// ======================================================
// Theory Engine
// 大乐透理论约束系统
// ======================================================


const TheoryEngine = {



// 奇偶结构

oddEven(numbers){


    let odd =
    numbers.filter(
        n=>n%2===1
    ).length;


    let even =
    numbers.length-odd;



    let score =
    (
        odd>=1 &&
        odd<=4
    )
    ?
    90
    :
    60;



    return {

        odd,

        even,

        score

    };

},




// 大小结构
// 前区1-17小，18-35大

bigSmall(numbers){


    let small =
    numbers.filter(
        n=>n<=17
    ).length;



    let big =
    numbers.length-small;



    return {


        small,

        big,


        score:

        (
            small>=1
            &&
            small<=4
        )
        ?
        85
        :
        60


    };


},





// 前区三区

zone(numbers){


    let z1=0;

    let z2=0;

    let z3=0;



    numbers.forEach(n=>{


        if(n<=12){

            z1++;

        }
        else if(n<=24){

            z2++;

        }
        else{

            z3++;

        }


    });



    return {


        zone1:z1,

        zone2:z2,

        zone3:z3,


        score:80


    };


},






// 和值

sum(numbers){


    let value =
    numbers.reduce(
        (a,b)=>a+b,
        0
    );



    return {


        value,


        score:

        (
            value>=80
            &&
            value<=140
        )
        ?
        90
        :
        60


    };


},





// 跨度

span(numbers){


    let value =
    Math.max(...numbers)
    -
    Math.min(...numbers);



    return {


        value,


        score:

        (
            value>=15
            &&
            value<=32
        )
        ?
        85
        :
        60


    };


},






// 尾数

tail(numbers){


    let tails =
    numbers.map(
        n=>n%10
    );



    let repeat =
    tails.length
    -
    new Set(tails).size;



    return {


        tails,

        repeat,


        score:

        repeat<=2
        ?
        85
        :
        60


    };


},






// 012路

road012(numbers){


    let road=[0,0,0];



    numbers.forEach(n=>{


        road[
            n%3
        ]++;


    });



    return {


        road0:road[0],

        road1:road[1],

        road2:road[2],


        score:80


    };


},







// AC值

ac(numbers){


    let diff=[];



    for(
        let i=0;
        i<numbers.length;
        i++
    ){


        for(
            let j=i+1;
            j<numbers.length;
            j++
        ){


            diff.push(

                Math.abs(
                    numbers[i]
                    -
                    numbers[j]
                )

            );


        }


    }



    let ac =
    new Set(diff)
    .size
    -
    4;



    return {


        value:ac,


        score:

        (
            ac>=3
            &&
            ac<=10
        )
        ?
        85
        :
        60


    };


},







// 连号

connect(numbers){


    let count=0;



    let arr =
    [
        ...numbers
    ]
    .sort(
        (a,b)=>a-b
    );



    for(
        let i=1;
        i<arr.length;
        i++
    ){


        if(
            arr[i]-arr[i-1]===1
        ){

            count++;

        }


    }



    return {


        count,


        score:

        count<=2
        ?
        85
        :
        60


    };


}



};







// ======================================================
// Feature Engine
// 特征矩阵
// ======================================================


function buildFeature(numbers){



    return {


        oddEven:

        TheoryEngine
        .oddEven(numbers),



        bigSmall:

        TheoryEngine
        .bigSmall(numbers),



        zone:

        TheoryEngine
        .zone(numbers),



        sum:

        TheoryEngine
        .sum(numbers),



        span:

        TheoryEngine
        .span(numbers),



        tail:

        TheoryEngine
        .tail(numbers),



        road012:

        TheoryEngine
        .road012(numbers),



        ac:

        TheoryEngine
        .ac(numbers),



        connect:

        TheoryEngine
        .connect(numbers)



    };


}






// 历史特征生成

function createFeatureMatrix(history){


    return history.map(item=>{


        return {


            front:
            item.front,


            back:
            item.back,


            feature:
            buildFeature(
                item.front
            )


        };


    });


}



let featureMatrix =
createFeatureMatrix(
    history
);



console.log(
"特征矩阵完成:",
featureMatrix.length
);

// ======================================================
// AI Model Center
// Frequency / Trend / Cycle / Bayes / Markov
// ======================================================



// ===============================
// Frequency Model
// 历史频率模型
// ===============================


function frequencyModel(history){


    let count={};



    history.forEach(item=>{


        item.front.forEach(n=>{


            count[n]=
            (count[n]||0)+1;


        });


    });




    return Object.entries(count)

    .map(([num,value])=>{


        return {


            number:
            Number(num),


            score:value


        };


    })


    .sort(
        (a,b)=>
        b.score-a.score
    );


}








// ===============================
// Trend Model
// 近期趋势模型
// ===============================


function trendModel(history){



    let recent =
    history.slice(-30);



    let score={};



    recent.forEach(
        (item,index)=>{


            let weight =
            index+1;



            item.front.forEach(n=>{


                score[n]=
                (
                    score[n]
                    ||
                    0
                )
                +
                weight;


            });


        }
    );



    return Object.entries(score)

    .map(([num,value])=>{


        return {


            number:
            Number(num),


            score:value


        };


    })

    .sort(
        (a,b)=>
        b.score-a.score
    );


}









// ===============================
// Cycle Model
// 遗漏周期模型
// ===============================


function cycleModel(history){



    let result=[];



    for(
        let n=1;
        n<=35;
        n++
    ){



        let miss=0;



        for(
            let i=
            history.length-1;
            i>=0;
            i--
        ){



            if(
                history[i]
                .front
                .includes(n)
            ){

                break;

            }



            miss++;


        }



        result.push({


            number:n,


            score:miss


        });



    }



    return result.sort(

        (a,b)=>
        b.score-a.score

    );


}









// ===============================
// Bayes Model
// 贝叶斯概率更新
// ===============================


function bayesModel(history){



    let count={};



    history.forEach(item=>{


        item.front.forEach(n=>{


            count[n]=
            (
                count[n]
                ||
                0
            )
            +
            1;


        });


    });





    let total =
    history.length*5;



    return Object.entries(count)

    .map(([num,value])=>{


        return {


            number:
            Number(num),


            score:
            value/total


        };


    })

    .sort(

        (a,b)=>
        b.score-a.score

    );

}









// ===============================
// Markov Model
// 一阶状态转移
// ===============================


function markovModel(history){



    let transition={};



    for(
        let i=1;
        i<history.length;
        i++
    ){



        let before =
        history[i-1]
        .front;



        let after =
        history[i]
        .front;




        before.forEach(a=>{


            if(
                !transition[a]
            ){

                transition[a]={};

            }



            after.forEach(b=>{


                transition[a][b]=
                (
                    transition[a][b]
                    ||
                    0
                )
                +
                1;



            });



        });



    }






    let score={};



    let last =
    history[
        history.length-1
    ]
    .front;



    last.forEach(n=>{


        let next =
        transition[n]
        ||
        {};



        Object.entries(next)
        .forEach(
        ([num,value])=>{


            score[num]=
            (
                score[num]
                ||
                0
            )
            +
            value;


        });


    });






    return Object.entries(score)

    .map(([num,value])=>{


        return {


            number:
            Number(num),


            score:value


        };


    })

    .sort(

        (a,b)=>
        b.score-a.score

    );


}









// ======================================================
// AI模型统一入口
// ======================================================


function runAIModels(history){



    return {


        Frequency:
        frequencyModel(history),



        Trend:
        trendModel(history),



        Cycle:
        cycleModel(history),



        Bayes:
        bayesModel(history),



        Markov:
        markovModel(history)



    };


}






let aiModels =
runAIModels(history);



console.log(
"AI模型加载完成"
);

// ======================================================
// Model Arena
// 模型竞技场
// ======================================================



function loadModelState(){


    return JSON.parse(

        fs.readFileSync(
            MODEL_FILE,
            "utf8"
        )

    );


}






function saveModelState(data){


    fs.writeFileSync(

        MODEL_FILE,

        JSON.stringify(
            data,
            null,
            2
        )

    );


}









// ===============================
// 模型历史回测评分
// ===============================


function evaluateModel(
    model,
    history
){



    let hit=0;



    let test =
    history.slice(-50);



    model
    .slice(0,10)
    .forEach(item=>{


        test.forEach(row=>{


            if(
                row.front
                .includes(
                    item.number
                )
            ){

                hit++;

            }


        });


    });





    return {


        hit,


        score:
        50+hit


    };


}







// ===============================
// Model Arena
// ===============================


function modelArena(
    models,
    history
){



    let result={};



    Object.keys(models)
    .forEach(name=>{


        result[name]=
        evaluateModel(

            models[name],

            history

        );


    });



    return result;


}









// ======================================================
// AI Committee
// 模型委员会
// ======================================================



function aiCommittee(
    models,
    arena
){



    let state =
    loadModelState();



    let weight={};




    Object.keys(arena)
    .forEach(name=>{


        let oldWeight =
        state[name]
        ?
        state[name].weight
        :
        1;



        let performance =
        arena[name].score
        /
        100;



        weight[name]=
        oldWeight
        *
        performance;



    });






    let pool={};





    Object.keys(models)
    .forEach(name=>{


        let model =
        models[name];



        model
        .slice(0,15)
        .forEach(item=>{


            if(
                !pool[item.number]
            ){

                pool[item.number]=0;

            }



            pool[item.number]
            +=
            item.score
            *
            weight[name];



        });


    });






    return Object.entries(pool)

    .map(([num,score])=>{


        return {


            number:
            Number(num),


            score


        };


    })

    .sort(

        (a,b)=>
        b.score-a.score

    );


}









// ======================================================
// Monte Carlo
// 约束随机模拟
// ======================================================



function monteCarlo(
    history,
    times=100000
){



    let frequency =
    frequencyModel(history);



    let pool =
    frequency.map(
        x=>x.number
    );



    let results=[];



    let max =
    Math.min(
        times,
        100000
    );



    for(
        let i=0;
        i<max;
        i++
    ){



        let set =
        new Set();



        while(
            set.size<5
        ){


            let n =
            pool[
                Math.floor(
                    Math.random()
                    *
                    pool.length
                )
            ];



            set.add(n);


        }



        let front =
        [...set]
        .sort(
            (a,b)=>a-b
        );



        let feature =
        buildFeature(
            front
        );



        let score =

        (

            feature.oddEven.score

            +

            feature.bigSmall.score

            +

            feature.zone.score

            +

            feature.sum.score

            +

            feature.span.score

            +

            feature.ac.score

        )

        /

        6;



        results.push({

            front,

            score


        });



    }






    return results.sort(

        (a,b)=>
        b.score-a.score

    )

    .slice(
        0,
        100
    );

}







console.log(
"模型竞技场准备完成"
);

// ======================================================
// Matrix Fusion Engine
// FinalScore =
// (F × W × R) × T × A × C
// ======================================================



// ===============================
// Anti Human Bias
// 反人类偏差修正
// ===============================


function antiHumanBias(score){



    // 防止过度追热


    if(
        score>200
    ){

        return 0.8;

    }




    // 防止极端冷号


    if(
        score<20
    ){

        return 0.9;

    }



    return 1;


}









// ===============================
// Confidence Engine
// 模型一致性
// ===============================


function confidenceEngine(
    models
){



    let numbers=[];



    Object.values(models)
    .forEach(model=>{


        model
        .slice(0,10)
        .forEach(item=>{


            numbers.push(
                item.number
            );


        });


    });






    let map={};



    numbers.forEach(n=>{


        map[n]=
        (
            map[n]
            ||
            0
        )
        +
        1;


    });






    return Object.entries(map)

    .map(([num,value])=>{


        return {


            number:
            Number(num),


            confidence:
            value
            /
            numbers.length


        };


    })

    .sort(

        (a,b)=>
        b.confidence-a.confidence

    );


}









// ===============================
// Theory Constraint
// 大乐透理论综合分
// ===============================


function theoryConstraint(
    numbers
){



    let feature =
    buildFeature(
        numbers
    );



    return (

        feature.oddEven.score

        +

        feature.bigSmall.score

        +

        feature.zone.score

        +

        feature.sum.score

        +

        feature.span.score

        +

        feature.ac.score


    )
    /
    6;



}









// ===============================
// Matrix Fusion
// ===============================


function matrixFusion(
    score,
    theory,
    confidence
){



    let F =
    score;



    let W =
    1;



    let R =
    confidence;



    let T =
    theory;



    let A =
    antiHumanBias(
        score
    );



    let C =
    confidence;




    return (

        F
        *
        W
        *
        R

    )

    *

    T

    *

    A

    *

    C;


}









// ======================================================
// Ranking Engine
// 最终排序
// ======================================================


function rankingEngine(
    committee,
    monte,
    confidence
){



    let result=[];



    committee
    .forEach(item=>{


        let monteItem =
        monte.find(
            x=>
            x.front
            .includes(
                item.number
            )
        );



        let base =
        item.score
        +
        (
            monteItem
            ?
            monteItem.score
            :
            0
        );



        let theory =
        monteItem
        ?
        theoryConstraint(
            monteItem.front
        )
        :
        60;



        let conf =
        confidence.find(
            x=>
            x.number
            ===
            item.number
        );



        let c =
        conf
        ?
        conf.confidence
        :
        0.1;



        result.push({


            number:
            item.number,


            finalScore:

            matrixFusion(

                base,

                theory,

                c

            )


        });



    });






    return result.sort(

        (a,b)=>
        b.finalScore
        -
        a.finalScore

    );

}









// ======================================================
// Rolling Learning
// 滚动学习
// ======================================================


function rollingLearning(
    modelResult
){



    let state =
    loadModelState();



    Object.keys(modelResult)
    .forEach(name=>{


        if(
            !state[name]
        ){

            state[name]={

                weight:1,

                score:50

            };

        }



        let old =
        state[name].score;



        let hit =
        modelResult[name].score;



        state[name].score =

        old*0.8

        +

        hit*0.2;




        state[name].weight =

        Math.max(

            0.1,

            state[name].score/50

        );



    });






    saveModelState(
        state
    );


}








console.log(
"矩阵融合与学习系统加载完成"
);

// ======================================================
// Feedback Engine
// 开奖反馈系统
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





    data.push({

        time:
        new Date()
        .toISOString(),


        prediction,


        actual,


        hitFront,


        hitBack


    });





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
// 模型进化淘汰机制
// ======================================================



function evolutionEngine(){



    let state =
    loadModelState();





    Object.keys(state)
    .forEach(name=>{



        if(
            name==="Committee"
        ){

            return;

        }




        let score =
        state[name].score;




        // 优秀模型


        if(
            score>=80
        ){

            state[name].status =
            "active";


            state[name].weight =
            Math.min(
                3,
                state[name].weight+0.1
            );


        }




        // 普通模型


        else if(
            score>=40
        ){

            state[name].status =
            "learning";


        }




        // 低表现模型


        else{


            state[name].status =
            "sleep";


            state[name].weight =
            0.1;


        }



    });






    saveModelState(
        state
    );



    return state;


}









// ======================================================
// Backtesting Engine
// 回测系统
// ======================================================



function backTesting(
    history
){



    let models =
    runAIModels(
        history
    );



    let result={};



    Object.keys(models)
    .forEach(name=>{



        result[name]=
        evaluateModel(

            models[name],

            history

        );



    });






    return result;


}









// ======================================================
// Prediction Engine
// 最终预测生成
// ======================================================



function generatePrediction(){



    let models =
    runAIModels(
        history
    );



    let arena =
    modelArena(
        models,
        history
    );



    let committee =
    aiCommittee(
        models,
        arena
    );



    let confidence =
    confidenceEngine(
        models
    );



    let monte =
    monteCarlo(
        history,
        100000
    );





    let ranking =
    rankingEngine(

        committee,

        monte,

        confidence

    );





    let front=[];




    ranking
    .slice(0,5)
    .forEach(item=>{


        if(
            !front.includes(
                item.number
            )
        ){

            front.push(
                item.number
            );

        }


    });






    while(
        front.length<5
    ){


        let n =
        Math.floor(
            Math.random()
            *
            35
        )
        +
        1;



        if(
            !front.includes(n)
        ){

            front.push(n);

        }

    }






    front.sort(
        (a,b)=>a-b
    );





    let back=[1,2];





    let prediction={


        front,


        back,


        time:
        new Date()
        .toISOString(),



        models:
        arena


    };






    let old =
    JSON.parse(

        fs.readFileSync(
            PREDICTION_FILE,
            "utf8"
        )

    );




    old.push(
        prediction
    );




    fs.writeFileSync(

        PREDICTION_FILE,

        JSON.stringify(
            old,
            null,
            2
        )

    );





    fs.writeFileSync(

        OUTPUT_PREDICTION,

`
DLT-AI-CORE V10.2

前区:
${front.join(" ")}

后区:
${back.join(" ")}

模型:
AI Committee

时间:
${prediction.time}

`

    );





    fs.writeFileSync(

        OUTPUT_ANALYSIS,

        JSON.stringify(

            {

                arena,

                committee:
                ranking.slice(0,10),

                confidence:
                confidence.slice(0,10)

            },

            null,

            2

        )

    );




    return prediction;


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


        history:
        history.length,


        status:
        "ready"


    });


});







app.get(
"/api/analyze",
(req,res)=>{


    let result =
    generatePrediction();



    res.json(
        result
    );


});







app.post(
"/api/feedback",
(req,res)=>{


    let result =
    saveFeedback(

        req.body.prediction,

        req.body.actual

    );



    rollingLearning(
        arenaScore
    );



    evolutionEngine();




    res.json({

        message:
        "反馈学习完成",


        result


    });



});








// ======================================================
// 启动
// ======================================================



app.listen(
3000,
()=>{


    console.log(
`
=================================

DLT-AI-CORE V10.2

启动成功

访问:
http://localhost:3000

历史数据:
${history.length}期

=================================
`
    );


});