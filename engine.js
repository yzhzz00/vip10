/*
================================

大乐透智能分析系统

V80.0 AI CORE

engine.js

核心控制引擎

================================
*/


class AIEngine{


constructor(){


    this.version="V80.0";


    this.ready=false;


    this.data=[];


    this.features=[];


    this.agents={};


    this.engines={};


    this.core={};


}









// ============================
// 初始化
// ============================


async init(){



    this.loadCore();



    this.loadAgents();



    this.loadEngines();





    await this.loadData();





    this.ready=true;



    return true;



}









// ============================
// 加载核心模块
// ============================


loadCore(){



    if(window.DataEngine){


        this.core.data=

        window.DataEngine;


    }






    if(window.FeatureEngine){


        this.core.feature=

        window.FeatureEngine;


    }






    if(window.LoadingEngine){


        this.core.loading=

        window.LoadingEngine;


    }



}









// ============================
// 加载Engine
// ============================


loadEngines(){



    if(window.FrequencyEngine){


        this.engines.frequency=

        window.FrequencyEngine;


    }





    if(window.MonteCarloEngine){


        this.engines.montecarlo=

        window.MonteCarloEngine;


    }



}









// ============================
// 加载Agent
// ============================


loadAgents(){



let list={


trend:"TrendAgent",


structure:"StructureAgent",


markov:"MarkovAgent",


risk:"RiskAgent",


review:"ReviewAgent",


theory:"TheoryAgent",


confidence:"ConfidenceAgent",


critic:"CriticAgent",


master:"MasterAgent"



};






Object.keys(list)

.forEach(key=>{



    if(window[list[key]]){



        this.agents[key]=

        window[list[key]];



    }



});



}









// ============================
// 加载历史数据
// ============================


async loadData(){



    if(!this.core.data)

        return;




    this.data=

    await this.core.data.load();



    if(this.core.feature){



        this.features=

        this.core.feature.build(

            this.data

        );



    }



}









// ============================
// AI分析入口
// ============================


async analyze(){



    if(!this.ready){



        await this.init();



    }






    if(this.core.loading){



        await this.core.loading.run();



    }






    let result={



        version:this.version,


        features:this.features.length,


        models:{},


        decision:null,


        critic:null



    };









// Trend


if(

this.agents.trend

&&

this.agents.trend.analyze

){


result.models.trend=

this.agents.trend.analyze(

this.features

);



}









// Structure


if(

this.agents.structure

&&

this.agents.structure.analyze

){


result.models.structure=

this.agents.structure.analyze(

this.features

);



}









// Markov


if(

this.agents.markov

&&

this.agents.markov.analyze

){


result.models.markov=

this.agents.markov.analyze(

this.features

);



}









// Master


if(

this.agents.master

&&

this.agents.master.decide

){


result.decision=

this.agents.master.decide(

result

);



}









// Critic


if(

this.agents.critic

&&

this.agents.critic.analyze

){


result.critic=

this.agents.critic.analyze(

result

);



}







return result;



}









// ============================
// 状态
// ============================


status(){



return {


version:this.version,


data:this.data.length,


features:this.features.length,


agents:Object.keys(

this.agents

),


engines:Object.keys(

this.engines

),


core:Object.keys(

this.core

),


ready:this.ready



};



}



}









window.AIEngine=

new AIEngine();