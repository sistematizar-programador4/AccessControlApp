# -*- coding: utf-8 -*-
from django.http import HttpResponseRedirect, HttpResponse
from datetime import datetime, timedelta
from django.shortcuts import render
from django.conf import settings
import json, time, requests
from .models import *
from .forms import *

# Se crea las dos variables para el contador del numero de alumnos sincronizados
newalum = 0
upalum = 0

def home(request):
	return render(request, 'home.html', {'title': 'Bienvenido'})

def sync(request):
	return render(request, 'sync.html', {'title': 'Sincronizacion'})

# Se recibe los datos que comienza con un indice de alumnos
def save_alum(value_array):
	# Se busca el grupo, ya que al guardar el grupo del alumno, este debe ser una instancia propia del modelo
	cgrupo = Grupo.objects.get(cgrupo = value_array[3])
	try:
		# Si el alumno existe, se actualiza
		alumno = Alumno.objects.get(calum = value_array[1])
		# Se reemplaza $ por un espacio vacio, este indica que no hay registro en ese elemento
		alumno.idalum = value_array[2].replace('$', '')
		alumno.cgrupo = cgrupo
		alumno.ape1alum = value_array[4]
		alumno.ape2alum = value_array[5].replace('$', '')
		alumno.nom1alum = value_array[6]
		alumno.nom2alum = value_array[7].replace('$', '')
		alumno.rh = value_array[8].replace('$', '')
		# Actualiza el alumno
		alumno.save(update_fields = ['idalum', 'cgrupo', 'ape1alum', 'ape2alum', 'nom1alum', 'nom2alum', 'rh'])
		# Llama la la variable global upalum y suma +1 para contar el numero de registros actualizados
		global upalum
		upalum = upalum + 1
	except:
		# Si el alumno no existe, se guarda
		alumno = Alumno(calum = value_array[1], idalum = value_array[3].replace('$', ''), cgrupo = cgrupo, ape1alum = value_array[4], ape2alum = value_array[5].replace('$', ''), nom1alum = value_array[6], nom2alum = value_array[7].replace('$', ''), rh = value_array[8].replace('$', ''))
		alumno.save()
		# Llama la la variable global newalum y suma +1 para contar el numero de registros nuevos
		global newalum
		newalum = newalum + 1

def save_grupo(value_array):
	# Se busca el grado, ya que al guardar el grado del grupo, este debe ser una instancia propia del modelo
	cgrado = Grado.objects.get(cgrado = value_array[4])
	try:
		# Si el grupo existe, se actualiza
		grupo = Grupo.objects.get(cgrupo = value_array[1])
		grupo.ngrupo = value_array[2]
		grupo.ngrupoalt = value_array[3]
		grupo.cgrado = cgrado
		grupo.save(update_fields = ['ngrado', 'ngrupoalt', 'cgrado'])
	except:
		# Si el grupo no existe, se guarda
		grupo = Grupo(cgrupo = value_array[1], ngrupo = value_array[2], cgrado = cgrado)
		grupo.save()

def save_grado(value_array):
	try:
		# Si el grado existe, se actualiza
		grado = Grado.objects.get(cgrado = value_array[1])
		grado.ngrado = value_array[2]
		grado.save(update_fields['ngrado'])
	except:
		# Si el grado no existe, se guarda
		grado = Grado(cgrado = value_array[1], ngrado = value_array[2])
		grado.save()

def sync_alum(request):
	response = {}
	# Realiza una peticion http via post a una url del server
	r = requests.post('http://192.168.0.10/siacolweb_version_2016/sw4.2/conection/syncAlum', data = {'school_key': settings.SCHOOL_KEY})
	if r.status_code == 200:
		# Si se realizo la peticion y se recibieron los datos, asigna los datos recibidos a una varible
		response_serv = r.text
		# Reemplaza el espacio vacio y * por saltos de linea entre registros
		response_serv = response_serv.replace('\r','').replace('\n','').split('*')
		# Filtro para poder separar un registro del otro
		response_serv = filter(None, response_serv)
		for resp in response_serv:
			value_array = []
			# Lectura por registro y se separa cada elemento del registro y se guarda en un arreglo
			for val in resp.split('/'):
				value_array.append(val)
			# Dependiento del indice del registro, este se envia a una funcion especifica para ser guardado
			if value_array[0] == 'grados': save_grado(value_array)
			if value_array[0] == 'grupos': save_grupo(value_array)
			if value_array[0] == 'alumnos': save_alum(value_array)
		# Se envia mensaje succes, total de alumnos nuevos y sincronizados
		response['totalum'] = newalum + upalum
		response['newalum'] = newalum
		response['upalum'] = upalum
		response['type'] = 'success'
		response['title'] = 'Exito'
		response['message'] = 'Exito en la sincronizacion de datos'
	else:
		# Se envia mensaje error si no se realizo la peticion
		response['title'] = 'Ha ocurrido un error'
		response['type'] = 'error'
		response['message'] = 'Favor comunicarse con SistematizarEF'
	# Resouesta json
	return HttpResponse(json.dumps(response), content_type = 'application/json')

