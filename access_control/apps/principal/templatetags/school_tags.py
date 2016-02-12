from django.conf import settings
from django import template

register = template.Library()

@register.simple_tag
def name_school():
	return settings.NAME_SCHOOL