let codigo, rubro, codigoInterno, nombreProducto, precio, stock, prod, imagen;
const rubros = ["Todos", "Caramelos", "Chocolates", "Electronica", "Gallettas", "Lacteos", "Merceria", "Regaleria", "Snacks"];
//recupero del LS los productos
const productos = JSON.parse(localStorage.getItem("productos"));
const carrito = structuredClone(productos);
let usuarioLog = JSON.parse(localStorage.getItem("usuario"))
const contenedorLista = document.querySelector("#contenedorLista");
const btnBuscar = document.querySelector("#btnBuscar");
const produc = document.querySelector("#produc");
const contenedor = document.querySelector("#contenedor");
const fin = document.querySelector("#fin");
const btnFin = document.querySelector("#btnFin");
const btnVaciar = document.querySelector("#btnVaciar");
const contenedorUsuario = document.querySelector("#contenedorUser")
const btnCerrar = document.querySelector("#btnCerrar");
const contenedorUserA = document.querySelector("#contenedorUser");
const resumen = document.querySelector("#resumen")
const TOTAL = document.querySelector("#TOTAL")

// inicializar el carrito en stock 0
for (i = 0; i < carrito.length; i++) {//
    carrito[i].stock = 0;
}

//verificar existencia en el LocalStorage , si no lo crea.(cuando se loguea se crea un carrito en el LS por cafa usuario)
function exitanciaCarritoLS() {
    if (JSON.parse(localStorage.getItem(usuarioLog + "carrito") == null)) {
        const carritoLS = structuredClone(carrito);
        localStorage.setItem(usuarioLog + "carrito", JSON.stringify(carritoLS))
    }
    const carritoLS = JSON.parse(localStorage.getItem(usuarioLog + "carrito"))
    return carritoLS
}
exitanciaCarritoLS()
mostrarCompra(JSON.parse(localStorage.getItem(usuarioLog + "carrito")))

//crea la listra para filtral los productos segul el rubro
function crearLista(arr) {
    contenedorLista.innerHTML = "";
    let html;
    for (let i = 0; i < arr.length; i++) {
        html = `<option id="contenedorLista" value="${i + 1}">${arr[i]}</option>`
        contenedorLista.innerHTML += html;
    }
}

//crea de manera dinamica los productos q se visualizan segun los filtros aplicados
function crearHtml(contenedor, arr) {
    contenedor.innerHTML = "";
    let html;
    let idd = 0;
    for (let i = 0; i < arr.length; i++) {
        const carritoLS = JSON.parse(localStorage.getItem(usuarioLog + "carrito"))
        carritoLS.forEach((e) => {
            e.codigo == arr[i].codigo && (idd = e.stock);
        })
        html = `<div class="cuadro" id="${arr[i].nombreProducto}">
                  <img src="../img/${arr[i].imagen}" alt="${arr[i].nombreProducto}">
                  <hr
                  <h3 id="${arr[i].nombreProducto}" class="nombreProducto">${arr[i].nombreProducto}</h3>
                  <p>Precio: $${arr[i].precio} </p>
                  <div id="contador" class="contador">
                  <div id="${arr[i].codigo}" class="producto" type="number" min="0" max="${arr[i].stock}" pattern="^[0-9]" value="0"></div>
                  <input type="number" id="mostrar" class="mostrar" value="${idd}" disabled></input>
                  <button type=submit class="agregar" id="agregar">+</button>
                  <button type=submit id="quitar" class="quitar">-</button>
                  </div>
                </div>`;
        contenedor.innerHTML += html
    }
    agregarOquitar()
}

crearHtml(contenedor, productos, carrito)
crearLista(rubros);

function filtroRubro(valor) {
    contenedorLista.addEventListener("change", (e) => {
        valor = document.querySelector("#contenedorLista").value;
    });

}
//genera un array con los productos fitrados por rubros
function buscarFiltrado(productos, valor, seleccion) {
    if (valor == "1") {
        for (let i = 0; i < productos.length; i++) {
            seleccion.push(productos[i]);
        }
    } else {
        for (let i = 0; i < productos.length; i++) {
            (productos[i].rubro == valor) && seleccion.push(productos[i]);
        }
    }
}
//busca en el array filtrado los productos que asemejen a lo ingresado
function filtrarServicio(arr, filtro) {
    const filtrado = arr.filter((el) => {
        return el.nombreProducto.toLowerCase().includes(filtro.toLowerCase());
    });
    return filtrado;
}

// detecta y guarda en variable el evento click correspondiente a +(agregar) o - (quitar)
function agregarOquitar() {
    const agregarBtn = document.querySelectorAll(".agregar")
    const quitarBtn = document.querySelectorAll(".quitar")
    agregarBtn.forEach(agregar => {
        agregar.addEventListener("click", clickAgregar)
    })
    quitarBtn.forEach(quitar => {
        quitar.addEventListener("click", clickQuitar)
    })
}

