# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UsuariosManager(BaseUserManager):
    def create_user(self,nickname, password=None, **extra_fields):
        if not nickname:
            raise ValueError('El nombre de usuario debe ser proporcionado')
        user = self.model(nickname=nickname, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class Usuarios(AbstractBaseUser, PermissionsMixin):
    last_login = None
    is_superuser = None
    is_staff = None
    id_user = models.AutoField(primary_key=True)
    nickname = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=200, db_column='contrasena')
    nombre = models.CharField(max_length=100)
    documento = models.BigIntegerField()

    objects = UsuariosManager()

    USERNAME_FIELD = 'nickname'
    REQUIRED_FIELDS = ['nombre', 'documento']

    class Meta:
        managed = False
        db_table = 'usuarios'

    def __str__(self):
        return self.nickname
    
class Registros(models.Model):
    id_registro = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500)

    class Meta:
        managed = False
        db_table = 'registros'
    
    def __str__(self):
        return self.nombre


class Horario(models.Model):
    id_horario = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        Usuarios,
        on_delete=models.CASCADE,
        related_name='horarios',
        db_column='id_user',
    )
    dia = models.CharField(max_length=20)
    titulo = models.CharField(max_length=120)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    descripcion = models.CharField(max_length=500, blank=True)

    class Meta:
        db_table = 'horarios'

    def __str__(self):
        return f'{self.dia} - {self.titulo}'
