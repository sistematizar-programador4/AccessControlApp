# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0012_remove_alumno_rh'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parametro',
            name='nparam',
            field=models.CharField(max_length=80),
        ),
    ]
