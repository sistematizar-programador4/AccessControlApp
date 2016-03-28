from django.conf import settings
from django import template
from ...principal.models import Parametro

register = template.Library()

@register.simple_tag
def school_name():
	return Parametro.objects.get(param1 = 'NC').nparam

@register.simple_tag
def params(type):
	return Parametro.objects.get(param1 = type).param2