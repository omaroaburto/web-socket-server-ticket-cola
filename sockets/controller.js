const TicketController = require("../models/ticket");
const ticketController  = new TicketController();

const socketController = (socket) => {
    socket.emit('ultimo-ticket',ticketController.ultimo);

    socket.emit('estado-actual', ticketController.ultimos);
     
    socket.emit('ticket-pendiente',  ticketController.tickets.length);

    socket.on('siguiente-ticket', ( payload, callback ) => {      
        const siguiente = ticketController.siguiente();
        socket.broadcast.emit('ticket-pendiente',  ticketController.tickets.length);
        callback(siguiente);
        //notificar que hay un ticket pendiente por asignar
    });
    
    socket.emit('ticket-pendiente',  ticketController.tickets.length);
   
    socket.on('atender-ticket', ( {escritorio}, callback ) => {      
        if(!escritorio){
            return callback({
                ok: false,
                msg: "El escritorio es necesario"
            });
        }
        const ticket =   ticketController.atenderTicket(escritorio);
        socket.emit('ticket-pendiente',  ticketController.tickets.length);
        socket.broadcast.emit('ticket-pendiente',  ticketController.tickets.length);
        socket.broadcast.emit('estado-actual', ticketController.ultimos);
        if(!ticket){
            return callback({
                ok: false,
                msg: "Ya no hay tickets pendientes"
            });
        }else{
            return callback({
                ok: true,
                ticket
            });
        }

    });
}



module.exports = {
    socketController
}

