// core/featureBuilder.js


/*
    DLT-AI CORE V1.0

    Feature Builder

    功能:

    开奖号码

        ↓

    特征数据


*/



// 和值

function getSum(numbers){

    return numbers.reduce(
        (a,b)=>a+b,
        0
    );

}



// 跨度

function getSpan(numbers){

    return Math.max(...numbers)
    -
    Math.min(...numbers);

}



// 奇偶

function getOddEven(numbers){


    let odd=0;
    let even=0;


    numbers.forEach(num=>{

        if(num%2===0){

            even++;

        }else{

            odd++;

        }

    });


    return `${odd}-${even}`;

}



// 大小

function getBigSmall(numbers){


    let big=0;
    let small=0;


    numbers.forEach(num=>{


        if(num>=18){

            big++;

        }else{

            small++;

        }


    });


    return `${big}-${small}`;

}



// 三区

function getZone(numbers){


    let zone1=0;
    let zone2=0;
    let zone3=0;



    numbers.forEach(num=>{


        if(num<=12){

            zone1++;

        }
        else if(num<=24){

            zone2++;

        }
        else{

            zone3++;

        }


    });



    return `${zone1}-${zone2}-${zone3}`;

}



// AC值
// 大乐透常用离散程度指标

function getAC(numbers){


    const diffs=[];


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

            diffs.push(
                Math.abs(
                    numbers[j]
                    -
                    numbers[i]
                )
            );

        }

    }



    const unique =
    [
        ...new Set(diffs)
    ];



    return unique.length
    -
    (numbers.length-1);

}



// 尾数

function getTails(numbers){

    return numbers
    .map(
        n=>n%10
    )
    .join(",");

}




function buildFeature(item){


    const front =
    item.front;


    const back =
    item.back;



    return {


        issue:item.issue,


        date:item.date,


        front,


        back,



        features:{


            sum:
            getSum(front),



            span:
            getSpan(front),



            oddEven:
            getOddEven(front),



            bigSmall:
            getBigSmall(front),



            zone:
            getZone(front),



            ac:
            getAC(front),



            tails:
            getTails(front),



            backSum:
            getSum(back),



            backOddEven:
            getOddEven(back)


        }


    };


}





function featureBuilder(history){


    return history.map(
        item=>
        buildFeature(item)
    );


}



module.exports =
featureBuilder;