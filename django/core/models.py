from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)

    tfa_secret = models.CharField(max_length=255, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["username"]


#reset passwors
class Reset(models.Model):
    email=models.CharField(max_length=300,null=True)
    token=models.CharField(max_length=300,unique=True, null=True)    