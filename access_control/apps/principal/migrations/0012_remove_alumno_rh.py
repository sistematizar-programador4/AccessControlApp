# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0011_auto_20160302_0723'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='alumno',
            name='rh',
        ),
    ]
