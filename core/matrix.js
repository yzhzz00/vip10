// DLT-AI-CORE V11 FINAL
// core/matrix.js
// 矩阵AI分析模块


class MatrixAI {


    constructor(){

        this.frontSize = 35;

        this.backSize = 12;

    }





    analyze(history){


        return {


            frequencyMatrix:

            this.frequencyMatrix(history),


            transitionMatrix:

            this.transitionMatrix(history),


            omissionMatrix:

            this.omissionMatrix(history),


            structureMatrix:

            this.structureMatrix(history)


        };


    }





    // 号码频率矩阵

    frequencyMatrix(history){


        const matrix={};



        for(let n=1;n<=35;n++){


            matrix[n]=0;


        }



        for(const item of history){


            for(const n of item.front){


                matrix[n]++;


            }


        }



        return matrix;


    }





    // 一阶转移矩阵

    transitionMatrix(history){


        const matrix={};



        for(
            let i=1;
            i<history.length;
            i++
        ){


            const previous =

            history[i-1].front;



            const current =

            history[i].front;



            for(const a of previous){


                if(!matrix[a]){

                    matrix[a]={};

                }



                for(const b of current){


                    matrix[a][b]=

                    (matrix[a][b]||0)+1;


                }


            }


        }



        return matrix;


    }





    // 遗漏矩阵

    omissionMatrix(history){


        const result={};



        for(let n=1;n<=35;n++){


            let miss=0;



            for(
                let i=history.length-1;
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



            result[n]=miss;


        }



        return result;


    }





    // 结构矩阵

    structureMatrix(history){


        const result={



            zone:{


                low:0,

                middle:0,

                high:0


            },



            odd:0,


            even:0,


            sum:0


        };



        const latest =

        history[
            history.length-1
        ];



        for(const n of latest.front){



            if(n<=12)

                result.zone.low++;


            else if(n<=24)

                result.zone.middle++;


            else

                result.zone.high++;



            if(n%2)

                result.odd++;

            else

                result.even++;



            result.sum += n;


        }



        return result;


    }





    // 根据矩阵生成评分

    scoreNumbers(matrix){


        const score={};



        const frequency =

        matrix.frequencyMatrix;



        const omission =

        matrix.omissionMatrix;



        for(let n=1;n<=35;n++){



            score[n]=


            frequency[n]*0.6

            +

            omission[n]*0.4;



        }



        return Object.entries(score)

        .sort(
            (a,b)=>b[1]-a[1]
        );


    }



}



export default MatrixAI;