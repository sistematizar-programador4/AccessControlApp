function trim( element ){return element.replace(/^\s+|\s+$/g,'')};
/*Template Para la presentacion de los mensajes.*/
var lista  = new Template("<li>#{title}<b>#{field}</b></li>");
var option = new Template("<option value='#{value}'>#{detalle}</option>");
var p  = new Template("<table width='100%' align='center' style='height: #{height}px;'><tr><td rowspan='2' width='9%' align='center' valign='middle'><img src='"+$Kumbia.path+"img/#{img}.png'></td><td style='height: 25px;' valign='bottom'><h1>#{title}</h1></td></tr><tr><td valign='middle' align='left' style='white-space: pre-wrap;' id='message'>#{msg}</td></tr></table>");
var tdcheck  = new Template("<td width='3%' align='center' valign='middle'><input type='checkbox' id='m#{name}' name='m#{name}' value='#{value}' ></td>");
var pdetalle  = new Template("<input id='#{field}[]' type='hidden' name='#{field}[]' value='#{value}'/>#{value}");
var pdetalle2 = new Template("<input id='#{field}[]' type='hidden' name='#{field}[]' value='#{value}'/>#{text}");
var span_input = new Template("<span class='checkjorna'>#{text}<input class='cgrupo' type='hidden' value='#{value}'/><input id='#{value}' class='#{clase}' type='checkbox'/></span>");
var span_input2;

var span_alumnosdeta = new Template("<span class='checkjorna' style='width: 50%;'>#{text}<input id='numregalum[]' name='numregalum[]' type='hidden' value='#{value}'/></span>#{selectgrupo}");

