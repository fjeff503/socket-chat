const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const usuarios = new Usuarios();
const { crearMensaje } = require('../utils/utils');

//escuchamos el cliente que se conecta
io.on('connection', (client) => {

    //recibir informacion de quien entra al chat
    /*recibe la data de lo que me envia el fronend de las funciones o lo que se ejecuta
    es decir que lo que viene dentro del objeto que envio*/
    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                ok: false,
                message: 'El nombre/sala es necesario'
            });
        };
        //unir a un usuario a una sala
        /*con solo unir al usuario a una sala podemos enviar mensajes
         solo dentro de la sala con el broadcast simplemente*/
        client.join(data.sala);

        //agregamos la persona 
        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        //enviamos quien se conecta al chat
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} entro`, 'in'));
        //enviamos cuando el usuario se conecta nuevamente (a los que esten en la misma sala)
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
        //enviamos el arreglo que nos devuelve la funcion de agregar la persona
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    //no servira para crear un mensaje
    client.on('crearMensaje', (data, callback) => {
        const persona = usuarios.getPersona(client.id);
        //el nombre lo toma de los arreglos de la clase persona
        //y el mensaje de la data que recibimos de parte del front end
        const mensaje = crearMensaje(persona.nombre, data.mensaje);
        //evento que recibira el frontend
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    client.on('disconnect', () => {
        //almacenamos la persona que se desconecto y la eliminamos del array que esta en la clase socket
        const personaBorrada = usuarios.borrarPersona(client.id);
        //enviamos un mensaje a todos de quien salio
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`, 'out'));
        //enviamos a todos los de la sala quienes estan activos
        //como parametro pasamos la sala a la que pertenece quien abandono la sala
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    //escuchar cuando se emitan los mensajes privados
    //recibimos la data que envia el frontend
    client.on('mensajePrivado', (data) => {
        //traemos el usuario de la clase persona
        const persona = usuarios.getPersona(client.id);
        //el to(data.para) indica que sera un mensaje privado que lo mandaremos del frontend
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});