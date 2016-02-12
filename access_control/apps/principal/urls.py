from django.conf.urls import patterns, url
from .views import *

urlpatterns = patterns('access_control.apps.principal.views',
	url(r'^$', 'home', name = 'home'),
	url(r'^Alumnos/mark-access/(?P<calum>\d+)/$', 'mark_access', name = 'mark_access'),
)