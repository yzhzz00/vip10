// models/markovModel.js


/*
    DLT-AI CORE V1.0

    Markov Model

    功能:

    一阶状态转移评分

    上一期号码

        ↓

    下一期候选号码


*/



// 建立转移矩阵

function buildMarkovMatrix(
    history
){


    const matrix={};



    for(
        let i=1;
        i<=35;
        i++
    ){

        matrix[i]={};

    }





    for(
        let i=1;
        i<history.length;
        i++
    ){


        const previous =
        history[i-1]
        .front;



        const current =
        history[i]
        .front;





        previous.forEach(
            prevNum=>{


                current.forEach(
                    curNum=>{


                        if(
                            !matrix[prevNum][curNum]
                        ){

                            matrix[prevNum][curNum]
                            =
                            0;

                        }



                        matrix[prevNum][curNum]++;



                    }
                );


            }
        );


    }



    return matrix;


}








function scoreMarkov(
    front,
    history
){



    const matrix =
    buildMarkovMatrix(
        history
    );



    const last =
    history[
        history.length-1
    ]
    .front;



    let total=0;



    front.forEach(
        num=>{


            let probability=0;



            last.forEach(
                lastNum=>{


                    const row =
                    matrix[lastNum];



                    const sum =
                    Object.values(row)
                    .reduce(
                        (a,b)=>a+b,
                        0
                    );



                    if(
                        row[num]
                        &&
                        sum>0
                    ){

                        probability +=

                        row[num]
                        /
                        sum;

                    }



                }
            );



            probability =
            probability
            /
            last.length;



            let score =
            probability
            *
            100;



            if(
                score>100
            ){

                score=100;

            }



            total+=score;



        }
    );





    return {


        score:

        Number(
            (
            total/5
            )
            .toFixed(2)
        ),



        matrix


    };


}





module.exports =
scoreMarkov;