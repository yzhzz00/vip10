// DLT-AI-CORE VIP
// core/engine.js
// AI预测核心引擎
//
// 总控制:
// data
// features
// models
// matrix
// generator
// filter
// score
// committee
// cache
// scheduler
//
// 负责真正执行一次预测流程


import DataManager from "./data.js";
import Features from "./features.js";
import Models from "./models.js";
import Matrix from "./matrix.js";
import Generator from "./generator.js";
import Filter from "./filter.js";
import Score from "./score.js";
import Committee from "./committee.js";
import Cache from "./cache.js";
import Scheduler from "./scheduler.js";



class Engine {



    constructor(){


        this.data =

        new DataManager();



        this.features =

        new Features();



        this.models =

        new Models();



        this.matrix =

        new Matrix();



        this.generator =

        new Generator();



        this.filter =

        new Filter();



        this.score =

        new Score();



        this.committee =

        new Committee();



        this.cache =

        new Cache();



        this.scheduler =

        new Scheduler();



    }









    // ======================
    // 主预测入口
    // ======================

    async predict(){



        const cacheKey =

        "latest_prediction";






        // 优先读取缓存

        if(

            this.cache.has(

                cacheKey

            )

        ){



            return this.cache.get(

                cacheKey

            )

            .value;



        }









        this.scheduler.start();









        // 1 数据读取

        this.scheduler.update(

            10,

            "读取历史数据"

        );



        const history =

        this.data.load();









        // 2 特征计算

        this.scheduler.update(

            30,

            "生成历史特征"

        );



        const features =

        this.features.analyze(

            history

        );









        // 3 模型计算

        this.scheduler.update(

            50,

            "多模型分析"

        );



        const models =

        this.models.run(

            history,

            features

        );









        // 4 矩阵融合

        this.scheduler.update(

            65,

            "模型融合评分"

        );



        const matrix =

        this.matrix.build(

            models

        );









        // 5 候选生成

        this.scheduler.update(

            75,

            "生成候选组合"

        );



        const candidates =

        this.generator.generate(

            this.matrix,

            history

        );









        // 6 过滤

        this.scheduler.update(

            85,

            "结构过滤"

        );



        const filtered =

        this.filter.filter(

            candidates,

            history

        );









        // 7 最终评分

        this.scheduler.update(

            95,

            "最终评分排序"

        );



        const ranked =

        this.score.rank(

            filtered,

            matrix,

            history

        );









        const result = {



            time:

            new Date()

            .toISOString(),



            dataCount:

            history.length,



            models:

            this.committee.getWeights(),



            result:

            ranked.slice(

                0,

                5

            )



        };









        this.scheduler.complete();









        // 保存缓存

        this.cache.set(

            cacheKey,

            result

        );









        return result;



    }









    // ======================
    // 获取运行状态
    // ======================

    status(){



        return this.scheduler

        .getStatus();



    }





}



export default Engine;