# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Alumno',
            fields=[
                ('calum', models.CharField(max_length=8, serialize=False, primary_key=True)),
                ('idalum', models.CharField(max_length=12)),
                ('ape1alum', models.CharField(max_length=20)),
                ('ape2alum', models.CharField(max_length=20, null=True, blank=True)),
                ('nom1alum', models.CharField(max_length=20)),
                ('nom2alum', models.CharField(max_length=20, null=True, blank=True)),
                ('foto', models.CharField(max_length=45)),
                ('rh', models.CharField(max_length=4)),
            ],
        ),
        migrations.CreateModel(
            name='Grado',
            fields=[
                ('cgrado', models.CharField(max_length=2, serialize=False, primary_key=True)),
                ('ngrado', models.CharField(max_length=40)),
                ('activo', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Grupo',
            fields=[
                ('cgrupo', models.CharField(max_length=8, serialize=False, primary_key=True)),
                ('ngrupo', models.CharField(max_length=80)),
                ('ngrupoalt', models.CharField(max_length=80, null=True, blank=True)),
                ('activo', models.IntegerField()),
                ('cgrado', models.ForeignKey(to='principal.Grado')),
            ],
        ),
        migrations.CreateModel(
            name='MoviRegistro',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateField(auto_now=True)),
                ('time', models.TimeField()),
                ('calum', models.ForeignKey(to='principal.Alumno')),
            ],
        ),
        migrations.AddField(
            model_name='alumno',
            name='cgrupo',
            field=models.ForeignKey(to='principal.Grupo'),
        ),
    ]
