// 前端接口


const API = {



predict(){

    return fetch(

        "/api/predict"

    )

    .then(

        r=>r.json()

    );

},




status(){

    return fetch(

        "/api/status"

    )

    .then(

        r=>r.json()

    );

},




backtest(period=100){


    return fetch(

        "/api/backtest?period="+period

    )

    .then(

        r=>r.json()

    );


},




learning(){


    return fetch(

        "/api/learning"

    )

    .then(

        r=>r.json()

    );


}



};