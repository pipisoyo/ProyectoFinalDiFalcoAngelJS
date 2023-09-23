const formulario = document.querySelector("#form-inicio");
const inputUser = document.querySelector("#user")
const inputPass = document.querySelector("#pass")
const message = document.querySelector("#message")
const noEncotrado = document.querySelector("#noEncontrado")
const usuarios = JSON.parse(localStorage.getItem("usuarios"))

//verifica si usuario existe en LocalStorage, sino es asi crea un arrary vacio
function usuariosLs() {
    if (usuarios === null) {
        usuarios = []
    }
}

function validar(contenedor, usuarios) {
    contenedor.innerHTML = " ";
    let html;
    let usuarioLog
    usuariosLs()
    //busca si el usuario ingresado esta en el array usuarios si es asi lo guarda en una variable, compara si el usuario y la contraseña coiciden con las q estan el LS
    let usuarioEncontrado = usuarios.find((usuario) => {
        usuarioLog = usuario.usuario;
        return usuario.usuario == inputUser.value && usuario.contrasenia == inputPass.value;
    })
    // si la variable no es nula guarda en Local Storage en nombre del usuario logeado
    if (usuarioEncontrado) {
        localStorage.setItem("usuario", JSON.stringify(usuarioLog));
        cargarProductos();
    } else {
        html = "<p>Usuario o contrasenia invalida</p>"
        contenedor.innerHTML = html;
    }
}

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    validar(noEncotrado, usuarios);
})

const producto = (arr) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (arr) {
                resolve(arr)
                location.href = "pages/carrito.html";

            } else {
                reject("error")
            }
        }, 2500)
        alerta()
    })
}

//caarga en el local storage los productos inportados
function cargarProductos() {
    const produ = fetch("data/data.json")
        .then(response => response.json())
        .then(data => {
            producto(data)
                .then((res) => {
                    localStorage.setItem("productos", JSON.stringify(res))
                })
                .catch((err) => {
                    contenedor.innerHTML = " error al obtener datos";
                })
        }
        );

}

function alerta() {
    let timerInterval
    Swal.fire({
        title: 'Cargando productos...',
        html: 'Esto demorara solo unos <b></b> milliseconds.',
        timer: 2500,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
            }, 300)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
        }
    })
}