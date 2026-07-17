class MatrixModel {


    analyze(history){


        let matrix={};



        for(let i=1;i<=35;i++){


            matrix[i]=0;


        }





        history.forEach(item=>{


            item.front.forEach(a=>{


                item.front.forEach(b=>{


                    if(a!==b)

                    matrix[b]++;


                });


            });



        });





        return {


            name:"matrix",

            scores:matrix


        };



    }


}


export default new MatrixModel();