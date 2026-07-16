const express = require("express");
const cors = require("cors");

const historyEngine = require("./ai_core/engine/history_engine");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("dlt ai core v10.2 online");
});


app.get("/api/history", (req, res) => {

    const data = historyEngine.loadHistory();

    res.json({

        status: "success",

        count: data.length,

        latest: data.slice(-5)

    });

});


const port = process.env.PORT || 3000;


app.listen(port, "0.0.0.0", () => {

    console.log("dlt ai core start");

    console.log("port:", port);

});