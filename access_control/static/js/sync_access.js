// Crea una variable el cual contenga la imagen del gif loading
var load_event = '<img src="/static/img/loading.gif"/><h3>Sincronizando, por favor espere</h3>';
// Crea una funcion loop par que este pendiente de la hora de sincronizacion
function loop(){
	// Toma la fecha y hora actual
	var now = new Date();
	// Peticion get a una url de la app para obtener la hora de sincronizacion tomado de la base de datos
	$.get('/get-hour-sync', function(data){
		if (now.getHours() === parseInt(data.hour) && now.getMinutes() === parseInt(data.minute)){
			// Si llego la hora, va a la funcion sync_access
			sync_access();
		}
	});
	// Queda abierto a la espera de la hora de sincronizacion
	var delay = 60000 - (now % 60000);
	setTimeout(loop, delay);
}
function sync_access(){
	// Realiza una peticion ajax a una url de la app
	$.ajax({
		url: "/sync-access",
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
			Lobibox.notify(value.type, {
				title: value.title,
				msg: value.message,
				sound: false,
			});
		}
	});
}