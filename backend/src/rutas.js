const express = require("express");
const cursosController = require("./cursosController")
const estudiantesController = require("./estudiantesController")
const relacionesController = require("./relacionController")

const path = require('path');

let router = express.Router()

router.get("/", (req, res)=>{ res.sendFile(path.join(__dirname + "../../../frontend/index.html")) })

//rutas cursos
router.get("/cursos", cursosController.buscarCurso)
router.get("/cursosAll", cursosController.buscarCursos)
router.post("/cursos", cursosController.crearCurso)
router.put("/cursos", cursosController.actualizarCurso)
router.delete("/cursos", cursosController.eliminarCurso)
router.get("/ordenarEstudiantesCurso", cursosController.ordenarEstudiantesCurso)

//rutas estudiantes de cursos 
router.get("/cursos/estudiantesDisponibles", relacionesController.estudiantesDisponibles)
router.put("/cursos/agregarEstudianteCurso", relacionesController.agregarEstudianteCurso)
router.put("/cursos/actualizarEstudianteCurso", relacionesController.actualizarEstudianteCurso)
router.delete("/cursos/eliminarEstudianteCurso", relacionesController.eliminarEstudianteCurso)

//rutas estudiantes y filtros
router.get("/estudiantes", estudiantesController.buscarEstudiante)
router.post("/estudiantes", estudiantesController.crearEstudiante)
router.put("/estudiantes", estudiantesController.actualizarEstudiante)
router.delete("/estudiantes", estudiantesController.eliminarEstudiante)
router.get("/topEstudiantes", estudiantesController.buscarTopEstudiantes)
router.get("/estudiantesSinCurso", estudiantesController.buscarEstudiantesSinCurso)

module.exports = router