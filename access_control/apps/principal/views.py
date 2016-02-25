# -*- coding: utf-8 -*-
from django.http import HttpResponseRedirect, HttpResponse
from datetime import datetime, timedelta
from django.shortcuts import render
from django.conf import settings
import json, time, requests
from .models import *
from .forms import *

newalum = 0
upalum = 0

def home(request):
	return render(request, 'home.html', {'title': 'Bienvenido'})

def sync(request):
	return render(request, 'sync.html', {'title': 'Sincronizacion'})

def save_alum(value_array):
	cgrupo = Grupo.objects.get(cgrupo = value_array[3])
	try:
		alumno = Alumno.objects.get(calum = value_array[1])
		alumno.idalum = value_array[2].replace('$', '')
		alumno.cgrupo = cgrupo
		alumno.ape1alum = value_array[4]
		alumno.ape2alum = value_array[5].replace('$', '')
		alumno.nom1alum = value_array[6]
		alumno.nom2alum = value_array[7].replace('$', '')
		alumno.rh = value_array[8].replace('$', '')
		alumno.save(update_fields = ['idalum', 'cgrupo', 'ape1alum', 'ape2alum', 'nom1alum', 'nom2alum', 'rh'])
		global upalum
		upalum = upalum + 1
	except:
		alumno = Alumno(calum = value_array[1], idalum = value_array[3].replace('$', ''), cgrupo = cgrupo, ape1alum = value_array[4], ape2alum = value_array[5].replace('$', ''), nom1alum = value_array[6], nom2alum = value_array[7].replace('$', ''), rh = value_array[8].replace('$', ''))
		alumno.save()
		global newalum
		newalum =newalum + 1

def save_grupo(value_array):
	cgrado = Grado.objects.get(cgrado = value_array[4])
	try:
		grupo = Grupo.objects.get(cgrupo = value_array[1])
		grupo.ngrupo = value_array[2]
		grupo.ngrupoalt = value_array[3]
		grupo.cgrado = cgrado
		grupo.save(update_fields = ['ngrado', 'ngrupoalt', 'cgrado'])
	except:
		grupo = Grupo(cgrupo = value_array[1], ngrupo = value_array[2], cgrado = cgrado)
		grupo.save()

def save_grado(value_array):
	try:
		grado = Grado.objects.get(cgrado = value_array[1])
		grado.ngrado = value_array[2]
		grado.save(update_fields['ngrado'])
	except:
		grado = Grado(cgrado = value_array[1], ngrado = value_array[2])
		grado.save()

def sync_alum(request):
	response = {}
	r = requests.post('http://192.168.0.10/siacolweb_version_2016/sw4.2/conection/syncAlum', data = {'school_key': settings.SCHOOL_KEY})
	if r.status_code == 200:
		response_serv = r.text
		response_serv = response_serv.replace('\r','').replace('\n','').split('*')
		response_serv = filter(None, response_serv)
		for resp in response_serv:
			value_array = []
			for val in resp.split('/'):
				value_array.append(val)
			if value_array[0] == 'grados': save_grado(value_array)
			if value_array[0] == 'grupos': save_grupo(value_array)
			if value_array[0] == 'alumnos': save_alum(value_array)
		response['totalum'] = newalum + upalum
		response['newalum'] = newalum
		response['upalum'] = upalum
		response['type'] = 'success'
		response['title'] = 'Exito'
		response['message'] = 'Exito en la sincronizacion de datos'
	else:
		response['title'] = 'Ha ocurrido un error'
		response['type'] = 'error'
		response['message'] = 'Favor comunicarse con SistematizarEF'
	return HttpResponse(json.dumps(response), content_type = 'application/json')

def sync_access(request):
	response = {}
	directory = 'access_control/static/files/file.txt'
	movi_registro = open(directory, 'w')
	m_registro = MoviRegistro.objects.filter(state = 0)
	for movi in m_registro:
		movi_registro.write(str(movi.pk)+', '+movi.calum.calum+', '+str(movi.date)+', '+str(movi.time)+', '+movi.type_reg+'\n')
	movi_registro.close()
	movi_registro = {'file': open(directory, 'rb')}
	r = requests.post('http://192.168.0.10/siacolweb_version_2016/sw4.2/conection/syncAccess', files = movi_registro, data = {'school_key': settings.SCHOOL_KEY})
	print r.status_code
	if r.status_code == 200:
		m_registro.update(state = 1)
		response['type'] = 'success'
		response['title'] = 'Exito'
		response['message'] = 'Exito en la sincronizacion de datos'
	else:
		response['title'] = 'Ha ocurrido un error'
		response['type'] = 'error'
		response['message'] = 'Favor comunicarse con SistematizarEF'
	return HttpResponse(json.dumps(response), content_type = 'application/json')

def mark_access(request, calum):
	response = {}
	repetido = False
	try:
		alumno = Alumno.objects.get(calum = calum)
		type_reg = ''
		time_now = datetime.now()
		p_hour = time_now + timedelta(hours = 2)
		m_hour = time_now - timedelta(hours = 2)
		p_hour = p_hour.time().strftime('%H:%M:%S')
		m_hour = m_hour.time().strftime('%H:%M:%S')
		for params in Parametro.objects.raw('SELECT * FROM principal_parametro WHERE param2 BETWEEN %s AND %s', [m_hour, p_hour]):
			type_reg = params.param1
		if type_reg == "":
			type_reg = 'S'
		for pro in MoviRegistro.objects.raw('SELECT * FROM principal_moviregistro WHERE calum_id = "'+alumno.calum+'" AND date = "'+str(time_now.date())+'" AND type_reg = "'+type_reg+'" AND time BETWEEN "'+m_hour+'" AND "'+p_hour+'"'):
			repetido = True
		if repetido is True:
			response['title'] = 'Ha ocurrido un error'
			response['type'] = 'error'
			response['message'] = 'El alumno ya ha sido registrado'
		else:
			movimiento = MoviRegistro(calum = alumno, date = datetime.now(), time = time_now, type_reg = type_reg)
			movimiento.save()
			response['sync_alum'] = True
			response['title'] = 'Exito'
			response['type'] = 'success'
			response['message'] = 'Exito en el ingreso'
			response['calum'] = alumno.calum
			response['nombre'] = alumno.nom1alum+' '+alumno.nom2alum
			response['apellido'] = alumno.ape1alum+' '+alumno.ape2alum
			response['rh'] = alumno.rh
			response['grupo'] = alumno.cgrupo.ngrupo
	except Alumno.DoesNotExist:
		response['title'] = 'Ha ocurrido un error'
		response['type'] = 'error'
		response['message'] = 'Alumno no encontrado'
	return HttpResponse(json.dumps(response), content_type = 'application/json')