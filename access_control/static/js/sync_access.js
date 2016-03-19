// Crea una variable el cual contenga la imagen del gif loading
var load_event = '<img src="/static/img/loading.gif"/><h3>Sincronizando, por favor espere</h3>';
// Crea una funcion loop par que este pendiente de la hora de sincronizacion
var hour = 0, minute = 0;
// Peticion get a una url de la app para obtener la hora de sincronizacion tomado de la base de datos
$.get('/get-hour-sync', function(data){
	hour = data.hour;
	minute = data.minute;
});
window.setInterval(function(){
	var now = new Date();
	if (now.getHours() === parseInt(hour) && now.getMinutes() === parseInt(minute)){
		// Si llego la hora, va a la funcion sync_access
		sync_access();
	}
}, 60000);
function notify(type, title, message){
	Lobibox.notify(type, {
		title: title,
		msg: message,
		sound: false,
		delay: 7000
	});
}
function sync_access(asis = 'false'){
	// Realiza una peticion ajax a una url de la app
	$.ajax({
		url: "/sync-access/",
		type: 'POST',
		data: {'asis': asis},
		// Antes de hacer la peticion, mostrar cargando
		beforeSend: function(){
			$('.loading').empty();
			$('.loading').append(load_event);
		},
		// Si ya acabo de sincronizar, oculta el gif loding y muestra datos del numero de sincronizados
		success: function(value){
			$('.loading').empty();
			if(value.sync_alum){
				$('.loading').append(
					'<p><strong>Total alumnos sincronizados: </strong>'+value.totalum+'</p>'+
					'<p><strong>Total alumnos nuevos: </strong>'+value.newalum+'</p>'+
					'<p><strong>Total alumnos actualizados: </strong>'+value.upalum+'</p>'
				);
			}
			// Mostrar mensaje flotante en la pantalla
			notify(value.type, value.title, value.message);
		}
	});
}