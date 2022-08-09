let fs = require("fs")
let dataBase = require("../dataBase.json")

let control = {
    estudiantesDisponibles: function(req, res){
        let disponibles = []

        dataBase.estudiantes.map(estudiante => {
            if(estudiante.cursos.length != 0){
                let disponible = true
                estudiante.cursos.map(curso => {
                    if(curso.id == req.query.id){
                        disponible = false
                    }
                })
                if(disponible){
                    disponibles.push(estudiante)
                }
            }else{
                disponibles.push(estudiante)
            }
            
        })
        if(disponibles.length == 0){
            res.status(404).send({mensaje: "No hay estudiantes disponibles"})
        }else{
            res.status(200).send(disponibles)
        }
    },
    agregarEstudianteCurso: function(req, res){
        let encontrado = false
        let msg = ""

        dataBase.estudiantes.map(estudiante => {
            if(estudiante.codigo == req.body.codigoEstudiante){
                encontrado = true
                let disponible = true
                estudiante.cursos.map(curso => {
                    if(curso.id == req.body.idCurso){
                        disponible = false
                        msg = "El estudiante ya está en el curso"
                    }
                })
                
                dataBase.cursos.map((curso)=>{
                    if(curso.id == req.body.idCurso && disponible == true){
                        msg = "Estudiante agregado al curso"
                        curso.estudiantes.push({
                            codigo: estudiante.codigo,
                            nombre: estudiante.nombre,
                            apellido: estudiante.apellido,
                            notas: req.body.notas,
                            notaTotal: calcularNotaTotal(curso, req.body.notas)
                        })

                        estudiante.cursos.push({
                            id: curso.id,
                            nombre: curso.nombre,
                            tipo: curso.tipo,
                            creditos: curso.creditos,
                            notaTotal: calcularNotaTotal(curso, req.body.notas)
                        })
                    }
                })
                estudiante.promedio = calcularPromedio(estudiante)
            }
        })

        if(encontrado){
            writeFile(res, "Error al agregar estudiante al curso", msg)
        }else {
            res.status(404).send({
                mensaje: "El estudiante no existe"
            })
        }
    },
    actualizarEstudianteCurso: function(req, res){
        let encontrado = false

        dataBase.cursos.map(curso => {
            if(curso.id == req.body.idCurso){
                curso.estudiantes.map(estudiante => {
                    if(estudiante.codigo == req.body.codigoEstudiante){
                        encontrado = true
                        estudiante.notas = req.body.notas
                        estudiante.notaTotal = calcularNotaTotal(curso, req.body.notas)

                        dataBase.estudiantes.map((estudiante2)=>{
                            if(estudiante2.codigo == req.body.codigoEstudiante){
                                estudiante2.cursos.map((curso2)=>{
                                    if(curso2.id == req.body.idCurso){
                                        curso2.notaTotal = calcularNotaTotal(curso, req.body.notas)
                                    }
                                })
                                estudiante2.promedio = calcularPromedio(estudiante2)
                            }
                        })
                    }
                })
            }
        })
        
        if(encontrado){
            writeFile(res, "Error al actualizar el estudiante en el curso", "Estudiante actualizado en el curso")
        }else {
            res.status(404).send({
                mensaje: "El estudiante no existe en el curso"
            })
        }
        
    },
    eliminarEstudianteCurso: function(req, res){
        let encontrado = false

        dataBase.cursos.map(curso => {
            if(curso.id == req.body.idCurso){
                curso.estudiantes.map(estudiante => {
                    if(estudiante.codigo == req.body.codigoEstudiante){
                        encontrado = true

                        let index = curso.estudiantes.indexOf(estudiante)
                        curso.estudiantes.splice(index, 1)
                        
                        dataBase.estudiantes.map((estudiante2)=>{
                            if(estudiante2.codigo == req.body.codigoEstudiante){
                                estudiante2.cursos.map((curso2)=>{
                                    if(curso2.id == req.body.idCurso){
                                        index = estudiante2.cursos.indexOf(curso2)
                                        estudiante2.cursos.splice(index, 1)
                                    }
                                })
                                estudiante2.promedio = calcularPromedio(estudiante2)
                            }
                        })
                    }
                })
            }
        })

        if(encontrado){
            writeFile(res, "Error al eliminar el estudiante del curso", "Estudiante eliminado del curso")
        }else {
            res.status(404).send({
                mensaje: "El estudiante no existe en el curso"
            })
        }
    },
    cargarDatosPorDefecto: function(req, res){
        if(req.body.cargar == true){
            //let defecto = require('./datosPorDefecto.json')
            dataBase = require('../datosPorDefecto.json')
            writeFile(res, "Error al cargar datos por defecto", "Datos por defecto cargados")
        }
    }
}

const calcularNotaTotal = (curso, notas) => {
    let notaTotal = 0
    notas.map((nota, index)=>{
        if(curso.tipo == "teorico"){
            switch(index){
                case 0: notaTotal += nota * 0.35; break;
                case 1: notaTotal += nota * 0.35; break;
                case 2: notaTotal += nota * 0.30; break;
            }
        }else{
            switch(index){
                case 0: notaTotal += nota * 0.30; break;
                case 1: notaTotal += nota * 0.25; break;
                case 2: notaTotal += nota * 0.20; break;
                case 3: notaTotal += nota * 0.25; break;
            }
        }
    })
    return parseFloat(notaTotal.toFixed(2))
}

const calcularPromedio = (estudiante) => {
    let promedio = 0
    let creditosTotales = 0
    if(estudiante.cursos.length > 0){
        estudiante.cursos.map((curso)=>{
            promedio += curso.creditos * curso.notaTotal
            creditosTotales += curso.creditos
        })
        promedio /= creditosTotales
    }
    
    return parseFloat(promedio.toFixed(2))
}

const writeFile = (res, msg1, msg2) => {
    fs.writeFile('dataBase.json', JSON.stringify(dataBase, null, 4), 'utf8', (err) => {
        if (err) {
            res.status(500).send({
                mensaje: msg1
            })
        } else {
            res.status(200).send({
                mensaje: msg2
            })
        }
    });
}

exports.control = control;
exports.calcularPromedio = calcularPromedio;
exports.writeFile = writeFile;