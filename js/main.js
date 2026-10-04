// TechStore 

class Producto {
  constructor(id,nombre,precio,categoria,stock){
    this.id= id;
    this.nombre= nombre;
    this.precio= precio;
    this.categoria= categoria;
    this.stock= stock;
  }
  descontarStock(cantidad){
    this.stock -= cantidad;
  }
}

class ItemCarrito {
  constructor(producto,cantidad){
    this.producto = producto;
    this.cantidad = cantidad;
  }
  productosCarrito(){
    return this.producto.precio * this.cantidad;
  }
}

const producto1 =new Producto(1, "Laptop", 1200, "Electronica",5);
const producto2 =new Producto(2, "Mouse", 25, "Accesorios",15);
const producto3 =new Producto(3, "Teclado", 85, "Accesorios", 10);
const producto4 =new Producto(4, "Auriculares", 60, "Audio", 10);
const producto5 =new Producto(5, "Monitor", 250, "Electronica", 6);

const catalogo = [producto1,producto2,producto3,producto4,producto5];

const carrito = [];

const iva = (monto) => monto * 0.21;

console.log (catalogo)

console.log("Stock antes:", producto1.stock);
producto1.descontarStock(2);
console.log("Stock después de descontar:", producto1.stock);
const itemDePrueba = new ItemCarrito(producto3, 3);
console.log("Subtotal de 3 Teclados:", itemDePrueba.productosCarrito());

function mostrarCatalogo (){
  let texto = "Catálogo\n";
  catalogo.forEach(prod =>{
    texto += `ID: ${prod.id} | ${prod.nombre} - $${prod.precio} [categoria: ${prod.categoria}] (Stock : ${prod.stock})\n`;
  });
  console.log (texto)
  return texto;
}

function filtroCategoria() {
  const cat = prompt("Ingresa la Categoria que quieras (Electronica, Accesorios, Audio)");
  if (!cat) return "Busqueda cancelada";
  const busqueda = cat.trim().toLocaleLowerCase();
  const resultado = catalogo.filter (prod =>
    prod.categoria.toLocaleLowerCase() === busqueda
  )
  if (resultado.length === 0) return "No se encontraron productos";
  let texto = "";
  resultado.forEach(prod =>{
    texto += `ID: ${prod.id} | ${prod.nombre} - $${prod.precio} (Stock : ${prod.stock})\n`;
  });
  return texto
}

function agregarCarrito () {
  const seleccion = parseInt(prompt (`${mostrarCatalogo()} \nIngresa el ID del producto que deseas comprar:`));

  const prod = catalogo.find (p => p.id === seleccion);

  if (!prod){
    alert ("Error; Producto no encontrado.");
    console.log ("Error; Producto no encontrado.");
    return
  }

  const cant = parseInt(prompt(`¿Cuantas unidades de ${prod.nombre} deseas? (Stock: ${prod.stock})`));
  if (isNaN(cant)|| cant <= 0){
    alert("No tenemos esa Cantidad");
    console.log("No tenemos esa Cantidad"); 
    return 
  }

  prod.descontarStock (cant);
  carrito.push (new ItemCarrito(prod,cant));
  alert(`${prod.nombre}(x${cant}) agregado al carrito`)
  console.log("Producto Agregado:", prod);
}

function verCompra(){
  if (carrito.length === 0) {
    alert ("Carrito Vacio");
    console.log ("Carrito vacio");
    return
  }

  let resumen = "Tu Resumen\n";
  let subtotal = 0;

  carrito.forEach((item, index) =>{
    const subtotalItem = item.productosCarrito();
    subtotal += subtotalItem;
    resumen += `${index + 1}. ${item.producto.nombre} x${item.cantidad}= $${subtotalItem}\n`;
  });

  const impuesto = iva (subtotal)
  const totalPagar = subtotal + impuesto

  resumen += `\nsubtotal: $${subtotal.toFixed(2)}\n`;
  resumen += `Iva (21%): + $${impuesto.toFixed(2)}\n`;
  resumen += `Total a Pagar: $${totalPagar.toFixed(2)}`;

  alert (resumen)
  console.log (resumen)

  const confirmarCompra = prompt("¿Desea Finalizar la Compra?(Escribe Si para Confirmar)");

  if ((confirmarCompra || "").trim().toUpperCase() === "SI"){
    alert ("Tu compra se confirmo con Exito");
    console.log ("Recibo de Compra");
    console.log (resumen);
    return true;
  } else {
    alert ("Falta Confirmar Compra");
    console.log ("Falta Confirmar Compra")
    return false;
  }
}

function iniciar () {
  let salir = false;

  while (!salir){
    const opcion = prompt(
      "Bienvenido a TechStore\n" +
      "selecciona una opcion:\n" +
      "1. Catalogo\n" +
      "2. Categorias\n" +
      "3. Agregar al Carrito\n" +
      "4. Ver Carrito y Finalizar Compra\n" +
      "5. Salir"
    );
    switch (opcion) {
      case "1":
        alert(mostrarCatalogo());
        break;
      case "2":
        alert(filtroCategoria())
        break;
      case "3":
        agregarCarrito();
        break;
      case "4":
        const compraExitosa = verCompra();
        if (compraExitosa) salir = true;
        break;
      case "5":
      alert ("Gracias por Visitar TechStore");
      salir = true;
      break;
      default:
      alert("Opcion no Valida, ingrese del 1 al 5");
      break;
    }
  }
}

iniciar();
