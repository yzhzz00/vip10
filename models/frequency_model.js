class FrequencyModel {


    analyze(features){


        let freq=

        features.frontFrequency;



        let max=

        Math.max(

            ...Object.values(freq)

        );



        let scores={};



        Object.keys(freq)

        .forEach(n=>{


            scores[n]=

            Number(

                (

                freq[n]/max*100

                )

                .toFixed(2)

            );


        });



        return {


            name:"frequency",

            scores



        };


    }


}


export default new FrequencyModel();