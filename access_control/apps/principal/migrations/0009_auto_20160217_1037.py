# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0008_auto_20160217_0951'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alumno',
            name='idalum',
            field=models.CharField(max_length=12, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='alumno',
            name='rh',
            field=models.CharField(max_length=4, null=True, blank=True),
        ),
    ]
