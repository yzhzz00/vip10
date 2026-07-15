// 大乐透AI_V90
// Markov Engine
// 一阶马尔可夫转移模型


window.MarkovEngine = {


    history: [],


    frontMatrix:{},


    backMatrix:{},



    initialized:false,







    // 初始化


    init(history){



        this.history =
        history || [];



        this.buildMatrix();



        this.initialized=true;



        console.log(
            "Markov Engine 初始化完成"
        );



    },








    // 构建转移矩阵


    buildMatrix(){



        this.frontMatrix={};

        this.backMatrix={};




        for(
            let i=0;
            i<this.history.length-1;
            i++
        ){



            let current =
            this.history[i];



            let next =
            this.history[i+1];




            current.front.forEach(
                from=>{


                    if(
                        !this.frontMatrix[from]
                    ){

                        this.frontMatrix[from]={};

                    }



                    next.front.forEach(
                        to=>{


                            if(
                                !this.frontMatrix[from][to]
                            ){

                                this.frontMatrix[from][to]=0;

                            }


                            this.frontMatrix[from][to]++;


                        }
                    );


                }
            );






            current.back.forEach(
                from=>{


                    if(
                        !this.backMatrix[from]
                    ){

                        this.backMatrix[from]={};

                    }



                    next.back.forEach(
                        to=>{


                            if(
                                !this.backMatrix[from][to]
                            ){

                                this.backMatrix[from][to]=0;

                            }


                            this.backMatrix[from][to]++;



                        }
                    );


                }
            );



        }



    },









    // 转概率计算


    normalize(matrix){



        let result={};



        for(
            let key in matrix
        ){



            let total=0;



            for(
                let child in matrix[key]
            ){

                total +=
                matrix[key][child];

            }



            result[key]={};



            for(
                let child in matrix[key]
            ){



                result[key][child] =

                matrix[key][child]
                /
                total;



            }


        }



        return result;



    },









    // 获取下一期概率


    predictNext(last){



        let frontProbability =
        this.normalize(
            this.frontMatrix
        );



        let backProbability =
        this.normalize(
            this.backMatrix
        );




        return {


            front:

            this.calculateNext(
                last.front,
                frontProbability
            ),



            back:

            this.calculateNext(
                last.back,
                backProbability
            )



        };



    },









    calculateNext(
        numbers,
        matrix
    ){



        let score={};



        numbers.forEach(
            n=>{


                let next =
                matrix[n];



                if(next){


                    for(
                        let key in next
                    ){


                        score[key] =

                        (
                            score[key]||0
                        )
                        +
                        next[key];


                    }


                }



            }
        );



        return Object.entries(score)

        .sort(
            (
                a,b
            )=>

            b[1]-a[1]

        );



    }






};