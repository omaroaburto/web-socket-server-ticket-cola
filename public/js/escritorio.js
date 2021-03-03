//referencias html
const lblEscritorio =  document.querySelector("h1");
const btnAtender    =  document.querySelector("button");
const msgserver     =  document.querySelector("small"); 
const divAlerta     =  document.querySelector(".alert");
const lblPendientes =  document.querySelector('#lblPendientes');
const span          =  document.querySelector("#span");
//guarda los parámetros de la url
const searchParams =  new URLSearchParams( window.location.search );
//consulta si existe el parámetro escritorio
if(!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error("El escritorio  es obligatorio");
}
const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = "none";

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');    
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});
 
socket.on('ultimo-ticket',(ultimo)=>{
        //lblNuevoTicket.innerText = `Ticket ${ultimo}`;
})

 
socket.on('ticket-pendiente', (e)=>{
    if(e===0){
        span.style.display = '';
        lblPendientes.style.display ='none';
    }else{
        lblPendientes.style.display ='';
        span.style.display = 'none';
        lblPendientes.innerText = e;
    }   
});  

btnAtender.addEventListener( 'click', () => {
      
      
    socket.emit('atender-ticket',{escritorio}, ({ok, ticket, msg})=>{
        if(!ok){
            msgserver.innerText =`nadie`;
            return divAlerta.style.display = "";
        }
        msgserver.innerText =`Ticket ${ticket.numero}`;
    });
    //socket.emit( 'siguiente-ticket', null, ( ticket ) => {
        // lblNuevoTicket.innerText = ticket;
    //});

});
