// TechStore

class Producto {
  constructor(id, nombre, precio, categoria, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.stock = stock;
  }
  descontarStock(cantidad) {
    if (cantidad > this.stock) {
      return false;
    }
    this.stock -= cantidad;
    return true;
  }
}

const catalogo = [
  new Producto(1, "Laptop", 1200, "Electronica", 5),
  new Producto(2, "Mouse", 25, "Accesorios", 15),
  new Producto(3, "Teclado", 85, "Accesorios", 10),
  new Producto(4, "Auriculares", 60, "Audio", 10),
  new Producto(5, "Monitor", 250, "Electronica", 6)
];

let carrito = [];

const calcularIva = (monto) => monto * 0.21;

let siguienteId = catalogo.length + 1;

const contenedorProductos = document.getElementById("contenedor-productos");
const listaCarrito = document.getElementById("lista-carrito");
const resumenTotal = document.getElementById("resumen-total");
const selectCategoria = document.getElementById("selec-categoria");
const btnFinalizar = document.getElementById("btn-finalizar");
const cajaMensaje = document.getElementById("mensaje");
const inputBusqueda = document.getElementById("input-busqueda");
const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const inputStock = document.getElementById("input-stock");
const selectNuevaCategoria = document.getElementById("select-nueva-categoria");
const btnAgregarProducto = document.getElementById("btn-agregar-producto");

function mostrarMensaje(texto, tipo) {
  cajaMensaje.textContent = texto;
  cajaMensaje.className = `mensaje ${tipo}`;
  cajaMensaje.style.display = "block";
}

function ocultarMensaje() {
  cajaMensaje.style.display = "none";
}

function renderizarProductos(productosAMostrar) {
  contenedorProductos.innerHTML = "";

  for (let i = 0; i < productosAMostrar.length; i++) {
    const producto = productosAMostrar[i];

    contenedorProductos.innerHTML += `
      <div class="tarjeta-producto">
        <h3>${producto.nombre}</h3>
        <p><strong>Categoría:</strong> ${producto.categoria}</p>
        <p><strong>Precio:</strong> $${producto.precio}</p>
        <p><strong>Stock:</strong> ${producto.stock}</p>
        <button data-id="${producto.id}">Agregar al Carrito</button>
      </div>
    `;
  }
}

function obtenerProductosFiltrados() {
  const categoriaSeleccionada = selectCategoria.value;
  const textoBusqueda = inputBusqueda.value.trim().toLowerCase();

  let resultado = catalogo;

  if (categoriaSeleccionada !== "todas") {
    resultado = resultado.filter(function (producto) {
      return producto.categoria === categoriaSeleccionada;
    });
  }

  if (textoBusqueda !== "") {
    resultado = resultado.filter(function (producto) {
      return producto.nombre.toLowerCase().includes(textoBusqueda);
    });
  }

  return resultado;
}

function agregarAlCarrito(id) {
  ocultarMensaje();

  let productoEncontrado = null;
  for (let i = 0; i < catalogo.length; i++) {
    if (catalogo[i].id === id) {
      productoEncontrado = catalogo[i];
      break;
    }
  }

  if (productoEncontrado === null) {
    mostrarMensaje("Producto no encontrado", "error");
    return;
  }

  if (!productoEncontrado.descontarStock(1)) {
    mostrarMensaje("Sin stock suficiente de " + productoEncontrado.nombre, "error");
    return;
  }

  let itemEnCarrito = null;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].producto.id === id) {
      itemEnCarrito = carrito[i];
      break;
    }
  }

  if (itemEnCarrito !== null) {
    itemEnCarrito.cantidad++;
  } else {
    carrito.push({ producto: productoEncontrado, cantidad: 1 });
  }

  mostrarMensaje("¡" + productoEncontrado.nombre + " agregado al carrito!", "exito");
  actualizarCarritoDOM();
  renderizarProductos(obtenerProductosFiltrados());
}

function eliminarDelCarrito(id) {
  ocultarMensaje();

  let indice = -1;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].producto.id === id) {
      indice = i;
      break;
    }
  }

  if (indice === -1) return;

  const itemCarrito = carrito[indice];
  itemCarrito.producto.stock += itemCarrito.cantidad;
  carrito.splice(indice, 1);

  mostrarMensaje(itemCarrito.producto.nombre + " eliminado del carrito", "exito");
  actualizarCarritoDOM();
  renderizarProductos(obtenerProductosFiltrados());
}

function actualizarCarritoDOM() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<li>El carrito está vacío.</li>";
    resumenTotal.textContent = "Total: $0.00";
    return;
  }

  for (let i = 0; i < carrito.length; i++) {
    const itemCarrito = carrito[i];
    const subtotal = itemCarrito.producto.precio * itemCarrito.cantidad;

    listaCarrito.innerHTML += `
      <li>
        ${itemCarrito.producto.nombre} (x${itemCarrito.cantidad}) - $${subtotal.toFixed(2)}
        <button class="btn-eliminar" data-id="${itemCarrito.producto.id}">Eliminar</button>
      </li>
    `;
  }

  let totalAcumulado = 0;
  for (let i = 0; i < carrito.length; i++) {
    const itemCarrito = carrito[i];
    totalAcumulado = totalAcumulado + itemCarrito.producto.precio * itemCarrito.cantidad;
  }

  const totalConIva = totalAcumulado + calcularIva(totalAcumulado);
  resumenTotal.textContent = "Total (+IVA 21%): $" + totalConIva.toFixed(2);
}

function agregarProductoCatalogo() {
  ocultarMensaje();

  const nombre = inputNombre.value.trim();
  const precio = parseFloat(inputPrecio.value);
  const stock = parseInt(inputStock.value);
  const categoria = selectNuevaCategoria.value;

  if (nombre === "") {
    mostrarMensaje("Ingresa un nombre válido", "error");
    return;
  }
  if (isNaN(precio) || precio <= 0) {
    mostrarMensaje("Ingresa un precio válido", "error");
    return;
  }
  if (isNaN(stock) || stock <= 0) {
    mostrarMensaje("Ingresa un stock válido", "error");
    return;
  }

  const nuevoProducto = new Producto(siguienteId, nombre, precio, categoria, stock);
  catalogo.push(nuevoProducto);
  siguienteId++;

  inputNombre.value = "";
  inputPrecio.value = "";
  inputStock.value = "";

  renderizarProductos(obtenerProductosFiltrados());
  mostrarMensaje("¡" + nombre + " agregado al catálogo!", "exito");
}

btnAgregarProducto.addEventListener("click", agregarProductoCatalogo);

contenedorProductos.addEventListener("click", function (event) {
  const boton = event.target.closest("button[data-id]");
  if (boton !== null) {
    agregarAlCarrito(Number(boton.dataset.id));
  }
});

listaCarrito.addEventListener("click", function (event) {
  const boton = event.target.closest("button[data-id]");
  if (boton !== null) {
    eliminarDelCarrito(Number(boton.dataset.id));
  }
});

inputBusqueda.addEventListener("input", function () {
  renderizarProductos(obtenerProductosFiltrados());
});

selectCategoria.addEventListener("change", function () {
  renderizarProductos(obtenerProductosFiltrados());
});

btnFinalizar.addEventListener("click", function () {
  ocultarMensaje();

  if (carrito.length === 0) {
    mostrarMensaje("El carrito está vacío", "error");
    return;
  }

  carrito = [];
  actualizarCarritoDOM();
  renderizarProductos(obtenerProductosFiltrados());
  mostrarMensaje("Compra realizada con éxito. ¡Gracias!", "exito");
});

renderizarProductos(catalogo);
actualizarCarritoDOM();