//recive evento, busca los id mas sercanos a este y regitra en variable los datos requeridos
function clickAgregar(evento) {
    const boton = evento.target;
    const agregado = boton.closest(".cuadro");
    const prodAgregado = agregado.querySelector(".producto").id
    const nombreProd = agregado.querySelector(".nombreProducto").id;
    const mostrarEn = agregado.querySelector(".mostrar")
    const cont = 1;
    controlStock(prodAgregado, cont, mostrarEn, nombreProd)

}
//recive evento, busca los id mas sercanos a este y regitra en variable los datos requeridos
function clickQuitar(evento) {
    const boton = evento.target;
    const quitado = boton.closest(".cuadro");
    const prodQuitado = quitado.querySelector(".producto").id;
    const nombreProd = quitado.querySelector(".nombreProducto").id;
    const mostrarEn = quitado.querySelector(".mostrar")
    const cont = -1;
    controlStock(prodQuitado, cont, mostrarEn, nombreProd)
}
//segun parametros, agrega o quita productos al stock del carrito
function cargarCarrito(idd, conta) {
    const carritoLS = exitanciaCarritoLS()
    if (carritoLS[idd - 1].stock >= 1) {
        carritoLS[idd - 1].stock = carritoLS[idd - 1].stock + conta;
        return localStorage.setItem(usuarioLog + "carrito", JSON.stringify(carritoLS))
    } else {
        if (conta > 0) {
            carritoLS[idd - 1].stock = carritoLS[idd - 1].stock + conta;
            return localStorage.setItem(usuarioLog + "carrito", JSON.stringify(carritoLS))
        }
    }
}
// muestra en el DOM el valor de stock del producto que esta en el carrito
function imprimir(mostrar, idd) {
    const carritoLS = exitanciaCarritoLS()
    mostrar.value = carritoLS[idd - 1].stock;
}

//muestra en tiempo real los productos que se agregan o quitan al carrito
function mostrarCompra(arr) {
    let total = 0;
    let html = ''
    let htmlTotal = ''
    resumen.innerHTML = html
    TOTAL.innerHTML = htmlTotal
    for (const el of arr) {
        if (el.stock > 0) {
            let total_parcial = (el.precio) * (el.stock)
            total = total + total_parcial;
            html = `<div class="resumen">
        <div class="h3res">
        <div>
        <h3 class="tituloProd">${el.nombreProducto} </h3>
        <div>
        <img class="img-resumen" src="../img/${el.imagen}" alt="${el.nombreProducto}">
        <div class=h3res-info>
        <h3>Cantidad: ${el.stock}</h3> 
        <br>
        <h3>SubTotal: $${total_parcial}</h3>
        </div>
        </div>
      </div>`;
            resumen.innerHTML += html;
        }
        htmlTotal = `<div class="total" id="total"div> Total : $ ${total}</div>`
        TOTAL.innerHTML = htmlTotal
    }
}

//buscar
btnBuscar.addEventListener("click", (e) => {
    let valor = document.querySelector("#contenedorLista").value;
    filtroRubro(valor);
    let seleccion = []
    buscarFiltrado(productos, valor, seleccion)
    const valorBuscado = document.getElementById("produc").value
    const filtrado = filtrarServicio(seleccion, valorBuscado);
    crearHtml(contenedor, filtrado);
})
//verifica q el stock del carrito no sea mayor al stok q existe
function controlStock(idd, cont, mostrarEn, nombreProd) {
    const carritoLS = exitanciaCarritoLS()
    const stockReal = productos[idd - 1].stock
    const stockCarrito = carritoLS[idd - 1].stock
    if (stockCarrito < stockReal) {
        cargarCarrito(idd, cont)
        imprimir(mostrarEn, idd)
        mostrarCompra(JSON.parse(localStorage.getItem(usuarioLog + "carrito")))
        cont > 0 ? cartelito(nombreProd, "agragado al carrito") : (cont < 0 && stockCarrito != 0) ? cartelito(nombreProd, "quitado del carrito") : cartelito(nombreProd, "- ERROR - Verifique seleccion");
    } else if (stockCarrito == stockReal && cont < 0) {
        cargarCarrito(idd, cont)
        imprimir(mostrarEn, idd)
        mostrarCompra(JSON.parse(localStorage.getItem(usuarioLog + "carrito")))
        cartelito(nombreProd, "quitado del carrito")
    } else {
        cartelito(nombreProd, "stock agotado")
    }
}
//termina compra- vacia carrito
btnFin.addEventListener("click", (e) => {
    localStorage.removeItem(usuarioLog + "carrito")
    const carritoLS = structuredClone(carrito);
    localStorage.setItem("carrito", JSON.stringify(carritoLS))
    resumen.innerHTML = `GRACIAS POR SU COMPRA`;
    const mostrar = document.querySelector(".mostrar")
    imprimir(mostrar, 1)
    localStorage.setItem(usuarioLog + "carrito", JSON.stringify(carritoLS))
    crearHtml(contenedor, carritoLS)
})

btnVaciar.addEventListener("click", (e) => {
    localStorage.removeItem(usuarioLog + "carrito")
    const carritoLS = structuredClone(carrito);
    localStorage.setItem("carrito", JSON.stringify(carritoLS))
    resumen.innerHTML = `Carrito vacio`;
    TOTAL.innerHTML = `<div class="total" id="total"div> Total : $ 0 </div>`
    const mostrar = document.querySelector(".mostrar")
    imprimir(mostrar, 1)
    localStorage.setItem(usuarioLog + "carrito", JSON.stringify(carritoLS))
    crearHtml(contenedor, carritoLS)

})

//muestra al usuario logeado
function mostrarUsuario() {
    const infoUsuarios = JSON.parse(localStorage.getItem("usuarios")).find((e) => e.usuario == usuarioLog);
    const { nombre, apellido } = infoUsuarios
    let html = `<div> 
    <hr>
    <h2>Usuario : ${nombre} ${apellido} </h2>
  </div>`;
    contenedorUsuario.innerHTML = html;
}
mostrarUsuario()

function cerrarSecion() {
    btnCerrar.addEventListener("click", () => {
        location.href = "../index.html";
    })
}


function cartelito(nombre, mensaje) {
    Toastify({
        text: nombre + " " + mensaje,
        duration: 1000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to left,#28bce5,#aae9fa )",
            color: "black"
        },
    }).showToast();
}

cerrarSecion()