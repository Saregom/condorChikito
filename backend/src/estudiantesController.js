let dataBase = require("../dataBase.json")
let writeFile = require("./relacionController.js").writeFile

let control = {
    buscarEstudiante: function(req, res){
        let resultado = dataBase.estudiantes.filter( (estudiante) => estudiante.codigo == req.query.codigo )

        if(resultado.length != 0){
            res.status(200).send({
                encontrados: resultado
            })
        }
        else{
            res.status(404).send({
                mensaje: "No se encontrĂ³ el codigo del estudiante (inician desde 202210001)"
            })
        }
    },
    buscarEstudiantes: function(req, res){
        res.status(200).send(
            dataBase.estudiantes
        )
    },
    crearEstudiante: function(req, res){
        let estudiantes = dataBase.estudiantes
        let codigo;
        (estudiantes.length == 0) ? codigo = 202210001 : codigo = estudiantes[estudiantes.length-1].codigo + 1;

        dataBase.estudiantes.push({
                codigo: codigo,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                promedio: 0,
                cursos: []
        });

        writeFile(res, "Error al crear el estudiante", "Estudiante creado")
    },
    actualizarEstudiante: function(req, res){
        let encontrado = false;

        dataBase.estudiantes.map((estudiante)=>{
            if(estudiante.codigo == req.body.codigo){
                encontrado = true;

                estudiante.nombre = req.body.nombre;
                estudiante.apellido = req.body.apellido;

                dataBase.cursos.map((curso)=>{
                    curso.estudiantes.map((estudiante2)=>{
                        if(estudiante2.codigo == req.body.codigo){
                            estudiante2.nombre = req.body.nombre
                            estudiante2.apellido = req.body.apellido
                        }
                    })
                })
            }
        })

        if(encontrado){
            writeFile(res, "Error al actualizar el estudiante", "Estudiante actualizado")
        }else {
            res.status(404).send({
                mensaje: "El estudiante no existe"
            })
        }
        
    },
    eliminarEstudiante: function(req, res){
        let encontrado = false

        dataBase.estudiantes.map((estudiante)=>{
            if(estudiante.codigo == req.body.codigo){
                encontrado = true;

                let index = dataBase.estudiantes.indexOf(estudiante)
                dataBase.estudiantes.splice(index, 1)
                
                dataBase.cursos.map((curso)=>{
                    curso.estudiantes.map((estudiante2)=>{
                        if(estudiante2.codigo == req.body.codigo){
                            index = curso.estudiantes.indexOf(estudiante2)
                            curso.estudiantes.splice(index, 1)
                        }
                    })
                })
            }
        })

        if(encontrado){
            writeFile(res, "Error al eliminar el estudiante", "Estudiante eliminado")
        }else {
            res.status(404).send({
                mensaje: "El estudiante no existe"
            })
        }
    },
    buscarTopEstudiantes: function(req, res){
        let topPromedios = []
        
        if(dataBase.estudiantes.length != 0){
            dataBase.estudiantes.map((estudiante)=>{
                topPromedios.push(estudiante.promedio)
            })
            topPromedios.sort((a, b) => b - a)
            let i = 1;
            topPromedios.map((prom, index) => {
                if(i <= 10){
                    for(let estudiante of dataBase.estudiantes){
                        if(estudiante.promedio == prom){
                            if(index > 0){
                                if(topPromedios[index-1].codigo != estudiante.codigo){
                                    topPromedios[index] = {
                                        codigo: estudiante.codigo,
                                        nombre: estudiante.nombre,
                                        apellido: estudiante.apellido,
                                        promedio: estudiante.promedio,
                                    }
                                    break
                                }
                            }else{
                                topPromedios[index] = {
                                    codigo: estudiante.codigo,
                                    nombre: estudiante.nombre,
                                    apellido: estudiante.apellido,
                                    promedio: estudiante.promedio,
                                }
                                break
                            }
                        }
                    }
                }else{
                    topPromedios.pop()
                }
                i++
            })
        }

        res.status(200).send(topPromedios)
    },
    buscarEstudiantesSinCurso: function(req, res){
        let sinCurso = []
        if(dataBase.estudiantes.length != 0){
            dataBase.estudiantes.map((estudiante)=>{
                if(estudiante.cursos.length == 0){
                    sinCurso.push(estudiante)
                }
            })
        }

        res.status(200).send(sinCurso)
    }
}

module.exports = control;