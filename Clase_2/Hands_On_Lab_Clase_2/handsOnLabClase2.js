class TicketManager {

    static #precioBaseDeGanancia = 0.15;

    constructor() {
        this.events = [];
    }

    getEvents() {
        console.table(this.events);
        return this.events;
    }

    agregarEvento(event) {

        const { nombre, lugar, precio, capacidad, fecha } = event;

        if (!nombre || !lugar || !precio || !capacidad || !fecha) {
            console.log("Todos los campos son obligatorios!");
            return
        }

        event.id = this.events.length + 1;
        event.participantes = [];
        event.precio = precio + (precio * TicketManager.#precioBaseDeGanancia);

        this.events.push(event);
        return
    }

    agregarUsuario(eventId, userId) {
        
        const event = this.events.find(event => event.id === eventId);

        const user = event.participantes.find(user => user === userId);

        if (!event) {
            console.log("El evento no existe");
            return
        }

        if (user) {
            console.log("El usuario ya esta registrado en el evento");
            return
        } else {
            event.participantes.push(userId);
            return
        }
    }

    ponerEventoEnGira(eventId, nuevaLocalidad, nuevaFecha) {
        
        const event = this.events.find(event => event.id === eventId);

        if (!event) {
            console.log("El evento no existe");
            return
        }

        let newEvent = {
            ...event,
            lugar: nuevaLocalidad,
            fecha: nuevaFecha,
            participantes: [],
        }
        
        console.log(newEvent.precio);

        this.agregarEvento(newEvent);
    }

}

const ticketManager = new TicketManager();
ticketManager.agregarEvento({ nombre: "evento 1", lugar: "lugar 1", precio: 100, capacidad: 100, fecha: "2022-12-21" });
ticketManager.agregarEvento({ nombre: "evento 2", lugar: "lugar 2", precio: 200, capacidad: 200, fecha: "2023-13-30" });
ticketManager.getEvents();
ticketManager.agregarUsuario(1, 1);
ticketManager.agregarUsuario(1, 1);
ticketManager.agregarUsuario(1, 2);
ticketManager.agregarUsuario(1, 2312311313);
ticketManager.agregarUsuario(1, 23123);
ticketManager.agregarUsuario(1, 23123213213131);
ticketManager.agregarUsuario(2, 1);
ticketManager.ponerEventoEnGira(1, "nueva localidad", "2023-12-31");
ticketManager.getEvents();
