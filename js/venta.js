//declaracion de variables
let nombre = '';

let opcion = '';

let seleccion = '';

let dias = '';

let valido = 0;

let dinero = 0;

let listaAnimatronicos = [];

let salir = 0;

let contador = 0;

let compraAnimatronico = "";

let animatronico;

let animatronicosJson;

let contenedor;

let animatronicoParseado;

let cards = "";

let carrito = [];

let carritoAux = [];

let listaAnimatronicosCarrito = [];

let contenidoCarrito = "";

let totalCarrito = 0;

let menu = `1.- [ADMINISTRACIÓN] Agregar animatronicos al Stock
2.- Rentar un animatronico.
3.- ¿Buscas un animatronico?
4.- Consultar puntos de distribución.
5.- Limpiar consola.
6.- Finalizar.
`;
class Animatronico{

    constructor(nombre, precio, stock){
        this.nombre=nombre;
        this.precio=precio;
        this.stock=stock;
    }
}

//declaracion de funciones
function rentarAnimatronico(valor, dias){
    if(listaAnimatronicos[valor-1].stock>0){
        console.log("Usted tendra a "+listaAnimatronicos[valor-1].nombre+" por "+dias+" dia(s) por el valor de: $"+listaAnimatronicos[valor-1].precio*dias);
        listaAnimatronicos[valor-1].stock = listaAnimatronicos[valor-1].stock-1;
    }else{
        console.log("Lamentamos informar que "+listaAnimatronicos[valor-1].nombre+" actualmente no tiene stock, seleccione otra opción.");
    }
    console.log(menu);
}

function menuAnimatronicos(){ 
    contador = 1;
    for(let animatronico of listaAnimatronicos){
        if(animatronico.stock>0){
            console.log(contador+".- "+animatronico.nombre+" $"+animatronico.precio+" x dia con stock de "+animatronico.stock);
        }else{
            console.log(contador+".- "+animatronico.nombre+" $"+animatronico.precio+" x dia actualmente sin stock");
        }
        contador++;
    }
}

function buscarAnimatronico(animatronico){
    return animatronico.nombre == compraAnimatronico;
}

function agregarAnimatronico() { //funcion que agrega los productos al localStorage
    nombre = document.getElementById('nombre').value;
    precio = document.getElementById('precio').value;
    stock = document.getElementById('stock').value;
    animatronico = new Animatronico(nombre,precio,stock);
    listaAnimatronicos.push(animatronico);
    animatronicosJson = JSON.stringify(listaAnimatronicos);
    localStorage.setItem("animatronicosActuales", animatronicosJson);
    llenarCards();
    event.preventDefault(); //evito que la pagina se recargue luego de que se ejecute el formulario
}

function llenarCards(){
    contenedor = document.getElementById("animatronicos"); //obtengo el div padre
    if(localStorage.getItem("animatronicosActuales")!=null){
        animatronicoParseado = JSON.parse(localStorage.getItem("animatronicosActuales")); //valido que existan productos
    }
    cards = ""; //inicializo la variable
    for(let animatronico of animatronicoParseado){ //genero las cards segun la cantidad de productos
        cards = cards+"<div class=\"card\">" +
                            "<h3>"+animatronico.nombre+"</h3>" +
                            "<p>$"+animatronico.precio+"</p>" +
                            "<p>Stock: "+animatronico.stock+"</p>" +
                            "<button onclick=\"agregarAlCarro('"+animatronico.nombre+"')\">Agregar al carro</button>" +
                            "</div>";
    }
    contenedor.innerHTML = cards; //envio las cards al html
}

function agregarAlCarro(nombre){ //funcion que agrega al carrito
    compraAnimatronico = nombre; //renombro la variable para la busqueda
    if(sessionStorage.getItem('animatronicosCarro')!=null){
        carrito = JSON.parse(sessionStorage.getItem('animatronicosCarro')); //recupero el carrito 
        sessionStorage.setItem('animatronicosCarro',null);
    }else{
        carrito = null; //si no existe carrito controlo que no este inicializado
    }
    listaAnimatronicosCarrito = [];
    if(localStorage.getItem("animatronicosActuales")!=null){
        animatronicoParseado = JSON.parse(localStorage.getItem("animatronicosActuales")); //recupero todos los productos
    }
    let resultadoBusqueda = animatronicoParseado.find(buscarAnimatronico); //busco el producto
    if(resultadoBusqueda!=null){
        if(carrito!=null){
            for(let animatronicoAux of carrito){ //recorro el carrito
                animatronico = new Animatronico(animatronicoAux.nombre,animatronicoAux.precio,animatronicoAux.stock);
                listaAnimatronicosCarrito.push(animatronico);
            }
            listaAnimatronicosCarrito.push(resultadoBusqueda); //agrego el nuevo producto
            sessionStorage.setItem('animatronicosCarro',JSON.stringify(listaAnimatronicosCarrito)); //guardo el carrito en la sesion
        }else{
            animatronico = new Animatronico(resultadoBusqueda.nombre,resultadoBusqueda.precio,resultadoBusqueda.stock); //si el carrito no existe agrego por primera vez
            listaAnimatronicosCarrito.push(animatronico);
            sessionStorage.setItem('animatronicosCarro',JSON.stringify(listaAnimatronicosCarrito));
        }
    }
}

function mostrarCarrito(){
    contenedor = document.getElementById("carrito"); //obtengo el div padre
    totalCarrito = 0;
    contenidoCarrito = "";
    if(sessionStorage.getItem('animatronicosCarro')!=null){
        carritoAux = JSON.parse(sessionStorage.getItem('animatronicosCarro')); //recupero el carrito 
    }else{
        carritoAux = null; //si no existe carrito controlo que no este inicializado
    }
    if(localStorage.getItem("animatronicosActuales")!=null){
        animatronicoParseado = JSON.parse(localStorage.getItem("animatronicosActuales")); //recupero todos los productos
    }else{
        animatronicoParseado = null;
    }
    let contarNombres = {};
    if(carritoAux!=null){
        carrito.forEach(animatronico => {
            let nombre = animatronico.nombre;
            contarNombres[nombre] = (contarNombres[nombre] || 0) + 1;
        });
        for (let clave in contarNombres) { //cuento cuantas veces tengo los productos en el carro
            compraAnimatronico = clave; //renombro la variable para la busqueda
            let resultadoBusqueda = animatronicoParseado.find(buscarAnimatronico); //busco el producto
            contenidoCarrito = contenidoCarrito+"<p>"+clave+" tiene un valor unitario de $"+resultadoBusqueda.precio+" y tiene actualmente: "+contarNombres[clave]+" en carrito con un total de: $"+resultadoBusqueda.precio*contarNombres[clave]+"</p>" //imprimo el producto, con su valor y su total
            totalCarrito=totalCarrito+(resultadoBusqueda.precio*contarNombres[clave]);
        }
        contenidoCarrito = contenidoCarrito+"<p>El total del carrito es: $"+totalCarrito+"</p>"; //imprimo el total del carro
    }else{
        carritoAux=[];
    }
    if(contenidoCarrito == ""){
        contenidoCarrito = "<p>No hay productos agregados al carrito</p>"
    }
    contenedor.innerHTML = contenidoCarrito;
}