//declaracion de variables
let imagenClima;
let tituloClima;
let descripcionClima;
let tempMin;
let tempMax;
let tempAct;
let animatronicos = [];
let animatronicosTemp = [];
let id = 0;
let nombre = '';
let descripcion = '';
let precio = 0;
let stock = 0;
let image = '';
let animatronicosJson;
let animatronicoParseado;
let compraAnimatronico = "";
let carrito = [];
let carritoAux = [];
let listaAnimatronicos = [];
let listaAnimatronicosCarrito = [];
let contenidoCarrito = "";
let totalCarrito = 0;
let animatronico;
//clase
class Animatronico{

    constructor(id,nombre, descripcion, precio, stock,image){
        this.id=id;
        this.nombre=nombre;
        this.descripcion=descripcion;
        this.precio=precio;
        this.stock=stock;
        this.image=image;
    }
}
//funciones
if(localStorage.getItem('animatronicos') === null){
    fetch("./json/animatronicos.json")
        .then( response => response.json() )
        .then( data => {animatronicosJson = JSON.stringify(data);
            localStorage.setItem("animatronicos", animatronicosJson);
            llenarCards();} );
        
}else{
    animatronicoParseado = JSON.parse(localStorage.getItem("animatronicos"));
    if(animatronicoParseado===null){
        fetch("./json/animatronicos.json")
            .then( response => response.json() )
            .then( data => {animatronicosJson = JSON.stringify(data);
                localStorage.setItem("animatronicos", animatronicosJson);} );
            llenarCards();
    }else{
        llenarCards();
    }
}

function llenarCards(){
    contenedor = document.getElementById("animatronicos"); //obtengo el div padre
    if(localStorage.getItem("animatronicos")!=null){
        animatronicoParseado = JSON.parse(localStorage.getItem("animatronicos")); //valido que existan productos
    }
    cards = ""; //inicializo la variable
    for(let animatronico of animatronicoParseado){ //genero las cards segun la cantidad de productos
        cards = cards+"<div class=\"card\">" +
                            "<center><img src=\""+animatronico.image+"\" width=\"10%\">"+
                            "<h3>"+animatronico.nombre+"</h3>" +
                            "<p>"+animatronico.descripcion+"</p>" +
                            "<p>$"+animatronico.precio+"</p>" +
                            "<p>Stock: "+animatronico.stock+"</p>" +
                            "<button onclick=\"agregarAlCarro('"+animatronico.nombre+"')\">Agregar al carro</button>" +
                            "</center></div><br>";
    }
    if(contenedor!=null){
        contenedor.innerHTML = cards; //envio las cards al html
    }
}

