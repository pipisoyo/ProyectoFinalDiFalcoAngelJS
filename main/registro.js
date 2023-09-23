const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const email = document.querySelector("#email");
const edad = document.querySelector("#edad");
const formularioREg = document.querySelector("#form-registro");
const usuario = document.querySelector("#user")
const contrasenia = document.querySelector("#pass")
const rcontrasenia = document.querySelector("#rpass")
const message = document.querySelector("#message")
const noCoincide = document.querySelector("#noCoincide")
let usuarios = []
class Usuario {
    constructor(nombre, apellido, email, edad, usuario, contrasenia) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.edad = edad;
        this.usuario = usuario;
        this.contrasenia = contrasenia;
    }
}
//guarda el array usuario en Local Storage.
function guardarUsuarioLS(arr) {
    return localStorage.setItem("usuarios", JSON.stringify
        (arr))

}
//verifica existencia del objeto con la clave usuario el LS, si es asi iguala el array usuarios a valor encontrado, si no crea el 
//elemento en el LS con el arrar usuarios vacio.
function verificarUsuario() {
    if ((window.localStorage.getItem("usuarios"))) {
        usuarios = JSON.parse(localStorage.getItem("usuarios"))
    } else {
        localStorage.setItem("usuarios", JSON.stringify
            (usuarios))
    }

}

formularioREg.addEventListener('submit', (e) => {
    e.preventDefault();
    passIgual();
})

function passIgual() {
    //verifica q la contraseña y su repeticion coincidan 
    if ((contrasenia.value == rcontrasenia.value)) {
        const nuevoUsuario = new Usuario(nombre.value, apellido.value, email.value, edad.value, usuario.value, contrasenia.value)
        verificarUsuario()
        //verifica si el usuario ingresado ya existe
        if (usuarios.find((e) => e.usuario == usuario.value)) {
            Swal.fire({
                icon: 'error',
                title: 'Usuario en uso',
                text: 'Intentelo nuevamente!',
            })
            //veridica si el mail ingresado ya existe
        } else if (usuarios.find((e) => e.email == email.value)) {
            Swal.fire({
                icon: 'error',
                title: 'Email registrado',
                text: 'Intentelo nuevamente!',
            })
        } else {
            //si es todo todo correco(usuario y mail no estan repetido y contraseñas coiciden)
            //se guarda en nuevo usuario en el array y luego se sube al LS. Se ridirije a la proxima pagina
            usuarios.push(nuevoUsuario);
            guardarUsuarioLS(usuarios);
            location.href = "../index.html";
        }
    } else {
        //si no se cumple la primera condicion
        Swal.fire({
            icon: 'error',
            title: 'Las contraseñas no coinciden',
            text: 'Intentelo nuevamente!',
        })
        noCoincide.innerHTML = "<p>Las contrasenias no coiciden</p>"
    }
}

