// DLT-AI-CORE V11 FINAL
// core/feature_select.js
// 特征筛选引擎


class FeatureSelector {


    constructor(){


        this.threshold =
        0.5;


    }









    select(features){


        return {


            basic:
            this.selectBasic(
                features.basic
            ),


            theory:
            this.selectTheory(
                features.theory
            ),


            frequency:
            this.selectFrequency(
                features.frequency
            ),


            missing:
            this.selectMissing(
                features.missing
            )


        };


    }









    selectBasic(data){


        return data;


    }









    selectTheory(theory){


        return {


            oddEven:
            theory.oddEven,


            size:
            theory.size,


            zone:
            theory.zone,


            sum:
            theory.sum,


            span:
            theory.span,


            route012:
            theory.route012



        };


    }









    selectFrequency(freq){


        return {


            front:
            this.limit(
                freq.front
            ),


            back:
            this.limit(
                freq.back
            )


        };


    }









    selectMissing(data){


        return data;


    }









    limit(obj){


        const result =
        {};


        Object.entries(
            obj
        )
        .forEach(
            ([key,value])=>{


                if(
                    value
                    >
                    0
                ){


                    result[key]=value;


                }


            }
        );


        return result;


    }









    setThreshold(value){


        this.threshold =
        value;


    }



}



export default FeatureSelector;