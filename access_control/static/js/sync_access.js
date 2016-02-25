var load_event = '<img src="/static/img/loading.gif"/><h3>Sincronizando, por favor espere</h3>';
function loop(){
	var now = new Date();
	if (now.getHours() === 11 && now.getMinutes() === 46) {
		sync_access();
	}
	now = new Date();
	var delay = 60000 - (now % 60000);
	setTimeout(loop, delay);
}
function sync_access(){
	$.ajax({
		url: "/sync-access",
		beforeSend: function(){
			$('.loading').empty();
			$('.loading').append(load_event);
		},
		success: function(value){
			$('.loading').empty();
			if(value.sync_alum){
				$('.loading').append(
					'<p><strong>Total alumnos sincronizados: </strong>'+value.totalum+'</p>'+
					'<p><strong>Total alumnos nuevos: </strong>'+value.newalum+'</p>'+
					'<p><strong>Total alumnos actualizados: </strong>'+value.upalum+'</p>'
				);
			}
			Lobibox.notify(value.type, {
				title: value.title,
				msg: value.message,
				sound: false,
			});
		}
	});
}