const path = require("path");
const fs   = require("fs");

class Ticket{
    constructor(numero, escritorio){
        this.numero = numero;
        this.escritorio =  escritorio;
    }
}

class TicketController{
    constructor(){
        this.ultimo  = 0;
        this.hoy     = new Date().getDate();
        this.tickets = [];
        //guarda los últimos 4 ticket
        this.ultimos  = [];

        this.init();
    }
    get toJson(){
        return {
            ultimo:  this.ultimo,
            hoy:     this.hoy,
            tickets: this.tickets,
            ultimos: this.ultimos
        };
    }
    init(){
        const {ultimo, hoy, tickets, ultimos} = require("../db/data.json");
        if( hoy === this.hoy){
            //es el mismo día
            this.tickets = tickets;
            this.ultimo  = ultimo;
            this.ultimos = ultimos
        }else{
            //es otro día
            this.guardarDB();
        }
    }
    guardarDB(){
        const dbPath = path.join(__dirname, "../db/data.json");
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }
    siguiente(){
        this.ultimo +=1;
        const ticket =  new Ticket(this.ultimo, null);
        this.tickets.push( ticket );
        this.guardarDB();
        return `Ticket ${ticket.numero}`;
    }
    atenderTicket(escritorio){
        //consultar si hay ticket
        if(this.tickets.length === 0){
            return null;
        }
        const ticket = this.tickets.shift();
        ticket.escritorio = escritorio;

        this.ultimos.unshift( ticket );

        if( this.ultimos.length > 4 ){
            this.ultimos.splice(-1,1);
        }
        this.guardarDB();
        return ticket;
    }
}

module.exports = TicketController;