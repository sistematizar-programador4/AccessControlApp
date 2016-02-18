from django.conf.urls import patterns, url
from .views import *

urlpatterns = patterns('access_control.apps.principal.views',
	url(r'^$', 'home', name = 'home'),
	url(r'^Sincronizacion/$', 'sync', name = 'sync'),
	url(r'^sync-access/$', 'sync_access', name = 'sync_access'),
	url(r'^sync-alum/$', 'sync_alum', name = 'sync_alum'),
	url(r'^Alumnos/mark-access/(?P<calum>\d+)/$', 'mark_access', name = 'mark_access'),
)