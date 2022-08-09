const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

let app = express()

/* app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use("/api/", require("./src/rutas"))
app.use(cors())

app.listen(8080, ()=>{ console.log("Servidor en ejecución") }) */
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())
app.use("/api/", require("./src/rutas"))

app.listen(3000, ()=>{ console.log("Servidor en ejecución")})