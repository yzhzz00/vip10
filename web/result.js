function renderDLT(data){


    let html="";


    data.prediction
    .forEach((item,index)=>{


        html+=`

        <div class="item">

        第${index+1}注<br>

        前区：

        ${item.front.join(" ")}

        <br>

        后区：

        ${item.back.join(" ")}

        </div>


        `;


    });



    return html;


}




function renderPL5(data){


    return `

    <div class="item">

    位置概率：

    <br>

    ${JSON.stringify(
        data.prediction
    )}

    </div>

    `;


}



export {

renderDLT,

renderPL5

};