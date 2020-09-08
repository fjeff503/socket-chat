//para poder utilizarlo en server/sockets/socket
//para utlizar esta funcion que sirve para enviar mensajes
const crearMensaje = (nombre, mensaje) => {
    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };
};

module.exports = {
    crearMensaje
}