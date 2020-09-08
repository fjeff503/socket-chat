//clase para menjar los usuarios
class Usuarios {
    constructor() {
        this.personas = [];//servira para saber quienes estan en el chat
    }

    //agregaremos personas al arreglo
    agregarPersona(id, nombre, sala) {
        const persona = {
            id,
            nombre,
            sala
        };
        this.personas.push(persona);
        return this.personas;
    }

    //extraemos la persona segun su id(que viene en el cliente del socket)
    getPersona(id) {
        const persona = this.personas.filter(person => person.id === id)[0];
        return persona;
    }

    //extraer todas las personas
    getPersonas() {
        return this.personas;
    }

    //extraer las personas por sala
    getPersonasPorSala(sala) {
        const personasSala = this.personas.filter(persona => persona.sala === sala);
        return personasSala;
    }

    //eliminamos personas (en caso el usuario abandona el chat)
    borrarPersona(id) {
        //se hace antes ya que si se hace despues no la encontrara xq estara fuera del array :v
        const personaBorrada = this.getPersona(id);
        //no trae el usuario que sea con id igual al que recibe
        this.personas = this.personas.filter(person => person.id != id);
        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}