function mostrar_posicion( posicion ){

    imagenClima = document.getElementById("imagenClima");
    tituloClima = document.getElementById("tituloClima");
    descripcionClima = document.getElementById("descripcionClima");
    tempMin = document.getElementById("tempMin");
    tempMax = document.getElementById("tempMax");
    tempAct = document.getElementById("tempAct");

    let lat = posicion.coords.latitude;
    let long = posicion.coords.longitude;
    let key = "59d4800eb2a16276f353ba1432ebfbf4";

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=metric&lang=es`)
        .then( response => response.json() )
        .then( data =>{ 
                        if(imagenClima!=null&&tituloClima!=null&&descripcionClima!=null){
                            imagenClima.innerHTML = `<img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="ImagenClima"/>`;
                            tituloClima.innerHTML = `${data.name}`;
                            descripcionClima.innerHTML = `${data.weather[0].description}`;
                            tempMin.innerHTML = `Temperatura minima: ${data.main.temp_min} C°`;
                            tempMax.innerHTML = `Temperatura maxima: ${data.main.temp_max} C°`;
                            tempAct.innerHTML = `Temperatura actual: ${data.main.temp} C°`;
                        }
        } )

}

navigator.geolocation.getCurrentPosition( mostrar_posicion );

function buscarAnimatronico(animatronico){
    return animatronico.nombre == compraAnimatronico;
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
    if(localStorage.getItem("animatronicos")!=null){
        animatronicoParseado = JSON.parse(localStorage.getItem("animatronicos")); //recupero todos los productos
    }
    let resultadoBusqueda = animatronicoParseado.find(buscarAnimatronico); //busco el producto
    if(resultadoBusqueda!=null){
        if(carrito!=null){
            for(let animatronicoAux of carrito){ //recorro el carrito
                animatronico = new Animatronico(animatronicoAux.id,animatronicoAux.nombre,animatronicoAux.descripcion,animatronicoAux.precio,animatronicoAux.stock,animatronicoAux.image);
                listaAnimatronicosCarrito.push(animatronico);
            }
            if(resultadoBusqueda.stock>0){
                listaAnimatronicosCarrito.push(resultadoBusqueda); //agrego el nuevo producto
                animatronicosTemp = [];
                for(let animatronicoAux of animatronicoParseado){ //recorro el carrito
                    if(resultadoBusqueda.nombre==animatronicoAux.nombre){
                        animatronico = new Animatronico(animatronicoAux.id,animatronicoAux.nombre,animatronicoAux.descripcion,animatronicoAux.precio,animatronicoAux.stock-1,animatronicoAux.image);
                        animatronicosTemp.push(animatronico);
                    }else{
                        animatronicosTemp.push(animatronicoAux);
                    }
                }
                animatronicosJson = JSON.stringify(animatronicosTemp);
                localStorage.setItem("animatronicos", animatronicosJson);
                llenarCards();
                Toastify({
                    text:"Producto agregado",
                    duration:2000,
                    gravity:"bottom",
                    position:"left",
                    style:{
                        fontSize:"25px",
                        fontFamily:"Verdana",
                        color:"green",
                        background:"black"
                    }
            
                }).showToast();
            }else{
                Toastify({
                    text:"Producto sin stock",
                    duration:2000,
                    gravity:"bottom",
                    position:"left",
                    style:{
                        fontSize:"25px",
                        fontFamily:"Verdana",
                        color:"red",
                        background:"black"
                    }
            
                }).showToast();
            }
            sessionStorage.setItem('animatronicosCarro',JSON.stringify(listaAnimatronicosCarrito)); //guardo el carrito en la sesion
        }else{
            animatronico = new Animatronico(resultadoBusqueda.id,resultadoBusqueda.nombre,resultadoBusqueda.descripcion,resultadoBusqueda.precio,resultadoBusqueda.stock,resultadoBusqueda.image); //si el carrito no existe agrego por primera vez
            listaAnimatronicosCarrito.push(animatronico);
            sessionStorage.setItem('animatronicosCarro',JSON.stringify(listaAnimatronicosCarrito));
            animatronicosTemp = [];
            for(let animatronicoAux of animatronicoParseado){ //recorro el carrito
                if(resultadoBusqueda.nombre==animatronicoAux.nombre){
                    animatronico = new Animatronico(animatronicoAux.id,animatronicoAux.nombre,animatronicoAux.descripcion,animatronicoAux.precio,animatronicoAux.stock-1,animatronicoAux.image);
                    animatronicosTemp.push(animatronico);
                }else{
                    animatronicosTemp.push(animatronicoAux);
                }
            }
            animatronicosJson = JSON.stringify(animatronicosTemp);
            localStorage.setItem("animatronicos", animatronicosJson);
            llenarCards();
            Toastify({
                text:"Producto agregado",
                duration:2000,
                gravity:"bottom",
                position:"left",
                style:{
                    fontSize:"25px",
                    fontFamily:"Verdana",
                    color:"green",
                    background:"black"
                }
        
            }).showToast();
        }
    }else{
        Toastify({
            text:"Error al agregar producto",
            duration:2000,
            gravity:"bottom",
            position:"left",
            style:{
                fontSize:"25px",
                fontFamily:"Verdana",
                color:"red",
                background:"black"
            }
    
        }).showToast();
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
    if(localStorage.getItem("animatronicos")!=null){
        animatronicoParseado = JSON.parse(localStorage.getItem("animatronicos")); //recupero todos los productos
    }else{
        animatronicoParseado = null;
    }
    let contarNombres = {};
    if(carritoAux!=null){
        carritoAux.forEach(animatronicoForEach => {
            let nombre = animatronicoForEach.nombre;
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
    carritoAux=[];
}

function agregarAnimatronico() { //funcion que agrega los productos al localStorage
    id = document.getElementById('id').value;
    nombre = document.getElementById('nombre').value;
    descripcion = document.getElementById('descripcion').value;
    precio = document.getElementById('precio').value;
    stock = document.getElementById('stock').value;
    image = document.getElementById('image').value;
    if((id===null||id==='')||(nombre===null||nombre==='')||(descripcion===null||descripcion==='')||(precio===null||precio==='')||(stock===null||stock==='')||(image===null||image==='')){
        Toastify({
            text:"Revise los datos del nuevo animatronico",
            duration:2000,
            gravity:"bottom",
            position:"left",
            style:{
                fontSize:"25px",
                fontFamily:"Verdana",
                color:"red",
                background:"black"
            }
    
        }).showToast();
    }else{
        listaAnimatronicos=[];
        animatronico = new Animatronico(id,nombre,descripcion,precio,stock,image);
        if(localStorage.getItem('animatronicos') === null){
            listaAnimatronicos.push(animatronico);
            animatronicosJson = JSON.stringify(listaAnimatronicos);
            localStorage.setItem("animatronicos", animatronicosJson);
        }else{
            animatronicoParseado = JSON.parse(localStorage.getItem("animatronicos"));
            if(animatronicoParseado===null){
                listaAnimatronicos.push(animatronico);
                animatronicosJson = JSON.stringify(listaAnimatronicos);
                localStorage.setItem("animatronicos", animatronicosJson);
            }else{
                animatronicoParseado.push(animatronico);
                animatronicosJson = JSON.stringify(animatronicoParseado);
                localStorage.setItem("animatronicos", animatronicosJson);
            }
        }
        document.getElementById('id').value ='';
        document.getElementById('nombre').value ='';
        document.getElementById('descripcion').value ='';
        document.getElementById('precio').value ='';
        document.getElementById('stock').value ='';
        document.getElementById('image').value ='';
        Toastify({
            text:"Animatronico añadido",
            duration:2000,
            gravity:"bottom",
            position:"left",
            style:{
                fontSize:"25px",
                fontFamily:"Verdana",
                color:"green",
                background:"black"
            }
    
        }).showToast();
        event.preventDefault(); //evito que la pagina se recargue luego de que se ejecute el formulario
    }
}