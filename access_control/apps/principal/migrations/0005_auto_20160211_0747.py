# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0004_auto_20160209_1111'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parametro',
            name='param2',
            field=models.CharField(max_length=10, null=True, blank=True),
        ),
    ]
