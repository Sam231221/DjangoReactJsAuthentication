# Generated by Django 4.0.5 on 2022-08-25 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='tfa_secret',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
