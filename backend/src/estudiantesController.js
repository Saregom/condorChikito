let fs = require("fs")
let dataBase = require("../dataBase.json")

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
                mensaje: "No se encontró el codigo del estudiante (inician desde 202210001)"
            })
        }
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
        let i = 1;
        if(dataBase.estudiantes.length != 0){
            dataBase.estudiantes.map((estudiante)=>{
                if(i <= 10){
                    topPromedios.push(estudiante.promedio)
                }
                i++;
            })
            topPromedios.sort((a, b) => b - a)
    
            topPromedios.map((prom, index) => {
                dataBase.estudiantes.map((estudiante) => {
                    if(estudiante.promedio == prom){
                        topPromedios[index] = {
                            codigo: estudiante.codigo,
                            nombre: estudiante.nombre,
                            apellido: estudiante.apellido,
                            promedio: estudiante.promedio,
                        }
                    }
                })
            })
        }

        res.status(200).send({
            topPromedios
        })
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

        res.status(200).send({
            sinCurso
        })
    }
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

module.exports = control;