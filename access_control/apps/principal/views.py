from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from .models import *
from .forms import *
import json, time
from datetime import datetime, timedelta

def home(request):
	return render(request, 'home.html', {'title': 'Bienvenido'})

def mark_access(request, calum):
	response = {}
	try:
		alumno = Alumno.objects.get(calum = calum)
		type_reg = ''
		time_now = datetime.now()
		p_hour = time_now + timedelta(hours = 1)
		m_hour = time_now - timedelta(hours = 1)
		p_hour = p_hour.time().strftime('%H:%M:%S')
		m_hour = m_hour.time().strftime('%H:%M:%S')
		for params in Parametro.objects.raw('SELECT * FROM principal_parametro WHERE param2 BETWEEN %s AND %s', [m_hour, p_hour]):
			type_reg = params.param1
		movimiento = MoviRegistro(calum = alumno, date = datetime.now(), time = time_now, type_reg = type_reg)
		movimiento.save()
		response['title'] = 'Exito'
		response['type'] = 'success'
		response['message'] = 'Exito en el ingreso'
		response['calum'] = alumno.calum
		response['nombre'] = alumno.nom1alum+' '+alumno.nom2alum
		response['apellido'] = alumno.ape1alum+' '+alumno.ape2alum
		response['foto'] = alumno.foto
		response['rh'] = alumno.rh
		response['grupo'] = alumno.cgrupo.ngrupo
	except Alumno.DoesNotExist:
		response['title'] = 'Ha ocurrido un error'
		response['type'] = 'error'
		response['message'] = 'Alumno no encontrado'
	return HttpResponse(json.dumps(response), content_type = 'application/json')