class OmissionModel {


    analyze(history){


        let last=

        history[history.length-1];



        let exist=

        last.front;



        let scores={};





        for(let i=1;i<=35;i++){



            scores[i]=

            exist.includes(i)

            ?

            0

            :

            100;


        }



        return {


            name:"omission",

            scores


        };



    }


}



export default new OmissionModel();