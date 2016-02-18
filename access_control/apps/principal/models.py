from django.db import models

CHOICE_TYPE = (
	('I', 'Ingreso'),
	('S', 'Salida'),
)

class Grado(models.Model):
	cgrado = models.CharField(max_length = 2, primary_key = True)
	ngrado = models.CharField(max_length = 40)
	activo = models.IntegerField(default = 1)

	def __str__(self):
		return self.cgrado+" - "+self.ngrado

	def __unicode__(self):
		return self.cgrado+" - "+self.ngrado

class Grupo(models.Model):
	cgrupo = models.CharField(max_length = 8, primary_key = True)
	ngrupo = models.CharField(max_length = 80)
	ngrupoalt = models.CharField(max_length = 80, null = True, blank = True)
	cgrado = models.ForeignKey(Grado)
	activo = models.IntegerField(default = 1)

	def __str__(self):
		return self.cgrupo+" - "+self.ngrupo

	def __unicode__(self):
		return self.cgrupo+" - "+self.ngrupo

class Alumno(models.Model):
	calum = models.CharField(max_length = 8, primary_key = True)
	idalum = models.CharField(max_length = 12, null = True, blank = True)
	cgrupo = models.ForeignKey(Grupo)
	ape1alum = models.CharField(max_length = 20)
	ape2alum = models.CharField(max_length = 20, null = True, blank = True)
	nom1alum = models.CharField(max_length = 20)
	nom2alum = models.CharField(max_length = 20, null = True, blank = True)
	rh = models.CharField(max_length = 4, null = True, blank = True)

	def __str__(self):
		return self.calum+" - "+self.nom1alum+" "+self.nom2alum+" "+self.ape1alum+" "+self.nom2alum

	def __unicode__(self):
		return self.calum+" - "+self.nom1alum+" "+self.nom2alum+" "+self.ape1alum+" "+self.nom2alum

class MoviRegistro(models.Model):
	calum = models.ForeignKey(Alumno)
	date = models.DateField(auto_now = False)
	time = models.TimeField()
	type_reg = models.CharField(max_length = 1, choices = CHOICE_TYPE, default = 'I')

class Parametro(models.Model):
	cparam = models.CharField(max_length = 3, primary_key = True)
	nparam = models.CharField(max_length = 30)
	param1 = models.CharField(max_length = 10, null = True, blank = True)
	param2 = models.TimeField()
	param3 = models.CharField(max_length = 10, null = True, blank = True)

	def __str__(self):
		return self.nparam