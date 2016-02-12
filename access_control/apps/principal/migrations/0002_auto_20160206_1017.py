# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Parametro',
            fields=[
                ('cparam', models.CharField(max_length=3, serialize=False, primary_key=True)),
                ('nparam', models.CharField(max_length=30)),
                ('param1', models.CharField(max_length=10, null=True, blank=True)),
                ('param2', models.CharField(max_length=10, null=True, blank=True)),
                ('param3', models.CharField(max_length=10, null=True, blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='moviregistro',
            name='type_reg',
            field=models.CharField(default=b'I', max_length=1, choices=[(b'I', b'Ingreso'), (b'S', b'Salida')]),
        ),
    ]
