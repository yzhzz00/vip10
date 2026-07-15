window.V110_FEEDBACK={




save(){



    let period =

    document.getElementById(
        "period"
    ).value;





    let front=[];



    for(
        let i=1;
        i<=5;
        i++
    ){


        let value=

        Number(

        document.getElementById(

            "front"+i

        ).value

        );



        front.push(value);


    }






    let back=[];



    for(
        let i=1;
        i<=2;
        i++
    ){



        let value=

        Number(

        document.getElementById(

            "back"+i

        ).value

        );



        back.push(value);



    }






    let data={



        period,


        front,


        back,


        time:

        Date.now()



    };






    V110_DB.saveFeedback(

        data

    );





    return data;



}







};