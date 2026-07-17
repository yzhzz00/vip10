class Elimination {



    filter(combinations){



        return combinations.filter(item=>{





            let front=item.front;





            let odd=

            front.filter(

                n=>n%2

            )

            .length;





            let sum=

            front.reduce(

                (a,b)=>a+b,

                0

            );






            if(

                odd<1 ||

                odd>4

            )

            return false;






            if(

                sum<70 ||

                sum>170

            )

            return false;






            return true;



        });



    }



}





export default new Elimination();