def sync_access(request):
	response = {}
	# Hora actual
	time_now = datetime.now()
	# Crea una variable con el path y name del file que contiene los datos del control de acceso de los alumnos
	directory = 'access_control/static/files/file-'+str(time_now.year)+'-'+str(time_now.day)+'-'+str(time_now.hour)+'-'+str(time_now.minute)+'-'+str(time_now.second)+'.txt'
	# Crea un nuevo file con la direccion y nombre de directory, se abre en modo escritura
	movi_registro = open(directory, 'w')
	# Se Consulta y se lista todos los registro con state = 0
	m_registro = MoviRegistro.objects.filter(state = 0)
	for movi in m_registro:
		# Se escribe en linea separada el registro del acceso el alumno
		# Se sigue la regla de orden de: pk(llave primaria del registro), codigo-alumno, fecha, hora, tipo-registro(salida o ingreso)
		movi_registro.write(str(movi.pk)+', '+movi.calum.calum+', '+str(movi.date)+', '+str(movi.time)+', '+movi.type_reg+'\n')
	# Guarda el file
	movi_registro.close()
	# Abre el arhivo guardado en modo lectura
	movi_registro = {'file': open(directory, 'rb')}
	# La llave del colegio se encuentra en settings.py en una variable llamada SCHOOL_KEY
	# Realiza peticion a la url del server via http y se envia por post el file y la llave del colegio
	r = requests.post('http://192.168.0.10/siacolweb_version_2016/sw4.2/conection/syncAccess', files = movi_registro, data = {'school_key': settings.SCHOOL_KEY})
	if r.status_code == 200:
		# Si se realizo la peticion y el server los guardó, se actualiza el state a 1 de los registros listados en el file
		m_registro.update(state = 1)
		response['type'] = 'success'
		response['title'] = 'Exito'
		response['message'] = 'Exito en la sincronizacion de datos'
	else:
		response['title'] = 'Ha ocurrido un error'
		response['type'] = 'error'
		response['message'] = 'Favor comunicarse con SistematizarEF'
	# Resouesta json
	return HttpResponse(json.dumps(response), content_type = 'application/json')

# Se recibe codigo del alumno
def mark_access(request, calum):
	response = {}
	try:
		# Se busca si existe el alumno
		alumno = Alumno.objects.get(calum = calum)
		type_reg = ''
		# Fecha y hora actual
		time_now = datetime.now()
		# Busca y convierte en entero el parametro rango de hora
		param_rango = int(Parametro.objects.get(param1 = 'R').param3)
		# Suma o resta el rango de hora a la hora actual
		p_hour = time_now + timedelta(hours = param_rango)
		m_hour = time_now - timedelta(hours = param_rango)
		# Convierte en formato hora
		p_hour = p_hour.time().strftime('%H:%M:%S')
		m_hour = m_hour.time().strftime('%H:%M:%S')
		# Busca entre un rango de hora inicial y hora final, el parametro correspondiente al tipo de registro (Ingreso o Salida)
		for params in Parametro.objects.raw('SELECT * FROM principal_parametro WHERE param2 BETWEEN %s AND %s', [m_hour, p_hour]):
			type_reg = params.param1
		# Si arroja vacio, se toma por defecto como una salida
		type_reg = 'S' if type_reg == '' else type_reg
		# Guarda el registro del acceso del alumnos
		movimiento = MoviRegistro(calum = alumno, date = datetime.now(), time = time_now, type_reg = type_reg)
		movimiento.save()
		# Envia succes
		response['sync_alum'] = True
		response['title'] = type_reg
		response['type'] = 'success'
		response['message'] = 'Exito en el registro'
		response['calum'] = alumno.calum
		response['nombre'] = alumno.nom1alum+' '+alumno.nom2alum
		response['apellido'] = alumno.ape1alum+' '+alumno.ape2alum
		response['rh'] = alumno.rh
		response['grupo'] = alumno.cgrupo.ngrupo
	except Alumno.DoesNotExist:
		# Si no existe el alumno se envia mensaje error
		response['title'] = 'Ha ocurrido un error'
		response['type'] = 'error'
		response['message'] = 'Alumno no encontrado'
	# Respuesta Json
	return HttpResponse(json.dumps(response), content_type = 'application/json')

def get_param_sycn(request):
	response = {}
	# Busca de parametro de la hora de sincronizacion
	param_sync = Parametro.objects.get(param1 = 'SY').param2
	# Devuelve hora y minuto de la sincronizacion
	response['hour'] = str(param_sync.hour)
	response['minute'] = str(param_sync.minute)
	# Respuesta Json
	return HttpResponse(json.dumps(response), content_type = 'application/json')