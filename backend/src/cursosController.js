let dataBase = require("../dataBase.json")
let calcularPromedio = require("./relacionController.js").calcularPromedio
let writeFile = require("./relacionController.js").writeFile

let control = {
    buscarCurso: function(req, res){
        let resultado = dataBase.cursos.filter( (curso) => curso.id == req.query.id )

        if(resultado.length != 0){
            res.status(200).send({
                encontrados: resultado
            })
        }
        else{
            res.status(404).send({
                mensaje: "No se encontró el curso"
            })
        }
    },
    buscarCursos: function(req, res){
        res.status(200).send(
            dataBase.cursos
        )
    },
    crearCurso: function(req, res){
        let curso = dataBase.cursos
        let id;
        (curso.length == 0) ? id = 1 : id = curso[curso.length-1].id + 1;

        dataBase.cursos.push({
            id: id,
            nombre: req.body.nombre,
            tipo: req.body.tipo,
            creditos: req.body.creditos,
            estudiantes: []
        });

        writeFile(res, "Error al crear el curso", "Curso creado")
    },
    actualizarCurso: function(req, res){
        let encontrado = false

        dataBase.cursos.map((curso)=>{
            if(curso.id == req.body.id){
                encontrado = true;

                curso.nombre = req.body.nombre
                curso.creditos = req.body.creditos
                
                dataBase.estudiantes.map((estudiante)=>{
                    estudiante.cursos.map((curso2)=>{
                        if(curso2.id == req.body.id){
                            curso2.nombre = req.body.nombre
                            curso2.creditos = req.body.creditos
                            estudiante.promedio = calcularPromedio(estudiante)
                        }
                    })
                })
            }
        })
        
        if(encontrado){
            writeFile(res, "Error al actualizar el curso", "Curso actualizado")
        }else {
            res.status(404).send({
                mensaje: "El curso no existe"
            })
        }
    },
    eliminarCurso: function(req, res){
        let encontrado = false

        dataBase.cursos.map((curso)=>{
            if(curso.id == req.body.id){
                encontrado = true;

                let index = dataBase.cursos.indexOf(curso)
                dataBase.cursos.splice(index, 1)
                
                dataBase.estudiantes.map((estudiante)=>{
                    estudiante.cursos.map((curso2)=>{
                        if(curso2.id == req.body.id){
                            index = estudiante.cursos.indexOf(curso2)
                            estudiante.cursos.splice(index, 1)
                            estudiante.promedio = calcularPromedio(estudiante)
                        }
                    })
                })
            }
        })

        if(encontrado){
            writeFile(res, "Error al eliminar el curso", "Curso eliminado")
        }else {
            res.status(404).send({
                mensaje: "El curso no existe"
            })
        }
    },
    ordenarEstudiantesCurso: function(req, res){
        let ordenarNotas = []
        if(dataBase.cursos.length != 0){
            dataBase.cursos.map((curso)=>{
                if(curso.id == req.query.id){
                    curso.estudiantes.map((estudiante)=>{
                        ordenarNotas.push(estudiante.notaTotal)
                    })
                }
            })
            ordenarNotas.sort((a, b) => b - a)
    
            ordenarNotas.map((nota, index) => {
                dataBase.cursos.map((curso) => {
                    if(curso.id == req.query.id){
                        curso.estudiantes.map((estudiante) => {
                            if(estudiante.notaTotal == nota){
                                ordenarNotas[index] = {
                                    codigo: estudiante.codigo,
                                    nombre: estudiante.nombre,
                                    apellido: estudiante.apellido,
                                    notaTotal: estudiante.notaTotal,
                                }
                            }
                        })
                    }
                })
            })
        }

        res.status(200).send({
            ordenarNotas
        })
    }
}

module.exports = control;