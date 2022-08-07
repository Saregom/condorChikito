const express = require("express")
const bodyParser = require("body-parser")

let app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use("/api/", require("./src/rutas"))

app.listen(5000, ()=>{ console.log("Servidor en ejecución") })