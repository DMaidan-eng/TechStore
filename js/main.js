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

class ItemCarrito {
  constructor(producto, cantidad) {
    this.producto = producto;
    this.cantidad = cantidad;
  }
  calcularSubtotal() {
    return this.producto.precio * this.cantidad;
  }
}

const catalogo = [
  new Producto(1, "Laptop", 1200, "Electronica", 5),
  new Producto(2, "Mouse", 25, "Accesorios", 15),
  new Producto(3, "Teclado", 85, "Accesorios", 10),
  new Producto(4, "Auriculares", 60, "Audio", 10),
  new Producto(5, "Monitor", 250, "Electronica", 6)
];

const carrito = [];

const calcularIva = (monto) => monto * 0.21;

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
  setTimeout(() => {
    cajaMensaje.style.display = "none";
  }, 2500);
}

function renderizarProductos(productosAMostrar) {
  contenedorProductos.innerHTML = "";

  productosAMostrar.forEach((prod) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-producto";
    tarjeta.innerHTML = `
      <h3>${prod.nombre}</h3>
      <p><strong>Categoria:</strong> ${prod.categoria}</p>
      <p><strong>Precio:</strong> $${prod.precio}</p>
      <p><strong>Stock:</strong> <span id="stock-${prod.id}">${prod.stock}</span></p>
      <button class="btn-agregar" data-id="${prod.id}">Agregar al Carrito</button>
    `;
    contenedorProductos.appendChild(tarjeta);
  });

  document.querySelectorAll(".btn-agregar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const idProd = parseInt(e.target.getAttribute("data-id"));
      agregarAlCarrito(idProd);
    });
  });
}

function obtenerProductosFiltrados() {
  const categoriaSeleccionada = selectCategoria.value;
  const textoBusqueda = inputBusqueda.value.trim().toLowerCase();

  let resultado = catalogo;

  if (categoriaSeleccionada !== "todas") {
    resultado = resultado.filter((p) => p.categoria === categoriaSeleccionada);
  }

  if (textoBusqueda !== "") {
    resultado = resultado.filter((p) =>
      p.nombre.toLowerCase().includes(textoBusqueda)
    );
  }

  return resultado;
}

function agregarAlCarrito(id) {
  const prod = catalogo.find((p) => p.id === id);

  if (!prod) {
    mostrarMensaje("Producto no encontrado", "error");
    return;
  }

  if (!prod.descontarStock(1)) {
    mostrarMensaje(`Sin stock suficiente de ${prod.nombre}`, "error");
    return;
  }

  const itemExiste = carrito.find((item) => item.producto.id === id);

  if (itemExiste) {
    itemExiste.cantidad++;
  } else {
    carrito.push(new ItemCarrito(prod, 1));
  }

  mostrarMensaje(`${prod.nombre} agregado al carrito`, "exito");
  actualizarCarritoDOM();
  renderizarProductos(obtenerProductosFiltrados());
}

function eliminarDelCarrito(id) {
  const indice = carrito.findIndex((item) => item.producto.id === id);

  if (indice === -1) return;

  const item = carrito[indice];
  item.producto.stock += item.cantidad;
  carrito.splice(indice, 1);

  mostrarMensaje(`${item.producto.nombre} eliminado del carrito`, "exito");
  actualizarCarritoDOM();
  renderizarProductos(obtenerProductosFiltrados());
}

function actualizarCarritoDOM() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<li>El carrito esta vacio.</li>";
    resumenTotal.textContent = "Total: $0.00";
    return;
  }

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.producto.nombre} (x${item.cantidad})</span>
      <span>$${item.calcularSubtotal().toFixed(2)}</span>
      <button class="btn-eliminar" data-id="${item.producto.id}">Eliminar</button>
    `;
    listaCarrito.appendChild(li);
  });

  document.querySelectorAll(".btn-eliminar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const idProd = parseInt(e.target.getAttribute("data-id"));
      eliminarDelCarrito(idProd);
    });
  });

  const subtotal = carrito.reduce((acc, item) => acc + item.calcularSubtotal(), 0);
  const totalConIva = subtotal + calcularIva(subtotal);

  resumenTotal.textContent = `Total (+IVA 21%): $${totalConIva.toFixed(2)}`;
}

let siguienteId = catalogo.length + 1;

function agregarProductoCatalogo() {
  const nombre = inputNombre.value.trim();
  const precio = parseFloat(inputPrecio.value);
  const stock = parseInt(inputStock.value);
  const categoria = selectNuevaCategoria.value;

  if (nombre === "") {
    mostrarMensaje("Ingresa un nombre valido", "error");
    return;
  }
  if (isNaN(precio) || precio <= 0) {
    mostrarMensaje("Ingresa un precio valido", "error");
    return;
  }
  if (isNaN(stock) || stock <= 0) {
    mostrarMensaje("Ingresa un stock valido", "error");
    return;
  }

  const nuevoProducto = new Producto(siguienteId, nombre, precio, categoria, stock);
  catalogo.push(nuevoProducto);
  siguienteId++;

  inputNombre.value = "";
  inputPrecio.value = "";
  inputStock.value = "";

  renderizarProductos(obtenerProductosFiltrados());
  mostrarMensaje(`${nombre} agregado al catalogo`, "exito");
}

btnAgregarProducto.addEventListener("click", agregarProductoCatalogo);

inputBusqueda.addEventListener("input", () => {
  renderizarProductos(obtenerProductosFiltrados());
});

selectCategoria.addEventListener("change", () => {
  renderizarProductos(obtenerProductosFiltrados());
});

btnFinalizar.addEventListener("click", () => {
  if (carrito.length === 0) {
    mostrarMensaje("El carrito esta vacio", "error");
    return;
  }

  carrito.length = 0;
  actualizarCarritoDOM();
  renderizarProductos(obtenerProductosFiltrados());
  mostrarMensaje("Compra realizada con exito. ¡Gracias!", "exito");
});

renderizarProductos(catalogo);
actualizarCarritoDOM();
