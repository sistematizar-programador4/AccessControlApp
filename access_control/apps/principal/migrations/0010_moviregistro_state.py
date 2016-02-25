# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0009_auto_20160217_1037'),
    ]

    operations = [
        migrations.AddField(
            model_name='moviregistro',
            name='state',
            field=models.IntegerField(default=0),
        ),
    ]