var layoutSpeed = "<p>Velocidad de Bajada:<br><img id=\"dlbar\" src=\""+$Kumbia.path+"img/bar.gif\" style=\"width: 1px; height: 10px;\"> <span id=\"dlspeed\"><img src=\""+$Kumbia.path+"img/busy.gif\"></span><br><img src=\""+$Kumbia.path+"img/bar.gif\" width=\"300\" height=\"10\"> 10 Mb/s</p><p>Velocidad de Subida:<br><img id=\"ulbar\" src=\""+$Kumbia.path+"img/bar.gif\" style=\"width: 1px; height: 10px;\"> <span id=\"ulspeed\"><img src=\""+$Kumbia.path+"img/busy.gif\"></span><br><img src=\""+$Kumbia.path+"img/bar.gif\" width=\"300\" height=\"10\"> 5 Mb/s</p>";
var speedError = new Template("<p><h2>Su Velocidad de Conexion es Muy Baja, Siacolweb No se Hace Responsable por Perdida de Datos</h2></p>");
/*Delegacion de Evento KEYPRESS a los Objetos de un Formulario*/
var creaCheck = function(obj){
	var strTemplate = "<span class='checkjorna'>";
	$j.each(obj,function(i,e){
		strTemplate = strTemplate+"Jornada "+e.det+"<input id='"+e.cod+"' type='checkbox' onclick='check"+e.cod+"();'>"
	});
	strTemplate = strTemplate+"</span>";
	span_input2 = new Template(strTemplate);
}
var enterPress = function (element, accion){
	if(!Object.isArray(element)){
		element.select('input[type=text]','input[type=checkbox]','input[type=password]','select','textarea').invoke('observe', 'keydown', function(obj){if(obj.keyCode==13) accion();});
	}else{
		element.each(function(obj){obj.select('input[type=text]','input[type=checkbox]','input[type=password]','select','textarea').invoke('observe', 'keydown', function(obj){if(obj.keyCode==13) accion();});});
	}
};
/*Identificador de Plurales;*/
var plural = function(array, op1, op2){
	return (array.length==1?op1:op2);
};
/*Filtros  de Validacion*/
var filters = {
	uniqueFields: function(eArray){
		var flag = new Array();
		var fields = new Array();
		eArray.each(function(obj,i){
			if((!$F(obj.id).blank() && obj.getAttribute('readonly')==null)){fields.push(obj.id+'='+obj.value);}
		});
		if(fields.length>0){
			var parameter = '';
			parameter = fields.join('&');
			new Ajax.Request(Utils.getKumbiaURL($Kumbia.controller+'/Unique'), {
				parameters: parameter,
				asynchronous: false,
				onSuccess: function(transport){
					var result = transport.responseText.evalJSON();
					flag = result;
				}
			});
			return flag;
		}
	},
	email: function(element){
		var email = element.value;
		if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) return true;
		else return false;
	},
	requiredFields: function(obj){
		if(obj.type=='text' || obj.type=='select-one' || obj.type=='password' || obj.type=='checkbox' || obj.type=='textarea' || obj.type=='hidden'){
			return (obj.value.blank()==true || obj.value=='@');
		}else if(obj.type=='radio'){
			return $$('input[name='+obj.id+']:checked')==''?true:false;
		}
	},
	compuesFields: function(eArray){
		var fields = new Array();
		var flag = 0;
		eArray.each(function(obj,i){
			if($F(obj.id)!='@'  && obj.getAttribute('disabled')==null){
				flag++;
				fields.push(obj.id+'='+obj.value);
			}
		});
		if(flag==eArray.length){
			var parameter = '';
			parameter = fields.join('&');
			if(!parameter.blank()){
				new Ajax.Request(Utils.getKumbiaURL($Kumbia.controller+'/Compues'), {
					parameters: parameter,
					asynchronous: false,
					onSuccess: function(transport){
						var result = transport.responseText.evalJSON();
						flag = result;
					}
				});
				return flag;
			}else return false;
		}
	},
	fechaActu: function(fieldDate){
		var fecha  = $F('dateSystem');
		return (fieldDate.value>fecha);
	}
};
var utilitys = {
	in_array: function( what, where ){
		var a = false;
		for(var i=0;i<where.length;i++){
			if(what == where[i]){a=true;break;}
		}
		return a;
	},
	viewImg: function(val,target){
		if(val!=''){
			$j(target).attr('src',val);
		}
	},
	readonly: function(obj){
		$j(obj).find('.readonly').attr('readonly','readonly');
	},
	confimationPassword: function(obj1,obj2){
		$j(obj2).keyup(function() {
			if($j(obj1).val()==$j(this).val()){
				$j(this).stop().animate({ backgroundColor: "#4fc49f" }, 1000,
					function() {
						$j(this).animate({backgroundColor: "#fff", border: '1px solid #4fc49f'},1000);
					});
				$j(obj1).stop().animate({ backgroundColor: "#4fc49f" }, 1000,
					function() {
						$j(this).animate({backgroundColor: "#fff", border: '1px solid #4fc49f'},1000);
					});
			}else{
				$j(this).stop().animate({ backgroundColor: "#c35050" }, 1000,
					function() {
						$j(this).animate({backgroundColor: "#fff", border: '1px solid #c35050'},1000);
					});
			}
		});
	},
	renderView: function(url, params, target){
		new Ajax.Request(Utils.getKumbiaURL(url), {
			parameters: params,
			onLoading: function(){
				$j('#ajax-loader').dialog('open');
			},
			onLoaded: function(){
				$j('#ajax-loader').dialog('close');
			},
			onComplete: function(transport){
				if(target.blank()){
					$('content').update(transport.responseText);
				}
				else{
					$(target).update(transport.responseText);
				}
			}
		});
	},
	renderView2: function(url, params, target){
		new Ajax.Request(Utils.getKumbiaURL(url), {
			parameters: params,
			onComplete: function(transport){
				if(target.blank())
					$('content').update(transport.responseText);
				else
					$(target).update(transport.responseText);
			}
		});
	},
	paginator: function(obj, target){
		var page = obj.innerHTML.replace(/^\s*|\s*$/g,"");
		var span = '';
		var accion = '';
		if(page =='Anterior'){
			span = obj.up().select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
			if(parseInt(span)>1){span = parseInt(span)-1;accion='before';}
			else return false;
		}else if(page == 'Siguiente'){
			span = obj.up().select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
			if(parseInt(span)<parseInt(obj.previous().innerHTML.replace(/^\s*|\s*$/g,""))){span = parseInt(span)+1;accion='next';}
			else return false;
		}else{
			span = obj.up().select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
			if(parseInt(span)!= parseInt(page)){span = parseInt(page);accion='before';}
			else return false;
		}
		if(Object.isElement($('search'))){
			var params = 'accion='+accion+'&pagina='+span+'&'+Form.serializeElements($A($('search').select('input','select')));
		}else{
			var params = 'accion='+accion+'&pagina='+span;
		}

		this.renderView($Kumbia.controller+'/'+target, params,'' );
	},
	paginator2: function(obj, target){
		var page = obj.innerHTML.replace(/^\s*|\s*$/g,"");
		var span = '';
		var accion = '';
		if(page =='Anterior'){
			span = obj.up().select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
			if(parseInt(span)>1){span = parseInt(span)-1;accion='before';}
			else return false;
		}else if(page == 'Siguiente'){
			span = obj.up().select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
			if(parseInt(span)<parseInt(obj.previous().innerHTML.replace(/^\s*|\s*$/g,""))){span = parseInt(span)+1;accion='next';}
			else return false;
		}else{
			span = obj.up().select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
			if(parseInt(span)!= parseInt(page)){span = parseInt(page);accion='before';}
			else return false;
		}
		var params = 'accion='+accion+'&pagina='+span;
		this.renderView(target, params,'' );
	},
	paginator3: function(obj, target, target2){
		var page = obj.innerHTML.replace(/^\s*|\s*$/g,"");
		var span = '';
		var accion = '';
		if(page =='Anterior'){
			span = obj.up().select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
			if(parseInt(span)>1){span = parseInt(span)-1;accion='before';}
			else return false;
		}else if(page == 'Siguiente'){
			span = obj.up().select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
			if(parseInt(span)<parseInt(obj.previous().innerHTML.replace(/^\s*|\s*$/g,""))){span = parseInt(span)+1;accion='next';}
			else return false;
		}else{
			span = obj.up().select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
			if(parseInt(span)!= parseInt(page)){span = parseInt(page);accion='before';}
			else return false;
		}
		var params = 'accion='+accion+'&pagina='+span+'&cmate='+$F('cmate')+'&cgrupo='+$F('cgrupo')+'&cmes='+$F('cmes');
		this.renderView(target, params,target2 );
	},
	order: function(obj, target){
		var ord = obj.hasClassName('asc')?' desc':' asc';
		if(!Object.isUndefined($('paginator')))
			var span = $('paginator').select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
		else
			var span = 1;
		var params = 'accion=before&pagina='+span+'&orden='+obj.id.substring(1)+ord;
		this.renderView($Kumbia.controller+'/'+target, params,'');
	},
	order2: function(obj, target){
		var ord = obj.hasClassName('asc')?' desc':' asc';
		if(!Object.isUndefined($('paginator')))
			var span = $('paginator').select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
		else
			var span = 1;
		var params = 'accion=before&pagina='+span+'&orden='+obj.id.substring(1)+ord;
		this.renderView(target, params,'');
	},
	editRow: function(obj){
		var valFileds = obj.up(2).select('td:not([style]) input[type=hidden]');
		var fieldPK = $('save').select('input[class]','select[class]').find(function(obj ){return obj.hasClassName('pk');});
		var fieldCK = $('save').select('input[class]','select[class]').findAll(function(obj ){return obj.hasClassName('ck');});

		if(!Object.isUndefined(fieldPK)){
			fieldPK.setAttribute('readonly','readonly');
			fieldPK.up().next().down().activate();
		}
		if(!Object.isUndefined(fieldCK)){
			fieldCK.invoke('setAttribute','disabled','disabled');
		}

		$$("table#data tfoot tr td").each(function(element, i){
			if(valFileds[i].hasClassName('hora')){
				var hora = valFileds[i].value.split(':');
				element.select('select').each(function(obj, j){
					obj.value = hora[j];
				});
			}else{
				element.down().value = valFileds[i].value;
			}

			element.down().value = valFileds[i].value;
		});
		var combo = $$("table#data tfoot tr td select[class~=comboload]");

		if(Object.isArray(combo)){
			if(!Object.isUndefined(combo[0])){
				var result = $$("table#data tfoot tr td select[class~=comboloadresult]");
				var content = $$("table#data tfoot tr td input[class~=contentresult]");
				utilitys.comboAjax('load/loadgrupo',combo[0],result[0]);
				result[0].value = content[0].value;
			}

		}

	},
	editRow2: function(obj, action){
		Master._action = 3;
		var fieldPK = obj.up(2).select('input[type=hidden]').findAll(function(obj ){return obj.hasClassName('PK');});
		var fields  = new Array();
		fieldPK.each(function(obj){
			fields.push(obj.id.replace(/(\[|\])/g,"")+'='+obj.value);
		});
		var params = fields.join('&');
		utilitys.renderView($Kumbia.controller+'/'+action, params,'');
		window.setTimeout(function(){
			Master._formElements.findAll(function(obj ){return obj.hasClassName('unique');}).invoke('setAttribute','readonly','readonly');
			Master._formElements.findAll(function(obj ){return obj.hasClassName('ck');}).invoke('setAttribute','disabled','disabled');
			Master._action = 1;
			Master._edit = 1;
			$('est').innerHTML = 'Estado: Guardar';
		},2000);
	},
	editRow3: function(obj, parent){
		var valFileds = obj.up(2).select('td:not([style]) input[type=hidden]').pluck('value');
		var fieldPK = $(parent).select('input[class]','select[class]').find(function(obj ){return obj.hasClassName('pk');});
		fieldPK.setAttribute('readonly','readonly');
		fieldPK.up().next().down().activate();
		$(parent).select('tr td').each(function(element, i){
			element.down().value = valFileds[i] ;
		});
	},
	deleteRow: function(obj,target){
		if(confirm('Realmente dese Eliminar Este Registro ?')){
			var fieldPK =  obj.up(2).select('input[type=hidden]').findAll(function(obj ){return obj.hasClassName('PK');});
			var fields  = new Array();
			if(Object.isArray(fieldPK)){
				fieldPK.each(function(obj){
					fields.push(obj.id.replace(/(\[|\])/g,"")+'='+obj.value);
				});
				switch(target){
					case 'detail' :
					Detail.drop(fields.join('&'));
					break;
					case 'master' :
					Master.drop(fields.join('&'));
					break;
				}
			}
		}else return false;
	},
	anularRow: function(obj,target){
		var clase = 'Realmente desea Anular Este Registro ?';
		if(obj.up(2).hasClassName('nula')){
			clase = 'Realmente desea Validar Este Registro ?';
		}
		if(confirm('Realmente desea Anular Este Registro ?')){
			var fieldPK =  obj.up(2).select('input[type=hidden]').findAll(function(obj ){return obj.hasClassName('cmatri');});
			var fields  = new Array();
			if(Object.isArray(fieldPK)){
				fieldPK.each(function(obj){
					fields.push(obj.id.replace(/(\[|\])/g,"")+'='+obj.value);
				});
				switch(target){
					case 'detail' :
					Detail.anular(fields.join('&'));
					break;
					case 'master' :
					Master.anular(fields.join('&'));
					break;
				}
			}
		}else return false;
	},
	verCalum: function(obj){
		var fieldPK =  obj.up(1).select('input[type=file]', 'input[class=PK]');
		var iden = "";
		if(Object.isArray(fieldPK)){
			fieldPK.each(function(obj){
				if (obj.getAttribute('type') != 'file') {
					iden = obj.getAttribute('id').replace(/(\[|\])/g,"");
					obj.setAttribute('id',iden);
					$('standard_use').appendChild(obj.cloneNode(true));
				}else{
					$('standard_use').appendChild(obj);
				}
			});
		}
	},
	find: function(){
		var span = '';
		if(Object.isUndefined($('paginator')))
			span = $('paginator').select("[class=page2]")[0].innerHTML.replace(/^\s*|\s*$/g,"");
		else span = 1;
		var params = 'accion=before&pagina='+span+'&'+Form.serializeElements($A($('search').select('input','select')));
		this.renderView($Kumbia.controller+'/index/', params,'');
	},
	comboAjax: function(accion, padre, hijo){
		if(padre.value=='@'){
			hijo.innerHTML = "";
			hijo.update( option.evaluate({value: '@', detalle: 'Seleccione......'}) );
			return false;
		}else{
			var params = padre.id+'='+padre.value;
			new Ajax.Request(Utils.getKumbiaURL(accion), {
				asynchronous: false,
				parameters: params,
				onSuccess: function(transport){
					var fields = transport.responseText.evalJSON();
					var html = "";
					if(fields.length>0){
						html+= option.evaluate({value: hijo.options[0].value , detalle: hijo.options[0].text});
						for(var i=0; i<fields.length; i++){
							html+=option.evaluate({value: fields[i].cod, detalle: fields[i].det});
						}
					}else{
						html = option.evaluate({value: hijo.options[0].value , detalle: hijo.options[0].text});
					}
					hijo.update(html);
					hijo.focus();
				}
			});
		}
	},
	comboAjax2: function(accion, padre, hijo){
		padre = $(padre);
		if(padre.value=='@'){
			hijo.innerHTML = "";
			hijo.update( option.evaluate({value: '@', detalle: 'Seleccione......'}) );
			return false;
		}else{
			var params = padre.id+'='+padre.value;
			new Ajax.Request(Utils.getKumbiaURL(accion), {
				asynchronous: false,
				parameters: params,
				onSuccess: function(transport){
					var fields = transport.responseText.evalJSON();
					var html = "";
					if($(hijo)==null){
						hijo = $$('.'+hijo)[0];
					}else{
						hijo = $(hijo);
					}
					if(fields.length>0){
						html+= option.evaluate({value: hijo.options[0].value , detalle: hijo.options[0].text});
						for(var i=0; i<fields.length; i++){
							html+=option.evaluate({value: fields[i].cod, detalle: fields[i].det});
						}
					}else{
						html = option.evaluate({value: hijo.options[0].value , detalle: hijo.options[0].text});
					}
					hijo.update(html);
					hijo.focus();
				}
			});
		}
	},
	comboAjax3: function(accion, padre, padre2, hijo){
		if(padre.value=='@' || padre2.value=='@'){
			hijo.innerHTML = "";
			hijo.update( option.evaluate({value: '@', detalle: 'Seleccione...'}) );
			return false;
		}else{
			var params = padre.id+'='+padre.value+'&'+padre2.id+'='+padre2.value;
			new Ajax.Request(Utils.getKumbiaURL(accion), {
				asynchronous: false,
				parameters: params,
				onSuccess: function(transport){
					var fields = transport.responseText.evalJSON();
					var html = "";
					if(fields.length>0){
						html+= option.evaluate({value: hijo.options[0].value , detalle: hijo.options[0].text});
						for(var i=0; i<fields.length; i++){

							html+=option.evaluate({value: fields[i].cod, detalle: fields[i].det});
						}
					}else{
						html = option.evaluate({value: hijo.options[0].value , detalle: hijo.options[0].text});
					}
					hijo.update(html);
					hijo.focus();
				}
			});
		}
	},comboAjax4: function(accion, padre, padre2, padre3, hijo){
		if(padre.value=='@' || padre2.value=='@' || padre3.value=='@'){
			hijo.innerHTML = "";
			hijo.update( option.evaluate({value: '@', detalle: 'Seleccione...'}) );
			return false;
		}else{

			var params = padre.id+'='+padre.value+'&'+padre2.id+'='+padre2.value+'&'+padre3.id+'='+padre3.value;
			new Ajax.Request(Utils.getKumbiaURL(accion), {
				asynchronous: false,
				parameters: params,
				onSuccess: function(transport){
					var fields = transport.responseText.evalJSON();
					var html = "";
					if(fields.length>0){
						html+= option.evaluate({value: hijo.options[0].value , detalle: hijo.options[0].text});
						for(var i=0; i<fields.length; i++){

							html+=option.evaluate({value: fields[i].cod, detalle: fields[i].det});
						}
					}else{
						html = option.evaluate({value: hijo.options[0].value , detalle: hijo.options[0].text});
					}
					hijo.update(html);
					hijo.focus();
				}
			});
		}
	},
	getMax: function(action, parameters){
		var flag = new Array();
		new Ajax.Request(Utils.getKumbiaURL(action), {
			parameters: parameters,
			asynchronous: false,
			onSuccess: function(transport){
				var result = transport.responseText.evalJSON();
				flag = result;
			}
		});
		return flag;
	},
	digitoV: function(identificacion){
		var array = [71,67,59,53,47,43,41,37,29,23,19,17,13,7,3];
		var number = utilitys.zeroFill(identificacion,15);
		var sum = 0;
		for(var i = 0; i < 15; i++){
			sum += number.substring(i,i+1) * array[i];
		}
		sum = sum%11;
		if (sum == 0 || sum == 1) var lnRetorno = sum;
		else var lnRetorno = 11 - sum;
		return lnRetorno;
	},
	zeroFill: function(number,len){
		var zero='';
		for(var i=0; i<(len-number.length); i++){zero+=0;}
			return  (zero+number);
	},
	getValues: function(obj){
		var fieldPK =  obj.up(2).select('input[type=hidden]').findAll(function(obj ){return obj.hasClassName('PK');});
		var fields  = new Array();
		fieldPK.each(function(obj){
			fields.push(obj.value);

		});
		return fields.join('/');
	},
	serialize: function(elements){
		var fields = new Array();
		elements.each(function(obj){
			if(obj.type=='radio'){
				fields.push(obj.id+'='+$$('input[name='+obj.id+']:checked').first().value);
			}else{
				fields.push(obj.id+'='+obj.value);
			}
		});
		return fields.join('&');
	},
	getValuesURL: function(elements){
		var fields = new Array();
		elements.each(function(obj){
			if(obj.type!='radio'){
				fields.push(obj.value);
			}else{
				fields.push($$('input[name='+obj.id+']:checked').first().value);
			}
		});
		return fields.join('/');
	},
	ajax: function(action, parameters){
		var res = '';
		new Ajax.Request(Utils.getKumbiaURL(action), {
			parameters: parameters,
			asynchronous: false,
			onSuccess: function(transport){
				var result = transport.responseText.evalJSON();
				res = result;
			}
		});
		return res;
	},
	formElements: function(obj){
		return obj.select('input[type=text]','input[type=hidden]','input[type=password]','input[type=checkbox]','select','textarea');
	},
	array_sum: function (array) {
		var sum = 0;
		for(var i=0; i<array.length; i++){
			var val = new Number(array[i].value);
			sum+= parseFloat(val);
		}
		return sum;
	},
	validateCheck:function(array) {
		var aux=false;
		for(var i=0;i<array.length;i++){
			if (array[i].checked){
				aux=true
			}
		}
		return aux;
	},
	date: function(obj){
		$j( obj ).datepicker({dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"], dateFormat: "yy-mm-dd",changeYear: true, yearRange: '1990:2015'});
	}
};
/*Clase Para la Generacion de Divs de Mensaje*/

var ventana  = Class.create();
ventana.prototype = {
	_window: '',
	id: '',
	width: '',
	height: '',
	titulo : '',
	div: '',
	focus: '',
	initialize: function(id, width, heigth, titulo ,div, focus, redirec){
		this.id =     id;
		this.width =  width;
		this.titulo = titulo;
		this.div =    div;
		this.heigth = heigth;
		if(!focus.blank())this.focus = focus;
		this.redirec = redirec;
		this.create();
	},
	create: function(){
		redi = this.redirec;
		this._window = new UI.Window({
			theme: 'alphacube',
			id: this.id,
			minimize: false,
			maximize: false,
			resizable: false,
			close: 'MyClose',
			width:  this.width,
			height: this.heigth
		});
		this._window.center().setHeader(this.titulo).setFooter("<div align='center' style='color: #000; margin-top: -3px; font-size: 11px; font-weight: bold;'>Sistematizar EF Ltda â€“ Todos los derechos reservados Copyright Â© 2015-2020 <br> Cra 11 No. 19-70 Tel 8330505 â€“ 8353786 Cel 315-2587590 314-3945809 â€“ Girardot Colombia</div>").activate().setContent($(this.div).show());
		UI.Window.addMethods({
			MyClose: function(){
				if(modi){
					if(!confirm("Usted ha modificado datos de la planilla de notas\n"+
						"Desea descartarlos?")){
						return;
				}
			}
			modi=false;
			if(redi==true){
				this.hide();
				window.location = Utils.getKumbiaURL("notas14/index");

			}else{
				this.hide();
			}
		}
	});
	},
	show: function(){
		this._window.show('modal');
		if(!this.focus.blank())$(this.focus).focus();
	},
	hide: function(){
		this._window.hide();
	}
};
var ventana2  = Class.create();
ventana2.prototype = {
	_window: '',
	id: '',
	width: '',
	height: '',
	titulo : '',
	div: '',
	focus: '',
	initialize: function(id,width,heigth,titulo ,div, focus){
		this.id =     id;
		this.width =  width;
		this.titulo = titulo;
		this.div =    div;
		this.heigth = heigth;
		this.create();
	},
	create: function(){
		this._window = new UI.Window({
			theme: 'alphacube',
			id: this.id,
			minimize: false,
			maximize: false,
			resizable: false,
			close: 'MyClose',
			width:  this.width,
			height: this.heigth
		});
		this._window.center().setHeader(this.titulo).setFooter("<div align='center' style='color: #000; margin-top: -3px; font-size: 11px; font-weight: bold;'>Sistematizar EF Ltda â€“ Todos los derechos reservados Copyright Â© 2015-2020 <br> Cra 11 No. 19-70 Tel 8330505 â€“ 8353786 Cel 315-2587590 314-3945809 â€“ Girardot Colombia</div>").activate().setContent($(this.div).show());
		UI.Window.addMethods({
			MyClose: function(){
				this.hide();
				$('d2').innerHTML='';
				$('d2').update('<div id="mostrar_logros" align="center" style="display: none"></div>');
			}
		});
	},
	show: function(){
		this._window.show();
	},
	hide: function(){
		this._window.hide();
		$('d2').innerHTML='';
		$('d2').update('<div id="mostrar_logros" align="center" style="display: none"></div>');
	}
};
var Message = Class.create();
Message.prototype = {
	initialize: function(){
		this.options = {
			minHeight: 100,
			width: document.viewport.getWidth()
		};
		this.createDiv();
	},
	createDiv: function(){
		this.container = new Element('div',{'id': 'message'});
		this.containerChild = new Element('div',{'id': 'message-container'});
		$$('body')[0].appendChild(this.container);
		this.container.update(this.containerChild);
	},
	show: function(message, status){
		var title = '';
		var img = '';
		var msg = $A($$('#message'));
		if(msg.length>0){
			msg.invoke('hide');
			msg.invoke('remove');
			this.createDiv();
		}
		switch(status){
			case 2:title = 'Exito!';img = 'success';break;
			case 1:title = 'Informaci&oacute;n!';img = 'info';break;
			case 0:title = 'Error!';img = 'error';break;
			case 3:title = 'Advertencia!';img = 'alert';break;
		}
		var dimension = document.viewport.getScrollOffsets();
		var top  = (document.viewport.getHeight())-(this.container.getHeight());
		var left = (document.viewport.getWidth()/2) - ((document.viewport.getWidth()*0.40)/2);
		var width = 40


		this.container.style.top = top+'px';
		this.container.style.left = 'calc(50% -  ' + width/2 + '%)';
		this.container.style.width = width+'%';

		this.container.setAttribute('class', 'status'+status);

		this.containerChild.update( p.evaluate({title: title, img: img, msg: message, height: this.containerChild.getHeight()}) );
		$j(this.container).animate({"top": "-=100px"}, "slow");
		var container = this.container;
		var hide = this.hide;
		setTimeout(function(){hide(container);},1000);
		setTimeout(function(){$j(container).animate({"top": "+=100px"}, "slow");},8000);


	},
	hide: function(container){
		setTimeout(function(){container.fade({duration: 6.0, queue: 'end'});},1000);
	},
	show2: function(message, status){
		var title = '';
		var img = '';
		var msg = $A($$('#message'));
		if(msg.length>0){
			msg.invoke('remove');
			this.createDiv();
		}
		switch(status){
			case 2:title = 'Exito!';img = 'success';break;
			case 1:title = 'InformaciÃ³n!';img = 'info';break;
			case 0:title = 'Error!';img = 'error';break;
			case 3:title = 'Advertencia!';img = 'alert';break;
		}
		var top  = (document.viewport.getHeight()/2);
		var left = (document.viewport.getWidth()/2) - ((document.viewport.getWidth()*0.6)/2);
		this.container.setStyle({top: top+'px', marginLeft: left+'px', width: 76+'%'});
		this.container.setAttribute('class', 'status'+status);
		this.containerChild.update( p.evaluate({title: title, img: img, msg: message, height: this.containerChild.getHeight()}) );
		this.container.appear({duration: 0.02, queue: 'end'});
		var container = this.container;
		setTimeout(function(){container.fade({duration: 3.0, queue: 'end'});},3000);
	},
	close2: function(){
		var container = this.container;
		setTimeout(function(){container.fade({duration: 3.0, queue: 'end'});},1000);
	}
};

var Message2 = Class.create();
Message2.prototype = {
	initialize: function(){
		this.options = {
			minHeight: 100,
			width: document.viewport.getWidth()
		};
		this.createDiv();
	},
	createDiv: function(){
		this.container = new Element('div',{'id': 'message2'});
		this.containerChild = new Element('div',{'id': 'message2-container'});
		$$('body')[0].appendChild(this.container);
		this.container.update(this.containerChild);
	},
	show: function(message, status){
		var title = '';
		var img = '';
		var msg = $A($$('#message'));
		if(msg.length>0){
			msg.invoke('hide');
			msg.invoke('remove');
			this.createDiv();
		}
		switch(status){
			case 2:title = 'Exito!';img = 'success';break;
			case 1:title = 'InformaciÃ³n!';img = 'info';break;
			case 0:title = 'Error!';img = 'error';break;
			case 3:title = 'Advertencia!';img = 'alert';break;
		}
		var dimension = document.viewport.getScrollOffsets();
		var top = (dimension[1]+document.viewport.getHeight()-this.container.getHeight());
		var left = (document.viewport.getWidth()/2) - ((document.viewport.getWidth()*0.75)/2);
		this.container.setStyle({top: top+'px', marginLeft: left+'px', width: 75+'%'});
		this.container.setAttribute('class', 'status'+status);
		this.containerChild.update( p.evaluate({title: title, img: img, msg: message, height: this.containerChild.getHeight()}) );
		this.container.appear({duration: 0.02, queue: 'end'});
		var container = this.container;
		this.hide(container);
	},
	hide: function(container){
		setTimeout(function(){container.fade({duration: 6.0, queue: 'end'});},1000);
	},
	show2: function(message, status){
		var title = '';
		var img = '';
		var msg = $A($$('#message'));
		if(msg.length>0){
			msg.invoke('remove');
			this.createDiv();
		}
		switch(status){
			case 2:title = 'Exito!';img = 'success';break;
			case 1:title = 'Informaci&oacute;n!';img = 'info';break;
			case 0:title = 'Error!';img = 'error';break;
			case 3:title = 'Advertencia!';img = 'alert';break;
		}
		var top  = (document.viewport.getHeight()/2)-(this.container.getHeight()/2);
		var left = (document.viewport.getWidth()/2) - ((document.viewport.getWidth()*0.6)/2);
		this.container.setStyle({top: top+'px', marginLeft: left+'px', width: 75+'%'});
		this.container.setAttribute('class', 'status'+status);
		this.containerChild.update( p.evaluate({title: title, img: img, msg: message, height: this.containerChild.getHeight()}) );
		this.container.appear({duration: 0.02, queue: 'end'});
		var container = this.container;
		setTimeout(function(){container.fade({duration: 3.0, queue: 'end'});},3000);
	},
	close2: function(){
		var container = this.container;
		setTimeout(function(){container.fade({duration: 3.0, queue: 'end'});},1000);
	}
};
var NewViewMaster ={
	_fist : '',
	_second : '',
	initialize: function(first,second){
		this._first = first;
		this._second = second;
		this._second.setStyle({display: 'none',position: 'absolute',minwidth: 75+'%'});
		this._first.select('fieldset ul li[class=new]').invoke('observe', 'click', function(evt){NewViewMaster.displayFirst();});

		this._first.select('fieldset ul li[class=find]').invoke('observe', 'click', function(evt){alert("find");});
		this._second.select('fieldset ul li[class=new]').invoke('observe', 'click', function(evt){alert("new2");});
		this._second.select('fieldset ul li[class=find]').invoke('observe', 'click', function(evt){alert("find2");});

	},
	displayFirst: function(){
		$j(this._first).animate({"top": "+=100px"}, "slow");
		this._first.fade({duration: 3.0, queue: 'end'});

		this._second.show();
		this._second.setStyle({marginLeft: 'auto',marginRigth: 'auto'});
		$j(this._second).animate({"top": "-=400px"}, "slow");

	},
	displaySecond: function(){

	}
}
/*Clase Para la Adminsitracion de Capturas Tipo Deatalle*/
var Detail = {
	_formElements : [],
	_table : '',
	initialize: function(table){
		this._table = table;
		this._formElements = $('save').select('input[type=text]','select');
		$('paginator').select('span').invoke('observe', 'click', function(evt){utilitys.paginator(Event.element(evt),'index');});
		$('detail').select('table thead th').invoke('observe', 'click', function(evt){utilitys.order(Event.element(evt),'index');});
		$('detail').select('table tbody th span[class=editar]').invoke('observe', 'click', function(evt){utilitys.editRow(Event.element(evt));});
		$('detail').select('table tbody th span[class=borrar]').invoke('observe', 'click', function(evt){utilitys.deleteRow(Event.element(evt),'detail');});
		if(Object.isElement($('match'))){
			$('match').observe('keydown', function(evt){if(evt.keyCode==13) utilitys.find();});
			$('filter').observe('change', function(){if($F('filter') == '@') utilitys.find();});
			var filter = $('filter').innerHTML;
			$('save').select('tr td').each(function(obj, i){filter += option.evaluate({value: obj.down().id, detalle: obj.up(1).previous(1).down(i+1).innerHTML});});
			$('filter').update(filter);
			if(!$F('filterh').blank()) $('filter').value = $F('filterh');
		}
	},
	beforeSave: function(){
		var fields  = new Array();
		var errors  = new Array();
		var m1 = new Array();
		var m2 = new Array();
		var m3 = new Array();
		var m4 = new Array();
		var mssg = new Message();
		var j = 0;
		this._formElements.each(function(obj,i){
			if(obj.hasClassName('required')){
				if(filters.requiredFields(obj)){
					if(Object.isElement(obj.up().previous())){
						if(Object.isUndefined(obj.up().previous().down().type)){
							m1.push(obj.up().previous().innerHTML.stripTags().replace(/(\*|\:)/g,''));
						}else{
							m1.push(obj.up(2).previous(1).down(i+1).innerHTML);
						}
					}else{
						m1.push(obj.up(2).previous(1).down(i+1).innerHTML);
					}
					fields.push(obj);
				}
			}
			if(obj.hasClassName('unique'))    m2.push(obj);
			if(obj.hasClassName('compues'))   m4.push(obj);
			if(obj.hasClassName('email')){
				if(filters.email(obj)){
					m3.push(obj.up(2).previous(1).down(i+1).innerHTML);
					fields.push(obj);
				}
			}
		});
		if(m1.length>0){
			var e1 = plural(fields,'el siguiente Campo', 'los siguientes Campos');
			errors.push(lista.evaluate({title: 'Por Favor Complete '+e1+'  : ', field: m1.join(', ')}));
		}
		var campos = new Array();
		var result = filters.uniqueFields(m2);
		if(Object.isArray(result) && result[0]){
			var campos  = result[1].split(',');
			var campos_ = new Array();
			var e1 = plural(fields,'el siguiente Campo', 'los siguientes Campos');
			m2.each(function(obj, i){
				if(utilitys.in_array(obj.id, campos)){
					campos_.push(obj.up(2).previous(1).down(i+1).innerHTML);
					fields.push(obj);
				}
			});
			if(campos_.length>0){
				errors.push(lista.evaluate({title: 'Ya Existe un Registro con ese Valor para '+e1+' : ', field: campos_.join(', ')}));
			}
		}
		if(m4.length>0){
			var campos = new Array();
			var result = filters.compuesFields(m4);
			if(Object.isArray(result) && result[0]){
				var campos  = result[1].split(',');
				var campos_ = new Array();
				m4.each(function(obj,i){
					if(utilitys.in_array(obj.id, campos)){
						if(Object.isElement(obj.up().previous())){
							if(Object.isUndefined(obj.up().previous().down().type)){
								campos_.push(obj.up().previous().innerHTML.stripTags().replace(/(\*|\:)/g,''));
							}else{
								campos_.push(obj.up(2).previous(1).down(i+1).innerHTML);
							}
						}else{
							campos_.push(obj.up(2).previous(1).down(i+1).innerHTML);
						}
						fields.push(obj);
					}
				});
				if(campos_.length>0){
					errors.push(lista.evaluate({title: 'Ya Existe un Registro con ese Valor para '+plural(fields,'el siguiente Campo', 'los siguientes Campos')+' : ', field: campos_.join(', ')}));
				}
			}
		}
		if(m3.length>0){
			var e1 = plural(fields,'del Campo', 'de los Campos');
			errors.push(lista.evaluate({title: 'Por Favor Confirmar la Informaciï¿½n '+e1+' Email  : ', field: m3.join(', ')}));
		}
		if(errors.length>0){
			mssg.show('<ul>'+errors.join('')+'</u>', 1);
			fields[0].focus();
			return false;
		}else{
			return true;
		}
	},
	save: function(){
		var mssg = new Message();
		var params = Detail.serialize(this._formElements);
		var result = this.ajax(Utils.getKumbiaURL($Kumbia.controller+'/guardar'), params);
		mssg.show(result[0],result[1]);
	},
	drop: function(param){
		var mssg = new Message();
		var result = this.ajax(Utils.getKumbiaURL($Kumbia.controller+'/eliminar'), param);
		mssg.show(result[0],result[1]);
		window.setTimeout(function(){Detail.afterSave();},3100);
	},
	ajax: function(action, params){
		var result = new Array();
		new Ajax.Request(action, {
			asynchronous: false,
			parameters: params,
			onComplete: function(transport){
				result = transport.responseText.evalJSON();
			}
		});
		return result;
	},
	afterSave: function(){
		utilitys.renderView($Kumbia.controller+'/index', '','');
	},
	serialize: function(elements){
		var fields = new Array();
		elements.each(function(obj){
			fields.push(obj.id+'='+obj.value);
		});
		return fields.join('&');
	},
	addFields: function(obj){
		this._formElements.push(obj);
	}
};
var Master = {
	_formElements : [],
	_formElements2 : [],
	_maximum: false,
	_mssg: '',
	_action: 1,
	_focus: '',
	_edit: 0,
	initialize: function(obj, max, focus){
		this._formElements = obj.select('input[type=text]','input[type=hidden]','input[type=password]','input[type=checkbox]','select','textarea');
		this._formElements2 = $j(obj).find('input.required,select.required,textarea.required');
		$('master').select('li').invoke('observe', 'click', function(evt){
			var obj = Event.element(evt);
			var accion = obj.innerHTML.toLowerCase();
			eval('Master.'+accion+'()');
		});
		this._maximum = max;
		this._focus = focus;
		this._mssg = new Message();
	},
	initBusqueda: function(buscar, editar){
		$('busqueda').select('table thead th').invoke('observe', 'click', function(evt){utilitys.order2(Event.element(evt),buscar);});
		$('busqueda').select('table tbody th span[class=editar]').invoke('observe', 'click', function(evt){utilitys.editRow2(Event.element(evt), editar);});
		$('busqueda').select('table tbody th span[class=borrar]').invoke('observe', 'click', function(evt){utilitys.deleteRow(Event.element(evt),'master');});
		$('paginator').select('span').invoke('observe', 'click', function(evt){utilitys.paginator2(Event.element(evt),buscar);});
	},
	initBusqueda2: function(buscar){
		$('busqueda').select('table thead th').invoke('observe', 'click', function(evt){utilitys.order2(Event.element(evt),buscar);});
		$('busqueda').select('table tbody th span[class=anular]').invoke('observe', 'click', function(evt){utilitys.anularRow(Event.element(evt),'master');});
		$('paginator').select('span').invoke('observe', 'click', function(evt){utilitys.paginator2(Event.element(evt),buscar);});
	},
	initBusqueda3: function(buscar){
		$('busqueda').select('table thead th').invoke('observe', 'click', function(evt){utilitys.order2(Event.element(evt),buscar);});
		$('paginator').select('span').invoke('observe', 'click', function(evt){utilitys.paginator2(Event.element(evt),buscar);});
	},
	beforeSave2: function(){
		var retu = true;
		var m2 = new Array();
		var fields = new Array();
		var errors = new Array();
		this._formElements2.each(function(){
			if($j(this).is("select")){
				if($j(this).val()=='@'){

					$j(this).css("backgroundColor","rgb(178, 209, 236)");
					retu = false;
				}
			}
			if($j(this).hasClass('unique')){m2.push($(this));}

			if($j(this).is("input")){
				if($j(this).val()==''){

					$j(this).css("backgroundColor","rgb(248, 192, 192)");
					retu = false;
				}
			}
		});

		return retu;
	},
	beforeSave: function(){
		var m1 = new Array();
		var m2 = new Array();
		var m3 = new Array();
		var m4 = new Array();
		var m5 = new Array();
		var fields = new Array();
		var errors = new Array();

		this._formElements.each(function(obj, i){
			if(obj.hasClassName('required')){
				if(filters.requiredFields(obj)){
					if(obj.type!='radio'){
						m1.push(trim(obj.up().previous().down().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					}else{
						m1.push(trim(obj.up(4).previous().down().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					}
					fields.push(obj);
				}
			}
			if(obj.hasClassName('fechaActu')){
				if(filters.fechaActu(obj)){
					m5.push(trim(obj.up().previous().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					fields.push(obj);
				}
			}
			if(obj.hasClassName('unique'))    m2.push(obj);
			if(obj.hasClassName('unique2'))   m2.push(obj);
			if(obj.hasClassName('compues'))   m4.push(obj);
			if(obj.hasClassName('email')){
				if(!obj.value.blank() && filters.email(obj)){
					m3.push(trim(obj.up().previous().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					fields.push(obj);
				}
			}
		});
		if(m1.length>0){
			errors.push(lista.evaluate({title: 'Por Favor Complete '+plural(fields,'el siguiente Campo', 'los siguientes Campos')+'  : ', field: m1.join(', ')}));
		}

		var campos = new Array();
		var result = filters.uniqueFields(m2);

		if(Object.isArray(result) && result[0]){
			var campos  = result[1].split(',');
			var campos_ = new Array();
			m2.each(function(obj, i){
				if(utilitys.in_array(obj.id, campos)){
					campos_.push(trim(obj.up().previous().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					fields.push(obj);
				}
			});
			if(campos_.length>0){
				errors.push(lista.evaluate({title: 'Ya Existe un Registro con ese Valor para '+plural(fields,'el siguiente Campo', 'los siguientes Campos')+' : ', field: campos_.join(', ')}));
			}
		}
		var campos = new Array();

		var result = filters.compuesFields(m4);

		if(Object.isArray(result) && result[0]){
			var campos  = result[1].split(',');
			var campos_ = new Array();
			m4.each(function(obj, i){
				if(utilitys.in_array(obj.id, campos)){
					campos_.push(trim(obj.up().previous().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					fields.push(obj);
				}
			});
			if(campos_.length>0){
				errors.push(lista.evaluate({title: 'Ya Existe un Registro con ese Valor para '+plural(fields,'el siguiente Campo', 'los siguientes Campos')+' : ', field: campos_.join(', ')}));
			}
		}
		if(m3.length>0){
			errors.push(lista.evaluate({title: 'Por Favor Confirmar la InformaciÃ³n '+plural(fields,'del Campo', 'de los Campos')+' Email  : ', field: m3.join(', ')}));
		}
		if(m5.length>0){
			errors.push(lista.evaluate({title: 'Por Favor Verifique las Fecha '+plural(fields,'del siguiente Campo', 'de los siguientes Campos')+'  : ', field: m5.join(', ')}));
		}
		if(errors.length>0){
			this._mssg.show('<ul>'+errors.join('')+'</u>', 1);
			fields[0].focus();
			return false;
		}else{
			return true;
		}
	},
	beforeSav: function(){
		var m1 = new Array();
		var m2 = new Array();
		var m3 = new Array();
		var m4 = new Array();
		var m5 = new Array();
		var fields = new Array();
		var errors = new Array();

		this._formElements.each(function(obj, i){
			if(obj.hasClassName('required')){
				if(filters.requiredFields(obj)){
					if(obj.type!='radio'){
						m1.push(trim(obj.up().previous().down().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					}else{
						m1.push(trim(obj.up(4).previous().down().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					}
					fields.push(obj);
				}
			}
			if(obj.hasClassName('fechaActu')){
				if(filters.fechaActu(obj)){
					m5.push(trim(obj.up().previous().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					fields.push(obj);
				}
			}
			if(obj.hasClassName('unique'))    m2.push(obj);
			if(obj.hasClassName('unique2'))   m2.push(obj);
			if(obj.hasClassName('compues'))   m4.push(obj);
			if(obj.hasClassName('email')){
				if(!obj.value.blank() && filters.email(obj)){
					m3.push(trim(obj.up().previous().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					fields.push(obj);
				}
			}
		});
		if(m1.length>0){
			errors.push(lista.evaluate({title: 'Por Favor Complete '+plural(fields,'el siguiente Campo', 'los siguientes Campos')+'  : ', field: m1.join(', ')}));
		}
		var campos = new Array();

		var result = filters.uniqueFields(m2);
		if(Object.isArray(result) && result[0]){
			if(!confirm("Hay Campos que se Sobreponen en el Horario !  \n \n Realmente Desea Guardar  ?")) {
				var campos  = result[1].split(',');
				var campos_ = new Array();
				m2.each(function(obj, i){
					if(utilitys.in_array(obj.id, campos)){
						campos_.push(trim(obj.up().previous().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
						fields.push(obj);
					}
				});
				if(campos_.length>0){
					errors.push(lista.evaluate({title: 'Ya Existe un Registro con ese Valor para '+plural(fields,'el siguiente Campo', 'los siguientes Campos')+' : ', field: campos_.join(', ')}));
				}
			}
		}
		var campos = new Array();
		var result = filters.compuesFields(m4);
		if(Object.isArray(result) && result[0]){
			if(!confirm("Hay Campos que se Sobreponen en el Horario !  \n \n Realmente Desea Guardar  ?")) {
				var campos  = result[1].split(',');
				var campos_ = new Array();
				m4.each(function(obj, i){
					if(utilitys.in_array(obj.id, campos)){
						campos_.push(trim(obj.up().previous().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
						fields.push(obj);
					}
				});
				if(campos_.length>0){
					errors.push(lista.evaluate({title: 'Ya Existe un Registro con ese Valor para '+plural(fields,'el siguiente Campo', 'los siguientes Campos')+' : ', field: campos_.join(', ')}));
				}
			}
		}

		if(m3.length>0){
			errors.push(lista.evaluate({title: 'Por Favor Confirmar la InformaciÃ³n '+plural(fields,'del Campo', 'de los Campos')+' Email  : ', field: m3.join(', ')}));
		}
		if(m5.length>0){
			errors.push(lista.evaluate({title: 'Por Favor Verifique las Fecha '+plural(fields,'del siguiente Campo', 'de los siguientes Campos')+'  : ', field: m5.join(', ')}));
		}
		if(errors.length>0){
			this._mssg.show('<ul>'+errors.join('')+'</u>', 1);
			fields[0].focus();
			return false;
		}else{
			return true;
		}
	},
	getParameters: function(obj){
		return  this._formElements;
	},
	ajax: function(action, params){
		var result = new Array();
		new Ajax.Request(action, {
			asynchronous: false,
			parameters: params,
			onComplete: function(transport){
				result = transport.responseText.evalJSON();
			}
		});
		return result;
	},
	nuevo: function(){
		this._action = 1;
		$('est').innerHTML = 'Estado: Guardar';
		this._focus.focus();
	},
	buscar: function(){
		this._action = 2;
		$('est').innerHTML = 'Estado: Buscar';
	},
	cancel: function(obj){
		switch(this._action){
			case 1:
			case 2:
			this._formElements.each(function(obj){
				if(obj.type=='text')   obj.value='';
				if(obj.type=='hidden') obj.value='';
				if(obj.type=='select-one') obj.value='@';
				if(obj.type=='checkbox') obj.checked=false;
				if(obj.type=='textarea') obj.value='';
				if(obj.type=='password') obj.value='';
			});
			this._formElements.findAll(function(obj ){return obj.hasClassName('ck');}).invoke('removeAttribute','disabled');
			this._formElements.findAll(function(obj ){return obj.hasClassName('unique');}).invoke('removeAttribute','readonly');
			obj.focus();
			this._action = 1;
			$('est').innerHTML = 'Estado: Guardar';
			break;
			default:
			obj.focus();
			break;
		}
	},
	find: function(action, obj){
		var fields = new Array();
		Master.getParameters().each(function(e){
			if(!filters.requiredFields(e)){
				if(e.type=='radio'){
					fields.push(e.id+'='+$$('input[name='+e.id+']:checked').first().value);
				}else if(e.type=='checkbox'){
					fields.push(e.id+'='+e.checked);
				}else{
					fields.push(e.id+'='+e.value);
				}
			}
		});
		if(fields.length>0){
			var params = fields.join('&');
			utilitys.renderView($Kumbia.controller+'/'+action, params,'');
		}else{
			if(confirm('Desea Listar los Registros Disponibles?')==true){
				params = '';
				utilitys.renderView($Kumbia.controller+'/'+action, '','');
			}
		}
	},
	drop: function(param){
		var mssg = new Message();
		var result = this.ajax(Utils.getKumbiaURL($Kumbia.controller+'/eliminar'), param);
		mssg.show(result[0],result[1]);
		window.setTimeout(function(){
			utilitys.renderView($Kumbia.controller+'/buscar', '','');
		},3100);
	},
	anular: function(param){
		var mssg = new Message();
		var result = this.ajax(Utils.getKumbiaURL($Kumbia.controller+'/anular'), param);
		mssg.show(result[0],result[1]);
		var fields = new Array();
		Master.getParameters().each(function(e){
			if(!filters.requiredFields(e)){
				if(e.type=='radio'){
					fields.push(e.id+'='+$$('input[name='+e.id+']:checked').first().value);
				}else if(e.type=='checkbox'){
					fields.push(e.id+'='+e.checked);
				}else{
					fields.push(e.id+'='+e.value);
				}
			}
		});
		window.setTimeout(function(){
			utilitys.renderView($Kumbia.controller+'/buscar', fields.join('&'),'');
		},3100);
	},
	serialize: function(elements){
		var fields = new Array();
		elements.each(function(obj){
			if(obj.type=='checkbox'){
				fields.push(obj.id+'='+obj.checked);

			}else{
				fields.push(obj.id+'='+obj.value);
			}
		});
		return fields.join('&');
	},
	serializeally: function (obj){
		return $j(obj).find('select,input,textarea').serialize();
	},
	addFields: function(obj){
		this._formElements.push(obj);
	},
	serializeRadios: function(array){
		var fields = new Array();
		array.each(function(e){
			fields.push(e.id+'='+$$('input[name='+e.id+']:checked').first().value);
		});
		return fields.join('&');
	}

};
var Login = {
	_formElements : [],
	initialize: function(){
		this._formElements = $('login').select('input[type=text]','input[type=password]','input[type=password]','select');
	},
	beforeAutenticate: function(){
		var m1 = new Array();
		var fields = new Array();
		var errors = new Array();
		var mssg   = new Message();
		this._formElements.each(function(obj, i){
			if(obj.hasClassName('required')){
				if(filters.requiredFields(obj)){
					m1.push(obj.up().previous().down().innerHTML.replace(/(\*|\:)/g,''));
					fields.push(obj);
				}
			}
		});
		if(m1.length>0){
			errors.push(lista.evaluate({title: 'Por Favor Complete '+plural(fields,'el siguiente Campo', 'los siguientes Campos')+'  : ', field: m1.join(', ')}));
		}
		if(errors.length>0){
			mssg.show('<ul>'+errors.join('')+'</u>', 1);
			fields[0].focus();
			return false;
		}else{
			return true;
		}
	},
	intro: function(urlRedirect){

		urlRedirect = typeof urlRedirect !== 'undefined' ? urlRedirect : "home";

		var mssg = new Message();
		var result = this.ajax(Utils.getKumbiaURL($Kumbia.controller+'/Autenticate'), Form.serializeElements(this._formElements));

		if(result[1]==2){
			mssg.show(result[0],result[1]);
			setTimeout(function(){
				window.location=Utils.getKumbiaURL(urlRedirect);
			},2000);
		}else{
			alert(result[0]);
		}
	},
	ajax: function(action, params){
		var result = new Array();
		new Ajax.Request(action, {
			asynchronous: false,
			parameters: params,
			onComplete: function(transport){
				result = transport.responseText.evalJSON();
			}
		});
		return result;
	}
};

var valFields ={
	_formElements : [],
	_formElements2: [],
	_mssg: '',
	_focus: '',
	initialize: function(obj, max, focus){
		if(!Object.isArray(obj)){
			this._formElements = obj.select('input[type=text]','input[type=hidden]','input[type=password]','input[type=checkbox]','select','textarea');
		}else{
			obj.each(function(e){
				valFields._formElements2 = valFields._formElements2.concat(e.select('input[type=text]','input[type=hidden]','input[type=password]','input[type=checkbox]','select','textarea'));

			});
		}
	},
	beforeExec: function(){
		var m1 = new Array();
		var fields = new Array();
		var errors = new Array();
		var mssg   = new Message();
		this._formElements.each(function(obj, i){
			if(obj.hasClassName('required')){
				if(filters.requiredFields(obj)){
					if(obj.type=='radio'){
						m1.push(trim(obj.up(4).previous().down().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					}else{
						if(obj.up().previous()!=null){
							if(!utilitys.in_array(obj.up().previous().down(), valFields._formElements)){
								m1.push(trim(obj.up().previous().down().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
							}else{
								m1.push(trim(obj.up(2).previous().down(i+1).innerHTML.stripTags().replace(/(\*|\:)/g,'')));
							}
						}else{
							m1.push(trim(obj.up(2).previous().down(i+1).innerHTML.stripTags().replace(/(\*|\:)/g,'')));
						}
					}
					fields.push(obj);
				}
			}
		});
		if(m1.length>0){
			errors.push(lista.evaluate({title: 'Por Favor Complete '+plural(fields,'el siguiente Campo', 'los siguientes Campos')+'  : ', field: m1.join(', ')}));
		}
		if(errors.length>0){
			mssg.show('<ul>'+errors.join('')+'</u>', 1);
			fields[0].focus();
			return false;
		}else{
			return true;
		}
	},
	beforeExec2: function(){
		var m1 = new Array();
		var fields = new Array();
		var errors = new Array();
		var mssg   = new Message();
		this._formElements2.each(function(obj, i){
			if(obj.hasClassName('required')){
				if(filters.requiredFields(obj)){
					if(obj.type=='radio'){
						m1.push(trim(obj.up(4).previous().down().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
					}else{
						if(obj.up().previous()!=null){
							if(!utilitys.in_array(obj.up().previous().down(), valFields._formElements)){
								m1.push(trim(obj.up().previous().down().innerHTML.stripTags().replace(/(\*|\:)/g,'')));
							}else{
								m1.push(trim(obj.up(2).previous().down(i+1).innerHTML.stripTags().replace(/(\*|\:)/g,'')));
							}
						}else{
							m1.push(trim(obj.up(2).previous().down(i+1).innerHTML.stripTags().replace(/(\*|\:)/g,'')));
						}
					}
					fields.push(obj);
				}
			}
		});
		if(m1.length>0){
			errors.push(lista.evaluate({title: 'Por Favor Complete '+plural(fields,'el siguiente Campo', 'los siguientes Campos')+'  : ', field: m1.join(', ')}));
		}
		if(errors.length>0){
			mssg.show('<ul>'+errors.join('')+'</u>', 1);
			fields[0].focus();
			return false;
		}else{
			return true;
		}
	},
	ajax: function(action, params){
		var result = new Array();
		new Ajax.Request(action, {
			asynchronous: false,
			parameters: params,
			onComplete: function(transport){
				result = transport.responseText.evalJSON();
			}
		});
		return result;
	},
	getParameters: function(){
		return  this._formElements;
	},
	addFields: function(obj){
		this._formElements.push(obj);
	}
};

var TestSpeed ={
	_type : 'GET',
	_url: "bigfile.bin?id=",
	_dataType: 'application/octet-stream',
	_speedDown: 0,
	_speedUp: 0,
	_log: false,
	initialize: function(type, url, dataType){
		this._type = type;
		this._url = $Kumbia.path+"img/"+url+"?id=";
		this._dataType = dataType;
		$j("#speedError").html( layoutSpeed );
	},
	TestDownload: function(){
		start = new Date().getTime();
		$j.ajax({
			type: this._type,
			url: this._url + start,
			dataType: this._dataType,
			async: false,
			success: function(msg) {
				binfile = msg;
				end = new Date().getTime();
				diff = (end - start) / 1000;
				bytes = msg.length;
				speed = (bytes / diff) / 1024 / 1024 * 8;
				speed = Math.round(speed*100)/100;
				$j('#dlspeed').html('<b>' + speed + ' Mb/s (You)</b>');
				$j('#dlbar').css('width', Math.floor(speed * 30)+'px');
				TestSpeed._speedDown = speed;
			},
			complete: function(xhr, textStatus) {
				TestSpeed.TestUpload();
			}
		});
	},
	ViewError: function(){
		if(this._speedUp < 0.2 || this._speedDown < 0.2){
			TestSpeed.Message();
		}
	},
	TestUpload: function(){
		start = new Date().getTime();
		$j.ajax({
			type: 'POST',
			url: this._url + start,
			data: binfile,
			dataType: this._dataType,
			async: false,
			success: function(msg) {
				end = new Date().getTime();
				diff = (end - start) / 1000;
				bytes = binfile.length;
				speed = (bytes / diff) / 1024 / 1024 * 8;
				speed = Math.round(speed*100)/100;
				$j('#ulspeed').html('<b>' + speed + ' Mb/s (You)</b>');
				$j('#ulbar').css('width', Math.floor(speed * 60)+'px');
				TestSpeed._speedUp = speed;

			},complete: function(x,text){
				TestSpeed.ViewError();
			}
		});
		start = new Date().getTime();

	},
	Message: function(){
		if(this._speedUp < 0.2 || this._speedDown < 0.2){
			this._log = true;
			$j("#speedError").innerHTML = speedError;
			$j("#speedError").innerHTML = speedError;
			$j("#speedError").dialog({
				autoOpen: false,
				modal: true,
				height: document.viewport.getHeight()-20,
				width: document.viewport.getWidth()-40

			});
			$j('#speedError').dialog('open');
		}

	},
	RunTest : function(){
		TestSpeed.TestDownload();
	},
	GetTest : function(){
		return this._log;
	}
};

/*-----------------*/
/*-----------------*/
/*-----------------*/
/*------2016-------*/
/*-----------------*/
/*-----------------*/
/*-----------------*/
function logout(){
	if(window.confirm("Realmente desea Salir del Sistema...?") == true){
		var msg = new Message();
		msg.show('Usted Acaba de Cerrar sesiÃ³n, Hasta Pronto!',2);
		window.setTimeout(function(){
			window.location = Utils.getKumbiaURL('/login/logoff');
		}, 3100);
	}else return false;
}
var mouseActivityMenu = false;

document.body.addEventListener("click",function(){
	if (document.querySelector(".activeSubmenu")) {
		document.querySelector(".activeSubmenu").classList.remove("activeSubmenu")
	};
})
document.addEventListener("DOMContentLoaded",function(){
	if (document.querySelector(".menu_new")){
		document.querySelector(".menu_new").addEventListener("click",function(event){event.stopPropagation()})
	};
})

function showMenu(event,itemMenu) {
	event.stopPropagation()
	var query = "[dataitemmenu = '"+ itemMenu +"']"
	var submenu = document.querySelector(query)

	if (event.target.parentNode.parentNode.classList.contains("activeSubmenu")){
		submenu.classList.toggle("activeSubmenu")
		submenu.style.left = (document.querySelector(".menu_new > li > .activeSubmenu").offsetWidth - 2) + "px"
		submenu.style.color = "red"
	}else{
		if (document.querySelector(".menu_new > li >.activeSubmenu")) {

			var activeSubmenu = document.querySelector(".menu_new > li >.activeSubmenu"),
			itemMenuActive = activeSubmenu.getAttribute("dataitemmenu")

			if (itemMenuActive == itemMenu){
				activeSubmenu.classList.remove("activeSubmenu")
			}else{
				activeSubmenu.classList.remove("activeSubmenu")
				submenu.classList.toggle("activeSubmenu")
			}
		}else{
			submenu.classList.toggle("activeSubmenu")
			submenu.addEventListener("mouseleave", menuOut)
			submenu.addEventListener("mouseover", menuIn)

		}
	}

}

function menuIn(){
	mouseActivityMenu = true
}
function menuOut(event){
	mouseActivityMenu = false

	var element = event.target
	window.setTimeout(function() {
		if (!mouseActivityMenu) {
		};
	},5000)
}

function new_validateDates(sDateOne, sDateTow){
	var dateOne = new Date(sDateOne),
	dateTow = new Date(sDateTow);

	var data = {
		isValid : new Boolean(),
		msg : new String(),
		status : new Number()
	}
	if (dateOne > dateTow){
		data.isValid = false
		data.msg = "La primera fecha es mayor a la segunda."
		data.status = 0
	}else{
		data.isValid = true
	}
	return data
}
Date.prototype.getFirstDateOfYear = function(){
	var year = this.getFullYear(),
	month = FillWihtZero("1",2),
	date = FillWihtZero("1",2);
	return year+"-"+month+"-"+date


}
Date.prototype.getDateFormatForCalendarTag = function(){
	var year = this.getFullYear(),
	month = FillWihtZero(String(this.getMonth()+1),2),
	date = FillWihtZero(String(this.getDate()),2);
	return year+"-"+month+"-"+date
}
function FillWihtZero(string,len){
	while(string.length < len){
		string = "0"+string
	}
	return string
}


function listModel(form){
	msg = new Message()

	this.save = function(){
		var dataNewMenu = new Serializer(form)
		var params = dataNewMenu.getParamsFormatQ()
		console.warn(params)
		var result = this.ajax(Utils.getKumbiaURL($Kumbia.controller+'/guardar'), params);
		msg.show(result[0],result[1]);
		if (typeof maxitem == "number") maxitem += 1
	},
this.drop = function(param){
	params = "item="+param
	var result = this.ajax(Utils.getKumbiaURL($Kumbia.controller+'/eliminar'), params);
	msg.show(result[0],result[1]);
},
this.ajax =  function(action, params){
	var result = new Array();
	new Ajax.Request(action, {
		asynchronous: false,
		parameters: params,
		onComplete: function(transport){
			result = transport.responseText.evalJSON();
		}
	});
	return result;
}

}

function Paginator(data){
	this.initShowElements = 0
	this.elementsShow = data.elementsShow
	this.element = data.element

	this.restart = function(){
		this.initShowElements = 0
		this.elementsShow = data.elementsShow
	}

	this.init = function(){
		this.subElement =  [].slice.call(this.element.children)
		this.showElement = this.subElement.slice(this.initShowElements, this.elementsShow)
		this.showElement = this.subElement.slice(this.initShowElements, this.elementsShow)
		for (var i = 0; i < this.showElement.length; i++) {
			this.showElement[i].classList.add("show")
		}
	}

	this.goForward = function(){
		this.initShowElements = this.elementsShow
		this.elementsShow += data.elementsShow
		this.showElement = this.subElement.slice(this.initShowElements, this.elementsShow)
		if (this.showElement.length == 0){
			this.elementsShow -= data.elementsShow
			this.initShowElements = this.elementsShow
			return
		}else{
			this.hideElements()
			this.init()
		}
	}

	this.goBack = function(){
		this.elementsShow = this.initShowElements
		this.initShowElements -= data.elementsShow
		this.showElement = this.subElement.slice(this.initShowElements, this.elementsShow)
		if (this.showElement.length == 0){
			this.elementsShow += data.elementsShow
			this.initShowElements = data.elementsShow
			return
		}else{
			this.hideElements()
			this.init()
		}
	}

	this.hideElements = function(){
		elementsShowCurrent = this.element.querySelectorAll(".show")
		for (var i = 0; i < elementsShowCurrent.length; i++) {
			elementsShowCurrent[i].classList.remove("show")
		};
	}

	this.goLast = function(){}
	this.goFirst = function(){}
}

function logout(){
	if(window.confirm("Realmente desea Salir del Sistema...?")==true){
		var msg = new Message();
		msg.show('Usted Acaba de Cerrar sesiÃ³n, Hasta Pronto!',2);
		window.setTimeout(function(){
			window.location = Utils.getKumbiaURL('/login/logoff');
		}, 3100);
	}else return false;
}