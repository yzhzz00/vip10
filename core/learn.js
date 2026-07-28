/**
 * DLT-AI-CORE-VIP
 * 学习反馈引擎
 *
 * 功能：
 * 1. 接收开奖反馈
 * 2. 分析预测效果
 * 3. 调整模型权重
 * 4. 保存学习结果
 */


const fs = require("fs");

const path =
    require("path");


const storage =
    path.join(
        __dirname,
        "../storage/result.json"
    );



/**
 * 初始化数据
 */
function init(){

    if(
        !fs.existsSync(storage)
    ){

        fs.writeFileSync(
            storage,
            JSON.stringify(
                {
                    total:0,
                    history:[],
                    weights:{
                        frequency:0.6,
                        missing:0.3,
                        random:0.1
                    }
                },
                null,
                2
            )
        );

    }


}



/**
 * 读取学习数据
 */
function read(){

    init();

    return JSON.parse(
        fs.readFileSync(
            storage,
            "utf8"
        )
    );

}



/**
 * 保存学习数据
 */
function save(data){

    fs.writeFileSync(
        storage,
        JSON.stringify(
            data,
            null,
            2
        )
    );

}



/**
 * 更新模型权重
 *
 * 规则：
 * 命中提高相关权重
 * 长期无提升降低随机因素
 */
function update(feedback){

    const data =
        read();


    data.total++;


    data.history.push(
        feedback
    );


    let weights =
        data.weights;



    if(
        feedback.hit >= 3
    ){

        weights.frequency += 0.01;

        weights.missing += 0.01;

        weights.random -= 0.01;

    }
    else{

        weights.random += 0.01;

        weights.frequency -= 0.005;

    }



    // 权重限制

    Object.keys(weights)
    .forEach(key=>{

        if(weights[key]<0){

            weights[key]=0;

        }


        if(weights[key]>1){

            weights[key]=1;

        }

    });



    data.weights =
        weights;



    save(data);



    return {

        status:
        "learned",

        total:
        data.total,

        weights:
        data.weights

    };

}



module.exports={

    update

};
