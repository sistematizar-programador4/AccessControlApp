# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0002_auto_20160206_1017'),
    ]

    operations = [
        migrations.AlterField(
            model_name='moviregistro',
            name='date',
            field=models.DateField(),
        ),
    ]
