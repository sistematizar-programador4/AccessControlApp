from django.conf.urls import patterns, url
from .views import *

urlpatterns = patterns('access_control.apps.principal.views',
	url(r'^$', 'home', name = 'home'),
	url(r'^get-hour-sync/$', 'get_param_sycn', name = 'get_param_sycn'),
	url(r'^Sincronizacion/$', 'sync', name = 'sync'),
	url(r'^sync-access/$', 'sync_access', name = 'sync_access'),
	url(r'^sync-alum/$', 'sync_alum', name = 'sync_alum'),
	url(r'^Alumnos/mark-access/(?P<calum>\d+)/$', 'mark_access', name = 'mark_access'),
     url(r'^Configuracion/$', 'conf', name = 'conf'),
	url(r'^Configuracion/Editar/$', 'edit_conf', name = 'edit_conf'),
)