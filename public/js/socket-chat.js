var socket = io();
//leemos los parametros que enviamos por la URL
var params = new URLSearchParams(window.location.search);
//en caso no venga el nombre que lance un error
if (!params.has('nombre') || !params.has('sala')) {
    console.log('El nombre y sala son necesarios');
    window.location = 'index.html';
};
//de lo contrario almacenamos el usuario en un objeto
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

//cuando el usuario se conecta
socket.on('connect', function () {
    console.log('Conectado al servidor');

    //enviar informacion de quien entra al chat
    //'entrarChat' nombre que asiganamos a la coneccion de enlace
    //usuario: la informacion que envio
    //function (resp): la respuesta que espero recibir
    socket.emit('entrarChat', usuario, function (resp) {
        console.log('Usuarios conectados: ', resp);
    });
});

// escuchar
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

// Escuchar cuando el usuario se desconecta
socket.on('crearMensaje', function (mensaje) {
    console.log('Server: ', mensaje);
});

// Escuchar cuando un usuario entra al chat
socket.on('listaPersonas', function (personas) {
    console.log('Server: ', personas);
});

//escuchamos los mensajes privados
socket.on('mensajePrivado', function (mensaje) {
    console.log('Mensaje Privado: ', mensaje);
});