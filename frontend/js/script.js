const query = function (selector) {
    return document.querySelector(selector)
}
const showHide = (cont1, cont2) => {
    query(cont1).style.display = "block"
    query(cont2).style.display = "none"
}

const cargarDatosDefecto = () => {
    fetch("http://localhost:3000/api/cargarDatosPorDefecto", {
        method: 'Post', 
        body: JSON.stringify({cargar: true}),
        headers: {'Content-Type': 'application/json'},
    }).then(res => res.json())
    .then(res =>{ alert(res.mensaje)})
}

//------------------Cursos------------------

//------post------
document.formCurso.onsubmit = function(e){
    e.preventDefault()

    const cursoNombre = query("#cursoNombre").value
    const cursoTipo = query("#cursoTipo").value
    const cursoCreditos = query("#cursoCreditos").value

    const curso = {
        nombre: cursoNombre,
        tipo: cursoTipo,
        creditos: parseInt(cursoCreditos)
    }

    fetch("http://localhost:3000/api/cursos", {
        method: 'POST', 
        body: JSON.stringify(curso),
        headers: {'Content-Type': 'application/json'},
    }).then(res => res.json())
    .then(res =>{
        alert(res.mensaje)
    })
}

//-----put-----
const putCurso = () => {
    const cursoId = query("#cursoId").value
    const cursoNombre = query("#cursoNombre").value
    const cursoCreditos = query("#cursoCreditos").value
    const cursoCreditos2 = document.getElementById("cursoCreditos").value
    console.log(cursoCreditos)
    console.log(cursoCreditos2)
    const curso = {
        id: parseInt(cursoId),
        nombre: cursoNombre,
        creditos: parseInt(cursoCreditos)
    }
    console.log(curso)

    fetch("http://localhost:3000/api/cursos", {
        method: 'PUT', 
        body: JSON.stringify(curso),
        headers: {'Content-Type': 'application/json'},
    }).then(res => res.json())
    .then(res =>{
        alert(res.mensaje)
    })
}

