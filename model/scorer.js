// ==================================================
// V100.1 综合评分器
// ==================================================

"use strict";


window.V100Scorer = {



    score(number,history){



        let value =

        V100Model.analyzeNumber(

            number,

            history

        );





        return {


            number:number,


            score:value



        };



    },









    sort(list){



        return list.sort(

            (a,b)=>

            b.score-a.score

        );



    }



};