# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0010_moviregistro_state'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='grupo',
            name='cgrado',
        ),
        migrations.RemoveField(
            model_name='alumno',
            name='cgrupo',
        ),
        migrations.DeleteModel(
            name='Grado',
        ),
        migrations.DeleteModel(
            name='Grupo',
        ),
    ]