//--------Delete--------
const delCurso = (id) => {
    fetch(`http://localhost:3000/api/cursos/`, {
        method: 'DELETE',
        body: JSON.stringify({id: id}),
        headers: {'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(estudiantes =>{
        alert(estudiantes.mensaje)
    })
}

//--------Gets--------
const showCursos = () => {
    showHide(".table-cursos", ".div-table-cursos-estudiantes")
    fetch("http://localhost:3000/api/cursosAll")
    .then(res => res.json())
    .then(cursos =>{
        const bodyCursos = query(".table-cursos tbody")

        bodyCursos.innerHTML = ""
        cursos.map(curso => {
            bodyCursos.innerHTML += 
            `<tr>
                <td>${curso.id}</td>
                <td>${curso.nombre}</td>
                <td>${curso.tipo}</td>
                <td>${curso.creditos}</td>
                <td><a href="javascript:detallesCurso(${curso.id})">ver</a></td>
                <td><a href="javascript:delCurso(${curso.id})">Borrar</a></td>
            </tr>`
        })
    })
}
showCursos()

const detallesCurso = (id) => {
    query(".div-table-cursos-estudiantes").style.display = "block"
    query("#cursoId2").value = id

    fetch(`http://localhost:3000/api/cursos/?id=${id}`)
    .then(res => res.json())
    .then(curso =>{
        const bodyCursos = query(".table-cursos tbody")
        const bodyCursosEstud = query(".table-cursos-estudiantes tbody")

        bodyCursos.innerHTML = ""
        bodyCursos.innerHTML += 
            `<tr>
                <td>${curso.id}</td>
                <td>${curso.nombre}</td>
                <td>${curso.tipo}</td>
                <td>${curso.creditos}</td>
                <td><a href="javascript:showCursos()">ocultar</a></td>
                <td><a href="javascript:delCurso(${curso.id})">Borrar</a></td>
            </tr>`
        fetch(`http://localhost:3000/api/ordenarEstudiantesCurso/?id=${id}`)
        .then(res => res.json())
        .then(estudiantes =>{
            console.log(id)
            bodyCursosEstud.innerHTML = ""
            estudiantes.map(estudiante => {
                let tr = "<tr>"
                if(estudiante.notaTotal < 3.0) tr = "<tr style='background-color: lightcoral'>";
                bodyCursosEstud.innerHTML += 
                `${tr}
                    <td>${estudiante.codigo}</td>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.apellido}</td>
                    <td>${estudiante.notas.join(', ')}</td>
                    <td>${estudiante.notaTotal}</td>
                    <td><a href="javascript:delCursoEstud(${id}, ${estudiante.codigo})">Borrar</a></td>
                </tr>`

            })
        })
    })
}

//--------Cursos Estudiantes--------

//-----post-----
const postCursoEstudiante = () => {
    const cursoId2 = query("#cursoId2").value
    const codigoEstudiante = query("#codigoEstudiante").value
    let notas = query("#notas").value
    notas = notas.split(',')
    const notasNum = notas.map(nota => {return parseFloat(nota)})
    
    const cursoEstudiante = {
        idCurso: parseInt(cursoId2),
        codigoEstudiante: parseInt(codigoEstudiante),
        notas: notasNum
    }
    fetch(`http://localhost:3000/api/cursos/agregarEstudianteCurso/`, {
        method: 'POST',
        body: JSON.stringify(cursoEstudiante),
        headers: {'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(estudiantes =>{
        alert(estudiantes.mensaje)
    })
}

//-----put-----
const putCursoEstudiante = () => {
    const cursoId2 = query("#cursoId2").value
    const codigoEstudiante = query("#codigoEstudiante").value
    let notas = query("#notas").value
    notas = notas.split(',')
    const notasNum = notas.map(nota => {return parseFloat(nota)})
    
    const cursoEstudiante = {
        idCurso: parseInt(cursoId2),
        codigoEstudiante: parseInt(codigoEstudiante),
        notas: notasNum
    }
    fetch(`http://localhost:3000/api/cursos/actualizarEstudianteCurso/`, {
        method: 'PUT',
        body: JSON.stringify(cursoEstudiante),
        headers: {'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(estudiantes =>{
        alert(estudiantes.mensaje)
    })
}

//--------Delete--------
const delCursoEstud = (id, codigo) => {
    const idCod = {
        idCurso: id,
        codigoEstudiante: codigo
    }
    fetch(`http://localhost:3000/api/cursos/eliminarEstudianteCurso/`, {
        method: 'DELETE',
        body: JSON.stringify(idCod),
        headers: {'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(estudiantes =>{
        alert(estudiantes.mensaje)
    })
}


//------------------Estudiantes------------------

//--------Get--------
const showEstudiantes = () => {
    fetch("http://localhost:3000/api/estudiantesAll")
    .then(res => res.json())
    .then(res =>{
        const bodyEstudiantes = query(".table-estudiantes tbody")
        query(".form-estudiante").style.display = "flex"
        query(".table-estudiantes thead tr th:last-child").innerHTML = "Eliminar"
        bodyEstudiantes.innerHTML = ""
        res.map(estudiante => {
            bodyEstudiantes.innerHTML += 
            `<tr>
                <td>${estudiante.codigo}</td>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.apellido}</td>
                <td>${estudiante.promedio}</td>
                <td><a href="javascript:delEstudiante(${estudiante.codigo})">Borrar</a></td>
            </tr>`
        })
    })
}
showEstudiantes()

const topPromedios = () => {
    fetch("http://localhost:3000/api/topEstudiantes")
    .then(res => res.json())
    .then(res =>{
        const bodyEstudiantes = query(".table-estudiantes tbody")
        query(".form-estudiante").style.display = "none"
        query(".table-estudiantes thead tr th:last-child").innerHTML = "Puesto"
        bodyEstudiantes.innerHTML = ""
        res.map((estudiante, index) => {
            bodyEstudiantes.innerHTML += 
            `<tr>
                <td>${estudiante.codigo}</td>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.apellido}</td>
                <td>${estudiante.promedio}</td>
                <td>${index+1}</td>
            </tr>`
        })
    })
}

const sinCurso = () => {
    fetch("http://localhost:3000/api/estudiantesSinCurso")
    .then(res => res.json())
    .then(res =>{
        const bodyEstudiantes = query(".table-estudiantes tbody")
        query(".form-estudiante").style.display = "none"
        query(".table-estudiantes thead tr th:last-child").innerHTML = "Curso"
        bodyEstudiantes.innerHTML = ""
        res.map((estudiante) => {
            bodyEstudiantes.innerHTML += 
            `<tr>
                <td>${estudiante.codigo}</td>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.apellido}</td>
                <td>${estudiante.promedio}</td>
                <td>Ninguno</td>
            </tr>`
        })
    })
}

//--------Post--------
document.formEstudiante.onsubmit = function(e){
    e.preventDefault()

    const estudianteNombre = query("#estudianteNombre").value
    const estudianteApellido = query("#estudianteApellido").value

    console.log(estudianteNombre, estudianteApellido)
    const estudiante = {
        nombre: estudianteNombre,
        apellido: estudianteApellido
    }

    fetch("http://localhost:3000/api/estudiantes", {
        method: 'POST', 
        body: JSON.stringify(estudiante),
        headers: {'Content-Type': 'application/json'},
    }).then(res => res.json())
    .then(res =>{
        alert(res.mensaje)
    })
}

//--------Put--------
const putEstudiante = () => {
    const codigo = query("#codigo").value
    const estudianteNombre = query("#estudianteNombre").value
    const estudianteApellido = query("#estudianteApellido").value

    const estudiante = {
        codigo: parseInt(codigo),
        nombre: estudianteNombre,
        apellido: estudianteApellido
    }

    fetch("http://localhost:3000/api/estudiantes", {
        method: 'PUT', 
        body: JSON.stringify(estudiante),
        headers: {'Content-Type': 'application/json'},
    }).then(res => res.json())
    .then(res =>{
        alert(res.mensaje)
    })
}

const delEstudiante = (codigo) => {
    fetch(`http://localhost:3000/api/estudiantes/`, {
        method: 'DELETE',
        body: JSON.stringify({codigo: codigo}),
        headers: {'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(estudiantes =>{
        alert(estudiantes.mensaje)
    })
}