# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0007_remove_alumno_foto'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grado',
            name='activo',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='grupo',
            name='activo',
            field=models.IntegerField(default=1),
        ),
    ]
