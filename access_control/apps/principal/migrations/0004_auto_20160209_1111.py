# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0003_auto_20160206_1019'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parametro',
            name='param2',
            field=models.TimeField(),
        ),
    ]
