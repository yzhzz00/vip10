const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("dlt ai core v10.2 online");
});

app.get("/api/history", (req, res) => {
    res.json({
        status: "success",
        message: "history api online"
    });
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
    console.log("dlt ai core start");
    console.log("port:", port);
});