// core/portraitBuilder.js


/*
    DLT-AI CORE V1.0

    Portrait Builder

    功能:

    特征数据

        ↓

    开奖画像


*/



// 和值等级

function sumLevel(sum){


    if(sum<80){

        return "低";

    }


    if(sum<110){

        return "中";

    }


    return "高";


}



// 跨度等级

function spanLevel(span){


    if(span<=15){

        return "小";

    }


    if(span<=25){

        return "中";

    }


    return "大";


}




// 后区等级

function backLevel(sum){


    if(sum<=10){

        return "低";

    }


    if(sum<=18){

        return "中";

    }


    return "高";

}




function buildPortrait(item){


    const f =
    item.features;



    return {


        issue:
        item.issue,


        date:
        item.date,


        front:
        item.front,


        back:
        item.back,



        features:f,



        portrait:{



            sum:f.sum,


            sumLevel:
            sumLevel(
                f.sum
            ),



            span:f.span,


            spanLevel:
            spanLevel(
                f.span
            ),



            zone:
            f.zone,



            oddEven:
            f.oddEven,



            bigSmall:
            f.bigSmall,



            ac:
            f.ac,



            backSum:
            f.backSum,


            backLevel:
            backLevel(
                f.backSum
            ),



            structure:

            `${sumLevel(f.sum)}和值+${spanLevel(f.span)}跨度`


        }


    };


}





function portraitBuilder(features){


    return features.map(
        item=>
        buildPortrait(item)
    );


}



module.exports =
portraitBuilder;